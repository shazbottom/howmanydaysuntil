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
