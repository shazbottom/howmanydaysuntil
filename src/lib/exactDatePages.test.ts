import assert from "node:assert/strict";
import test from "node:test";
import { getCountdown } from "./countdown";
import { getExactDateDetails } from "./exactDatePages";

function buildDetailsForDate(targetDateText: string, nowText: string) {
  const targetDate = new Date(`${targetDateText}T00:00:00`);
  const now = new Date(`${nowText}T12:00:00`);
  const countdown = getCountdown(targetDate, now);

  return getExactDateDetails(targetDate, countdown);
}

test("December dates show summer in Australia and winter in the US and Europe", () => {
  const details = buildDetailsForDate("2026-12-17", "2026-06-20");

  assert.equal(
    details.includes("Summer in Australia, Winter in the US and Europe."),
    true,
  );
});

test("April dates show autumn in Australia and spring in the US and Europe", () => {
  const details = buildDetailsForDate("2026-04-15", "2026-01-10");

  assert.equal(
    details.includes("Autumn in Australia, Spring in the US and Europe."),
    true,
  );
});

test("July dates show winter in Australia and summer in the US and Europe", () => {
  const details = buildDetailsForDate("2026-07-15", "2026-03-01");

  assert.equal(
    details.includes("Winter in Australia, Summer in the US and Europe."),
    true,
  );
});

test("October dates show spring in Australia and autumn in the US and Europe", () => {
  const details = buildDetailsForDate("2026-10-15", "2026-06-01");

  assert.equal(
    details.includes("Spring in Australia, Autumn in the US and Europe."),
    true,
  );
});
