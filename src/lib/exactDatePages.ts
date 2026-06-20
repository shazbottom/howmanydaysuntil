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

export interface ExactDateFactSection {
  title: string;
  lines: string[];
}

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

function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { month: "long" }).format(date);
}

function formatMonthShort(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date);
}

function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  return Math.floor((startOfLocalDay(date).getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function getDaysInYear(date: Date): number {
  return isLeapYear(date.getFullYear()) ? 366 : 365;
}

function getDaysUntilMonthEnd(date: Date): number {
  const nextMonthStart = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return Math.round(
    (startOfLocalDay(nextMonthStart).getTime() - startOfLocalDay(date).getTime()) /
      (1000 * 60 * 60 * 24),
  ) - 1;
}

function getWeekOfYear(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
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

function getNorthernSeasonName(date: Date): string {
  const month = date.getMonth() + 1;

  if (month >= 3 && month <= 5) {
    return "Spring";
  }

  if (month >= 6 && month <= 8) {
    return "Summer";
  }

  if (month >= 9 && month <= 11) {
    return "Autumn";
  }

  return "Winter";
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
  const northernSeason = getNorthernSeasonName(date);
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

  detailLines.push(
    `${australianSeason} in Australia, ${northernSeason} in the US and Europe.`,
  );

  return detailLines.slice(0, 4);
}

export function getExactDateFactSections(
  date: Date,
  countdown: CountdownResult,
): ExactDateFactSection[] {
  const weekday = formatWeekday(date);
  const month = formatMonth(date);
  const monthShort = formatMonthShort(date);
  const quarter = getQuarter(date);
  const dayOfYear = getDayOfYear(date);
  const daysInYear = getDaysInYear(date);
  const weekOfYear = getWeekOfYear(date);
  const daysUntilMonthEnd = getDaysUntilMonthEnd(date);
  const fallsOnWeekend = date.getDay() === 0 || date.getDay() === 6;
  const matchingEvents = findSeoHubEventsForDate(date).filter((event) => event.category === "holiday");
  const { weeks, days } = countdown.weeksRemaining;
  const matchingEventNames = matchingEvents.map((event) => event.name);

  const aboutDateLines = [
    `${weekday}, ${month} ${date.getDate()} ${date.getFullYear()} sits in quarter ${quarter} of ${date.getFullYear()}.`,
    `It is day ${dayOfYear} of ${daysInYear} in the year and falls in ISO week ${weekOfYear}.`,
    daysUntilMonthEnd === 0
      ? `${month} ${date.getDate()} is the final day of ${month}.`
      : `${daysUntilMonthEnd} ${daysUntilMonthEnd === 1 ? "day remains" : "days remain"} in ${monthShort} after this date.`,
  ];

  const planningLines = [
    days === 0
      ? `There are ${weeks} ${weeks === 1 ? "week" : "weeks"} remaining until this date.`
      : `There are ${weeks} ${weeks === 1 ? "week" : "weeks"} and ${days} ${days === 1 ? "day" : "days"} remaining until this date.`,
    fallsOnWeekend
      ? `This date falls on a weekend, which can matter for travel, event planning, and office deadlines.`
      : `This date falls on a weekday, which can matter if you are planning around work, school, or business deadlines.`,
    matchingEventNames.length > 0
      ? `This date lines up with ${matchingEventNames.join(", ")}.`
      : "This date does not match one of the site's major recurring holidays, so it works as a pure calendar planning page.",
  ];

  const contextLines = [
    `Nearby navigation is useful here because people often compare this date with the next day, next week, or the start of the following month.`,
    fallsOnWeekend
      ? "If you are using this page for a deadline, check whether your organisation shifts weekend deadlines to the next working day."
      : "If you are using this page for a deadline, remember that a calendar countdown and a business-day countdown can produce different answers.",
  ];

  return [
    { title: "About this date", lines: aboutDateLines },
    { title: "Planning around it", lines: planningLines },
    { title: "Useful context", lines: contextLines },
  ];
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
