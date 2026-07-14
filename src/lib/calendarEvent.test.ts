import assert from "node:assert/strict";
import test from "node:test";
import { buildAllDayGoogleCalendarUrl, buildAllDayIcsContent } from "./calendarEvent";

const event = {
  title: "Christmas 2026",
  date: "2026-12-25",
  description: "Live Christmas countdown",
  url: "https://daysuntil.is/days-until-christmas",
  fileName: "christmas-2026",
};

test("all-day Google Calendar links use an exclusive end date", () => {
  const url = buildAllDayGoogleCalendarUrl(event);

  assert.ok(url);
  const parsedUrl = new URL(url);
  assert.equal(parsedUrl.searchParams.get("dates"), "20261225/20261226");
  assert.equal(parsedUrl.searchParams.get("text"), "Christmas 2026");
});

test("all-day ICS exports contain the event and following-day boundary", () => {
  const content = buildAllDayIcsContent(event);

  assert.ok(content);
  assert.match(content, /DTSTART;VALUE=DATE:20261225/);
  assert.match(content, /DTEND;VALUE=DATE:20261226/);
  assert.match(content, /SUMMARY:Christmas 2026/);
  assert.match(content, /https:\/\/daysuntil\.is\/days-until-christmas/);
});

test("invalid all-day dates do not generate calendar output", () => {
  const invalidEvent = { ...event, date: "2026-02-30" };

  assert.equal(buildAllDayGoogleCalendarUrl(invalidEvent), null);
  assert.equal(buildAllDayIcsContent(invalidEvent), null);
});
