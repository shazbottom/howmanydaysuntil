from datetime import date
import tempfile
from pathlib import Path
import unittest
import zipfile

from triage_indexing import build_report, classify, read_export


class TriageTests(unittest.TestCase):
    def classify(self, path):
        return classify("https://daysuntil.is" + path, {"2029-04-30"}, date(2026, 9, 18), date(2030, 12, 31), {"/days-until-christmas"})["category"]

    def test_policy_boundaries(self):
        self.assertEqual(self.classify("/days-until/date/2026/09/17"), "expected_404_outside_range")
        self.assertEqual(self.classify("/days-until/date/2031/01/01"), "expected_404_outside_range")
        self.assertEqual(self.classify("/days-until/date/2027/02/29"), "expected_404_invalid_date")
        self.assertEqual(self.classify("/days-until/date/2029/04/30"), "eligible_exact_date_inspect")
        self.assertEqual(self.classify("/days-until/date/2029/04/29"), "intentional_noindex_exact_date")

    def test_no_guessed_status_for_other_routes(self):
        self.assertEqual(self.classify("/missing"), "needs_inspection")
        self.assertEqual(self.classify("/days-until-christmas"), "sitemap_url_inspect")
        self.assertEqual(self.classify("/days-until/christmas"), "legacy_redirect_verify")
        self.assertEqual(self.classify("/c/private"), "intentional_private_or_tool_exclusion")

    def test_summary_is_not_mistaken_for_zero_issues(self):
        report = build_report([], [{"reason": "Not found (404)", "pages": 101}], set(), date.today(), date(2030, 12, 31), set())
        self.assertEqual(report["status"], "blocked_missing_url_examples")
        self.assertEqual(report["reportedReasons"][0]["pages"], 101)

    def test_reads_issue_detail_url_column_and_deduplicates(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "export.zip"
            with zipfile.ZipFile(path, "w") as archive:
                archive.writestr("Table.csv", "\ufeffURL,Last crawled\nhttps://daysuntil.is/missing,2026-09-01\nhttps://daysuntil.is/missing,2026-09-02\n")
            self.assertEqual(read_export(path)[0], ["https://daysuntil.is/missing"])


if __name__ == "__main__":
    unittest.main()
