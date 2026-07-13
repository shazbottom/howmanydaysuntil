import { getCountdown, type CountdownResult } from "./countdown";

export type YearPlanningKind = "fridays" | "weekends" | "working-days";

export interface YearPlanningMonthRow {
  month: string;
  count: number;
}

export interface YearPlanningData {
  kind: YearPlanningKind;
  year: number;
  title: string;
  description: string;
  lead: string;
  count: number;
  countLabel: string;
  detailLine: string;
  howItWorks: string;
  monthRows: YearPlanningMonthRow[];
  countdown: CountdownResult;
  relatedLinks: Array<{ href: string; label: string }>;
}

export const yearPlanningPaths: Record<YearPlanningKind, string> = {
  fridays: "/fridays-left-this-year",
  weekends: "/weekends-left-this-year",
  "working-days": "/working-days-left-this-year",
};

const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcDateOnly(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function countMatchingDays(
  kind: Exclude<YearPlanningKind, "weekends">,
  start: Date,
  end: Date,
) {
  let count = 0;

  for (
    let timestamp = start.getTime();
    timestamp <= end.getTime();
    timestamp += DAY_MS
  ) {
    const day = new Date(timestamp).getUTCDay();

    if (kind === "fridays" ? day === 5 : day >= 1 && day <= 5) {
      count += 1;
    }
  }

  return count;
}

function countWeekends(start: Date, end: Date, includeCurrentSunday: boolean) {
  let count = includeCurrentSunday ? 1 : 0;

  for (
    let timestamp = start.getTime();
    timestamp <= end.getTime();
    timestamp += DAY_MS
  ) {
    if (new Date(timestamp).getUTCDay() === 6) {
      count += 1;
    }
  }

  return count;
}

function countForKind(kind: YearPlanningKind, start: Date, end: Date, currentSunday = false) {
  return kind === "weekends"
    ? countWeekends(start, end, currentSunday)
    : countMatchingDays(kind, start, end);
}

function getMonthRows(kind: YearPlanningKind, now: Date) {
  const year = now.getFullYear();

  return Array.from({ length: 12 - now.getMonth() }, (_, index) => {
    const monthIndex = now.getMonth() + index;
    const startDay = index === 0 ? now.getDate() : 1;
    const start = new Date(Date.UTC(year, monthIndex, startDay));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0));
    const includeCurrentSunday =
      kind === "weekends" && index === 0 && toUtcDateOnly(now).getUTCDay() === 0;

    return {
      month: new Intl.DateTimeFormat("en-GB", { month: "long" }).format(
        new Date(year, monthIndex, 1),
      ),
      count: countForKind(kind, start, end, includeCurrentSunday),
    };
  });
}

function getCopy(kind: YearPlanningKind, year: number, count: number) {
  if (kind === "fridays") {
    return {
      title: `How many Fridays are left in ${year}?`,
      description: `There are ${count} Fridays left in ${year}. See a month-by-month breakdown and the counting method.`,
      lead: `There are ${count} Fridays remaining from today through December 31, ${year}.`,
      countLabel: count === 1 ? "Friday left" : "Fridays left",
      detailLine: "Includes today when today is Friday",
      howItWorks:
        "The count starts with today and checks each remaining calendar date through December 31. Today is included only when it is a Friday.",
    };
  }

  if (kind === "weekends") {
    return {
      title: `How many weekends are left in ${year}?`,
      description: `There are ${count} weekends left in ${year}. See how they are distributed across the remaining months.`,
      lead: `There are ${count} weekends remaining from today through the end of ${year}.`,
      countLabel: count === 1 ? "Weekend left" : "Weekends left",
      detailLine: "The current weekend is included when today is Saturday or Sunday",
      howItWorks:
        "Each remaining Saturday represents one weekend. If today is Sunday, the current weekend is also included even though its Saturday has already passed.",
    };
  }

  return {
    title: `How many working days are left in ${year}?`,
    description: `There are ${count} Monday-to-Friday working days left in ${year} before public holidays are removed.`,
    lead: `There are ${count} Monday-to-Friday weekdays remaining from today through December 31, ${year}.`,
    countLabel: count === 1 ? "Working day left" : "Working days left",
    detailLine: "Monday to Friday; public holidays are not removed",
    howItWorks:
      "This headline count includes Monday through Friday and includes today when today is a weekday. Public holidays vary by country and region, so they are not removed from this universal total.",
  };
}

export function getYearPlanningData(
  kind: YearPlanningKind,
  now: Date = new Date(),
): YearPlanningData {
  const today = toUtcDateOnly(now);
  const year = now.getFullYear();
  const end = new Date(Date.UTC(year, 11, 31));
  const currentSunday = kind === "weekends" && today.getUTCDay() === 0;
  const count = countForKind(kind, today, end, currentSunday);
  const copy = getCopy(kind, year, count);
  const countdownTarget = new Date(year, 11, 31, 23, 59, 59, 999);

  return {
    kind,
    year,
    ...copy,
    count,
    monthRows: getMonthRows(kind, now),
    countdown: getCountdown(countdownTarget, now),
    relatedLinks: (Object.entries(yearPlanningPaths) as Array<[YearPlanningKind, string]>)
      .filter(([relatedKind]) => relatedKind !== kind)
      .map(([relatedKind, href]) => ({
        href,
        label:
          relatedKind === "fridays"
            ? "Fridays left this year"
            : relatedKind === "weekends"
              ? "Weekends left this year"
              : "Working days left this year",
      })),
  };
}
