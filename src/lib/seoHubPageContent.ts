import type { SeoHubEventDefinition } from "../data/seoHubEvents";
import { formatFullDate } from "./dateFormat";
import { resolveSeoHubEventDate } from "./seoHubEventResolver";

export interface SeoHubOccurrenceRow {
  year: number;
  dateLabel: string;
  dayOfWeek: string;
}

export interface SeoHubOccurrenceTarget {
  year: number;
  date: Date;
}

function getOccurrenceForYear(
  event: SeoHubEventDefinition,
  year: number,
): Date | null {
  switch (event.recurrence.recurrenceType) {
    case "fixed-annual-date":
    case "season-approximate":
      return new Date(year, event.recurrence.month - 1, event.recurrence.day);
    case "annual-nth-weekday": {
      const firstDayOfMonth = new Date(year, event.recurrence.month - 1, 1);
      const firstWeekdayOffset =
        (event.recurrence.weekday - firstDayOfMonth.getDay() + 7) % 7;
      const dayOfMonth = 1 + firstWeekdayOffset + (event.recurrence.occurrence - 1) * 7;
      return new Date(year, event.recurrence.month - 1, dayOfMonth);
    }
    case "annual-relative-to-nth-weekday": {
      const firstDayOfMonth = new Date(year, event.recurrence.month - 1, 1);
      const firstWeekdayOffset =
        (event.recurrence.weekday - firstDayOfMonth.getDay() + 7) % 7;
      const dayOfMonth =
        1 + firstWeekdayOffset + (event.recurrence.occurrence - 1) * 7 + event.recurrence.offsetDays;
      return new Date(year, event.recurrence.month - 1, dayOfMonth);
    }
    case "easter": {
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
    case "fixed-year-date":
      return new Date(event.recurrence.year, event.recurrence.month - 1, event.recurrence.day);
    case "weekday-recurring":
      return null;
    default:
      return null;
  }
}

export function getSeoHubOccurrenceTargets(
  event: SeoHubEventDefinition,
  now: Date,
  rowCount = 5,
): SeoHubOccurrenceTarget[] {
  if (event.recurrence.recurrenceType === "weekday-recurring") {
    return [];
  }

  if (event.recurrence.recurrenceType === "fixed-year-date") {
    const targetDate = getOccurrenceForYear(event, event.recurrence.year);

    if (!targetDate) {
      return [];
    }

    return [
      {
        year: targetDate.getFullYear(),
        date: targetDate,
      },
    ];
  }

  const firstOccurrence = resolveSeoHubEventDate(event, now);

  if (!firstOccurrence) {
    return [];
  }

  const rows: SeoHubOccurrenceTarget[] = [];
  let year = firstOccurrence.getFullYear();

  while (rows.length < rowCount) {
    const occurrence = getOccurrenceForYear(event, year);

    if (occurrence) {
      rows.push({
        year,
        date: occurrence,
      });
    }

    year += 1;
  }

  return rows;
}

export function getSeoHubOccurrenceRows(
  event: SeoHubEventDefinition,
  now: Date,
  rowCount = 5,
): SeoHubOccurrenceRow[] {
  return getSeoHubOccurrenceTargets(event, now, rowCount).map((row) => ({
    year: row.year,
    dateLabel: formatFullDate(row.date, "en-US"),
    dayOfWeek: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(row.date),
  }));
}
