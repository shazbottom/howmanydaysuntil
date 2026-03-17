import type { CountdownLinkItem } from "../components/CountdownLinkList";
import { formatLongDate } from "./dateFormat";
import { startOfLocalDay } from "./countdown";
import {
  findSeoHubEventBySlug,
  type SeoHubEventDefinition,
} from "../data/seoHubEvents";
import { findSeoHubEventsForDate } from "./seoHubEventResolver";

export const EXACT_DATE_ROLLOUT_DAYS = 500;

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function formatWeekday(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date);
}

function getYearSlug(date: Date): string | null {
  const yearSlug = String(date.getFullYear());
  return findSeoHubEventBySlug(yearSlug) ? yearSlug : null;
}

function getPrimarySeasonSlug(date: Date): string | null {
  const season = findSeoHubEventsForDate(date).find((event) => event.category === "season");
  return season?.slug ?? null;
}

function getMatchedHolidaySlugs(date: Date): string[] {
  return findSeoHubEventsForDate(date)
    .filter((event) => event.category === "holiday")
    .map((event) => event.slug);
}

function buildRelatedLink(label: string, slug: string): CountdownLinkItem {
  const event = findSeoHubEventBySlug(slug);

  return {
    href: `/days-until/${slug}`,
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

  return Array.from({ length: EXACT_DATE_ROLLOUT_DAYS + 1 }, (_, offset) => {
    const date = addDays(today, offset);

    return {
      year: String(date.getFullYear()),
      month: padDatePart(date.getMonth() + 1),
      day: padDatePart(date.getDate()),
    };
  });
}

export function isExactDateInRolloutRange(date: Date, now: Date = new Date()): boolean {
  const today = startOfLocalDay(now);
  const lastDate = addDays(today, EXACT_DATE_ROLLOUT_DAYS);
  const targetDate = startOfLocalDay(date);

  return targetDate >= today && targetDate <= lastDate;
}

export function getExactDateSupportingCopy(date: Date): string[] {
  const longDate = formatLongDate(date, "en-GB");
  const weekday = formatWeekday(date);
  const matchingEvents = findSeoHubEventsForDate(date);
  const matchingHoliday = matchingEvents.find((event) => event.category === "holiday");
  const matchingSeason = matchingEvents.find((event) => event.category === "season");

  const paragraphs = [`${longDate} falls on a ${weekday}.`];

  if (matchingHoliday) {
    paragraphs.push(`This date is ${matchingHoliday.name}.`);
  }

  if (matchingSeason) {
    paragraphs.push(`This date falls in ${matchingSeason.name} in the Northern Hemisphere.`);
  }

  if (paragraphs.length === 1) {
    paragraphs.push("This exact-date countdown gives a live answer for a specific calendar day.");
  }

  return paragraphs.slice(0, 3);
}

export function getExactDateRelatedLinks(date: Date): CountdownLinkItem[] {
  const relatedSlugs: string[] = [];

  for (const slug of getMatchedHolidaySlugs(date)) {
    relatedSlugs.push(slug);
  }

  const seasonSlug = getPrimarySeasonSlug(date);

  if (seasonSlug) {
    relatedSlugs.push(seasonSlug);
  }

  const yearSlug = getYearSlug(date);

  if (yearSlug) {
    relatedSlugs.push(yearSlug);
  }

  if (date.getMonth() <= 5) {
    relatedSlugs.push("new-year", "easter", "summer", "christmas");
  } else if (date.getMonth() <= 8) {
    relatedSlugs.push("summer", "halloween", "christmas", "new-year");
  } else {
    relatedSlugs.push("halloween", "thanksgiving", "christmas", "new-year");
  }

  const uniqueSlugs = Array.from(new Set(relatedSlugs))
    .filter((slug) => Boolean(findSeoHubEventBySlug(slug)))
    .slice(0, 6);

  return uniqueSlugs.map((slug) => {
    const event = findSeoHubEventBySlug(slug) as SeoHubEventDefinition;
    return buildRelatedLink(`Days until ${event.name}`, slug);
  });
}
