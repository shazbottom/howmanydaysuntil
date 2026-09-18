import { getCountdown, getWeeksAndDaysRemaining, type CountdownResult } from "./countdown";

// Interpret calendar labels in the selected zone, without changing the target instant.
export function getCountdownInTimeZone(
  targetDate: Date,
  now: Date = new Date(),
  timeZone?: string,
): CountdownResult {
  const countdown = getCountdown(targetDate, now);
  if (!timeZone) return countdown;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  function dateOnly(value: Date): number {
    const parts = formatter.formatToParts(value);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((entry) => entry.type === type)?.value);
    return Date.UTC(part("year"), part("month") - 1, part("day"));
  }
  const daysRemaining = Math.max(0, Math.round((dateOnly(targetDate) - dateOnly(now)) / 86_400_000));
  return {
    ...countdown,
    daysRemaining,
    weeksRemaining: getWeeksAndDaysRemaining(daysRemaining),
  };
}

export function alignCountdownTimeZone(countdown: CountdownResult | null, timeZone?: string) {
  if (!countdown || !timeZone) return countdown;
  // Reuse the supplied snapshot's time so SSR and hydration start with identical values.
  const now = new Date(countdown.targetDate.getTime() - countdown.totalMillisecondsRemaining);
  return getCountdownInTimeZone(countdown.targetDate, now, timeZone);
}
