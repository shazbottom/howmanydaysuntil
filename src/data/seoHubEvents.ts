export type SeoHubEventCategory =
  | "holiday"
  | "season"
  | "weekday"
  | "weekend"
  | "year";

export type SeoHubRecurrenceType =
  | "fixed-annual-date"
  | "annual-nth-weekday"
  | "annual-relative-to-nth-weekday"
  | "season-approximate"
  | "weekday-recurring"
  | "fixed-year-date"
  | "easter";

export interface FixedAnnualDateRule {
  recurrenceType: "fixed-annual-date";
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

export interface SeasonApproximateRule {
  recurrenceType: "season-approximate";
  month: number;
  day: number;
  hemisphere: "northern";
}

export interface WeekdayRecurringRule {
  recurrenceType: "weekday-recurring";
  weekdays: number[];
  minimumDaysAhead?: number;
}

export interface FixedYearDateRule {
  recurrenceType: "fixed-year-date";
  year: number;
  month: number;
  day: number;
}

export interface EasterRule {
  recurrenceType: "easter";
}

export type SeoHubEventRule =
  | FixedAnnualDateRule
  | AnnualNthWeekdayRule
  | AnnualRelativeToNthWeekdayRule
  | SeasonApproximateRule
  | WeekdayRecurringRule
  | FixedYearDateRule
  | EasterRule;

export interface SeoHubEventDefinition {
  slug: string;
  name: string;
  category: SeoHubEventCategory;
  aliases: string[];
  recurrenceType: SeoHubRecurrenceType;
  recurrence: SeoHubEventRule;
  description: string;
  seoDescription: string;
  supportingCopy: string[];
  relatedEventSlugs: string[];
  indexable: boolean;
}

export const seoHubEvents: SeoHubEventDefinition[] = [
  {
    slug: "christmas",
    name: "Christmas",
    category: "holiday",
    aliases: ["christmas day", "xmas", "noel"],
    recurrenceType: "fixed-annual-date",
    recurrence: { recurrenceType: "fixed-annual-date", month: 12, day: 25 },
    description: "Annual holiday observed on December 25.",
    seoDescription: "Christmas Day is observed on December 25 each year and is one of the most widely celebrated holidays in the world.",
    supportingCopy: [
      "Christmas is celebrated on December 25 and sits at the center of the late-year holiday season for many households around the world.",
      "People often count down to Christmas for travel, celebrations, gift giving, and time spent with family and friends.",
    ],
    relatedEventSlugs: ["christmas-eve", "new-year", "halloween"],
    indexable: true,
  },
  {
    slug: "christmas-eve",
    name: "Christmas Eve",
    category: "holiday",
    aliases: ["xmas eve"],
    recurrenceType: "fixed-annual-date",
    recurrence: { recurrenceType: "fixed-annual-date", month: 12, day: 24 },
    description: "Annual holiday observed on December 24.",
    seoDescription: "Christmas Eve falls on December 24 and is often when holiday celebrations and family gatherings begin.",
    supportingCopy: [
      "Christmas Eve is the day before Christmas Day and is often used for travel, festive meals, church services, and final preparations.",
      "For many people it marks the emotional start of the Christmas period rather than just a date on the calendar.",
    ],
    relatedEventSlugs: ["christmas", "new-year", "thanksgiving"],
    indexable: true,
  },
  {
    slug: "new-year",
    name: "New Year",
    category: "holiday",
    aliases: ["new year", "new year's day", "new years day"],
    recurrenceType: "fixed-annual-date",
    recurrence: { recurrenceType: "fixed-annual-date", month: 1, day: 1 },
    description: "The first day of the calendar year.",
    seoDescription: "New Year begins on January 1 and marks the start of the next calendar year.",
    supportingCopy: [
      "New Year’s Day is the first day of the calendar year and follows New Year’s Eve celebrations around the world.",
      "It is commonly associated with resolutions, fresh starts, public holidays, and a clean reset for the year ahead.",
    ],
    relatedEventSlugs: ["christmas", "valentines-day", "2027"],
    indexable: true,
  },
  {
    slug: "halloween",
    name: "Halloween",
    category: "holiday",
    aliases: ["hallows eve", "all hallows eve"],
    recurrenceType: "fixed-annual-date",
    recurrence: { recurrenceType: "fixed-annual-date", month: 10, day: 31 },
    description: "Annual holiday observed on October 31.",
    seoDescription: "Halloween is celebrated on October 31 and is associated with costumes, trick-or-treating, and autumn events.",
    supportingCopy: [
      "Halloween arrives at the end of October and is one of the most recognizable seasonal dates in the year.",
      "Many people count down to Halloween for parties, school events, decorations, and the start of the late-year holiday run.",
    ],
    relatedEventSlugs: ["thanksgiving", "christmas", "black-friday"],
    indexable: true,
  },
  {
    slug: "valentines-day",
    name: "Valentine's Day",
    category: "holiday",
    aliases: ["valentines", "valentines day", "saint valentines day"],
    recurrenceType: "fixed-annual-date",
    recurrence: { recurrenceType: "fixed-annual-date", month: 2, day: 14 },
    description: "Annual holiday observed on February 14.",
    seoDescription: "Valentine's Day is observed on February 14 and is commonly associated with cards, flowers, and romantic gestures.",
    supportingCopy: [
      "Valentine’s Day is one of the earliest widely recognized annual occasions after New Year.",
      "People often count down to it for dinner plans, gifts, cards, flowers, and other relationship milestones.",
    ],
    relatedEventSlugs: ["new-year", "easter", "2027"],
    indexable: true,
  },
  {
    slug: "easter",
    name: "Easter",
    category: "holiday",
    aliases: ["easter sunday"],
    recurrenceType: "easter",
    recurrence: { recurrenceType: "easter" },
    description: "Movable Christian holiday observed on Easter Sunday.",
    seoDescription: "Easter is a movable Christian feast, so its date changes each year and usually falls in March or April.",
    supportingCopy: [
      "Easter does not land on the same calendar date every year, which makes it one of the most useful holidays to count down to with a live tool.",
      "It is associated with church observance, school breaks, family gatherings, and the wider spring holiday period.",
    ],
    relatedEventSlugs: ["spring", "valentines-day", "thanksgiving"],
    indexable: true,
  },
  {
    slug: "thanksgiving",
    name: "Thanksgiving",
    category: "holiday",
    aliases: ["thanksgiving day"],
    recurrenceType: "annual-nth-weekday",
    recurrence: {
      recurrenceType: "annual-nth-weekday",
      month: 11,
      weekday: 4,
      occurrence: 4,
    },
    description: "Annual holiday observed on the fourth Thursday of November.",
    seoDescription: "Thanksgiving in the United States is observed on the fourth Thursday of November.",
    supportingCopy: [
      "Thanksgiving is tied to a weekday rule rather than a fixed date, so its calendar day changes from year to year.",
      "It is closely associated with family travel, large meals, and the transition into the Christmas shopping season.",
    ],
    relatedEventSlugs: ["black-friday", "christmas", "halloween"],
    indexable: true,
  },
  {
    slug: "black-friday",
    name: "Black Friday",
    category: "holiday",
    aliases: ["black friday sale", "black friday deals"],
    recurrenceType: "annual-relative-to-nth-weekday",
    recurrence: {
      recurrenceType: "annual-relative-to-nth-weekday",
      month: 11,
      weekday: 4,
      occurrence: 4,
      offsetDays: 1,
    },
    description: "Annual shopping day observed on the Friday after Thanksgiving.",
    seoDescription: "Black Friday falls on the Friday after Thanksgiving and is widely seen as the start of the holiday shopping season.",
    supportingCopy: [
      "Because Black Friday is tied to Thanksgiving, its date changes every year rather than staying fixed on the calendar.",
      "People often count down to Black Friday for sales, product launches, and major shopping promotions.",
    ],
    relatedEventSlugs: ["thanksgiving", "christmas", "halloween"],
    indexable: true,
  },
  {
    slug: "spring",
    name: "Spring",
    category: "season",
    aliases: [],
    recurrenceType: "season-approximate",
    recurrence: {
      recurrenceType: "season-approximate",
      month: 3,
      day: 20,
      hemisphere: "northern",
    },
    description: "Approximate astronomical start of spring in the Northern Hemisphere.",
    seoDescription: "Spring begins around March 20 in the Northern Hemisphere and marks the shift into longer, brighter days.",
    supportingCopy: [
      "Spring is commonly linked with the vernal equinox, warmer weather, and the return of new growth.",
      "For many people it marks the beginning of outdoor plans, lighter evenings, and the move away from winter.",
    ],
    relatedEventSlugs: ["summer", "autumn", "winter", "easter"],
    indexable: true,
  },
  {
    slug: "summer",
    name: "Summer",
    category: "season",
    aliases: [],
    recurrenceType: "season-approximate",
    recurrence: {
      recurrenceType: "season-approximate",
      month: 6,
      day: 21,
      hemisphere: "northern",
    },
    description: "Approximate astronomical start of summer in the Northern Hemisphere.",
    seoDescription: "Summer begins around June 21 in the Northern Hemisphere and includes the longest day of the year.",
    supportingCopy: [
      "Summer is associated with the summer solstice, school holidays, travel, and long stretches of daylight.",
      "It is one of the most commonly searched seasonal countdowns for weather, events, and vacation planning.",
    ],
    relatedEventSlugs: ["spring", "autumn", "winter"],
    indexable: true,
  },
  {
    slug: "autumn",
    name: "Autumn",
    category: "season",
    aliases: ["fall"],
    recurrenceType: "season-approximate",
    recurrence: {
      recurrenceType: "season-approximate",
      month: 9,
      day: 22,
      hemisphere: "northern",
    },
    description: "Approximate astronomical start of autumn in the Northern Hemisphere.",
    seoDescription: "Autumn begins around September 22 in the Northern Hemisphere and marks the move into shorter, cooler days.",
    supportingCopy: [
      "Autumn is often associated with harvest season, falling leaves, and the autumnal equinox.",
      "It also leads into Halloween, Thanksgiving, and the final stretch of the calendar year.",
    ],
    relatedEventSlugs: ["spring", "summer", "winter", "halloween"],
    indexable: true,
  },
  {
    slug: "winter",
    name: "Winter",
    category: "season",
    aliases: [],
    recurrenceType: "season-approximate",
    recurrence: {
      recurrenceType: "season-approximate",
      month: 12,
      day: 21,
      hemisphere: "northern",
    },
    description: "Approximate astronomical start of winter in the Northern Hemisphere.",
    seoDescription: "Winter begins around December 21 in the Northern Hemisphere and includes the shortest day of the year.",
    supportingCopy: [
      "Winter starts near the winter solstice and is associated with colder weather, holiday travel, and long nights.",
      "For many people it marks the last astronomical season before the year turns again toward spring.",
    ],
    relatedEventSlugs: ["spring", "summer", "autumn", "christmas"],
    indexable: true,
  },
  {
    slug: "monday",
    name: "Monday",
    category: "weekday",
    aliases: [],
    recurrenceType: "weekday-recurring",
    recurrence: { recurrenceType: "weekday-recurring", weekdays: [1] },
    description: "Next occurrence of Monday.",
    seoDescription: "Monday is the first working day of the week for many people and returns every seven days.",
    supportingCopy: [
      "A Monday countdown is useful for work schedules, travel planning, and weekly routines that restart at the beginning of the week.",
      "Because it is recurring, the next Monday can be resolved from any day of the week without needing a fixed calendar date.",
    ],
    relatedEventSlugs: ["friday", "weekend", "saturday"],
    indexable: true,
  },
  {
    slug: "friday",
    name: "Friday",
    category: "weekday",
    aliases: [],
    recurrenceType: "weekday-recurring",
    recurrence: { recurrenceType: "weekday-recurring", weekdays: [5] },
    description: "Next occurrence of Friday.",
    seoDescription: "Friday is the final weekday in many work schedules and often marks the lead-in to the weekend.",
    supportingCopy: [
      "People frequently count down to Friday for the end of the working week, travel plans, and social events.",
      "Because Friday is recurring, the live countdown always points to the next upcoming occurrence.",
    ],
    relatedEventSlugs: ["weekend", "saturday", "monday"],
    indexable: true,
  },
  {
    slug: "saturday",
    name: "Saturday",
    category: "weekday",
    aliases: [],
    recurrenceType: "weekday-recurring",
    recurrence: { recurrenceType: "weekday-recurring", weekdays: [6] },
    description: "Next occurrence of Saturday.",
    seoDescription: "Saturday is the first full weekend day in many calendars and repeats every week.",
    supportingCopy: [
      "Saturday is commonly linked with travel, sport, family plans, and time away from work or school.",
      "A Saturday countdown is useful when you want a simple live answer for the next weekend start.",
    ],
    relatedEventSlugs: ["sunday", "weekend", "friday"],
    indexable: true,
  },
  {
    slug: "sunday",
    name: "Sunday",
    category: "weekday",
    aliases: [],
    recurrenceType: "weekday-recurring",
    recurrence: { recurrenceType: "weekday-recurring", weekdays: [0] },
    description: "Next occurrence of Sunday.",
    seoDescription: "Sunday is the final day of the weekend in many calendars and repeats every week.",
    supportingCopy: [
      "Sunday is often associated with rest, family time, sport, and preparation for the coming week.",
      "Because it is recurring, the next Sunday can be calculated from any current date without a fixed annual rule.",
    ],
    relatedEventSlugs: ["saturday", "weekend", "monday"],
    indexable: true,
  },
  {
    slug: "weekend",
    name: "Weekend",
    category: "weekend",
    aliases: [],
    recurrenceType: "weekday-recurring",
    recurrence: { recurrenceType: "weekday-recurring", weekdays: [6, 0] },
    description: "Next weekend day, resolved to Saturday or Sunday.",
    seoDescription: "Weekend countdowns point to the next Saturday or Sunday, depending on which arrives first.",
    supportingCopy: [
      "A weekend countdown is useful when you want the fastest answer to how long remains until your next break from the working week.",
      "This page resolves to the next upcoming weekend day rather than a fixed annual event.",
    ],
    relatedEventSlugs: ["friday", "saturday", "sunday"],
    indexable: true,
  },
  {
    slug: "2027",
    name: "2027",
    category: "year",
    aliases: ["year 2027"],
    recurrenceType: "fixed-year-date",
    recurrence: { recurrenceType: "fixed-year-date", year: 2027, month: 1, day: 1 },
    description: "Start of the year 2027.",
    seoDescription: "2027 begins on January 1, 2027 and represents a fixed future year countdown.",
    supportingCopy: [
      "Year countdowns are useful for planning long-term goals, deadlines, travel, and milestone events.",
      "Unlike recurring holidays, a page for 2027 points to one fixed calendar date rather than repeating annually.",
    ],
    relatedEventSlugs: ["2028", "2030", "new-year"],
    indexable: true,
  },
  {
    slug: "2028",
    name: "2028",
    category: "year",
    aliases: ["year 2028"],
    recurrenceType: "fixed-year-date",
    recurrence: { recurrenceType: "fixed-year-date", year: 2028, month: 1, day: 1 },
    description: "Start of the year 2028.",
    seoDescription: "2028 begins on January 1, 2028 and represents a fixed future year countdown.",
    supportingCopy: [
      "A countdown to 2028 is useful for multi-year planning, financial goals, and long-range project timelines.",
      "It is a one-off target date rather than a recurring annual holiday or weekday cycle.",
    ],
    relatedEventSlugs: ["2027", "2030", "new-year"],
    indexable: true,
  },
  {
    slug: "2030",
    name: "2030",
    category: "year",
    aliases: ["year 2030"],
    recurrenceType: "fixed-year-date",
    recurrence: { recurrenceType: "fixed-year-date", year: 2030, month: 1, day: 1 },
    description: "Start of the year 2030.",
    seoDescription: "2030 begins on January 1, 2030 and represents a fixed future year countdown.",
    supportingCopy: [
      "A 2030 countdown is commonly used for long-term personal or business milestones, planning horizons, and deadline tracking.",
      "It gives a simple live answer to a fixed-year target without requiring users to enter the date manually.",
    ],
    relatedEventSlugs: ["2027", "2028", "new-year"],
    indexable: true,
  },
];

export const seoHubEventsBySlug: Record<string, SeoHubEventDefinition> = Object.fromEntries(
  seoHubEvents.map((event) => [event.slug, event]),
);

export function findSeoHubEventBySlug(slug: string): SeoHubEventDefinition | undefined {
  return seoHubEventsBySlug[slug];
}
