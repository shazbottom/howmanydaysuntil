"""Offline recovered65 measurement. Reads ZIPs or folders containing GSC
Pages.csv, Chart.csv and Filters.csv; prints JSON, never writes files.

Baseline: python -B scripts/compare_search_cohort.py
Compare:  python -B scripts/compare_search_cohort.py --post export.zip --as-of YYYY-MM-DD
Optional --pre export.zip replaces the measurement window, never the frozen cohort.
Use --verified-live-date only after independently confirming the live deployment.
Exit 0: comparable observed windows; 1: pending/incomparable; 2: invalid input.
"""

import argparse
import csv
from datetime import date, timedelta
import io
import json
import math
from pathlib import Path
import re
from urllib.parse import urlsplit
import zipfile


BASELINE = Path(__file__).resolve().parents[1] / "data/reports/recovered65-baseline-2026-09-18.json"
PATH = re.compile(r"/days-until/date/(\d{4})/(\d{2})/(\d{2})/?")
LIMITATIONS = [
    "Observed export totals only; missing page rows are unknown, not confirmed zero traffic.",
    "CTR is total clicks / total impressions, not an average of row CTRs.",
    "Position is an impression-weighted approximation of rounded exported averages, not a fixed rank.",
    "Chart totals are property/filter totals, not cohort totals; page and chart impressions need not reconcile.",
    "Equal windows and matching export filters do not control query/device/country mix or establish causality.",
    "A reported push is not proof of live deployment, Google recrawl, or reindexing.",
    "Window dates use the export's reporting calendar; supply a verified live date in that same calendar.",
]


def normalized_key(value):
    url = urlsplit(value)
    if url.scheme not in ("http", "https") or url.netloc.lower() not in ("daysuntil.is", "www.daysuntil.is"):
        return None
    match = PATH.fullmatch(url.path)
    if not match:
        return None
    try:
        return date(*map(int, match.groups())).isoformat()
    except ValueError:
        return None


def metric_row(row):
    clicks = int(row["Clicks"].replace(",", ""))
    impressions = int(row["Impressions"].replace(",", ""))
    position = float(row["Position"]) if row["Position"].strip() else None
    if clicks < 0 or impressions < 0 or (position is not None and (not math.isfinite(position) or position < 0)):
        raise ValueError("Invalid negative/nonfinite search metric")
    if impressions and position is None:
        raise ValueError("Position is required for rows with impressions")
    return {"clicks": clicks, "impressions": impressions, "position": position}


def metrics(rows):
    clicks = sum(row["clicks"] for row in rows)
    impressions = sum(row["impressions"] for row in rows)
    return {
        "clicks": clicks,
        "impressions": impressions,
        "ctrPercent": clicks / impressions * 100 if impressions else None,
        "weightedPositionApprox": sum((row["position"] or 0) * row["impressions"] for row in rows) / impressions if impressions else None,
    }


def read_export(path):
    tables = {}
    required = {
        "Pages.csv": {"Top pages", "Clicks", "Impressions", "Position"},
        "Chart.csv": {"Date", "Clicks", "Impressions", "Position"},
        "Filters.csv": {"Filter", "Value"},
    }
    archive = zipfile.ZipFile(path) if path.is_file() else None
    try:
        for name, columns in required.items():
            if archive:
                matches = [entry for entry in archive.namelist() if Path(entry).name == name]
                if len(matches) != 1:
                    raise ValueError(f"Expected exactly one {name} in export")
                content = archive.read(matches[0]).decode("utf-8-sig")
            else:
                content = (path / name).read_text(encoding="utf-8-sig")
            reader = csv.DictReader(io.StringIO(content))
            if not columns.issubset(reader.fieldnames or []):
                raise ValueError(f"Missing required columns in {name}")
            tables[name] = list(reader)
    finally:
        if archive:
            archive.close()
    return tables


