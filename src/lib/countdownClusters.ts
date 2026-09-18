import type { Metadata } from "next";
import { findSeoHubEventBySlug, type SeoHubEventDefinition } from "../data/seoHubEvents";
import { startOfLocalDay } from "./countdown";
import { formatFullDate } from "./dateFormat";
import { getSeoHubOccurrenceTargets } from "./seoHubPageContent";
import { resolveSeoHubEventCountdown } from "./seoHubEventResolver";
import { formatActionDate } from "./countdownActions";
import { isExactDateInRolloutRange } from "./exactDatePages";
import { LEGACY_SUMMER, formatSummerUtcDate, getSelectedSummerTargets, getSummerCountdown, parseSummerSelection, selectedSummerNote, summerSelectionLabel, summerSelectionQuery, utcCivilDate, type SummerSearchParams, type SummerSelection } from "./summerSelection";

const DAYS_PER_WEEK = 7;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const FRIDAY_WEEKDAY = 5;
const SATURDAY_WEEKDAY = 6;

export type CountdownClusterKind = "fridays" | "weekends";

export interface CountdownClusterDefinition {
  slug: string;
  eventSlug: string;
  kind: CountdownClusterKind;
}

export interface CountdownClusterYearRow {
  year: number;
  dateLabel: string;
  count: number;
}

export interface CountdownClusterLink {
  href: string;
  label: string;
}

function getBaseEventButtonLabel(eventName: string): string {
  return `Days to ${eventName}`;
}

function getClusterButtonLabel(definition: CountdownClusterDefinition, eventName: string): string {
  return `${getClusterDisplayLabel(definition.kind)} to ${eventName}`;
}

const clusterDefinitions: CountdownClusterDefinition[] = [
  { slug: "fridays-until-christmas", eventSlug: "christmas", kind: "fridays" },
  { slug: "weekends-until-christmas", eventSlug: "christmas", kind: "weekends" },
  { slug: "fridays-until-easter", eventSlug: "easter", kind: "fridays" },
  { slug: "weekends-until-easter", eventSlug: "easter", kind: "weekends" },
  { slug: "fridays-until-valentines-day", eventSlug: "valentines-day", kind: "fridays" },
  { slug: "weekends-until-valentines-day", eventSlug: "valentines-day", kind: "weekends" },
  { slug: "fridays-until-new-year", eventSlug: "new-year", kind: "fridays" },
  { slug: "weekends-until-new-year", eventSlug: "new-year", kind: "weekends" },
  { slug: "fridays-until-halloween", eventSlug: "halloween", kind: "fridays" },
  { slug: "weekends-until-halloween", eventSlug: "halloween", kind: "weekends" },
  { slug: "fridays-until-black-friday", eventSlug: "black-friday", kind: "fridays" },
  { slug: "weekends-until-black-friday", eventSlug: "black-friday", kind: "weekends" },
  { slug: "fridays-until-summer", eventSlug: "summer", kind: "fridays" },
  { slug: "weekends-until-summer", eventSlug: "summer", kind: "weekends" },
  { slug: "fridays-until-thanksgiving", eventSlug: "thanksgiving", kind: "fridays" },
  { slug: "weekends-until-thanksgiving", eventSlug: "thanksgiving", kind: "weekends" },
];

