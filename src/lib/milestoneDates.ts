import { startOfLocalDay } from "./countdown";

export function getNextMonthDate(now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export function getNextYearDate(now: Date = new Date()): Date {
  return new Date(now.getFullYear() + 1, 0, 1);
}

export function getNextDecadeDate(now: Date = new Date()): Date {
  const currentYear = startOfLocalDay(now).getFullYear();
  const nextDecadeYear = Math.floor(currentYear / 10) * 10 + 10;

  return new Date(nextDecadeYear, 0, 1);
}