def summarize_export(tables, cohort):
    chart = tables["Chart.csv"]
    days = sorted(date.fromisoformat(row["Date"]) for row in chart)
    if not days:
        raise ValueError("Chart.csv has no dates")
    if len(days) != len(set(days)):
        raise ValueError("Chart.csv contains duplicate dates (comparison exports are not supported)")
    by_date = {key: [] for key in cohort}
    for row in tables["Pages.csv"]:
        key = normalized_key(row["Top pages"])
        if key in by_date:
            by_date[key].append(metric_row(row))
    filters = sorted([row["Filter"].strip(), row["Value"].strip()] for row in tables["Filters.csv"])
    if not any(key.lower() == "search type" for key, _ in filters):
        raise ValueError("Filters.csv must identify the search type")
    page_rows = {key: metrics(rows) if rows else None for key, rows in by_date.items()}
    return {
        "window": {"start": days[0].isoformat(), "end": days[-1].isoformat(),
                   "days": len(days), "spanDays": (days[-1] - days[0]).days + 1},
        "filters": filters,
        "pageExportRowCount": len(tables["Pages.csv"]),
        "cohortObserved": metrics([row for rows in by_date.values() for row in rows]),
        "chartPropertyTotals": metrics([metric_row(row) for row in chart]),
        "missingCohortDates": [key for key, rows in by_date.items() if not rows],
        "perDate": page_rows,
    }


def window_issues(summary, as_of, label):
    issues = []
    window = summary["window"]
    if window["days"] != 28 or window["spanDays"] != 28:
        issues.append(f"{label}: requires 28 distinct consecutive chart days; got {window['days']} over {window['spanDays']} days.")
    if date.fromisoformat(window["end"]) >= as_of:
        issues.append(f"{label}: window includes today or future dates; not a completed window as of {as_of}.")
    return issues


def filter_scope(summary):
    return [pair for pair in summary["filters"] if pair[0].lower() != "date"]


def delta(before, after):
    result = {}
    for key in ("clicks", "impressions"):
        result[key] = {"absolute": after[key] - before[key],
                       "percent": (after[key] - before[key]) / before[key] * 100 if before[key] else None}
    for key, label in (("ctrPercent", "ctrPercentagePoints"), ("weightedPositionApprox", "weightedPositionApproxChange")):
        result[label] = after[key] - before[key] if before[key] is not None and after[key] is not None else None
    return result


def subset_metrics(summary, keys):
    if summary is None:
        return None
    rows = [summary["perDate"][key] for key in keys if summary["perDate"][key] is not None]
    return metrics([{"clicks": row["clicks"], "impressions": row["impressions"],
                     "position": row["weightedPositionApprox"]} for row in rows])


