import type { SeoHubEventDefinition } from "../data/seoHubEvents";
import { formatFullDate } from "./dateFormat";
import { resolveSeoHubEventDate } from "./seoHubEventResolver";

export interface SeoHubOccurrenceRow {
  year: number;
  dateLabel: string;
  dayOfWeek: string;
}

export interface SeoHubFaqItem {
  question: string;
  answer: string;
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

export function getSeoHubOccurrenceRows(
  event: SeoHubEventDefinition,
  now: Date,
  rowCount = 4,
): SeoHubOccurrenceRow[] {
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
        dateLabel: formatFullDate(targetDate, "en-US"),
        dayOfWeek: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(targetDate),
      },
    ];
  }

  const firstOccurrence = resolveSeoHubEventDate(event, now);

  if (!firstOccurrence) {
    return [];
  }

  const rows: SeoHubOccurrenceRow[] = [];
  let year = firstOccurrence.getFullYear();

  while (rows.length < rowCount) {
    const occurrence = getOccurrenceForYear(event, year);

    if (occurrence) {
      rows.push({
        year,
        dateLabel: formatFullDate(occurrence, "en-US"),
        dayOfWeek: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(occurrence),
      });
    }

    year += 1;
  }

  return rows;
}

export function getSeoHubFaqs(
  event: SeoHubEventDefinition,
  targetDate: Date,
): SeoHubFaqItem[] {
  const fullTargetDate = formatFullDate(targetDate, "en-US");

  if (event.category === "year") {
    return [
      {
        question: `When does ${event.name} begin?`,
        answer: `${event.name} begins on ${fullTargetDate}. This countdown tracks the start of that calendar year.`,
      },
      {
        question: `Why would someone count down to ${event.name}?`,
        answer: `${event.name} countdowns are useful for long-range planning, deadlines, travel planning, and milestone events tied to that year.`,
      },
      {
        question: `Is ${event.name} a recurring annual page?`,
        answer: `No. ${event.name} points to one fixed date rather than a recurring holiday or weekday rule.`,
      },
    ];
  }

  if (event.recurrence.recurrenceType === "weekday-recurring") {
    return [
      {
        question: `When is the next ${event.name}?`,
        answer: `The next ${event.name} shown on this page falls on ${fullTargetDate}. Because ${event.name} recurs weekly, the countdown always updates to the next upcoming occurrence.`,
      },
      {
        question: `Does ${event.name} happen on the same calendar date every year?`,
        answer: `No. ${event.name} is a recurring weekday, so the exact calendar date changes every week rather than being fixed to one annual date.`,
      },
      {
        question: `What is this ${event.name} countdown useful for?`,
        answer: `People often use a ${event.name} countdown for work schedules, weekly routines, travel planning, and social plans.`,
      },
    ];
  }

  const recurrenceAnswer =
    event.recurrence.recurrenceType === "fixed-annual-date" ||
    event.recurrence.recurrenceType === "season-approximate"
      ? `${event.name} falls on the same calendar date each year, so the next occurrence shown here is ${fullTargetDate}.`
      : `${event.name} does not fall on the same calendar date every year. The next occurrence shown here is ${fullTargetDate}.`;

  return [
    {
      question: `When is ${event.name}?`,
      answer: `The next ${event.name} falls on ${fullTargetDate}.`,
    },
    {
      question: `Does ${event.name} fall on the same date every year?`,
      answer: recurrenceAnswer,
    },
    {
      question: `Why use a live countdown for ${event.name}?`,
      answer: `A live countdown gives a quick answer in days, hours, and minutes so you can plan travel, celebrations, deadlines, and reminders around ${event.name}.`,
    },
  ];
}
