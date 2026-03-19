import type { CountryCode } from "./countries";

export type LocalizedEventRule =
  | {
      type: "fixed-date";
      month: number;
      day: number;
    }
  | {
      type: "nth-weekday";
      month: number;
      weekday: number;
      occurrence: number;
    }
  | {
      type: "easter-offset";
      offsetDays: number;
    };

export interface LocalizedEventDefinition {
  slug: string;
  displayName: string;
  countries: CountryCode[] | "all";
  rule: LocalizedEventRule;
}

export const localizedEvents: LocalizedEventDefinition[] = [
  {
    slug: "christmas",
    displayName: "Christmas",
    countries: "all",
    rule: { type: "fixed-date", month: 12, day: 25 },
  },
  {
    slug: "new-year",
    displayName: "New Year",
    countries: "all",
    rule: { type: "fixed-date", month: 1, day: 1 },
  },
  {
    slug: "halloween",
    displayName: "Halloween",
    countries: "all",
    rule: { type: "fixed-date", month: 10, day: 31 },
  },
  {
    slug: "australia-day",
    displayName: "Australia Day",
    countries: ["au"],
    rule: { type: "fixed-date", month: 1, day: 26 },
  },
  {
    slug: "anzac-day",
    displayName: "ANZAC Day",
    countries: ["au"],
    rule: { type: "fixed-date", month: 4, day: 25 },
  },
  {
    slug: "bonfire-night",
    displayName: "Bonfire Night",
    countries: ["uk"],
    rule: { type: "fixed-date", month: 11, day: 5 },
  },
  {
    slug: "mothers-day",
    displayName: "Mother's Day",
    countries: ["uk"],
    rule: { type: "easter-offset", offsetDays: -21 },
  },
  {
    slug: "thanksgiving",
    displayName: "Thanksgiving",
    countries: ["us"],
    rule: { type: "nth-weekday", month: 11, weekday: 4, occurrence: 4 },
  },
  {
    slug: "fathers-day",
    displayName: "Father's Day",
    countries: ["us"],
    rule: { type: "nth-weekday", month: 6, weekday: 0, occurrence: 3 },
  },
];

export function getLocalizedEventsForCountry(countryCode: CountryCode): LocalizedEventDefinition[] {
  return localizedEvents.filter(
    (event) => event.countries === "all" || event.countries.includes(countryCode),
  );
}

export function getLocalizedEventByCountryAndSlug(
  countryCode: CountryCode,
  slug: string,
): LocalizedEventDefinition | null {
  return (
    getLocalizedEventsForCountry(countryCode).find((event) => event.slug === slug) ?? null
  );
}
