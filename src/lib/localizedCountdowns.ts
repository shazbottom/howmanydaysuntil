import { getCountdown, type CountdownResult } from "./countdown";
import { formatFullDate } from "./dateFormat";
import { getCountryByCode, type CountryCode, type CountryDefinition } from "./countries";
import {
  getEventsForRegion,
  getLocalizedEventByCountryAndSlug,
  getLocalizedEventsForCountry,
  getRegionEventByRegionAndSlug,
  type LocalizedEventDefinition,
  type LocalizedEventRule,
} from "./events";
import {
  buildRegionEventUrl,
  getRegionByCountryAndSlug,
  type RegionDefinition,
} from "./regions";

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

export interface LocalizedDateCountdownPageData {
  country: CountryDefinition;
  targetDate: Date;
  countdown: CountdownResult;
  todayLabel: string;
  targetDateLabel: string;
  dateSlug: string;
}

export interface LocalizedRegionCountdownPageData {
  country: CountryDefinition;
  region: RegionDefinition;
  event: LocalizedEventDefinition;
  targetDate: Date;
  countdown: CountdownResult;
  todayLabel: string;
  targetDateLabel: string;
  occurrenceRows: LocalizedOccurrenceRow[];
}

export interface LocalizedHubEventLink {
  href: string;
  label: string;
}

