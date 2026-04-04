import { getCountryByCode, type CountryCode } from "./countries";
import { getCountryReferenceData, type CountryPublicHolidayRow } from "./countryData";
import { getRegionReferenceData } from "./regionData";

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDateOnly(dateText: string): Date | null {
  const match = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function differenceInCalendarDays(startDate: Date, endDate: Date): number {
  return Math.round((endDate.getTime() - startDate.getTime()) / DAY_MS);
}

function getDaysInUtcMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function addUtcMonthsClamped(date: Date, monthDelta: number): Date {
  const year = date.getUTCFullYear();
  const monthIndex = date.getUTCMonth();
  const day = date.getUTCDate();
  const targetMonthIndex = monthIndex + monthDelta;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonthIndex = ((targetMonthIndex % 12) + 12) % 12;
  const maxDay = getDaysInUtcMonth(targetYear, normalizedMonthIndex);

  return new Date(
    Date.UTC(targetYear, normalizedMonthIndex, Math.min(day, maxDay)),
  );
}

function addUtcYearsClamped(date: Date, yearDelta: number): Date {
  const year = date.getUTCFullYear() + yearDelta;
  const monthIndex = date.getUTCMonth();
  const day = date.getUTCDate();
  const maxDay = getDaysInUtcMonth(year, monthIndex);

  return new Date(Date.UTC(year, monthIndex, Math.min(day, maxDay)));
}

function countWeekdaysExclusiveStart(startDate: Date, endDate: Date): number {
  if (endDate.getTime() < startDate.getTime()) {
    return -countWeekdaysExclusiveStart(endDate, startDate);
  }

  let count = 0;
  const cursor = new Date(startDate.getTime());

  while (cursor.getTime() < endDate.getTime()) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);

    const dayOfWeek = cursor.getUTCDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count += 1;
    }
  }

  return count;
}

function getTodayInTimeZone(timeZone: string): Date {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return new Date(Date.UTC(year, month - 1, day));
}

