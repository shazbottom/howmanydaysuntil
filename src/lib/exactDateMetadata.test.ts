import assert from "node:assert/strict";
import test from "node:test";
import { getCountdown } from "./countdown";
import { buildExactDateMetadata } from "./exactDateMetadata";
import { getExactDateStaticParams } from "./exactDatePages";

// Clicked future dates missing from the original 116-key list in the September 18 export.
const recoveredClickedDates = [
  "2026-09-30",
  "2026-10-21",
  "2026-12-15",
  "2027-01-21",
  "2027-03-03",
  "2027-03-08",
  "2027-05-01",
  "2027-05-30",
  "2027-06-15",
  "2027-07-27",
  "2027-07-29",
  "2027-08-19",
  "2027-09-01",
  "2027-09-02",
  "2027-09-07",
  "2027-09-08",
  "2027-09-15",
  "2027-09-17",
  "2027-09-26",
  "2027-10-18",
  "2027-12-04",
  "2027-12-31",
  "2028-01-10",
  "2028-01-31",
  "2028-02-05",
  "2028-02-10",
  "2028-03-01",
  "2028-03-15",
  "2028-04-04",
  "2028-04-06",
  "2028-04-15",
  "2028-05-31",
  "2028-06-09",
  "2028-07-05",
  "2028-08-01",
  "2028-08-03",
  "2028-08-08",
  "2028-08-20",
  "2028-08-24",
  "2028-09-14",
  "2028-09-25",
  "2028-10-21",
  "2028-11-20",
  "2029-01-01",
  "2029-01-16",
  "2029-02-21",
  "2029-03-28",
  "2029-04-30",
  "2029-05-05",
  "2029-05-23",
  "2029-05-30",
  "2029-06-05",
  "2029-06-09",
  "2029-06-21",
  "2029-08-09",
  "2029-08-21",
  "2029-09-23",
  "2029-09-25",
  "2029-10-08",
  "2029-10-16",
  "2029-12-05",
  "2030-02-04",
  "2030-03-09",
  "2030-03-31",
  "2030-11-29",
] as const;

test("exact-date metadata uses month-first wording and preserves indexability", () => {
  const now = new Date("2026-08-15T12:00:00");
  const targetDate = new Date("2027-10-08T00:00:00");
  const countdown = getCountdown(targetDate, now);
  const metadata = buildExactDateMetadata(targetDate, countdown, now);

  assert.equal(metadata.title, "How Many Days Until October 8, 2027? | Live Countdown");
  assert.equal(
    String(metadata.description).startsWith(
      `October 8, 2027 is in ${countdown.daysRemaining} days.`,
    ),
    true,
  );
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.deepEqual(metadata.alternates, {
    canonical: "/days-until/date/2027/10/08",
  });
});

test("all 65 recovered clicked dates are indexable and included in sitemap inputs", () => {
  const now = new Date("2026-09-18T12:00:00");
  const routes = new Set(getExactDateStaticParams(now).map(
    ({ year, month, day }) => `/days-until/date/${year}/${month}/${day}`,
  ));
  assert.equal(recoveredClickedDates.length, 65);
  for (const key of recoveredClickedDates) {
    const target = new Date(`${key}T00:00:00`);
    const metadata = buildExactDateMetadata(target, getCountdown(target, now), now);
    const canonical = `/days-until/date/${key.replaceAll("-", "/")}`;
    assert.deepEqual(metadata.robots, { index: true, follow: true }, key);
    assert.deepEqual(metadata.alternates, { canonical }, key);
    assert.equal(routes.has(canonical), true, key);
  }
});

test("unlisted exact dates remain noindex without suppressing link following", () => {
  const now = new Date("2026-09-18T12:00:00");
  const target = new Date("2026-12-19T00:00:00");
  const metadata = buildExactDateMetadata(target, getCountdown(target, now), now);
  assert.deepEqual(metadata.robots, { index: false, follow: true });
  assert.deepEqual(metadata.alternates, { canonical: "/days-until/date/2026/12/19" });
});
