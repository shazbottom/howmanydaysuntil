export type EventCategory =
  | "holiday"
  | "weekday"
  | "time-period";

export type RecurrenceType =
  | "fixed-annual-date"
  | "weekday-recurring"
  | "year-start"
  | "annual-nth-weekday";

export interface FixedAnnualDateRule {
  recurrenceType: "fixed-annual-date";
  month: number;
  day: number;
}

export interface WeekdayRecurringRule {
  recurrenceType: "weekday-recurring";
  weekdays: number[];
  minimumDaysAhead?: number;
}

export interface YearStartRule {
  recurrenceType: "year-start";
  month: number;
  day: number;
}

export interface AnnualNthWeekdayRule {
  recurrenceType: "annual-nth-weekday";
  month: number;
  weekday: number;
  occurrence: number;
}

export type EventRecurrenceRule =
  | FixedAnnualDateRule
  | WeekdayRecurringRule
  | YearStartRule
  | AnnualNthWeekdayRule;

export interface EventDefinition {
  slug: string;
  name: string;
  aliases: string[];
  category: EventCategory;
  description: string;
  relatedEventSlugs: string[];
  recurrenceType: RecurrenceType;
  recurrence: EventRecurrenceRule;
}

// Seed dataset for common countdown targets used by homepage chips and future parsing.
export const events: EventDefinition[] = [
  {
    slug: "christmas",
    name: "Christmas",
    aliases: ["christmas day", "xmas", "noel"],
    category: "holiday",
    description: "Annual holiday observed on December 25.",
    relatedEventSlugs: ["new-year", "halloween"],
    recurrenceType: "fixed-annual-date",
    recurrence: {
      recurrenceType: "fixed-annual-date",
      month: 12,
      day: 25,
    },
  },
  {
    slug: "halloween",
    name: "Halloween",
    aliases: ["hallows eve", "all hallows eve"],
    category: "holiday",
    description: "Annual holiday observed on October 31.",
    relatedEventSlugs: ["christmas", "thanksgiving"],
    recurrenceType: "fixed-annual-date",
    recurrence: {
      recurrenceType: "fixed-annual-date",
      month: 10,
      day: 31,
    },
  },
  {
    slug: "new-year",
    name: "New Year",
    aliases: ["new year", "new years", "new year's day", "new years day"],
    category: "holiday",
    description: "The first day of the calendar year.",
    relatedEventSlugs: ["christmas"],
    recurrenceType: "year-start",
    recurrence: {
      recurrenceType: "year-start",
      month: 1,
      day: 1,
    },
  },
  {
    slug: "valentines-day",
    name: "Valentine's Day",
    aliases: ["valentines", "valentines day", "saint valentines day", "st valentines day"],
    category: "holiday",
    description: "Annual holiday observed on February 14.",
    relatedEventSlugs: ["christmas", "new-year"],
    recurrenceType: "fixed-annual-date",
    recurrence: {
      recurrenceType: "fixed-annual-date",
      month: 2,
      day: 14,
    },
  },
  {
    slug: "thanksgiving",
    name: "Thanksgiving",
    aliases: ["thanksgiving day", "thanksgiving holiday"],
    category: "holiday",
    description: "Annual holiday observed on the fourth Thursday of November.",
    relatedEventSlugs: ["halloween", "christmas"],
    recurrenceType: "annual-nth-weekday",
    recurrence: {
      recurrenceType: "annual-nth-weekday",
      month: 11,
      weekday: 4,
      occurrence: 4,
    },
  },
];

// Fast slug lookup for routing, parsing, and internal references.
export const eventsBySlug: Record<string, EventDefinition> = Object.fromEntries(
  events.map((event) => [event.slug, event]),
);

export function findEventBySlug(slug: string): EventDefinition | undefined {
  return eventsBySlug[slug];
}

// Matches an event by slug, canonical name, or any alias without case sensitivity.
export function findEventByNameOrAlias(
  query: string,
): EventDefinition | undefined {
  const normalizedQuery = query.trim().toLowerCase();

  return events.find((event) => {
    if (event.slug.toLowerCase() === normalizedQuery) {
      return true;
    }

    if (event.name.toLowerCase() === normalizedQuery) {
      return true;
    }

    return event.aliases.some((alias) => alias.toLowerCase() === normalizedQuery);
  });
}
