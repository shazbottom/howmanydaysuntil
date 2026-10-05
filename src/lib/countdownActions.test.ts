import assert from "node:assert/strict";
import test from "node:test";
import { getCountdownActions, parseCountdownPrefill } from "./countdownActions";
import { parseCalculatorSearchParams } from "./calculatorShare";
import { parseCountdownWidgetConfig } from "./countdownWidget";

test("all destination tools preserve the chosen date", () => {
  const actions = getCountdownActions(new Date(2028, 1, 29), "Leap day & friends");
  const params = (path: string) => Object.fromEntries(new URL(path, "https://daysuntil.is").searchParams);
  assert.equal(parseCalculatorSearchParams(params(actions.business)).targetDate, "2028-02-29");
  assert.equal(parseCalculatorSearchParams(params(actions.compare)).endDate, "2028-02-29");
  assert.equal(parseCalculatorSearchParams(params(actions.adjust)).startDate, "2028-02-29");
  assert.equal(parseCountdownWidgetConfig(params(actions.widget)).targetDate, "2028-02-29");
  assert.deepEqual(parseCountdownPrefill(params(actions.save)), { title: "Leap day & friends", targetDate: "2028-02-29T00:00" });
});

test("prefill rejects malformed and overflowing dates", () => {
  for (const date of ["2027-02-29", "2028-13-01", "oops", "2028-2-1", "1899-01-01"]) {
    assert.equal(parseCountdownPrefill({ date }).targetDate, "");
  }
  assert.equal(parseCountdownPrefill({ date: ["2028-02-29", "bad"], title: "x".repeat(100) }).title.length, 60);
});

test("regional planning preserves the civil date across leap day and DST boundaries", () => {
  for (const [instant, expected] of [
    ["2028-02-28T13:00:00Z", "2028-02-29"],
    ["2026-10-03T14:00:00Z", "2026-10-04"],
    ["2026-10-04T13:00:00Z", "2026-10-05"],
  ]) {
    const actions = getCountdownActions(new Date(instant), "Sydney deadline", {
      countryCode: "au", regionId: "au-nsw", timeZone: "Australia/Sydney",
    });
    const params = Object.fromEntries(new URL(actions.business, "https://daysuntil.is").searchParams);
    const parsed = parseCalculatorSearchParams(params);
    assert.equal(parsed.targetDate, expected);
    assert.equal(parsed.countryCode, "au");
    assert.equal(parsed.regionId, "au-nsw");
    const saved = new URL(actions.save, "https://daysuntil.is");
    assert.equal(parseCountdownPrefill(Object.fromEntries(saved.searchParams)).targetDate, `${expected}T00:00`);
    assert.equal(saved.searchParams.has("country"), false);
  }
  const west = getCountdownActions(new Date("2026-12-25T08:00:00Z"), "Christmas", {
    countryCode: "us", regionId: "us-ca", timeZone: "America/Los_Angeles",
  });
  assert.equal(new URL(west.business, "https://daysuntil.is").searchParams.get("target"), "2026-12-25");
});

test("generic events do not invent a country and region context cannot cross countries", () => {
  const target = new Date(2027, 5, 21);
  const generic = new URL(getCountdownActions(target, "Original Northern Hemisphere summer").business, "https://daysuntil.is");
  assert.deepEqual(Object.fromEntries(generic.searchParams), { target: "2027-06-21" });
  const mismatched = new URL(getCountdownActions(target, "Holiday", { countryCode: "uk", regionId: "au-nsw" }).business, "https://daysuntil.is");
  assert.equal(mismatched.searchParams.get("country"), "uk");
  assert.equal(mismatched.searchParams.has("region"), false);
  const orphan = new URL(getCountdownActions(target, "Holiday", { regionId: "au-nsw" }).business, "https://daysuntil.is");
  assert.equal(orphan.searchParams.has("region"), false);
});
