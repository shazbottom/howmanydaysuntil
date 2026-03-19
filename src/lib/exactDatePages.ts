import type { CountdownLinkItem } from "../components/CountdownLinkList";
import type { CountdownResult } from "./countdown";
import { formatLongDate } from "./dateFormat";
import { startOfLocalDay } from "./countdown";
import {
  findSeoHubEventBySlug,
  type SeoHubEventDefinition,
} from "../data/seoHubEvents";
import {
  findSeoHubEventsForDate,
  resolveSeoHubEventDate,
} from "./seoHubEventResolver";
import { getSeoLandingPath } from "./seoLandingPages";

export const EXACT_DATE_ROLLOUT_END = {
  year: 2030,
  month: 12,
  day: 31,
} as const;

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function getExactDateRolloutEndDate(): Date {
  return new Date(
    EXACT_DATE_ROLLOUT_END.year,
    EXACT_DATE_ROLLOUT_END.month - 1,
    EXACT_DATE_ROLLOUT_END.day,
  );
}

function formatWeekday(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date);
}

function getAustralianSeasonName(date: Date): string {
  const monthDay = (date.getMonth() + 1) * 100 + date.getDate();

  if (monthDay >= 301 && monthDay <= 531) {
    return "Autumn";
  }

  if (monthDay >= 601 && monthDay <= 831) {
    return "Winter";
  }

  if (monthDay >= 901 && monthDay <= 1130) {
    return "Spring";
  }

  return "Summer";
}

function getYearSlug(date: Date): string | null {
  const yearSlug = String(date.getFullYear());
  return findSeoHubEventBySlug(yearSlug) ? yearSlug : null;
}

function getPrimarySeasonSlug(date: Date): string {
  const monthDay = (date.getMonth() + 1) * 100 + date.getDate();

  if (monthDay >= 320 && monthDay <= 620) {
    return "spring";
  }

  if (monthDay >= 621 && monthDay <= 921) {
    return "summer";
  }

  if (monthDay >= 922 && monthDay <= 1220) {
    return "autumn";
  }

  return "winter";
}

function getMatchedHolidaySlugs(date: Date): string[] {
  return findSeoHubEventsForDate(date)
    .filter((event) => event.category === "holiday")
    .map((event) => event.slug);
}

function buildRelatedLink(label: string, slug: string): CountdownLinkItem {
  const event = findSeoHubEventBySlug(slug);

  return {
    href: getSeoLandingPath(slug),
    label: label || `Days until ${event?.name ?? slug}`,
  };
}

export function getExactDateRoutePath(date: Date): string {
  return `/days-until/date/${date.getFullYear()}/${padDatePart(date.getMonth() + 1)}/${padDatePart(
    date.getDate(),
  )}`;
}

export function getExactDateStaticParams(now: Date = new Date()): Array<{
  year: string;
  month: string;
  day: string;
}> {
  const today = startOfLocalDay(now);
  const lastDate = getExactDateRolloutEndDate();
  const params: Array<{
    year: string;
    month: string;
    day: string;
  }> = [];

  for (
    let date = new Date(today);
    date <= lastDate;
    date = addDays(date, 1)
  ) {
    params.push({
      year: String(date.getFullYear()),
      month: padDatePart(date.getMonth() + 1),
      day: padDatePart(date.getDate()),
    });
  }

  return params;
}

export function isExactDateInRolloutRange(date: Date, now: Date = new Date()): boolean {
  const today = startOfLocalDay(now);
  const lastDate = getExactDateRolloutEndDate();
  const targetDate = startOfLocalDay(date);

  return targetDate >= today && targetDate <= lastDate;
}

export function getExactDateDetails(date: Date, countdown: CountdownResult): string[] {
  const longDate = formatLongDate(date, "en-GB");
  const weekday = formatWeekday(date);
  const australianSeason = getAustralianSeasonName(date);
  const matchingEvents = findSeoHubEventsForDate(date);
  const matchingHoliday = matchingEvents.find((event) => event.category === "holiday");
  const detailLines: string[] = [`${longDate} falls on a ${weekday}.`];

  const { weeks, days } = countdown.weeksRemaining;

  if (days === 0) {
    detailLines.push(
      weeks === 1
        ? "There is 1 week remaining until this date."
        : `There are ${weeks} weeks remaining until this date.`,
    );
  } else {
    const weekLabel = weeks === 1 ? "week" : "weeks";
    const dayLabel = days === 1 ? "day" : "days";
    detailLines.push(`There are ${weeks} ${weekLabel} and ${days} ${dayLabel} remaining until this date.`);
  }

  if (matchingHoliday) {
    detailLines.push(`This date is ${matchingHoliday.name}.`);
  } else {
    detailLines.push("This is a standard calendar date.");
  }

  detailLines.push(`This date is in the ${australianSeason} season in Australia.`);

  return detailLines.slice(0, 4);
}

export function getExactDateRelatedLinks(date: Date): CountdownLinkItem[] {
  const dateStart = startOfLocalDay(date);
  const relatedSlugs: string[] = [];

  const yearSlug = getYearSlug(date);
  if (yearSlug) {
    relatedSlugs.push(yearSlug);
  }

  const seasonSlug = getPrimarySeasonSlug(date);
  const seasonEvent = findSeoHubEventBySlug(seasonSlug);
  if (seasonEvent?.indexable) {
    relatedSlugs.push(seasonSlug);
  }

  for (const slug of getMatchedHolidaySlugs(date)) {
    relatedSlugs.push(slug);
  }

  const majorEventSlugs = [
    "christmas",
    "christmas-eve",
    "new-year",
    "halloween",
    "valentines-day",
    "easter",
    "thanksgiving",
    "black-friday",
  ];

  const proximitySortedSlugs = majorEventSlugs
    .map((slug) => {
      const event = findSeoHubEventBySlug(slug);
      const eventDate = event ? resolveSeoHubEventDate(event, dateStart) : null;

      if (!event || !eventDate) {
        return null;
      }

      const daysAway = Math.round(
        (startOfLocalDay(eventDate).getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        slug,
        daysAway,
      };
    })
    .filter((entry): entry is { slug: string; daysAway: number } => entry !== null)
    .sort((left, right) => left.daysAway - right.daysAway)
    .map((entry) => entry.slug);

  for (const slug of proximitySortedSlugs.slice(0, 2)) {
    relatedSlugs.push(slug);
  }

  const uniqueSlugs = Array.from(new Set(relatedSlugs))
    .filter((slug) => Boolean(findSeoHubEventBySlug(slug)))
    .slice(0, 6);

  return uniqueSlugs.map((slug) => {
    const event = findSeoHubEventBySlug(slug) as SeoHubEventDefinition;
    return buildRelatedLink(`Days until ${event.name}`, slug);
  });
}

export function getExactDateNearbyLinks(date: Date): CountdownLinkItem[] {
  const nearbyDates = [
    { offset: -1, prefix: "" },
    { offset: 1, prefix: "" },
    { offset: 7, prefix: "" },
    { offset: 30, prefix: "" },
  ]
    .map(({ offset, prefix }) => {
      const targetDate = addDays(date, offset);

      if (!isExactDateInRolloutRange(targetDate)) {
        return null;
      }

      return {
        href: getExactDateRoutePath(targetDate),
        label: `${prefix}${formatLongDate(targetDate, "en-GB")}`,
      };
    })
    .filter((item): item is CountdownLinkItem => item !== null);

  return nearbyDates;
}
