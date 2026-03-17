import { getCountdown, startOfLocalDay, type CountdownResult } from "./countdown";

export interface ExactDateParams {
  year: string;
  month: string;
  day: string;
}

export interface ResolvedExactDateCountdown {
  targetDate: Date;
  countdown: CountdownResult;
}

function parsePositiveInteger(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  return Number(value);
}

function createExactDate(year: number, month: number, day: number): Date | null {
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

export function parseExactDateParams(params: ExactDateParams): Date | null {
  const year = parsePositiveInteger(params.year);
  const month = parsePositiveInteger(params.month);
  const day = parsePositiveInteger(params.day);

  if (year === null || month === null || day === null) {
    return null;
  }

  if (year < 1000 || year > 9999) {
    return null;
  }

  if (month < 1 || month > 12) {
    return null;
  }

  if (day < 1 || day > 31) {
    return null;
  }

  return createExactDate(year, month, day);
}

export function resolveExactDateCountdown(
  params: ExactDateParams,
  now: Date = new Date(),
): ResolvedExactDateCountdown | null {
  const exactDate = parseExactDateParams(params);

  if (!exactDate) {
    return null;
  }

  const startOfTargetDate = startOfLocalDay(exactDate);
  const today = startOfLocalDay(now);

  if (startOfTargetDate < today) {
    return null;
  }

  const targetDate =
    startOfTargetDate.getTime() === today.getTime() ? now : startOfTargetDate;

  return {
    targetDate,
    countdown: getCountdown(targetDate, now),
  };
}
