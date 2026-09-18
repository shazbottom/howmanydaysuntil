import assert from "node:assert/strict";
import test from "node:test";
import { getCountdown } from "./countdown";
import { indexableExactDateKeys } from "../data/indexableExactDates";
import {
  getExactDateDetails,
  getExactDateFactSections,
  getExactDateStaticParams,
  isExactDateIndexable,
} from "./exactDatePages";

test("day-of-year facts do not lose a day after daylight saving starts", () => {
  const target = new Date(2026, 6, 1);
  const facts = getExactDateFactSections(target, getCountdown(target, new Date(2026, 0, 1)));
  assert.ok(facts.flatMap(section => section.lines).some(line => line.startsWith("It is day 182 of 365")));
});

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

test("only curated exact dates are indexable", () => {
  const now = new Date("2026-07-13T12:00:00");

  assert.equal(isExactDateIndexable(new Date("2026-12-17T00:00:00"), now), true);
  assert.equal(isExactDateIndexable(new Date("2026-12-19T00:00:00"), now), false);
});

test("static exact-date params exclude arbitrary future dates", () => {
  const params = getExactDateStaticParams(new Date("2026-07-13T12:00:00"));
  const routeKeys = new Set(
    params.map(({ year, month, day }) => `${year}-${month}-${day}`),
  );

  assert.equal(routeKeys.has("2026-12-17"), true);
  assert.equal(routeKeys.has("2026-12-19"), false);
  const expectedKeys = indexableExactDateKeys.filter((key) => key >= "2026-07-13");
  assert.deepEqual([...routeKeys].sort(), [...expectedKeys].sort());
  assert.equal(params.length, routeKeys.size);
});

test("recovery preserves date expiry and the rollout ceiling", () => {
  const now = new Date("2026-09-30T12:00:00");
  assert.equal(isExactDateIndexable(new Date("2026-09-30T00:00:00"), now), true);
  assert.equal(isExactDateIndexable(new Date("2026-09-30T00:00:00"), new Date("2026-10-01T00:00:00")), false);
  assert.equal(isExactDateIndexable(new Date("2031-01-01T00:00:00"), now), false);
  const params = getExactDateStaticParams(new Date("2031-01-01T00:00:00"));
  assert.deepEqual(params, []);
});

test("curated date keys remain unique and valid", () => {
  assert.equal(new Set(indexableExactDateKeys).size, indexableExactDateKeys.length);
  for (const key of indexableExactDateKeys) {
    const date = new Date(`${key}T00:00:00Z`);
    assert.equal(date.toISOString().slice(0, 10), key);
  }
});
