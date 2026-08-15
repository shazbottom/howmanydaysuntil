import { findSeoHubEventBySlug } from "../data/seoHubEvents";
import { getSeoLandingPath } from "./seoLandingPages";
import { getSeoHubOccurrenceTargets } from "./seoHubPageContent";
import { getYearPlanningData } from "./yearPlanning";

export const COUNTDOWN_CALENDAR_YEAR = 2026;

export type CountdownCalendarCategory = "Celebration" | "Season" | "Planning";

interface CountdownCalendarEventSource {
  slug: string;
  eventSlug?: string;
  name: string;
  category: CountdownCalendarCategory;
  note: string;
  month?: number;
  day?: number;
}

export interface CountdownCalendarEvent {
  slug: string;
  name: string;
  category: CountdownCalendarCategory;
  note: string;
  date: Date;
  dateLabel: string;
  shortDateLabel: string;
  daysAway: number;
  statusLabel: string;
  href: string | null;
}

export interface CountdownCalendarData {
  year: number;
  daysRemaining: number;
  fridaysRemaining: number;
  weekendsRemaining: number;
  nextEvent: CountdownCalendarEvent | null;
  events: CountdownCalendarEvent[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

const eventSources: CountdownCalendarEventSource[] = [
  {
    slug: "new-year",
    eventSlug: "new-year",
    name: "New Year's Day",
    category: "Celebration",
    note: "The first day of the 2026 calendar year.",
  },
  {
    slug: "valentines-day",
    eventSlug: "valentines-day",
    name: "Valentine's Day",
    category: "Celebration",
    note: "A fixed annual date observed on February 14.",
  },
  {
    slug: "march-equinox",
    eventSlug: "spring",
    name: "March equinox",
    category: "Season",
    note: "Approximate start of astronomical spring in the Northern Hemisphere and autumn in the Southern Hemisphere.",
  },
  {
    slug: "easter",
    eventSlug: "easter",
    name: "Easter Sunday",
    category: "Celebration",
    note: "A movable date calculated for the 2026 calendar year.",
  },
  {
    slug: "june-solstice",
    eventSlug: "summer",
    name: "June solstice",
    category: "Season",
    note: "Approximate start of astronomical summer in the Northern Hemisphere and winter in the Southern Hemisphere.",
  },
  {
    slug: "september-equinox",
    eventSlug: "autumn",
    name: "September equinox",
    category: "Season",
    note: "Approximate start of astronomical autumn in the Northern Hemisphere and spring in the Southern Hemisphere.",
  },
  {
    slug: "halloween",
    eventSlug: "halloween",
    name: "Halloween",
    category: "Celebration",
    note: "The annual date for Halloween celebrations and events.",
  },
  {
    slug: "thanksgiving",
    eventSlug: "thanksgiving",
    name: "US Thanksgiving",
    category: "Planning",
    note: "Observed on the fourth Thursday of November in the United States.",
  },
  {
    slug: "black-friday",
    eventSlug: "black-friday",
    name: "Black Friday",
    category: "Planning",
    note: "The Friday immediately after US Thanksgiving.",
  },
  {
    slug: "december-solstice",
    eventSlug: "winter",
    name: "December solstice",
    category: "Season",
    note: "Approximate start of astronomical winter in the Northern Hemisphere and summer in the Southern Hemisphere.",
  },
  {
    slug: "christmas-eve",
    eventSlug: "christmas-eve",
    name: "Christmas Eve",
    category: "Celebration",
    note: "The day before Christmas Day.",
  },
  {
    slug: "christmas",
    eventSlug: "christmas",
    name: "Christmas Day",
    category: "Celebration",
    note: "A fixed annual date observed on December 25.",
  },
  {
    slug: "new-years-eve",
    name: "New Year's Eve",
    category: "Celebration",
    note: "The final day of the 2026 calendar year.",
    month: 12,
    day: 31,
  },
];

function toUtcDateOnly(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function differenceInCalendarDays(date: Date, now: Date) {
  return Math.round((toUtcDateOnly(date) - toUtcDateOnly(now)) / DAY_MS);
}

function getEventDate(source: CountdownCalendarEventSource, year: number) {
  if (source.month && source.day) {
    return new Date(year, source.month - 1, source.day);
  }

  if (!source.eventSlug) {
    return null;
  }

  const event = findSeoHubEventBySlug(source.eventSlug);

  if (!event) {
    return null;
  }

  const occurrence = getSeoHubOccurrenceTargets(event, new Date(year, 0, 1, 12), 1)[0];
  return occurrence?.year === year ? occurrence.date : null;
}

function getStatusLabel(daysAway: number) {
  if (daysAway < 0) {
    return "Passed";
  }

  if (daysAway === 0) {
    return "Today";
  }

  return daysAway === 1 ? "1 day away" : `${daysAway} days away`;
}

function getEventHref(source: CountdownCalendarEventSource) {
  if (!source.eventSlug) {
    return null;
  }

  const event = findSeoHubEventBySlug(source.eventSlug);
  return event?.indexable ? getSeoLandingPath(event.slug) : null;
}

export function getCountdownCalendarEvents(
  year = COUNTDOWN_CALENDAR_YEAR,
  now: Date = new Date(),
): CountdownCalendarEvent[] {
  return eventSources
    .flatMap((source) => {
      const date = getEventDate(source, year);

      if (!date) {
        return [];
      }

      const daysAway = differenceInCalendarDays(date, now);

      return [{
        slug: source.slug,
        name: source.name,
        category: source.category,
        note: source.note,
        date,
        dateLabel: new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(date),
        shortDateLabel: new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(date),
        daysAway,
        statusLabel: getStatusLabel(daysAway),
        href: getEventHref(source),
      }];
    })
    .sort((left, right) => left.date.getTime() - right.date.getTime());
}

export function getCountdownCalendarData(
  now: Date = new Date(),
  year = COUNTDOWN_CALENDAR_YEAR,
): CountdownCalendarData {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const effectiveDate = now < start ? start : now;
  const isAfterCalendar = now > new Date(year, 11, 31, 23, 59, 59, 999);
  const events = getCountdownCalendarEvents(year, now);
  const fridaysRemaining = isAfterCalendar
    ? 0
    : getYearPlanningData("fridays", effectiveDate).count;
  const weekendsRemaining = isAfterCalendar
    ? 0
    : getYearPlanningData("weekends", effectiveDate).count;

  return {
    year,
    daysRemaining: isAfterCalendar ? 0 : Math.max(0, differenceInCalendarDays(end, effectiveDate)),
    fridaysRemaining,
    weekendsRemaining,
    nextEvent: events.find((event) => event.daysAway >= 0) ?? null,
    events,
  };
}

function toIcsDate(date: Date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function escapeIcsText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

export function buildCountdownCalendarIcs(year = COUNTDOWN_CALENDAR_YEAR) {
  const events = getCountdownCalendarEvents(year, new Date(year, 0, 1));
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DaysUntil//Countdown Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:DaysUntil ${year} Countdown Calendar`,
  ];

  for (const event of events) {
    const dayAfter = new Date(event.date);
    dayAfter.setDate(event.date.getDate() + 1);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.slug}-${year}@daysuntil.is`,
      `DTSTAMP:${year}0101T000000Z`,
      `DTSTART;VALUE=DATE:${toIcsDate(event.date)}`,
      `DTEND;VALUE=DATE:${toIcsDate(dayAfter)}`,
      `SUMMARY:${escapeIcsText(event.name)}`,
      `DESCRIPTION:${escapeIcsText(event.note)}`,
      ...(event.href ? [`URL:https://daysuntil.is${event.href}`] : []),
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
