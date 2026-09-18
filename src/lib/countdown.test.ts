import assert from "node:assert/strict";
import test from "node:test";
import { getCalendarDaysRemaining, getCountdown } from "./countdown";

test("calendar days remain stable across spring and autumn clock changes", () => {
  for (const [year, month, day] of [[2026, 2, 8], [2026, 9, 4], [2026, 10, 1], [2026, 3, 5]]) {
    const start = new Date(year, month, day);
    const end = new Date(year, month, day + 1);
    assert.equal(getCalendarDaysRemaining(end, start), 1);
    assert.equal(getCountdown(end, start).daysRemaining, 1);
  }
});

test("calendar days handle leap day, year rollover and same-day targets", () => {
  assert.equal(getCalendarDaysRemaining(new Date(2028, 2, 1), new Date(2028, 1, 28)), 2);
  assert.equal(getCalendarDaysRemaining(new Date(2027, 0, 1), new Date(2026, 11, 31)), 1);
  assert.equal(getCalendarDaysRemaining(new Date(2026, 8, 18, 23), new Date(2026, 8, 18, 1)), 0);
});