def compare(fixture, before, after, as_of, verified_live_date=None):
    push = date.fromisoformat(fixture["pushReportedDate"])
    if verified_live_date and (verified_live_date < push or verified_live_date > as_of):
        raise ValueError("Verified live date must be on/after reported push and not in the future")
    anchor = verified_live_date or push
    start = anchor + timedelta(days=1)
    end = start + timedelta(days=27)
    blockers = window_issues(before, as_of, "pre")
    warnings = []
    if date.fromisoformat(before["window"]["end"]) >= push:
        blockers.append("Pre window must finish before the reported push date.")
    if not verified_live_date:
        warnings.append("Live deployment has not been independently verified; post-push observations are not verified post-deployment results.")
    if after:
        blockers += window_issues(after, as_of, "post")
        if after["window"]["start"] <= before["window"]["end"]:
            blockers.append("Pre/post windows overlap or are reversed.")
        if date.fromisoformat(after["window"]["start"]) < start:
            blockers.append("Post window must start after the deployment anchor day to exclude a partial deployment day.")
        if filter_scope(before) != filter_scope(after):
            blockers.append("Non-date Filters.csv scopes differ; matched-filter comparison is required.")
    else:
        blockers.append("Post export pending; no future 28-day performance has been measured.")
    window_blockers = list(blockers)
    for label, summary in (("pre", before), ("post", after)):
        if not summary:
            continue
        if summary["missingCohortDates"]:
            blockers.append(f"{label}: {len(summary['missingCohortDates'])} cohort dates absent from Pages.csv; cannot assume zero.")
        if summary["pageExportRowCount"] >= 1000:
            warnings.append(f"{label}: Pages.csv has at least 1,000 rows; export truncation may omit pages or URL variants.")
        if (as_of - date.fromisoformat(summary["window"]["end"])).days <= 3:
            warnings.append(f"{label}: recent Search Console dates may still be preliminary; re-export after data settles.")
    expiry_end = after["window"]["end"] if after else end.isoformat()
    expired = [key for key in fixture["dates"] if key < expiry_end]
    newly_expired = [key for key in expired if key >= before["window"]["end"]]
    if expired:
        warnings.append("Cohort dates expire after their target day; retain the frozen cohort but do not attribute expiry-related changes to indexing recovery.")
    survivors = [key for key in fixture["dates"] if key >= expiry_end]
    survivor_blockers = list(window_blockers)
    if not survivors:
        survivor_blockers.append("No cohort dates remain unexpired through the post-window end.")
    for label, summary in (("pre", before), ("post", after)):
        if summary:
            missing = sorted(set(summary["missingCohortDates"]) & set(survivors))
            if missing:
                survivor_blockers.append(f"{label}: {len(missing)} matched unexpired dates absent from Pages.csv; cannot assume zero.")
    survivor_pre = subset_metrics(before, survivors)
    survivor_post = subset_metrics(after, survivors)
    return {
        "cohortId": fixture["cohortId"], "cohortSize": len(fixture["dates"]),
        "status": "pending_post_window" if after is None else "incomparable" if blockers else "observational_comparison",
        "asOf": as_of.isoformat(), "pushReportedDate": push.isoformat(),
        "pushCommit": fixture["pushCommit"], "pushVerified": fixture["pushVerified"],
        "verifiedLiveDate": verified_live_date.isoformat() if verified_live_date else None,
        "earliestCandidatePostWindow": {"start": start.isoformat(), "end": end.isoformat(),
                                        "basis": "verified live date" if verified_live_date else "push date; live deployment unverified"},
        "pre": before, "post": after,
        "observedCohortDelta": delta(before["cohortObserved"], after["cohortObserved"]) if after and not blockers else None,
        "expiredDatesByPostEnd": expired, "newlyExpiredSincePreEnd": newly_expired,
        "expiryIsProjection": after is None,
        "matchedUnexpiredSubcohort": {
            "definition": "Same frozen dates in both periods, restricted to target date >= post-window end (target day remains eligible).",
            "cutoff": expiry_end, "size": len(survivors), "dates": survivors,
            "preObserved": survivor_pre, "postObserved": survivor_post,
            "observedDelta": delta(survivor_pre, survivor_post) if after and not survivor_blockers else None,
            "blockers": survivor_blockers,
        },
        "blockers": blockers, "warnings": warnings, "limitations": LIMITATIONS,
    }


def load_fixture():
    fixture = json.loads(BASELINE.read_text(encoding="utf-8"))
    dates = fixture["dates"]
    if len(dates) != 65 or len(set(dates)) != 65:
        raise ValueError("Frozen cohort must contain exactly 65 unique dates")
    for key in dates:
        if date.fromisoformat(key).isoformat() != key:
            raise ValueError("Invalid cohort date")
    return fixture


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pre", type=Path, help="ZIP or extracted export folder; default: frozen baseline")
    parser.add_argument("--post", type=Path, help="ZIP or extracted export folder")
    parser.add_argument("--as-of", type=date.fromisoformat, default=date.today())
    parser.add_argument("--verified-live-date", type=date.fromisoformat)
    args = parser.parse_args()
    try:
        fixture = load_fixture()
        before = summarize_export(read_export(args.pre), fixture["dates"]) if args.pre else fixture["baseline"]
        if not before:
            raise ValueError("Baseline missing; supply --pre")
        after = summarize_export(read_export(args.post), fixture["dates"]) if args.post else None
        report = compare(fixture, before, after, args.as_of, args.verified_live_date)
    except (OSError, ValueError, KeyError, TypeError, zipfile.BadZipFile) as error:
        parser.error(str(error))
    print(json.dumps(report, indent=2, allow_nan=False))
    return 0 if report["status"] == "observational_comparison" else 1


if __name__ == "__main__":
    raise SystemExit(main())
