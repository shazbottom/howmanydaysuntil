const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;
const DAYS_PER_WEEK = 7;

export interface CountdownBreakdown {
  weeks: number;
  days: number;
}

export interface CountdownResult {
  targetDate: Date;
  totalMillisecondsRemaining: number;
  daysRemaining: number;
  weeksRemaining: CountdownBreakdown;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
}

// Validates inputs before any countdown math runs.
export function isValidDate(value: Date): boolean {
  return Number.isFinite(value.getTime());
}

// Converts a remaining millisecond span into full whole units.
export function getWholeUnitsRemaining(
  millisecondsRemaining: number,
  unitInMilliseconds: number,
): number {
  return Math.floor(millisecondsRemaining / unitInMilliseconds);
}

// Splits full remaining days into whole weeks plus leftover days.
export function getWeeksAndDaysRemaining(daysRemaining: number): CountdownBreakdown {
  return {
    weeks: Math.floor(daysRemaining / DAYS_PER_WEEK),
    days: daysRemaining % DAYS_PER_WEEK,
  };
}

export function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

// Calendar-day math avoids off-by-one behavior for date-only countdowns.
export function getCalendarDaysRemaining(targetDate: Date, now: Date): number {
  const targetDay = startOfLocalDay(targetDate).getTime();
  const currentDay = startOfLocalDay(now).getTime();

  return Math.max(0, Math.floor((targetDay - currentDay) / MILLISECONDS_PER_DAY));
}

// Calculates countdown values for a future target date using local time.
export function getCountdown(
  targetDate: Date,
  now: Date = new Date(),
): CountdownResult {
  if (!isValidDate(targetDate) || !isValidDate(now)) {
    throw new Error("Invalid date provided.");
  }

  const millisecondsRemaining = targetDate.getTime() - now.getTime();

  if (millisecondsRemaining < 0) {
    throw new Error("Target date must be in the future.");
  }

  const daysRemaining = getCalendarDaysRemaining(targetDate, now);

  return {
    targetDate,
    totalMillisecondsRemaining: millisecondsRemaining,
    daysRemaining,
    weeksRemaining: getWeeksAndDaysRemaining(daysRemaining),
    hoursRemaining: getWholeUnitsRemaining(
      millisecondsRemaining,
      MILLISECONDS_PER_HOUR,
    ),
    minutesRemaining: getWholeUnitsRemaining(
      millisecondsRemaining,
      MILLISECONDS_PER_MINUTE,
    ),
    secondsRemaining: getWholeUnitsRemaining(
      millisecondsRemaining,
      MILLISECONDS_PER_SECOND,
    ),
  };
}

/*
Example usage:

const now = new Date(2026, 2, 15, 9, 0, 0);
const target = new Date(2026, 2, 22, 9, 0, 0);

getCountdown(target, now);
// {
//   targetDate: Date(2026-03-22T09:00:00.000 local),
//   totalMillisecondsRemaining: 604800000,
//   daysRemaining: 7,
//   weeksRemaining: { weeks: 1, days: 0 },
//   hoursRemaining: 168,
//   minutesRemaining: 10080,
//   secondsRemaining: 604800
// }

const laterToday = new Date(2026, 2, 15, 18, 30, 0);

getCountdown(laterToday, now);
// daysRemaining is 0 because the target date is still today.
*/