export interface LocalizedUpcomingEventLink extends LocalizedHubEventLink {
  daysRemaining: number;
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

function createValidLocalDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
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

export function parseLocalizedDateSlug(dateSlug: string): Date | null {
  const match = dateSlug.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  return createValidLocalDate(Number(yearText), Number(monthText), Number(dayText));
}

export function getLocalizedDateCountdownPageData(
  countryCode: CountryCode,
  dateSlug: string,
  now: Date = new Date(),
): LocalizedDateCountdownPageData | null {
  const country = getCountryByCode(countryCode);
  const parsedDate = parseLocalizedDateSlug(dateSlug);

  if (!country || !parsedDate) {
    return null;
  }

  const nowParts = getTimeZoneDateParts(now, country.timezone);
  const targetParts = {
    year: parsedDate.getFullYear(),
    month: parsedDate.getMonth() + 1,
    day: parsedDate.getDate(),
  };

  if (compareDateParts(targetParts, nowParts) < 0) {
    return null;
  }

  const targetDate =
    compareDateParts(targetParts, nowParts) === 0
      ? now
      : createDateInTimeZone(targetParts.year, targetParts.month, targetParts.day, country.timezone);

  return {
    country,
    targetDate,
    countdown: getCountdown(targetDate, now),
    todayLabel: getCountryTodayLabel(country, now),
    targetDateLabel: new Intl.DateTimeFormat(country.locale, {
      timeZone: country.timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(targetDate),
    dateSlug,
  };
}

function formatDateForLocaleAndTimeZone(
  date: Date,
  locale: string,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getRegionTodayLabel(
  region: RegionDefinition,
  locale: string,
  now: Date = new Date(),
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: region.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
}

export function getRegionalCountdownPageData(
  countryCode: CountryCode,
  regionSlug: string,
  eventSlug: string,
  now: Date = new Date(),
): LocalizedRegionCountdownPageData | null {
  const country = getCountryByCode(countryCode);
  const region = getRegionByCountryAndSlug(countryCode, regionSlug);
  const event = region ? getRegionEventByRegionAndSlug(region, eventSlug) : null;

  if (!country || !region || !event) {
    return null;
  }

  const nowParts = getTimeZoneDateParts(now, region.timezone);
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
          region.timezone,
        );

  const countdown = getCountdown(targetDate, now);
  const firstOccurrenceYear =
    compareDateParts(targetOccurrence, nowParts) < 0 ? targetYear + 1 : targetYear;
  const occurrenceRows = Array.from({ length: 5 }, (_, index) => {
    const occurrenceDate = createDateInTimeZone(
      getOccurrencePartsForYear(event.rule, firstOccurrenceYear + index).year,
      getOccurrencePartsForYear(event.rule, firstOccurrenceYear + index).month,
      getOccurrencePartsForYear(event.rule, firstOccurrenceYear + index).day,
      region.timezone,
    );

    return {
      year: firstOccurrenceYear + index,
      formattedDate: new Intl.DateTimeFormat(country.locale, {
        timeZone: region.timezone,
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(occurrenceDate),
      dayOfWeek: new Intl.DateTimeFormat(country.locale, {
        timeZone: region.timezone,
        weekday: "long",
      }).format(occurrenceDate),
    };
  });

  return {
    country,
    region,
    event,
    targetDate,
    countdown,
    todayLabel: getRegionTodayLabel(region, country.locale, now),
    targetDateLabel: formatDateForLocaleAndTimeZone(targetDate, country.locale, region.timezone),
    occurrenceRows,
  };
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
    label: event.displayName,
  }));
}

export function getPopularLocalizedEventLinksForCountry(
  countryCode: CountryCode,
  limit = 5,
): LocalizedHubEventLink[] {
  return getLocalizedEventLinksForCountry(countryCode).slice(0, limit);
}

export function getUpcomingLocalizedEventLinksForCountry(
  countryCode: CountryCode,
  now: Date = new Date(),
  limit = 5,
): LocalizedUpcomingEventLink[] {
  return getLocalizedEventsForCountry(countryCode)
    .map((event) => {
      const pageData = getLocalizedCountdownPageData(countryCode, event.slug, now);

      if (!pageData) {
        return null;
      }

      return {
        href: `/${countryCode}/days-until/${event.slug}`,
        label: event.displayName,
        daysRemaining: pageData.countdown.daysRemaining,
        targetDate: pageData.targetDate,
      };
    })
    .filter(
      (
        eventLink,
      ): eventLink is LocalizedUpcomingEventLink & { targetDate: Date } => eventLink !== null,
    )
    .sort((left, right) => {
      if (left.daysRemaining !== right.daysRemaining) {
        return left.daysRemaining - right.daysRemaining;
      }

      return left.targetDate.getTime() - right.targetDate.getTime();
    })
    .slice(0, limit)
    .map(({ href, label, daysRemaining }) => ({
      href,
      label,
      daysRemaining,
    }));
}

export function getUpcomingLocalizedEventLinksForRegion(
  countryCode: CountryCode,
  regionSlug: string,
  now: Date = new Date(),
  limit = 5,
): LocalizedUpcomingEventLink[] {
  const region = getRegionByCountryAndSlug(countryCode, regionSlug);

  if (!region) {
    return [];
  }

  return getEventsForRegion(region)
    .map((event) => {
      const pageData = getRegionalCountdownPageData(countryCode, regionSlug, event.slug, now);

      if (!pageData) {
        return null;
      }

      return {
        href: buildRegionEventUrl(region, event.slug),
        label: event.displayName,
        daysRemaining: pageData.countdown.daysRemaining,
        targetDate: pageData.targetDate,
      };
    })
    .filter(
      (
        eventLink,
      ): eventLink is LocalizedUpcomingEventLink & { targetDate: Date } => eventLink !== null,
    )
    .sort((left, right) => {
      if (left.daysRemaining !== right.daysRemaining) {
        return left.daysRemaining - right.daysRemaining;
      }

      return left.targetDate.getTime() - right.targetDate.getTime();
    })
    .slice(0, limit)
    .map(({ href, label, daysRemaining }) => ({
      href,
      label,
      daysRemaining,
    }));
}

export function getSecondaryGlobalEventLinksForRegion(
  countryCode: CountryCode,
  now: Date = new Date(),
  limit = 2,
): LocalizedUpcomingEventLink[] {
  return getLocalizedEventsForCountry(countryCode)
    .filter((event) => event.scope === "global")
    .map((event) => {
      const pageData = getLocalizedCountdownPageData(countryCode, event.slug, now);

      if (!pageData) {
        return null;
      }

      return {
        href: `/${countryCode}/days-until/${event.slug}`,
        label: event.displayName,
        daysRemaining: pageData.countdown.daysRemaining,
        targetDate: pageData.targetDate,
      };
    })
    .filter(
      (
        eventLink,
      ): eventLink is LocalizedUpcomingEventLink & { targetDate: Date } => eventLink !== null,
    )
    .sort((left, right) => {
      if (left.daysRemaining !== right.daysRemaining) {
        return left.daysRemaining - right.daysRemaining;
      }

      return left.targetDate.getTime() - right.targetDate.getTime();
    })
    .slice(0, limit)
    .map(({ href, label, daysRemaining }) => ({
      href,
      label,
      daysRemaining,
    }));
}
