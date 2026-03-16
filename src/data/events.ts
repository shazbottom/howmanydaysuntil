export type EventCategory =
  | "holiday"
  | "weekday"
  | "time-period";

export type RecurrenceType =
  | "fixed-annual-date"
  | "weekday-recurring"
  | "year-start"
  | "annual-nth-weekday"
  | "annual-relative-to-nth-weekday"
  | "easter";

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

export interface AnnualRelativeToNthWeekdayRule {
  recurrenceType: "annual-relative-to-nth-weekday";
  month: number;
  weekday: number;
  occurrence: number;
  offsetDays: number;
}

export interface EasterRule {
  recurrenceType: "easter";
}

export type EventRecurrenceRule =
  | FixedAnnualDateRule
  | WeekdayRecurringRule
  | YearStartRule
  | AnnualNthWeekdayRule
  | AnnualRelativeToNthWeekdayRule
  | EasterRule;

export interface EventDefinition {
  slug: string;
  name: string;
  aliases: string[];
  category: EventCategory;
  description: string;
  seoDescription: string;
  supportingCopy: string[];
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
    seoDescription: "There are days remaining until Christmas. See the live countdown with weeks, hours, and minutes remaining.",
    supportingCopy: [
      "Christmas Day is observed on December 25 each year and is one of the most widely celebrated holidays in the world.",
      "For many people it marks the center of the holiday season, with family gatherings, gift giving, and religious observance.",
    ],
    relatedEventSlugs: ["christmas-eve", "new-year", "halloween"],
    recurrenceType: "fixed-annual-date",
    recurrence: {
      recurrenceType: "fixed-annual-date",
      month: 12,
      day: 25,
    },
  },
  {
    slug: "christmas-eve",
    name: "Christmas Eve",
    aliases: ["xmas eve", "christmas eve"],
    category: "holiday",
    description: "Annual holiday observed on December 24.",
    seoDescription: "There are days remaining until Christmas Eve. See the live countdown with weeks, hours, and minutes remaining.",
    supportingCopy: [
      "Christmas Eve falls on December 24 and is often the moment when holiday celebrations begin in earnest.",
      "Many families use the evening for travel, church services, festive meals, and final preparations before Christmas Day.",
    ],
    relatedEventSlugs: ["christmas", "new-year", "thanksgiving"],
    recurrenceType: "fixed-annual-date",
    recurrence: {
      recurrenceType: "fixed-annual-date",
      month: 12,
      day: 24,
    },
  },
  {
    slug: "halloween",
    name: "Halloween",
    aliases: ["hallows eve", "all hallows eve"],
    category: "holiday",
    description: "Annual holiday observed on October 31.",
    seoDescription: "There are days remaining until Halloween. See the live countdown with weeks, hours, and minutes remaining.",
    supportingCopy: [
      "Halloween is celebrated on October 31 and is closely associated with costumes, trick-or-treating, and autumn events.",
      "It arrives near the end of October and often marks the run-in to Thanksgiving and the winter holidays.",
    ],
    relatedEventSlugs: ["christmas", "new-year", "thanksgiving", "black-friday"],
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
    seoDescription: "There are days remaining until New Year. See the live countdown with weeks, hours, and minutes remaining.",
    supportingCopy: [
      "New Year begins on January 1 and marks the start of the next calendar year.",
      "The day follows New Year's Eve celebrations around the world and often represents fresh starts, resolutions, and public holidays.",
    ],
    relatedEventSlugs: ["christmas", "christmas-eve", "valentines-day"],
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
    seoDescription: "There are days remaining until Valentine's Day. See the live countdown with weeks, hours, and minutes remaining.",
    supportingCopy: [
      "Valentine's Day is observed on February 14 and is commonly associated with cards, flowers, and romantic gestures.",
      "It falls early in the year, making it one of the first widely recognized annual occasions after New Year.",
    ],
    relatedEventSlugs: ["new-year", "easter", "christmas"],
    recurrenceType: "fixed-annual-date",
    recurrence: {
      recurrenceType: "fixed-annual-date",
      month: 2,
      day: 14,
    },
  },
  {
    slug: "easter",
    name: "Easter",
    aliases: ["easter sunday"],
    category: "holiday",
    description: "Movable Christian holiday observed on Easter Sunday.",
    seoDescription: "There are days remaining until Easter. See the live countdown with weeks, hours, and minutes remaining.",
    supportingCopy: [
      "Easter is a movable feast in the Christian calendar, so its date changes each year and usually falls in March or April.",
      "It marks the resurrection of Jesus in Christian tradition and is also linked with spring holidays, school breaks, and family gatherings.",
    ],
    relatedEventSlugs: ["valentines-day", "thanksgiving", "christmas"],
    recurrenceType: "easter",
    recurrence: {
      recurrenceType: "easter",
    },
  },
  {
    slug: "thanksgiving",
    name: "Thanksgiving",
    aliases: ["thanksgiving day", "thanksgiving holiday"],
    category: "holiday",
    description: "Annual holiday observed on the fourth Thursday of November.",
    seoDescription: "There are days remaining until Thanksgiving. See the live countdown with weeks, hours, and minutes remaining.",
    supportingCopy: [
      "Thanksgiving in the United States is observed on the fourth Thursday of November and is centered on food, family, and travel.",
      "It also serves as the lead-in to the Christmas shopping season and late-year holiday events.",
    ],
    relatedEventSlugs: ["black-friday", "christmas", "halloween"],
    recurrenceType: "annual-nth-weekday",
    recurrence: {
      recurrenceType: "annual-nth-weekday",
      month: 11,
      weekday: 4,
      occurrence: 4,
    },
  },
  {
    slug: "black-friday",
    name: "Black Friday",
    aliases: ["black friday sale", "black friday deals"],
    category: "holiday",
    description: "Annual shopping day observed on the Friday after Thanksgiving.",
    seoDescription: "There are days remaining until Black Friday. See the live countdown with weeks, hours, and minutes remaining.",
    supportingCopy: [
      "Black Friday falls on the day after Thanksgiving in the United States and is widely treated as the opening of the holiday shopping season.",
      "It is associated with major retail discounts, online sales, and one of the busiest shopping periods of the year.",
    ],
    relatedEventSlugs: ["thanksgiving", "christmas", "halloween"],
    recurrenceType: "annual-relative-to-nth-weekday",
    recurrence: {
      recurrenceType: "annual-relative-to-nth-weekday",
      month: 11,
      weekday: 4,
      occurrence: 4,
      offsetDays: 1,
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
