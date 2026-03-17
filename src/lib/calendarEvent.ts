import type { CustomCountdown } from "./customCountdowns";
import { createLocalDateFromIso } from "./customCountdowns";

function padCalendarPart(value: number): string {
  return value.toString().padStart(2, "0");
}

function formatCalendarDate(date: Date): string {
  return `${date.getFullYear()}${padCalendarPart(date.getMonth() + 1)}${padCalendarPart(date.getDate())}`;
}

function formatCalendarDateTime(date: Date): string {
  return `${formatCalendarDate(date)}T${padCalendarPart(date.getHours())}${padCalendarPart(date.getMinutes())}00`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function hasTimedCustomCountdown(record: CustomCountdown): boolean {
  return record.targetDate.includes("T");
}

export function getCustomCountdownCalendarDates(record: CustomCountdown): {
  startDate: Date;
  endDate: Date;
  allDay: boolean;
} | null {
  const startDate = createLocalDateFromIso(record.targetDate);

  if (!startDate) {
    return null;
  }

  const allDay = !hasTimedCustomCountdown(record);

  return {
    startDate,
    endDate: allDay ? addDays(startDate, 1) : addHours(startDate, 1),
    allDay,
  };
}

export function buildCalendarDescription(record: CustomCountdown, countdownUrl: string): string {
  const lines = [record.note, countdownUrl].filter(Boolean);
  return lines.join("\n\n");
}

export function buildGoogleCalendarUrl(
  record: CustomCountdown,
  countdownUrl: string,
): string | null {
  const calendarDates = getCustomCountdownCalendarDates(record);

  if (!calendarDates) {
    return null;
  }

  const { startDate, endDate, allDay } = calendarDates;
  const url = new URL("https://calendar.google.com/calendar/render");

  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", record.title);
  url.searchParams.set("details", buildCalendarDescription(record, countdownUrl));

  if (allDay) {
    url.searchParams.set(
      "dates",
      `${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}`,
    );
  } else {
    url.searchParams.set(
      "dates",
      `${formatCalendarDateTime(startDate)}/${formatCalendarDateTime(endDate)}`,
    );

    if (record.timezone) {
      url.searchParams.set("ctz", record.timezone);
    }
  }

  return url.toString();
}

export function buildIcsContent(record: CustomCountdown, countdownUrl: string): string | null {
  const calendarDates = getCustomCountdownCalendarDates(record);

  if (!calendarDates) {
    return null;
  }

  const { startDate, endDate, allDay } = calendarDates;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DaysUntil//Custom Countdown//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${record.slug}@daysuntil.is`,
    `DTSTAMP:${formatCalendarDateTime(new Date())}Z`,
    `SUMMARY:${escapeIcsText(record.title)}`,
    `DESCRIPTION:${escapeIcsText(buildCalendarDescription(record, countdownUrl))}`,
  ];

  if (allDay) {
    lines.push(`DTSTART;VALUE=DATE:${formatCalendarDate(startDate)}`);
    lines.push(`DTEND;VALUE=DATE:${formatCalendarDate(endDate)}`);
  } else if (record.timezone) {
    lines.push(`DTSTART;TZID=${record.timezone}:${formatCalendarDateTime(startDate)}`);
    lines.push(`DTEND;TZID=${record.timezone}:${formatCalendarDateTime(endDate)}`);
  } else {
    lines.push(`DTSTART:${formatCalendarDateTime(startDate)}`);
    lines.push(`DTEND:${formatCalendarDateTime(endDate)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return `${lines.join("\r\n")}\r\n`;
}

export function downloadIcsFile(record: CustomCountdown, countdownUrl: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const icsContent = buildIcsContent(record, countdownUrl);

  if (!icsContent) {
    return false;
  }

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = `${record.slug}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(objectUrl);

  return true;
}
