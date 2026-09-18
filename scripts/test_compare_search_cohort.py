import contextlib
import copy
import csv
from datetime import date, timedelta
import io
import json
from pathlib import Path
import re
import tempfile
import unittest
from unittest.mock import patch
import zipfile

import compare_search_cohort as cohort


def export_tables(start="2026-08-19", days=28):
    keys = cohort.load_fixture()["dates"]
    chart = [{"Date": (date.fromisoformat(start) + timedelta(days=offset)).isoformat(),
              "Clicks": "2", "Impressions": "100", "Position": "10"}
             for offset in range(days)]
    pages = [{"Top pages": "https://daysuntil.is/days-until/date/" + key.replace("-", "/"),
              "Clicks": "1", "Impressions": "100", "Position": "10"} for key in keys]
    return {"Chart.csv": chart, "Pages.csv": pages,
            "Filters.csv": [{"Filter": "Search type", "Value": "Web"},
                            {"Filter": "Date", "Value": "Last 28 days"}]}


def summary(start="2026-08-19", days=28):
    return cohort.summarize_export(export_tables(start, days), cohort.load_fixture()["dates"])


class CohortTests(unittest.TestCase):
    def setUp(self):
        self.fixture = cohort.load_fixture()
        self.before = summary()
        self.after = summary("2026-09-19")

    def compare(self, before=None, after=None, as_of=date(2026, 10, 20), **kwargs):
        return cohort.compare(self.fixture, before or self.before, after or self.after, as_of, **kwargs)

    def test_frozen_cohort_matches_recovery_regression_list(self):
        source = (cohort.BASELINE.parents[2] / "src/lib/exactDateMetadata.test.ts").read_text(encoding="utf-8")
        block = re.search(r"const recoveredClickedDates = \[([\s\S]*?)\] as const", source)[1]
        expected = re.findall(r'"(\d{4}-\d{2}-\d{2})"', block)
        self.assertEqual(self.fixture["dates"], expected)
        self.assertEqual(len(set(expected)), 65)
        baseline = self.fixture["baseline"]
        self.assertEqual(baseline["window"], {"start": "2026-08-19", "end": "2026-09-15", "days": 28, "spanDays": 28})
        self.assertEqual(baseline["missingCohortDates"], [])
        self.assertEqual(baseline["cohortObserved"]["clicks"], 71)
        self.assertEqual(baseline["cohortObserved"]["impressions"], 11184)
        self.assertEqual(sum(row["clicks"] for row in baseline["perDate"].values()), 71)
        self.assertEqual(baseline["chartPropertyTotals"]["clicks"], 122)
        self.assertEqual(baseline["chartPropertyTotals"]["impressions"], 119352)

    def test_normalizes_www_query_fragment_and_trailing_slash(self):
        for value in ["https://daysuntil.is/days-until/date/2029/04/30",
                      "http://www.daysuntil.is/days-until/date/2029/04/30/?ref=x#result"]:
            self.assertEqual(cohort.normalized_key(value), "2029-04-30")
        for value in ["https://example.com/days-until/date/2029/04/30",
                      "https://daysuntil.is/days-until/date/2029/02/30",
                      "https://daysuntil.is/c/private", "https://daysuntil.is/au/days-until/2029-04-30"]:
            self.assertIsNone(cohort.normalized_key(value))

    def test_normalized_rows_aggregate_weighted_metrics_not_average_ctr(self):
        tables = export_tables()
        tables["Pages.csv"] = [
            {"Top pages": "https://daysuntil.is/days-until/date/2029/04/30", "Clicks": "10", "Impressions": "100", "Position": "2"},
            {"Top pages": "https://www.daysuntil.is/days-until/date/2029/04/30?x=1", "Clicks": "0", "Impressions": "900", "Position": "10"},
        ]
        result = cohort.summarize_export(tables, ["2029-04-30"])
        self.assertEqual(result["cohortObserved"]["ctrPercent"], 1)
        self.assertEqual(result["cohortObserved"]["weightedPositionApprox"], 9.2)
        self.assertEqual(result["perDate"]["2029-04-30"], result["cohortObserved"])

    def test_complete_equal_windows_compare_but_do_not_assert_live_deployment(self):
        result = self.compare()
        self.assertEqual(result["status"], "observational_comparison")
        self.assertEqual(result["observedCohortDelta"]["clicks"]["absolute"], 0)
        self.assertIsNone(result["verifiedLiveDate"])
        self.assertTrue(any("independently verified" in warning for warning in result["warnings"]))
        self.assertEqual(result["newlyExpiredSincePreEnd"], ["2026-09-30"])
        self.assertEqual(result["cohortSize"], 65)
        self.assertEqual(result["matchedUnexpiredSubcohort"]["size"], 64)
        self.assertNotIn("2026-09-30", result["matchedUnexpiredSubcohort"]["dates"])
        self.assertEqual(result["matchedUnexpiredSubcohort"]["observedDelta"]["clicks"]["absolute"], 0)

    def test_september_and_october_expiry_use_identical_survivors_in_both_windows(self):
        after = summary("2026-10-01")
        result = self.compare(after=after, as_of=date(2026, 11, 1))
        self.assertEqual(result["newlyExpiredSincePreEnd"], ["2026-09-30", "2026-10-21"])
        matched = result["matchedUnexpiredSubcohort"]
        self.assertEqual(matched["size"], 63)
        self.assertEqual(matched["preObserved"]["clicks"], 63)
        self.assertEqual(matched["postObserved"]["clicks"], 63)

    def test_missing_expired_page_does_not_block_complete_survivor_comparison(self):
        tables = export_tables("2026-09-19")
        tables["Pages.csv"] = tables["Pages.csv"][1:]
        after = cohort.summarize_export(tables, self.fixture["dates"])
        result = self.compare(after=after)
        self.assertIsNone(result["observedCohortDelta"])
        matched = result["matchedUnexpiredSubcohort"]
        self.assertEqual(matched["size"], 64)
        self.assertEqual(matched["blockers"], [])
        self.assertEqual(matched["observedDelta"]["clicks"]["absolute"], 0)

    def test_no_survivors_after_current_2030_horizon(self):
        result = self.compare(after=summary("2031-01-01"), as_of=date(2031, 2, 1))
        matched = result["matchedUnexpiredSubcohort"]
        self.assertEqual(matched["size"], 0)
        self.assertIsNone(matched["observedDelta"])
        self.assertTrue(matched["blockers"])

    def test_pending_does_not_invent_future_results(self):
        result = cohort.compare(self.fixture, self.fixture["baseline"], None, date(2026, 9, 18))
        self.assertEqual(result["status"], "pending_post_window")
        self.assertIsNone(result["post"])
        self.assertIsNone(result["observedCohortDelta"])
        self.assertEqual(result["earliestCandidatePostWindow"]["end"], "2026-10-16")
        self.assertTrue(result["expiryIsProjection"])

    def test_short_gapped_or_future_windows_suppress_deltas(self):
        short = summary("2026-09-19", 27)
        tables = export_tables("2026-09-19", 29)
        del tables["Chart.csv"][10]
        gapped = cohort.summarize_export(tables, self.fixture["dates"])
        for after, as_of in [(short, date(2026, 10, 20)), (gapped, date(2026, 10, 20)),
                             (self.after, date(2026, 10, 16)), (self.after, date(2026, 9, 18))]:
            result = self.compare(after=after, as_of=as_of)
            self.assertEqual(result["status"], "incomparable")
            self.assertIsNone(result["observedCohortDelta"])

    def test_filters_must_match_except_date_label(self):
        after = copy.deepcopy(self.after)
        after["filters"] = [["Date", "Custom"], ["Search type", "Web"]]
        self.assertEqual(self.compare(after=after)["status"], "observational_comparison")
        after["filters"].append(["Device", "Mobile"])
        self.assertEqual(self.compare(after=after)["status"], "incomparable")

    def test_overlapping_and_predeployment_windows_are_blocked(self):
        for after in [self.before, summary("2026-09-18")]:
            result = self.compare(after=after)
            self.assertEqual(result["status"], "incomparable")
        result = self.compare(verified_live_date=date(2026, 9, 20))
        self.assertEqual(result["status"], "incomparable")
        with self.assertRaises(ValueError):
            self.compare(verified_live_date=date(2026, 12, 1))

    def test_missing_rows_are_unknown_not_zero(self):
        tables = export_tables("2026-09-19")
        tables["Pages.csv"].pop()
        after = cohort.summarize_export(tables, self.fixture["dates"])
        key = self.fixture["dates"][-1]
        self.assertIsNone(after["perDate"][key])
        result = self.compare(after=after)
        self.assertEqual(result["status"], "incomparable")
        self.assertIsNone(result["observedCohortDelta"])

    def test_truncation_and_preliminary_data_warn(self):
        after = copy.deepcopy(self.after)
        after["pageExportRowCount"] = 1000
        result = self.compare(after=after, as_of=date(2026, 10, 18))
        self.assertTrue(any("truncation" in warning for warning in result["warnings"]))
        self.assertTrue(any("preliminary" in warning for warning in result["warnings"]))

    def test_zero_denominators_are_null(self):
        zero = cohort.metrics([])
        self.assertIsNone(zero["ctrPercent"])
        self.assertIsNone(zero["weightedPositionApprox"])
        result = cohort.delta(zero, zero)
        self.assertIsNone(result["clicks"]["percent"])
        self.assertIsNone(result["ctrPercentagePoints"])

    def test_rejects_duplicate_chart_dates_and_invalid_metrics(self):
        tables = export_tables()
        tables["Chart.csv"].append(tables["Chart.csv"][0])
        with self.assertRaises(ValueError):
            cohort.summarize_export(tables, self.fixture["dates"])
        for position in ["NaN", "inf", "", "-1"]:
            with self.assertRaises(ValueError):
                cohort.metric_row({"Clicks": "1", "Impressions": "10", "Position": position})

    def test_zip_and_directory_exports_with_bom(self):
        tables = export_tables()
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            archive_path = folder / "export.zip"
            with zipfile.ZipFile(archive_path, "w") as archive:
                for name, rows in tables.items():
                    stream = io.StringIO()
                    writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
                    writer.writeheader()
                    writer.writerows(rows)
                    content = "\ufeff" + stream.getvalue()
                    (folder / name).write_text(content, encoding="utf-8")
                    archive.writestr("export/" + name, content)
            self.assertEqual(cohort.read_export(folder), tables)
            self.assertEqual(cohort.read_export(archive_path), tables)
            (folder / "Filters.csv").write_text("Wrong,Columns\n", encoding="utf-8")
            with self.assertRaises(ValueError):
                cohort.read_export(folder)

    def test_cli_default_is_pending_without_writing_files(self):
        with (patch("sys.argv", ["compare", "--as-of", "2026-09-18"]),
              contextlib.redirect_stdout(io.StringIO()) as output):
            self.assertEqual(cohort.main(), 1)
            self.assertEqual(json.loads(output.getvalue())["status"], "pending_post_window")


if __name__ == "__main__":
    unittest.main()
