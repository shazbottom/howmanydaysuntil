import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCountdownCalendarIcs,
  getCountdownCalendarData,
  getCountdownCalendarEvents,
} from "./countdownCalendar";

test("2026 calendar resolves movable and relative dates", () => {
  const events = getCountdownCalendarEvents(2026, new Date(2026, 7, 15));
  const bySlug = new Map(events.map((event) => [event.slug, event]));

  assert.equal(bySlug.get("easter")?.shortDateLabel, "Apr 5");
  assert.equal(bySlug.get("thanksgiving")?.shortDateLabel, "Nov 26");
  assert.equal(bySlug.get("black-friday")?.shortDateLabel, "Nov 27");
  assert.equal(bySlug.get("christmas")?.shortDateLabel, "Dec 25");
  assert.equal(events.length, 13);
});

test("calendar summary identifies the next listed event", () => {
  const calendar = getCountdownCalendarData(new Date(2026, 9, 1), 2026);

  assert.equal(calendar.nextEvent?.slug, "halloween");
  assert.ok(calendar.fridaysRemaining > 0);
  assert.ok(calendar.weekendsRemaining > 0);
});

test("calendar download produces valid all-day events", () => {
  const content = buildCountdownCalendarIcs(2026);

  assert.match(content, /BEGIN:VCALENDAR/);
  assert.match(content, /DTSTART;VALUE=DATE:20261126/);
  assert.match(content, /SUMMARY:US Thanksgiving/);
  assert.match(content, /URL:https:\/\/daysuntil\.is\/days-until-christmas/);
  assert.match(content, /END:VCALENDAR/);
});
