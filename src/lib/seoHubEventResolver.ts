import type { CountdownResult } from "./countdown";
import { getCountdown, startOfLocalDay } from "./countdown";
import {
  findSeoHubEventBySlug,
  type SeoHubEventDefinition,
} from "../data/seoHubEvents";

function isSameLocalDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getNextFixedAnnualDate(month: number, day: number, now: Date): Date {
  const currentYear = now.getFullYear();
  const candidate = new Date(currentYear, month - 1, day);
  const today = startOfLocalDay(now);

  if (isSameLocalDay(candidate, now)) {
    return now;
  }

  if (candidate < today) {
    return new Date(currentYear + 1, month - 1, day);
  }

  return candidate;
}

function getNthWeekdayOfMonth(year: number, month: number, weekday: number, occurrence: number): Date {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstWeekdayOffset = (weekday - firstDayOfMonth.getDay() + 7) % 7;
  const dayOfMonth = 1 + firstWeekdayOffset + (occurrence - 1) * 7;

  return new Date(year, month - 1, dayOfMonth);
}

function getRelativeDateFromNthWeekday(
  year: number,
  month: number,
  weekday: number,
  occurrence: number,
  offsetDays: number,
): Date {
  const baseDate = getNthWeekdayOfMonth(year, month, weekday, occurrence);
  const relativeDate = new Date(baseDate);
  relativeDate.setDate(baseDate.getDate() + offsetDays);

  return relativeDate;
}

function getNextAnnualNthWeekdayDate(
  month: number,
  weekday: number,
  occurrence: number,
  now: Date,
): Date {
  const currentYear = now.getFullYear();
  const candidate = getNthWeekdayOfMonth(currentYear, month, weekday, occurrence);
  const today = startOfLocalDay(now);

  if (isSameLocalDay(candidate, now)) {
    return now;
  }

  if (candidate < today) {
    return getNthWeekdayOfMonth(currentYear + 1, month, weekday, occurrence);
  }

  return candidate;
}

function getNextAnnualRelativeDate(
  month: number,
  weekday: number,
  occurrence: number,
  offsetDays: number,
  now: Date,
): Date {
  const currentYear = now.getFullYear();
  const candidate = getRelativeDateFromNthWeekday(
    currentYear,
    month,
    weekday,
    occurrence,
    offsetDays,
  );
  const today = startOfLocalDay(now);

  if (isSameLocalDay(candidate, now)) {
    return now;
  }

  if (candidate < today) {
    return getRelativeDateFromNthWeekday(
      currentYear + 1,
      month,
      weekday,
      occurrence,
      offsetDays,
    );
  }

  return candidate;
}

function getNextWeekdayDate(weekdays: number[], now: Date, minimumDaysAhead = 0): Date {
  const today = startOfLocalDay(now);
  let bestCandidate: Date | null = null;

  for (const weekday of weekdays) {
    const offset = (weekday - now.getDay() + 7) % 7;
    const adjustedOffset = offset < minimumDaysAhead ? offset + 7 : offset;
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + adjustedOffset);

    if (adjustedOffset === 0 && minimumDaysAhead === 0) {
      return now;
    }

    if (!bestCandidate || candidate < bestCandidate) {
      bestCandidate = candidate;
    }
  }

  return bestCandidate ?? today;
}

function getFixedYearDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

function getEasterSunday(year: number): Date {
  const century = Math.floor(year / 100);
  const yearInCentury = year % 100;
  const leapCenturyCorrection = Math.floor(century / 4);
  const centuryRemainder = century % 4;
  const moonCorrection = Math.floor((century + 8) / 25);
  const adjustedMoonCorrection = Math.floor((century - moonCorrection + 1) / 3);
  const epact =
    (19 * (year % 19) + century - leapCenturyCorrection - adjustedMoonCorrection + 15) % 30;
  const leapYearInCentury = Math.floor(yearInCentury / 4);
  const yearRemainder = yearInCentury % 4;
  const weekdayCorrection =
    (32 + 2 * centuryRemainder + 2 * leapYearInCentury - epact - yearRemainder) % 7;
  const monthFactor = Math.floor((year % 19 + 11 * epact + 22 * weekdayCorrection) / 451);
  const month = Math.floor((epact + weekdayCorrection - 7 * monthFactor + 114) / 31);
  const day = ((epact + weekdayCorrection - 7 * monthFactor + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

function getNextEasterDate(now: Date): Date {
  const currentYear = now.getFullYear();
  const candidate = getEasterSunday(currentYear);
  const today = startOfLocalDay(now);

  if (isSameLocalDay(candidate, now)) {
    return now;
  }

  if (candidate < today) {
    return getEasterSunday(currentYear + 1);
  }

  return candidate;
}

export function resolveSeoHubEventDate(
  event: SeoHubEventDefinition,
  now: Date = new Date(),
): Date | null {
  switch (event.recurrence.recurrenceType) {
    case "fixed-annual-date":
      return getNextFixedAnnualDate(event.recurrence.month, event.recurrence.day, now);
    case "season-approximate":
      return getNextFixedAnnualDate(event.recurrence.month, event.recurrence.day, now);
    case "annual-nth-weekday":
      return getNextAnnualNthWeekdayDate(
        event.recurrence.month,
        event.recurrence.weekday,
        event.recurrence.occurrence,
        now,
      );
    case "annual-relative-to-nth-weekday":
      return getNextAnnualRelativeDate(
        event.recurrence.month,
        event.recurrence.weekday,
        event.recurrence.occurrence,
        event.recurrence.offsetDays,
        now,
      );
    case "weekday-recurring":
      return getNextWeekdayDate(
        event.recurrence.weekdays,
        now,
        event.recurrence.minimumDaysAhead ?? 0,
      );
    case "fixed-year-date": {
      const targetDate = getFixedYearDate(
        event.recurrence.year,
        event.recurrence.month,
        event.recurrence.day,
      );

      return targetDate >= startOfLocalDay(now) ? targetDate : null;
    }
    case "easter":
      return getNextEasterDate(now);
    default:
      return null;
  }
}

export interface ResolvedSeoHubEventCountdown {
  event: SeoHubEventDefinition;
  targetDate: Date;
  countdown: CountdownResult;
}

export function resolveSeoHubEventCountdown(
  slug: string,
  now: Date = new Date(),
): ResolvedSeoHubEventCountdown | null {
  const event = findSeoHubEventBySlug(slug);

  if (!event) {
    return null;
  }

  const targetDate = resolveSeoHubEventDate(event, now);

  if (!targetDate) {
    return null;
  }

  return {
    event,
    targetDate,
    countdown: getCountdown(targetDate, now),
  };
}
