"""Read-only GSC Pages.csv/ZIP audit; never automatically expands indexing.

Usage: python scripts/audit_exact_date_indexing.py export.zip --as-of 2026-09-18 --check
Exit 1 with --check when clicked, in-range dates are missing from the allowlist.
Impression-only dates and dates beyond the rollout ceiling require separate review.
"""

import argparse
import csv
from datetime import date
import io
import json
from pathlib import Path
import re
from urllib.parse import urlsplit
import zipfile


ROOT = Path(__file__).resolve().parents[1]
DATE_PATH = re.compile(r"/days-until/date/(\d{4})/(\d{2})/(\d{2})")


def read_pages(path):
    if path.suffix.lower() == ".zip":
        with zipfile.ZipFile(path) as archive:
            names = [name for name in archive.namelist() if Path(name).name == "Pages.csv"]
            if len(names) != 1:
                raise ValueError("Expected exactly one Pages.csv in the ZIP")
            content = archive.read(names[0]).decode("utf-8-sig")
    else:
        content = path.read_text(encoding="utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))
    if not {"Top pages", "Clicks", "Impressions"}.issubset(reader.fieldnames or []):
        raise ValueError("Expected GSC columns: Top pages, Clicks, Impressions")
    return list(reader)


def read_policy():
    source = (ROOT / "src/data/indexableExactDates.ts").read_text(encoding="utf-8")
    keys = re.findall(r'^\s*"(\d{4}-\d{2}-\d{2})",?\s*$', source, re.MULTILINE)
    if not keys or len(keys) != len(set(keys)):
        raise ValueError("Allowlist must contain unique literal date keys")
    for key in keys:
        date.fromisoformat(key)
    pages = (ROOT / "src/lib/exactDatePages.ts").read_text(encoding="utf-8")
    end = re.search(
        r"EXACT_DATE_ROLLOUT_END\s*=\s*\{\s*year:\s*(\d+),\s*month:\s*(\d+),\s*day:\s*(\d+)",
        pages,
    )
    if not end:
        raise ValueError("Cannot read the application's rollout ceiling")
    return set(keys), date(*map(int, end.groups()))


def summarize(rows):
    return {
        "dates": len(rows),
        "clicks": sum(row["clicks"] for row in rows),
        "impressions": sum(row["impressions"] for row in rows),
    }


def audit(rows, allowed, as_of, rollout_end):
    dates = {}
    for row in rows:
        url = urlsplit(row["Top pages"])
        match = DATE_PATH.fullmatch(url.path)
        if url.scheme != "https" or url.netloc != "daysuntil.is" or not match:
            continue
        try:
            target = date(*map(int, match.groups()))
        except ValueError:
            continue
        if target < as_of:
            continue
        key = target.isoformat()
        entry = dates.setdefault(key, {"date": key, "clicks": 0, "impressions": 0})
        for metric in ("clicks", "impressions"):
            value = int(row[metric.title()].replace(",", ""))
            if value < 0:
                raise ValueError("GSC counts must not be negative")
            entry[metric] += value

    in_range = [row for key, row in sorted(dates.items()) if key <= rollout_end.isoformat()]
    missing = [row for row in in_range if row["date"] not in allowed]
    clicked = [row for row in missing if row["clicks"] > 0]
    return {
        "asOf": as_of.isoformat(),
        "rolloutEnd": rollout_end.isoformat(),
        "allowlistKeys": len(allowed),
        "futureInRange": summarize(in_range),
        "missingFutureInRange": summarize(missing),
        "missingClicked": summarize(clicked),
        "recoveryCandidates": clicked,
        "impressionOnlyReview": [row for row in missing if row["clicks"] == 0 and row["impressions"] > 0],
        "beyondRolloutReview": [row for key, row in sorted(dates.items()) if key > rollout_end.isoformat()],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("export", type=Path)
    parser.add_argument("--as-of", type=date.fromisoformat, default=date.today())
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    try:
        allowed, rollout_end = read_policy()
        result = audit(read_pages(args.export), allowed, args.as_of, rollout_end)
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        parser.error(str(error))
    print(json.dumps(result, indent=2))
    return 1 if args.check and result["recoveryCandidates"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
