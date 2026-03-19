import { getCountdown, type CountdownResult } from "./countdown";
import { formatFullDate } from "./dateFormat";
import { getCountryByCode, type CountryCode, type CountryDefinition } from "./countries";
import {
  getLocalizedEventByCountryAndSlug,
  getLocalizedEventsForCountry,
  type LocalizedEventDefinition,
  type LocalizedEventRule,
} from "./events";

interface TimeZoneDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface LocalizedOccurrenceRow {
  year: number;
  formattedDate: string;
  dayOfWeek: string;
}

export interface LocalizedCountdownPageData {
  country: CountryDefinition;
  event: LocalizedEventDefinition;
  targetDate: Date;
  countdown: CountdownResult;
  todayLabel: string;
  targetDateLabel: string;
  occurrenceRows: LocalizedOccurrenceRow[];
}

function getTimeZoneDateParts(date: Date, timeZone: string): TimeZoneDateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);

  function getPart(type: Intl.DateTimeFormatPartTypes): number {
    const value = parts.find((part) => part.type === type)?.value;
    return Number(value);
  }

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hour: getPart("hour"),
    minute: getPart("minute"),
    second: getPart("second"),
  };
}

function getTimeZoneOffsetMilliseconds(date: Date, timeZone: string): number {
  const parts = getTimeZoneDateParts(date, timeZone);

  return (
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    ) - date.getTime()
  );
}

function createDateInTimeZone(
  year: number,
  month: number,
  day: number,
  timeZone: string,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const initialDate = new Date(utcGuess);
  const initialOffset = getTimeZoneOffsetMilliseconds(initialDate, timeZone);
  let resolvedDate = new Date(utcGuess - initialOffset);
  const correctedOffset = getTimeZoneOffsetMilliseconds(resolvedDate, timeZone);

  if (correctedOffset !== initialOffset) {
    resolvedDate = new Date(utcGuess - correctedOffset);
  }

  return resolvedDate;
}

function getEasterSundayForYear(year: number): { month: number; day: number } {
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

  return { month, day };
}

function addDays(year: number, month: number, day: number, offsetDays: number): {
  year: number;
  month: number;
  day: number;
} {
  const nextDate = new Date(Date.UTC(year, month - 1, day + offsetDays));

  return {
    year: nextDate.getUTCFullYear(),
    month: nextDate.getUTCMonth() + 1,
    day: nextDate.getUTCDate(),
  };
}

function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  occurrence: number,
): { year: number; month: number; day: number } {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const firstWeekday = firstDay.getUTCDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  const day = 1 + offset + (occurrence - 1) * 7;

  return { year, month, day };
}

function getOccurrencePartsForYear(
  rule: LocalizedEventRule,
  year: number,
): { year: number; month: number; day: number } {
  if (rule.type === "fixed-date") {
    return {
      year,
      month: rule.month,
      day: rule.day,
    };
  }

  if (rule.type === "nth-weekday") {
    return getNthWeekdayOfMonth(year, rule.month, rule.weekday, rule.occurrence);
  }

  const easterSunday = getEasterSundayForYear(year);
  return addDays(year, easterSunday.month, easterSunday.day, rule.offsetDays);
}

function compareDateParts(
  left: Pick<TimeZoneDateParts, "year" | "month" | "day">,
  right: Pick<TimeZoneDateParts, "year" | "month" | "day">,
): number {
  const leftValue = left.year * 10_000 + left.month * 100 + left.day;
  const rightValue = right.year * 10_000 + right.month * 100 + right.day;

  return leftValue - rightValue;
}

export function formatDateForCountry(date: Date, country: CountryDefinition): string {
  return formatFullDate(
    new Date(
      date.toLocaleString("en-US", {
        timeZone: country.timezone,
      }),
    ),
    country.locale,
  );
}

export function getCountryTodayLabel(country: CountryDefinition, now: Date = new Date()): string {
  return new Intl.DateTimeFormat(country.locale, {
    timeZone: country.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
}

export function getLocalizedEventOccurrenceForYear(
  event: LocalizedEventDefinition,
  country: CountryDefinition,
  year: number,
): Date {
  const occurrence = getOccurrencePartsForYear(event.rule, year);
  return createDateInTimeZone(
    occurrence.year,
    occurrence.month,
    occurrence.day,
    country.timezone,
  );
}

export function getLocalizedCountdownPageData(
  countryCode: CountryCode,
  eventSlug: string,
  now: Date = new Date(),
): LocalizedCountdownPageData | null {
  const country = getCountryByCode(countryCode);
  const event = getLocalizedEventByCountryAndSlug(countryCode, eventSlug);

  if (!country || !event) {
    return null;
  }

  const nowParts = getTimeZoneDateParts(now, country.timezone);
  let targetYear = nowParts.year;
  let targetOccurrence = getOccurrencePartsForYear(event.rule, targetYear);

  if (compareDateParts(targetOccurrence, nowParts) < 0) {
    targetYear += 1;
    targetOccurrence = getOccurrencePartsForYear(event.rule, targetYear);
  }

  const targetDate =
    compareDateParts(targetOccurrence, nowParts) === 0
      ? now
      : createDateInTimeZone(
          targetOccurrence.year,
          targetOccurrence.month,
          targetOccurrence.day,
          country.timezone,
        );

  const countdown = getCountdown(targetDate, now);
  const firstOccurrenceYear =
    compareDateParts(targetOccurrence, nowParts) < 0 ? targetYear + 1 : targetYear;
  const occurrenceRows = Array.from({ length: 5 }, (_, index) => {
    const occurrenceDate = getLocalizedEventOccurrenceForYear(
      event,
      country,
      firstOccurrenceYear + index,
    );
    return {
      year: firstOccurrenceYear + index,
      formattedDate: new Intl.DateTimeFormat(country.locale, {
        timeZone: country.timezone,
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(occurrenceDate),
      dayOfWeek: new Intl.DateTimeFormat(country.locale, {
        timeZone: country.timezone,
        weekday: "long",
      }).format(occurrenceDate),
    };
  });

  return {
    country,
    event,
    targetDate,
    countdown,
    todayLabel: getCountryTodayLabel(country, now),
    targetDateLabel: new Intl.DateTimeFormat(country.locale, {
      timeZone: country.timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(targetDate),
    occurrenceRows,
  };
}

export function getLocalizedEventLinksForCountry(countryCode: CountryCode): Array<{
  href: string;
  label: string;
}> {
  return getLocalizedEventsForCountry(countryCode).map((event) => ({
    href: `/${countryCode}/days-until/${event.slug}`,
    label: `Days until ${event.displayName}`,
  }));
}
