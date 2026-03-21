import type { EventDefinition } from "../data/events";
import { events } from "../data/events";

const MONTH_ALIASES: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

export interface ParseMetadata {
  raw: string;
  normalized: string;
}

export interface ParsedDateValue {
  date: Date;
  isoDate: string;
}

export interface ParsedYearValue {
  year: number;
}

export interface ParsedWeekdayValue {
  weekday: number;
  label: string;
}

export interface InvalidParseResult extends ParseMetadata {
  type: "invalid";
  reason: string;
}

export interface EventParseResult extends ParseMetadata {
  type: "event";
  event: EventDefinition;
}

export interface WeekdayParseResult extends ParseMetadata {
  type: "weekday";
  value: ParsedWeekdayValue;
}

export interface YearParseResult extends ParseMetadata {
  type: "year";
  value: ParsedYearValue;
}

export interface DateParseResult extends ParseMetadata {
  type: "date";
  value: ParsedDateValue;
}

export type ParseResult =
  | EventParseResult
  | WeekdayParseResult
  | YearParseResult
  | DateParseResult
  | InvalidParseResult;

function collapseWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function normalizeInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[.,#!$%^&*;:{}=_`~()/-]/g, " ")
    .replace(/['\u2019]/g, "")
    .replace(/\s+/g, " ");
}

function stripCountdownQueryWrappers(normalized: string): string {
  return normalized
    .replace(/^how many more days (until|till|to) /, "")
    .replace(/^how many days (until|till|to) /, "")
    .replace(/^days (until|till|to) /, "")
    .replace(/^day(s)? (until|till|to) /, "")
    .replace(/^countdown to /, "")
    .trim();
}

function createInvalidResult(
  raw: string,
  normalized: string,
  reason: string,
): InvalidParseResult {
  return {
    type: "invalid",
    raw,
    normalized,
    reason,
  };
}

function createLocalDate(year: number, month: number, day: number): Date | null {
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

function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeParsedYear(yearText: string): number | null {
  if (!/^\d{2}$|^\d{4}$/.test(yearText)) {
    return null;
  }

  // Two-digit years map to 2000-2099 to keep countdown input predictable.
  if (yearText.length === 2) {
    return 2000 + Number(yearText);
  }

  const year = Number(yearText);

  if (year < 1000 || year > 9999) {
    return null;
  }

  return year;
}

function parseYear(normalized: string): ParsedYearValue | null {
  const year = normalizeParsedYear(normalized);

  if (year === null) {
    return null;
  }

  return { year };
}

function parseIsoLikeDate(input: string): ParsedDateValue | InvalidParseResult | null {
  const match = input.match(/^(\d{2}|\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = normalizeParsedYear(yearText);

  if (year === null) {
    return null;
  }

  const date = createLocalDate(year, Number(monthText), Number(dayText));

  if (!date) {
    return createInvalidResult(
      input,
      input.toLowerCase(),
      "Invalid calendar date. Check the day, month, and year values.",
    );
  }

  return {
    date,
    isoDate: formatIsoDate(date),
  };
}

function parseDayFirstNumericDate(input: string): ParsedDateValue | InvalidParseResult | null {
  const match = input.match(/^(\d{1,2})([/-])(\d{1,2})\2(\d{2}|\d{4})$/);

  if (!match) {
    return null;
  }

  const [, dayText, , monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = normalizeParsedYear(yearText);

  if (year === null) {
    return null;
  }

  // Reject purely numeric dates where both dd/mm and mm/dd are plausible.
  if (day <= 12 && month <= 12) {
    return createInvalidResult(
      input,
      input.toLowerCase(),
      "Ambiguous numeric date. Use YYYY-MM-DD or spell the month name, for example 2026-04-03 or 3 Apr 2026.",
    );
  }

  const date = createLocalDate(year, month, day);

  if (!date) {
    return createInvalidResult(
      input,
      input.toLowerCase(),
      "Invalid calendar date. Check the day, month, and year values.",
    );
  }

  return {
    date,
    isoDate: formatIsoDate(date),
  };
}

function parseDayMonthYearDate(input: string): ParsedDateValue | InvalidParseResult | null {
  const parts = input.split(" ");

  if (parts.length !== 3) {
    return null;
  }

  const [dayText, monthText, yearText] = parts;
  const month = MONTH_ALIASES[monthText];
  const year = normalizeParsedYear(yearText);

  if (!month || !/^\d{1,2}$/.test(dayText) || year === null) {
    return null;
  }

  const date = createLocalDate(year, month, Number(dayText));

  if (!date) {
    return createInvalidResult(
      input,
      input.toLowerCase(),
      "Invalid calendar date. Check the day, month, and year values.",
    );
  }

  return {
    date,
    isoDate: formatIsoDate(date),
  };
}

function parseMonthDayYearDate(input: string): ParsedDateValue | InvalidParseResult | null {
  const parts = input.split(" ");

  if (parts.length !== 3) {
    return null;
  }

  const [monthText, dayText, yearText] = parts;
  const month = MONTH_ALIASES[monthText];
  const year = normalizeParsedYear(yearText);

  if (!month || !/^\d{1,2}$/.test(dayText) || year === null) {
    return null;
  }

  const date = createLocalDate(year, month, Number(dayText));

  if (!date) {
    return createInvalidResult(
      input,
      input.toLowerCase(),
      "Invalid calendar date. Check the day, month, and year values.",
    );
  }

  return {
    date,
    isoDate: formatIsoDate(date),
  };
}

// Accepted exact date formats:
// - ISO: YYYY-MM-DD or YY-MM-DD
// - Day-first numeric: DD/MM/YYYY, DD/MM/YY, DD-MM-YYYY, and DD-MM-YY
// - Month-name: DD Mon YYYY, DD Mon YY, DD Month YYYY, Mon DD YYYY, and similar
//
// Intentionally rejected:
// - Ambiguous numeric dates where both day-first and month-first could be valid
// - Unsupported free-text or locale-dependent formats
function parseExactDate(input: string): ParsedDateValue | InvalidParseResult | null {
  const parsers = [
    parseDayFirstNumericDate,
    parseIsoLikeDate,
    parseDayMonthYearDate,
    parseMonthDayYearDate,
  ];

  for (const parser of parsers) {
    const result = parser(input);

    if (result) {
      return result;
    }
  }

  return null;
}

function resolveKnownEvent(normalized: string): EventDefinition | undefined {
  return events.find((event) => {
    if (normalizeInput(event.slug) === normalized) {
      return true;
    }

    if (normalizeInput(event.name) === normalized) {
      return true;
    }

    return event.aliases.some((alias) => normalizeInput(alias) === normalized);
  });
}

function resolveWeekdayEvent(event: EventDefinition): ParsedWeekdayValue | null {
  if (
    event.recurrenceType !== "weekday-recurring" ||
    event.recurrence.recurrenceType !== "weekday-recurring" ||
    event.recurrence.weekdays.length !== 1
  ) {
    return null;
  }

  return {
    weekday: event.recurrence.weekdays[0],
    label: event.name,
  };
}

// Converts raw user input into a structured result for event, weekday, year, or exact date handling.
export function parseInput(input: string): ParseResult {
  const raw = input;
  const collapsedInput = collapseWhitespace(input);
  const normalized = normalizeInput(collapsedInput);
  const normalizedSubject = stripCountdownQueryWrappers(normalized);

  if (!normalized) {
    return createInvalidResult(raw, normalized, "Input is empty.");
  }

  const matchedEvent = resolveKnownEvent(normalizedSubject);

  if (matchedEvent) {
    const weekdayValue = resolveWeekdayEvent(matchedEvent);

    if (weekdayValue) {
      return {
        type: "weekday",
        raw,
        normalized,
        value: weekdayValue,
      };
    }

    return {
      type: "event",
      raw,
      normalized,
      event: matchedEvent,
    };
  }

  const parsedYear = parseYear(normalizedSubject);

  if (parsedYear) {
    return {
      type: "year",
      raw,
      normalized,
      value: parsedYear,
    };
  }

  const parsedDate = parseExactDate(collapsedInput.toLowerCase());

  if (parsedDate) {
    if ("type" in parsedDate) {
      return {
        ...parsedDate,
        raw,
        normalized,
      };
    }

    return {
      type: "date",
      raw,
      normalized,
      value: parsedDate,
    };
  }

  return createInvalidResult(
    raw,
    normalized,
    "Input did not match a known event, weekday, year, or supported exact date format.",
  );
}

export const parseInputExamples: Array<{
  input: string;
  expectedType: ParseResult["type"];
}> = [
  { input: "Christmas", expectedType: "event" },
  { input: "Xmas", expectedType: "event" },
  { input: "how many days to xmas", expectedType: "event" },
  { input: "days until xmas", expectedType: "event" },
  { input: "Thanksgiving", expectedType: "event" },
  { input: "Valentines Day", expectedType: "event" },
  { input: "2027", expectedType: "year" },
  { input: "how many more days until 2027", expectedType: "year" },
  { input: "27", expectedType: "year" },
  { input: "25/12/2026", expectedType: "date" },
  { input: "25/12/26", expectedType: "date" },
  { input: "25-12-2026", expectedType: "date" },
  { input: "25 December 2026", expectedType: "date" },
  { input: "25 December 26", expectedType: "date" },
  { input: "25 Dec 2026", expectedType: "date" },
  { input: "Dec 25 2026", expectedType: "date" },
  { input: "Dec 25 26", expectedType: "date" },
  { input: "December 25 2026", expectedType: "date" },
  { input: "2026-12-25", expectedType: "date" },
  { input: "26-12-25", expectedType: "date" },
  { input: "", expectedType: "invalid" },
  { input: "03/04/2026", expectedType: "invalid" },
  { input: "03/04/26", expectedType: "invalid" },
  { input: "04-05-2026", expectedType: "invalid" },
  { input: "31/02/2026", expectedType: "invalid" },
  { input: "31/02/26", expectedType: "invalid" },
];

/*
Example checks:

parseInput("Christmas").type === "event"
parseInput("Thanksgiving").type === "event"
parseInput("2027").type === "year"
parseInput("27").type === "year"
parseInput("25/12/2026").type === "date"
parseInput("25/12/26").type === "date"
parseInput("25 December 2026").type === "date"
parseInput("03/04/2026").type === "invalid"
*/