const clusterDefinitionsBySlug = new Map(
  clusterDefinitions.map((definition) => [definition.slug, definition]),
);

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function countWeekdayOccurrencesUntil(targetDate: Date, now: Date, weekday: number): number {
  const startDate = startOfLocalDay(now);
  const endDate = startOfLocalDay(targetDate);

  if (endDate < startDate) {
    return 0;
  }

  const offset = (weekday - startDate.getDay() + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  const firstOccurrence = addDays(startDate, offset);

  if (firstOccurrence > endDate) {
    return 0;
  }

  const daysBetween = Math.round(
    (endDate.getTime() - firstOccurrence.getTime()) / MILLISECONDS_PER_DAY,
  );

  return Math.floor(daysBetween / DAYS_PER_WEEK) + 1;
}

function countWeekendsUntil(targetDate: Date, now: Date): number {
  const startDate = startOfLocalDay(now);
  const endDate = startOfLocalDay(targetDate);

  if (endDate < startDate) {
    return 0;
  }

  const todayWeekday = startDate.getDay();
  let currentWeekendCount = 0;
  let firstSaturday = startDate;

  if (todayWeekday === SATURDAY_WEEKDAY) {
    currentWeekendCount = 1;
    firstSaturday = addDays(startDate, DAYS_PER_WEEK);
  } else if (todayWeekday === 0) {
    currentWeekendCount = 1;
    firstSaturday = addDays(startDate, SATURDAY_WEEKDAY);
  } else {
    const offset = (SATURDAY_WEEKDAY - todayWeekday + DAYS_PER_WEEK) % DAYS_PER_WEEK;
    firstSaturday = addDays(startDate, offset);
  }

  if (firstSaturday > endDate) {
    return currentWeekendCount;
  }

  const daysBetween = Math.round(
    (endDate.getTime() - firstSaturday.getTime()) / MILLISECONDS_PER_DAY,
  );

  return currentWeekendCount + Math.floor(daysBetween / DAYS_PER_WEEK) + 1;
}

function countClusterOccurrences(kind: CountdownClusterKind, targetDate: Date, now: Date): number {
  return kind === "fridays"
    ? countWeekdayOccurrencesUntil(targetDate, now, FRIDAY_WEEKDAY)
    : countWeekendsUntil(targetDate, now);
}

function getClusterCountNoun(kind: CountdownClusterKind, count: number): string {
  if (kind === "fridays") {
    return count === 1 ? "Friday" : "Fridays";
  }

  return count === 1 ? "Weekend" : "Weekends";
}

function getClusterDisplayLabel(kind: CountdownClusterKind): string {
  return kind === "fridays" ? "Fridays" : "Weekends";
}

function getEventRootPath(eventSlug: string): string | null {
  if (eventSlug === "summer") {
    return null;
  }

  return `/days-until-${eventSlug}`;
}

function getSiblingClusterLinks(definition: CountdownClusterDefinition): CountdownClusterLink[] {
  return clusterDefinitions
    .filter(
      (candidate) =>
        candidate.eventSlug === definition.eventSlug && candidate.slug !== definition.slug,
    )
    .map((candidate) => ({
      href: `/${candidate.slug}`,
      label: `How many ${getClusterDisplayLabel(candidate.kind).toLowerCase()} until ${getClusterEventName(candidate.slug)}?`,
    }));
}

function getSiblingClusterButtons(definition: CountdownClusterDefinition): CountdownClusterLink[] {
  const event = findSeoHubEventBySlug(definition.eventSlug);

  if (!event) {
    return [];
  }

  return clusterDefinitions
    .filter(
      (candidate) =>
        candidate.eventSlug === definition.eventSlug && candidate.slug !== definition.slug,
    )
    .map((candidate) => ({
      href: `/${candidate.slug}`,
      label: getClusterButtonLabel(candidate, event.name),
    }));
}

function getClusterEventName(slug: string): string {
  const definition = findCountdownClusterBySlug(slug);
  const event = definition ? findSeoHubEventBySlug(definition.eventSlug) : null;
  return event?.name ?? "this date";
}

function buildClusterTitle(definition: CountdownClusterDefinition, event: SeoHubEventDefinition): string {
  return `How many ${getClusterDisplayLabel(definition.kind).toLowerCase()} until ${event.name}?`;
}

export function getCountdownClusterLinksForEvent(eventSlug: string): CountdownClusterLink[] {
  const event = findSeoHubEventBySlug(eventSlug);

  if (!event) {
    return [];
  }

  return clusterDefinitions
    .filter((definition) => definition.eventSlug === eventSlug)
    .map((definition) => ({
      href: `/${definition.slug}`,
      label: buildClusterTitle(definition, findSeoHubEventBySlug(eventSlug)!),
    }));
}

export function getCountdownClusterButtonsForEvent(eventSlug: string): CountdownClusterLink[] {
  const event = findSeoHubEventBySlug(eventSlug);

  if (!event) {
    return [];
  }

  return clusterDefinitions
    .filter((definition) => definition.eventSlug === eventSlug)
    .map((definition) => ({
      href: `/${definition.slug}`,
      label: getClusterButtonLabel(definition, event.name),
    }));
}

export function getCountdownClusterDefinitions(): CountdownClusterDefinition[] {
  return clusterDefinitions;
}

export function findCountdownClusterBySlug(
  slug: string,
): CountdownClusterDefinition | null {
  return clusterDefinitionsBySlug.get(slug) ?? null;
}

export function buildCountdownClusterMetadata(
  slug: string,
  now: Date = new Date(),
  searchParams: SummerSearchParams = {},
): Metadata {
  const selection = parseSummerSelection(searchParams);
  const pageData = getCountdownClusterPageData(slug, now, selection);

  if (!pageData) {
    return {
      title: selection.method === "astronomical" ? "Astronomical summer dates unavailable | DaysUntil" : "Countdown Not Found | DaysUntil",
      description: selection.method === "astronomical" ? "Maintained astronomical summer dates cover 2026-2035. Choose another season convention explicitly." : "The requested countdown page could not be found.",
      robots: { index: false, follow: true },
      alternates: { canonical: `/${slug}` },
    };
  }

  const {
    canonicalPath,
    count,
    event,
    targetDate,
  } = pageData;

  const targetYear = pageData.isExplicitSummer ? targetDate.getUTCFullYear() : targetDate.getFullYear();
  const countNoun = getClusterCountNoun(pageData.definition.kind, count);
  const description = `There are ${count.toLocaleString("en-GB")} ${countNoun.toLowerCase()} until ${event.name} ${targetYear}. Track the countdown to ${pageData.isExplicitSummer ? formatSummerUtcDate(targetDate) : formatFullDate(targetDate, "en-US")}.${event.slug === "summer" ? ` ${summerSelectionLabel(selection)}.` : ""}`;
  const queryNoun = getClusterDisplayLabel(pageData.definition.kind);
  const resultTitle = `How Many ${queryNoun} Until ${event.name}? ${count.toLocaleString(
    "en-GB",
  )} ${countNoun} Left`;

  return {
    title: resultTitle,
    description,
    ...(event.slug === "summer" && Object.keys(searchParams).length ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: resultTitle,
      description,
      url: `https://daysuntil.is${canonicalPath}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resultTitle,
      description,
    },
  };
}

export function getCountdownClusterPageData(
  slug: string,
  now: Date = new Date(),
  selection: SummerSelection = LEGACY_SUMMER,
) {
  const definition = findCountdownClusterBySlug(slug);

  if (!definition) {
    return null;
  }

  const resolvedCountdown = resolveSeoHubEventCountdown(definition.eventSlug, now);

  if (!resolvedCountdown) {
    return null;
  }

  const event = resolvedCountdown.event;
  const isExplicitSummer = event.slug === "summer" && selection.method !== "legacy";
  const selectedTargets = isExplicitSummer ? getSelectedSummerTargets(selection, now) : null;
  if (selectedTargets && !selectedTargets.length) return null;
  const targetDate = selectedTargets?.[0] ?? resolvedCountdown.targetDate;
  const countingNow = isExplicitSummer ? utcCivilDate(now) : now;
  const countingTarget = isExplicitSummer ? utcCivilDate(targetDate) : targetDate;
  const dateLabel = (date: Date) => isExplicitSummer ? formatSummerUtcDate(date) : formatFullDate(date, "en-US");
  const count = countClusterOccurrences(definition.kind, countingTarget, countingNow);
  const countNoun = getClusterCountNoun(definition.kind, count);
  const clusterLabel = `${getClusterDisplayLabel(definition.kind)} until ${isExplicitSummer ? summerSelectionLabel(selection) : event.name}`;
  const title = buildClusterTitle(definition, event);
  const canonicalPath = `/${definition.slug}`;
  const lead = `There are ${count.toLocaleString("en-GB")} ${countNoun.toLowerCase()} left until ${event.name}, on ${dateLabel(targetDate)}${isExplicitSummer ? " (UTC)" : ""}.`;
  const detailLine = `until ${dateLabel(targetDate)}${isExplicitSummer ? " (UTC)" : ""}`;
  const occurrenceTargets = selectedTargets?.map((date) => ({ year: date.getUTCFullYear(), date })) ?? getSeoHubOccurrenceTargets(event, now, 5);
  const yearRows: CountdownClusterYearRow[] = occurrenceTargets.map((row) => ({
    year: row.year,
    dateLabel: dateLabel(row.date),
    count: countClusterOccurrences(definition.kind, isExplicitSummer ? utcCivilDate(row.date) : row.date, countingNow),
  }));

  const relatedLinks: CountdownClusterLink[] = [];
  const remainingFridays: Array<{ href: string | null; label: string }> = [];
  if (definition.kind === "fridays") {
    const cursor = startOfLocalDay(countingNow);
    cursor.setDate(cursor.getDate() + (FRIDAY_WEEKDAY - cursor.getDay() + 7) % 7);
    while (cursor <= countingTarget) {
      remainingFridays.push({
        href: isExactDateInRolloutRange(cursor, now) ? `/days-until/date/${formatActionDate(cursor).replaceAll("-", "/")}` : null,
        label: formatFullDate(cursor, "en-US"),
      });
      cursor.setDate(cursor.getDate() + 7);
    }
  }
  const cardActionLinks: CountdownClusterLink[] = [];
  const eventRootPath = getEventRootPath(event.slug);

  if (eventRootPath) {
    relatedLinks.push({
      href: eventRootPath,
      label: `Days until ${event.name}`,
    });
    cardActionLinks.push({
      href: eventRootPath,
      label: getBaseEventButtonLabel(event.name),
    });
  }

  relatedLinks.push(...getSiblingClusterLinks(definition));
  cardActionLinks.push(...getSiblingClusterButtons(definition));
  const query = event.slug === "summer" ? summerSelectionQuery(selection) : "";
  if (query) {
    for (const link of [...relatedLinks, ...cardActionLinks]) link.href += query;
  }

  return {
    definition,
    event,
    targetDate,
    actionDate: countingTarget,
    selectedPath: `${canonicalPath}${query}`,
    selection,
    isExplicitSummer,
    countdown: isExplicitSummer ? getSummerCountdown(targetDate, now) : resolvedCountdown.countdown,
    count,
    clusterLabel,
    title,
    lead,
    detailLine,
    canonicalPath,
    yearRows,
    seasonNote: isExplicitSummer ? selectedSummerNote(selection, targetDate) : event.recurrenceType === "season-approximate"
      ? `This countdown uses ${new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(targetDate)} every year as an approximate Northern Hemisphere start of ${event.name.toLowerCase()}. It is not the exact astronomical instant, a meteorological season date, or a Southern Hemisphere countdown. Changing country does not change this convention.`
      : null,
    baselineLabel: `All counts start from today, ${dateLabel(now)}${isExplicitSummer ? " (UTC)" : ""}, including today when eligible.`,
    cardActionLinks,
    relatedLinks,
    remainingFridays,
    howItWorks:
      definition.kind === "fridays"
        ? `This page counts each Friday from today through ${event.name}. If the target date itself falls on a Friday, that final Friday is included in the total.`
        : `This page counts each remaining weekend from today through ${event.name}. If today is already Saturday or Sunday, the current weekend is included. If ${event.name} lands on a weekend, that final weekend is included too.`,
  };
}
