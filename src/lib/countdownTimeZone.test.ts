import assert from "node:assert/strict";
import test from "node:test";
import { getCountdown } from "./countdown";
import { alignCountdownTimeZone, getCountdownInTimeZone } from "./countdownTimeZone";

test("UTC count stays on UTC date labels across first tick and UTC midnight", () => {
  const target = new Date("2028-01-08T00:30:00Z");
  const before = new Date("2027-12-31T23:59:58Z");
  const snapshot = alignCountdownTimeZone(getCountdown(target, before), "UTC")!;
  const firstTick = getCountdownInTimeZone(target, new Date("2027-12-31T23:59:59Z"), "UTC");
  const midnightTick = getCountdownInTimeZone(target, new Date("2028-01-01T00:00:00Z"), "UTC");
  assert.equal(snapshot.daysRemaining, 8);
  assert.equal(firstTick.daysRemaining, 8);
  assert.equal(midnightTick.daysRemaining, 7);
  assert.deepEqual(midnightTick.weeksRemaining, { weeks: 1, days: 0 });
  assert.equal(firstTick.secondsRemaining, snapshot.secondsRemaining - 1);
  assert.equal(midnightTick.secondsRemaining, firstTick.secondsRemaining - 1);
});

test("UTC and Pacific date-day counts differ without changing elapsed totals", () => {
  const target = new Date("2028-01-01T00:30:00Z");
  const now = new Date("2027-12-31T12:00:00Z");
  const utc = getCountdownInTimeZone(target, now, "UTC");
  const pacific = getCountdownInTimeZone(target, now, "America/Los_Angeles");
  assert.equal(utc.daysRemaining, 1);
  assert.equal(pacific.daysRemaining, 0);
  assert.equal(utc.hoursRemaining, pacific.hoursRemaining);
  assert.equal(utc.secondsRemaining, pacific.secondsRemaining);
  assert.equal(utc.targetDate, target);
});

test("timezone date-day counts are DST-safe for 23-hour and 25-hour days", () => {
  const spring = getCountdownInTimeZone(new Date("2027-03-15T07:00:00Z"), new Date("2027-03-14T08:00:00Z"), "America/Los_Angeles");
  const fall = getCountdownInTimeZone(new Date("2027-11-08T08:00:00Z"), new Date("2027-11-07T07:00:00Z"), "America/Los_Angeles");
  assert.equal(spring.daysRemaining, 1);
  assert.equal(spring.hoursRemaining, 23);
  assert.equal(fall.daysRemaining, 1);
  assert.equal(fall.hoursRemaining, 25);
});

test("omitted timezone preserves core local behavior and empty snapshots", () => {
  const target = new Date(2027, 11, 25);
  const now = new Date(2027, 11, 1);
  const snapshot = getCountdown(target, now);
  assert.deepEqual(getCountdownInTimeZone(target, now), snapshot);
  assert.equal(alignCountdownTimeZone(snapshot), snapshot);
  assert.equal(alignCountdownTimeZone(null, "UTC"), null);
});

test("zero-at-target fallback respects the selected timezone", () => {
  const target = new Date("2028-01-01T00:30:00Z");
  const zero = getCountdownInTimeZone(target, target, "UTC");
  assert.equal(zero.daysRemaining, 0);
  assert.equal(zero.secondsRemaining, 0);
});
