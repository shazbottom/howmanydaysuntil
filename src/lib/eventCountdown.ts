import { findEventBySlug, type EventDefinition } from "../data/events";
import { getCountdown, startOfLocalDay, type CountdownResult } from "./countdown";

function isSameLocalDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getNextFixedDate(month: number, day: number, now: Date): Date {
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

function getNextWeekdayDate(weekday: number, now: Date): Date {
  const currentWeekday = now.getDay();
  const offset = (weekday - currentWeekday + 7) % 7;

  if (offset === 0) {
    return now;
  }

  const candidate = new Date(now);
  candidate.setDate(now.getDate() + offset);

  return startOfLocalDay(candidate);
}

function getNthWeekdayOfMonth(year: number, month: number, weekday: number, occurrence: number): Date {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstWeekdayOffset = (weekday - firstDayOfMonth.getDay() + 7) % 7;
  const dayOfMonth = 1 + firstWeekdayOffset + (occurrence - 1) * 7;

  return new Date(year, month - 1, dayOfMonth);
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

export function resolveEventDate(event: EventDefinition, now: Date = new Date()): Date | null {
  switch (event.recurrence.recurrenceType) {
    case "fixed-annual-date":
      return getNextFixedDate(event.recurrence.month, event.recurrence.day, now);
    case "year-start":
      return getNextFixedDate(event.recurrence.month, event.recurrence.day, now);
    case "weekday-recurring":
      return getNextWeekdayDate(event.recurrence.weekdays[0], now);
    case "annual-nth-weekday":
      return getNextAnnualNthWeekdayDate(
        event.recurrence.month,
        event.recurrence.weekday,
        event.recurrence.occurrence,
        now,
      );
    default:
      return null;
  }
}

export interface ResolvedEventCountdown {
  event: EventDefinition;
  targetDate: Date;
  countdown: CountdownResult;
}

export function resolveEventCountdown(
  slug: string,
  now: Date = new Date(),
): ResolvedEventCountdown | null {
  const event = findEventBySlug(slug);

  if (!event) {
    return null;
  }

  const targetDate = resolveEventDate(event, now);

  if (!targetDate) {
    return null;
  }

  return {
    event,
    targetDate,
    countdown: getCountdown(targetDate, now),
  };
}