function isWeekday(date: Date): boolean {
  const dayOfWeek = date.getUTCDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

function getIncludedPublicHolidaysBetween(
  startDate: Date,
  endDate: Date,
  countryCode: CountryCode,
  regionId?: string,
): CountryPublicHolidayRow[] {
  if (endDate.getTime() < startDate.getTime()) {
    return [];
  }

  const years = new Set<number>();
  let currentYear = startDate.getUTCFullYear();
  const lastYear = endDate.getUTCFullYear();

  while (currentYear <= lastYear) {
    years.add(currentYear);
    currentYear += 1;
  }

  return Array.from(years)
    .flatMap((year) => {
      const regionReferenceData = regionId ? getRegionReferenceData(regionId, year) : null;

      if (regionReferenceData?.publicHolidays.length) {
        return regionReferenceData.publicHolidays;
      }

      return getCountryReferenceData(countryCode, year);
    })
    .filter((holiday) => {
      if (!holiday.date) {
        return false;
      }

      const holidayDate = parseDateOnly(holiday.date);

      if (!holidayDate || !isWeekday(holidayDate)) {
        return false;
      }

      return holidayDate.getTime() > startDate.getTime() && holidayDate.getTime() <= endDate.getTime();
    });
}

export interface BusinessDayCalculationResult {
  businessDays: number;
  includedHolidays: CountryPublicHolidayRow[];
}

export interface AddOrSubtractDateResult {
  resultDate: string;
  resultLabel: string;
  dayDifference: number;
}

export interface RetirementCountdownResult {
  retirementDate: string;
  retirementLabel: string;
  daysRemaining: number;
  yearsRemaining: number;
  monthsRemaining: number;
  extraDaysRemaining: number;
}

export function calculateDaysBetween(startDateText: string, endDateText: string) {
  const startDate = parseDateOnly(startDateText);
  const endDate = parseDateOnly(endDateText);

  if (!startDate || !endDate) {
    return null;
  }

  return differenceInCalendarDays(startDate, endDate);
}

export function calculateWorkingDaysBetween(startDateText: string, endDateText: string) {
  const startDate = parseDateOnly(startDateText);
  const endDate = parseDateOnly(endDateText);

  if (!startDate || !endDate) {
    return null;
  }

  return countWeekdaysExclusiveStart(startDate, endDate);
}

export function calculateBusinessDaysBetween(startDateText: string, endDateText: string) {
  const startDate = parseDateOnly(startDateText);
  const endDate = parseDateOnly(endDateText);

  if (!startDate || !endDate) {
    return null;
  }

  return countWeekdaysExclusiveStart(startDate, endDate);
}

export function calculateBusinessDaysUntil(targetDateText: string, timeZone = "Australia/Sydney") {
  const today = getTodayInTimeZone(timeZone);
  const targetDate = parseDateOnly(targetDateText);

  if (!targetDate) {
    return null;
  }

  return countWeekdaysExclusiveStart(today, targetDate);
}

export function calculateBusinessDaysBetweenForCountry(
  startDateText: string,
  endDateText: string,
  countryCode: CountryCode,
  regionId?: string,
): BusinessDayCalculationResult | null {
  const startDate = parseDateOnly(startDateText);
  const endDate = parseDateOnly(endDateText);

  if (!startDate || !endDate) {
    return null;
  }

  if (endDate.getTime() < startDate.getTime()) {
    return {
      businessDays: -calculateBusinessDaysBetweenForCountry(
        endDateText,
        startDateText,
        countryCode,
        regionId,
      )!.businessDays,
      includedHolidays: [],
    };
  }

  const includedHolidays = getIncludedPublicHolidaysBetween(startDate, endDate, countryCode, regionId);

  return {
    businessDays: countWeekdaysExclusiveStart(startDate, endDate) - includedHolidays.length,
    includedHolidays,
  };
}

export function calculateBusinessDaysUntilForCountry(
  targetDateText: string,
  countryCode: CountryCode,
  regionId?: string,
): BusinessDayCalculationResult | null {
  const country = getCountryByCode(countryCode);
  const targetDate = parseDateOnly(targetDateText);

  if (!country || !targetDate) {
    return null;
  }

  const today = getTodayInTimeZone(country.timezone);

  if (targetDate.getTime() < today.getTime()) {
    return {
      businessDays: -calculateBusinessDaysBetweenForCountry(
        targetDateText,
        today.toISOString().slice(0, 10),
        countryCode,
        regionId,
      )!.businessDays,
      includedHolidays: [],
    };
  }

  const includedHolidays = getIncludedPublicHolidaysBetween(today, targetDate, countryCode, regionId);

  return {
    businessDays: countWeekdaysExclusiveStart(today, targetDate) - includedHolidays.length,
    includedHolidays,
  };
}

export function calculateAddOrSubtractDate(
  startDateText: string,
  mode: "add" | "subtract",
  amount: number,
  unit: "days" | "weeks" | "months" | "years",
): AddOrSubtractDateResult | null {
  const startDate = parseDateOnly(startDateText);

  if (!startDate || !Number.isFinite(amount) || amount < 0) {
    return null;
  }

  const direction = mode === "subtract" ? -1 : 1;
  const adjustedAmount = amount * direction;
  const resultDate = new Date(startDate.getTime());

  if (unit === "days") {
    resultDate.setUTCDate(resultDate.getUTCDate() + adjustedAmount);
  } else if (unit === "weeks") {
    resultDate.setUTCDate(resultDate.getUTCDate() + adjustedAmount * 7);
  } else if (unit === "months") {
    return {
      resultDate: addUtcMonthsClamped(startDate, adjustedAmount).toISOString().slice(0, 10),
      resultLabel: new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(addUtcMonthsClamped(startDate, adjustedAmount)),
      dayDifference: differenceInCalendarDays(startDate, addUtcMonthsClamped(startDate, adjustedAmount)),
    };
  } else {
    return {
      resultDate: addUtcYearsClamped(startDate, adjustedAmount).toISOString().slice(0, 10),
      resultLabel: new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(addUtcYearsClamped(startDate, adjustedAmount)),
      dayDifference: differenceInCalendarDays(startDate, addUtcYearsClamped(startDate, adjustedAmount)),
    };
  }

  return {
    resultDate: resultDate.toISOString().slice(0, 10),
    resultLabel: new Intl.DateTimeFormat("en-GB", {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(resultDate),
    dayDifference: differenceInCalendarDays(startDate, resultDate),
  };
}

export function calculateRetirementCountdown(
  dateOfBirthText: string,
  retirementAge: number,
): RetirementCountdownResult | null {
  const dateOfBirth = parseDateOnly(dateOfBirthText);

  if (!dateOfBirth || !Number.isFinite(retirementAge) || retirementAge < 1 || retirementAge > 100) {
    return null;
  }

  const retirementDate = addUtcYearsClamped(dateOfBirth, retirementAge);
  const today = getTodayInTimeZone("Australia/Sydney");
  const daysRemaining = differenceInCalendarDays(today, retirementDate);
  const yearsRemaining = Math.trunc(daysRemaining / 365.2425);
  const afterYears = addUtcYearsClamped(today, yearsRemaining);

  let monthsRemaining = 0;
  let cursor = afterYears;

  while (monthsRemaining < 12) {
    const nextMonth = addUtcMonthsClamped(cursor, 1);

    if (nextMonth.getTime() > retirementDate.getTime()) {
      break;
    }

    monthsRemaining += 1;
    cursor = nextMonth;
  }

  const extraDaysRemaining = differenceInCalendarDays(cursor, retirementDate);

  return {
    retirementDate: retirementDate.toISOString().slice(0, 10),
    retirementLabel: new Intl.DateTimeFormat("en-GB", {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(retirementDate),
    daysRemaining,
    yearsRemaining,
    monthsRemaining,
    extraDaysRemaining,
  };
}
