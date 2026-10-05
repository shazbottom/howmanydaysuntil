import assert from "node:assert/strict";
import test from "node:test";
import { getBusinessDayExplanation } from "./businessDayExplanation";
import { calculateBusinessDaysUntilForCountry, getBusinessDayTimeZone } from "./dateCalculators";

test("regional deductions reconcile with weekdays and exclude the start", () => {
  const audit = getBusinessDayExplanation("2026-12-28", "au", "au-nsw", "2026-12-24")!;
  assert.equal(audit.weekdays, 2);
  assert.equal(audit.result.businessDays, 0);
  assert.deepEqual(audit.result.includedHolidays.map((holiday) => holiday.date), ["2026-12-25", "2026-12-28"]);
  assert.equal(audit.coverage[0].level, "region");
  assert.ok(audit.coverage[0].attribution?.sources.some((source) => source.href));
  const endpoint = getBusinessDayExplanation("2026-12-28", "au", "au-nsw", "2026-12-25")!;
  assert.equal(endpoint.result.includedHolidays.length, 1);
});

test("reversed dates explain the same holiday deductions in chronological order", () => {
  const audit = getBusinessDayExplanation("2026-12-24", "au", "au-nsw", "2026-12-29")!;
  assert.equal(audit.reversed, true);
  assert.equal(audit.startDate, "2026-12-24");
  assert.equal(audit.result.includedHolidays.length, 2);
  assert.equal(audit.result.businessDays, 1);
});

test("each year identifies regional, country fallback, or missing coverage", () => {
  const audit = getBusinessDayExplanation("2029-01-03", "ca", "ca-on", "2026-12-24")!;
  assert.deepEqual(audit.coverage.map((item) => item.level), ["region", "country", "country", "missing"]);
  assert.equal(audit.coverage[1].fallback, true);
  assert.equal(audit.coverage[3].attribution, null);
});

test("undated holidays are identified rather than claimed as deducted", () => {
  const audit = getBusinessDayExplanation("2026-12-31", "au", "au-vic", "2026-01-01")!;
  assert.ok(audit.coverage[0].undatedHolidays.includes("Friday before AFL Grand Final"));
});

test("until explanation uses the calculator country timezone and handles invalid dates", () => {
  const audit = getBusinessDayExplanation("2026-12-28", "au", "au-nsw", undefined, new Date("2026-12-24T15:00:00Z"))!;
  assert.equal(audit.startDate, "2026-12-25");
  assert.equal(audit.todayTimeZone, "Australia/Sydney");
  assert.equal(getBusinessDayExplanation("invalid", "au"), null);
  assert.equal(getBusinessDayExplanation("2026-12-25", "au", undefined, "2026-12-25")!.result.businessDays, 0);
});

test("regional today reconciles the estimate and audit across midnight and DST", () => {
  for (const now of [new Date("2026-03-09T05:30:00Z"), new Date("2026-11-02T05:30:00Z")]) {
    const audit = getBusinessDayExplanation("2026-12-31", "us", "us-ca", undefined, now)!;
    assert.equal(audit.todayTimeZone, "America/Los_Angeles");
    assert.equal(audit.startDate, now.getUTCMonth() === 2 ? "2026-03-08" : "2026-11-01");
    assert.equal(calculateBusinessDaysUntilForCountry("2026-12-31", "us", "us-ca", now)!.businessDays, audit.result.businessDays);
  }
  assert.equal(getBusinessDayTimeZone("us", "au-nsw"), "America/New_York");
});
