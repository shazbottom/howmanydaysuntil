import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCalculatorSharePath,
  getDefaultCalculatorRegionId,
  getDefaultCalculatorValues,
  hasCalculatorShareParams,
  parseCalculatorSearchParams,
} from "./calculatorShare";

const now = new Date("2026-07-14T12:00:00");

test("calculator defaults follow today and the current year", () => {
  const defaults = getDefaultCalculatorValues(now);

  assert.equal(defaults.startDate, "2026-07-14");
  assert.equal(defaults.endDate, "2026-12-31");
  assert.equal(defaults.targetDate, "2026-12-31");
});

test("calculator query values restore valid dates and regional selections", () => {
  const values = parseCalculatorSearchParams(
    {
      start: "2026-08-01",
      end: "2026-09-01",
      country: "us",
      region: "invalid-region",
      amount: "45",
      mode: "subtract",
      unit: "weeks",
    },
    now,
  );

  assert.equal(values.startDate, "2026-08-01");
  assert.equal(values.endDate, "2026-09-01");
  assert.equal(values.countryCode, "us");
  assert.equal(values.regionId, getDefaultCalculatorRegionId("us"));
  assert.equal(values.amount, 45);
  assert.equal(values.mode, "subtract");
  assert.equal(values.unit, "weeks");
});

test("invalid dates stay empty while other query values fall back to constrained defaults", () => {
  const values = parseCalculatorSearchParams(
    {
      start: "2026-02-30",
      country: "xx",
      age: "150",
      amount: "-2",
    },
    now,
  );

  assert.equal(values.startDate, "");
  assert.equal(values.countryCode, "au");
  assert.equal(values.retirementAge, 67);
  assert.equal(values.amount, 30);
});

test("share paths contain only the active calculator inputs", () => {
  const values = {
    ...getDefaultCalculatorValues(now),
    startDate: "2026-08-01",
    endDate: "2026-09-01",
    countryCode: "us" as const,
    regionId: "us-ca",
  };
  const path = buildCalculatorSharePath("business-days-between", values);

  assert.equal(
    path,
    "/business-days-between-dates?start=2026-08-01&end=2026-09-01&country=us&region=us-ca",
  );
  assert.equal(path.includes("age="), false);
});

test("recognized calculator parameters mark a URL as a shared result", () => {
  assert.equal(hasCalculatorShareParams({ start: "2026-08-01" }), true);
  assert.equal(hasCalculatorShareParams({ unrelated: "value" }), false);
});

test("malformed shared dates cannot silently become a different target", () => {
  const values = parseCalculatorSearchParams({ target: "2027-02-30", country: "us", region: "us-ca" }, now);
  assert.equal(values.targetDate, "");
  assert.equal(values.hasExplicitHolidayCalendar, true);
  const omitted = parseCalculatorSearchParams({ country: "us", region: "us-ca" }, now);
  assert.equal(omitted.targetDate, "2026-12-31");
});

test("only a valid country and matching region confirm a holiday calendar", () => {
  assert.equal(parseCalculatorSearchParams({}, now).hasExplicitHolidayCalendar, false);
  assert.equal(parseCalculatorSearchParams({ country: "us" }, now).hasExplicitHolidayCalendar, false);
  assert.equal(parseCalculatorSearchParams({ country: "us", region: "au-nsw" }, now).hasExplicitHolidayCalendar, false);
  assert.equal(parseCalculatorSearchParams({ country: "us", region: "us-ca" }, now).hasExplicitHolidayCalendar, true);
  const restored = parseCalculatorSearchParams({ target: "2027-01-01", country: "us", region: "us-ca" }, now);
  assert.equal(restored.targetDate, "2027-01-01");
  assert.equal(restored.referenceNow, now.toISOString());
});
