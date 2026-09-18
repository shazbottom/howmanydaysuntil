"""Offline triage of a GSC issue-detail CSV/ZIP against local URL policy.

No network requests or automatic redirects. Results are source expectations,
not a claim about Google's index or the deployed HTTP response.
"""
import argparse
from collections import Counter
import csv
from datetime import date
import io
import json
from pathlib import Path
import re
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
import zipfile

from audit_exact_date_indexing import read_policy


def read_export(path):
    if path.suffix.lower() == ".zip":
        with zipfile.ZipFile(path) as archive:
            tables = [(name, archive.read(name).decode("utf-8-sig"))
                      for name in archive.namelist() if name.lower().endswith(".csv")]
    else:
        tables = [(path.name, path.read_text(encoding="utf-8-sig"))]
    urls, reasons = [], []
    for name, content in tables:
        reader = csv.DictReader(io.StringIO(content))
        fields = reader.fieldnames or []
        url_field = next((key for key in fields if key.lower().strip() in ("url", "page url")), None)
        if url_field:
            urls.extend(row[url_field].strip() for row in reader if row.get(url_field))
        elif "Reason" in fields and "Pages" in fields:
            reasons.extend({"reason": row["Reason"], "pages": int(row["Pages"].replace(",", ""))}
                           for row in reader)
    return sorted(set(urls)), reasons


def read_sitemap(path):
    if path is None:
        return set()
    root = ET.parse(path).getroot()
    return {urlsplit(element.text).path for element in root.iter()
            if element.tag.endswith("}loc") and element.text}


def classify(url, allowed, as_of, ceiling, sitemap_paths):
    parsed = urlsplit(url)
    path = parsed.path
    result = {"url": url, "inLocalSitemap": path in sitemap_paths,
              "category": "needs_inspection", "action": "Inspect live status, canonical and indexing directives."}
    if parsed.scheme not in ("https", "http") or parsed.hostname not in ("daysuntil.is", "www.daysuntil.is"):
        return {**result, "category": "outside_property", "action": "Check the export/property; not a supported site URL."}
    if path.startswith(("/c/", "/embed/")) or path == "/create":
        return {**result, "category": "intentional_private_or_tool_exclusion", "action": "Keep personal records and embed variants out of the index."}
    match = re.fullmatch(r"/days-until/date/(\d{4})/(\d{2})/(\d{2})/?", path)
    if match:
        try:
            target = date(*map(int, match.groups()))
        except ValueError:
            return {**result, "category": "expected_404_invalid_date", "action": "Leave invalid dates unavailable; remove any internal link to them."}
        if target < as_of or target > ceiling:
            return {**result, "category": "expected_404_outside_range", "action": "Source intentionally rejects this date. Remove stale internal links; do not redirect unrelated dates to the homepage."}
        if target.isoformat() not in allowed:
            return {**result, "category": "intentional_noindex_exact_date", "action": "Not selected for indexing. Review search demand before changing the allowlist."}
        result.update(category="eligible_exact_date_inspect", action="Source allows indexing. Use URL Inspection to check live response and canonical, then compare Google's last crawl." )
    elif re.fullmatch(r"/days-until/[^/]+", path):
        result.update(category="legacy_redirect_verify", action="Source redirects this route to /days-until-[slug]. Verify that the final destination exists before treating the exclusion as expected.")
    elif path in sitemap_paths:
        result.update(category="sitemap_url_inspect", action="Local sitemap lists this page. Prioritise live response, canonical and content checks; sitemap presence does not guarantee indexing.")
    if parsed.hostname == "www.daysuntil.is" or parsed.scheme == "http":
        result["hostNote"] = "Verify one-way HTTPS/apex normalization in Vercel; this offline audit cannot check it."
    return result


def build_report(urls, reasons, allowed, as_of, ceiling, sitemap_paths):
    rows = [classify(url, allowed, as_of, ceiling, sitemap_paths) for url in urls]
    return {"asOf": as_of.isoformat(), "evidence": "Local policy only; no live requests",
            "status": "url_examples_available" if rows else "blocked_missing_url_examples",
            "reportedReasons": reasons, "exampleCount": len(rows),
            "categories": dict(Counter(row["category"] for row in rows)), "examples": rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("export", type=Path)
    parser.add_argument("--as-of", type=date.fromisoformat, default=date.today())
    parser.add_argument("--sitemap", type=Path, help="Optional locally built sitemap XML")
    args = parser.parse_args()
    try:
        urls, reasons = read_export(args.export)
        allowed, ceiling = read_policy()
        report = build_report(urls, reasons, allowed, args.as_of, ceiling, read_sitemap(args.sitemap))
    except (OSError, ValueError, zipfile.BadZipFile, ET.ParseError) as error:
        parser.error(str(error))
    print(json.dumps(report, indent=2))
    return 0 if urls else 2


if __name__ == "__main__":
    raise SystemExit(main())
