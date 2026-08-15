import assert from "node:assert/strict";
import test from "node:test";
import { findSeoHubEventBySlug } from "../data/seoHubEvents";
import { getCountdown } from "./countdown";
import { getSeoHubRecurringDateRows } from "./seoHubPageContent";
import { buildSeoHubLandingMetadata, getSeoHubLandingLead } from "./seoHubMetadata";

test("recurring weekday metadata omits the year and answers the query directly", () => {
  const event = findSeoHubEventBySlug("friday");
  const now = new Date("2026-08-15T12:00:00");
  const targetDate = new Date("2026-08-21T00:00:00");

  assert.ok(event);
  const countdown = getCountdown(targetDate, now);
  const metadata = buildSeoHubLandingMetadata(event, targetDate, countdown);
  const lead = getSeoHubLandingLead(event, targetDate, countdown);

  assert.equal(metadata.title, "How Many Days Until Friday? | Live Countdown");
  assert.equal(String(metadata.description).startsWith("Friday is in 6 days."), true);
  assert.equal(lead.includes("Friday, August 21, 2026"), true);
});

test("annual event metadata retains the target year", () => {
  const event = findSeoHubEventBySlug("christmas");
  const now = new Date("2026-08-15T12:00:00");
  const targetDate = new Date("2026-12-25T00:00:00");

  assert.ok(event);
  const metadata = buildSeoHubLandingMetadata(event, targetDate, getCountdown(targetDate, now));

  assert.equal(metadata.title, "How Many Days Until Christmas 2026? | Live Countdown");
});

test("recurring date rows return the next six Fridays", () => {
  const event = findSeoHubEventBySlug("friday");

  assert.ok(event);
  const rows = getSeoHubRecurringDateRows(event, new Date("2026-08-15T12:00:00"));

  assert.equal(rows.length, 6);
  assert.deepEqual(rows[0], {
    dateLabel: "Friday, August 21, 2026",
    daysAway: 6,
  });
  assert.deepEqual(rows[1], {
    dateLabel: "Friday, August 28, 2026",
    daysAway: 13,
  });
});
