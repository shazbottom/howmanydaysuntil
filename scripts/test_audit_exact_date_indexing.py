import contextlib
from datetime import date
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

import audit_exact_date_indexing as audit


def row(key, clicks=1, impressions=10):
    return {"Top pages": f"https://daysuntil.is/days-until/date/{key}",
            "Clicks": str(clicks), "Impressions": str(impressions)}


class AuditTests(unittest.TestCase):
    def test_narrow_recovery_and_separate_review(self):
        rows = [row("2026/09/18"), row("2026/09/17"), row("2027/01/01"),
                row("2027/02/01", 0, 1000), row("2031/01/01"), row("2027/02/30")]
        result = audit.audit(rows, {"2027-01-01"}, date(2026, 9, 18), date(2030, 12, 31))
        self.assertEqual(result["missingClicked"], {"dates": 1, "clicks": 1, "impressions": 10})
        self.assertEqual(result["recoveryCandidates"][0]["date"], "2026-09-18")
        self.assertEqual(result["impressionOnlyReview"][0]["date"], "2027-02-01")
        self.assertEqual(result["beyondRolloutReview"][0]["date"], "2031-01-01")

    def test_aggregates_url_variants_but_ignores_other_routes_and_hosts(self):
        first = row("2027/01/01")
        variant = row("2027/01/01?ref=test", 2, "1,000")
        unrelated = [{**first, "Top pages": url} for url in [
            "https://example.com/days-until/date/2027/01/01",
            "https://daysuntil.is/c/private",
            "https://daysuntil.is/au/days-until/2027-01-01",
            "https://daysuntil.is/days-until/date/2027/01/01/opengraph-image",
        ]]
        result = audit.audit([first, variant, *unrelated], set(), date(2026, 9, 18), date(2030, 12, 31))
        self.assertEqual(result["missingClicked"], {"dates": 1, "clicks": 3, "impressions": 1010})

    def test_reads_csv_and_zip_with_bom_and_quoted_counts(self):
        content = '\ufeffTop pages,Clicks,Impressions,CTR,Position\nhttps://daysuntil.is/days-until/date/2027/01/01,1,"1,234",0.1%,10\n'
        with tempfile.TemporaryDirectory() as directory:
            csv_path = Path(directory) / "Pages.csv"
            csv_path.write_text(content, encoding="utf-8")
            zip_path = Path(directory) / "export.zip"
            with zipfile.ZipFile(zip_path, "w") as archive:
                archive.writestr("export/Pages.csv", content)
            self.assertEqual(audit.read_pages(csv_path), audit.read_pages(zip_path))
            self.assertEqual(audit.read_pages(csv_path)[0]["Impressions"], "1,234")

    def test_rejects_wrong_export(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "Queries.csv"
            path.write_text("Top queries,Clicks,Impressions\nChristmas,1,10\n", encoding="utf-8")
            with self.assertRaises(ValueError):
                audit.read_pages(path)

    def test_check_fails_only_for_missing_clicked_in_range_dates(self):
        for allowed, expected in [(set(), 1), ({"2027-01-01"}, 0)]:
            with (patch("sys.argv", ["audit", "export.zip", "--as-of", "2026-09-18", "--check"]),
                  patch.object(audit, "read_policy", return_value=(allowed, date(2030, 12, 31))),
                  patch.object(audit, "read_pages", return_value=[row("2027/01/01"), row("2027/02/01", 0), row("2031/01/01")]),
                  contextlib.redirect_stdout(io.StringIO()) as output):
                self.assertEqual(audit.main(), expected)
                self.assertEqual(len(json.loads(output.getvalue())["recoveryCandidates"]), expected)


if __name__ == "__main__":
    unittest.main()
