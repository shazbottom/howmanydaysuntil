import { getCountdown, startOfLocalDay, type CountdownResult } from "./countdown";

export interface SeasonDefinition {
  slug: "spring" | "summer" | "autumn" | "winter";
  name: string;
  routePath: `days-until-${"spring" | "summer" | "autumn" | "winter"}`;
  month: number;
  day: number;
  description: string;
  supportingCopy: string[];
  relatedSeasonSlugs: SeasonDefinition["slug"][];
}

export interface ResolvedSeasonCountdown {
  season: SeasonDefinition;
  targetDate: Date;
  countdown: CountdownResult;
}

export const seasons: SeasonDefinition[] = [
  {
    slug: "spring",
    name: "Spring",
    routePath: "days-until-spring",
    month: 3,
    day: 20,
    description:
      "Spring begins on March 20 in the Northern Hemisphere and marks the transition into longer, brighter days.",
    supportingCopy: [
      "Spring is commonly associated with the vernal equinox, warmer weather, and the return of blossoms and new growth.",
      "For many people it signals the transition out of winter and the beginning of outdoor events, travel, and longer daylight hours.",
    ],
    relatedSeasonSlugs: ["summer", "autumn", "winter"],
  },
  {
    slug: "summer",
    name: "Summer",
    routePath: "days-until-summer",
    month: 6,
    day: 21,
    description:
      "Summer begins on June 21 in the Northern Hemisphere and marks the longest day of the year.",
    supportingCopy: [
      "Summer is linked with the summer solstice, school holidays, warm evenings, and peak travel season.",
      "For many places it marks the height of daylight, outdoor events, and long stretches of hot weather.",
    ],
    relatedSeasonSlugs: ["spring", "autumn", "winter"],
  },
  {
    slug: "autumn",
    name: "Autumn",
    routePath: "days-until-autumn",
    month: 9,
    day: 22,
    description:
      "Autumn begins on September 22 in the Northern Hemisphere and marks the gradual move into shorter, cooler days.",
    supportingCopy: [
      "Autumn is often associated with harvest season, falling leaves, and the autumnal equinox.",
      "It also leads into Halloween, Thanksgiving, and the end-of-year holiday period.",
    ],
    relatedSeasonSlugs: ["spring", "summer", "winter"],
  },
  {
    slug: "winter",
    name: "Winter",
    routePath: "days-until-winter",
    month: 12,
    day: 21,
    description:
      "Winter begins on December 21 in the Northern Hemisphere and includes the shortest day of the year.",
    supportingCopy: [
      "Winter starts near the winter solstice and is associated with colder temperatures, holiday travel, and long nights.",
      "It is the final astronomical season of the year before the calendar turns toward spring again.",
    ],
    relatedSeasonSlugs: ["spring", "summer", "autumn"],
  },
];

export function findSeasonBySlug(slug: string): SeasonDefinition | undefined {
  return seasons.find((season) => season.slug === slug);
}

function getNextSeasonDate(month: number, day: number, now: Date): Date {
  const currentYear = now.getFullYear();
  const candidate = new Date(currentYear, month - 1, day);
  const today = startOfLocalDay(now);

  if (
    candidate.getFullYear() === now.getFullYear() &&
    candidate.getMonth() === now.getMonth() &&
    candidate.getDate() === now.getDate()
  ) {
    return now;
  }

  if (candidate < today) {
    return new Date(currentYear + 1, month - 1, day);
  }

  return candidate;
}

export function resolveSeasonCountdown(
  slug: string,
  now: Date = new Date(),
): ResolvedSeasonCountdown | null {
  const season = findSeasonBySlug(slug);

  if (!season) {
    return null;
  }

  const targetDate = getNextSeasonDate(season.month, season.day, now);

  return {
    season,
    targetDate,
    countdown: getCountdown(targetDate, now),
  };
}
