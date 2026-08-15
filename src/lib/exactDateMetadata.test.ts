import assert from "node:assert/strict";
import test from "node:test";
import { getCountdown } from "./countdown";
import { buildExactDateMetadata } from "./exactDateMetadata";

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
