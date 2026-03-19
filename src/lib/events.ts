import type { CountryCode } from "./countries";
import type { RegionDefinition } from "./regions";
import { getSeoLandingPath } from "./seoLandingPages";

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
  scope: "global" | "country" | "region";
  appliesToCountries?: CountryCode[] | "all";
  appliesToRegions?: string[];
  rule: LocalizedEventRule;
  canonicalStrategy: "global" | "self";
}

export const localizedEvents: LocalizedEventDefinition[] = [
  {
    slug: "christmas",
    displayName: "Christmas",
    scope: "global",
    appliesToCountries: "all",
    rule: { type: "fixed-date", month: 12, day: 25 },
    canonicalStrategy: "global",
  },
  {
    slug: "new-year",
    displayName: "New Year",
    scope: "global",
    appliesToCountries: "all",
    rule: { type: "fixed-date", month: 1, day: 1 },
    canonicalStrategy: "global",
  },
  {
    slug: "halloween",
    displayName: "Halloween",
    scope: "global",
    appliesToCountries: "all",
    rule: { type: "fixed-date", month: 10, day: 31 },
    canonicalStrategy: "global",
  },
  {
    slug: "australia-day",
    displayName: "Australia Day",
    scope: "country",
    appliesToCountries: ["au"],
    rule: { type: "fixed-date", month: 1, day: 26 },
    canonicalStrategy: "self",
  },
  {
    slug: "anzac-day",
    displayName: "ANZAC Day",
    scope: "country",
    appliesToCountries: ["au"],
    rule: { type: "fixed-date", month: 4, day: 25 },
    canonicalStrategy: "self",
  },
  {
    slug: "bonfire-night",
    displayName: "Bonfire Night",
    scope: "country",
    appliesToCountries: ["uk"],
    rule: { type: "fixed-date", month: 11, day: 5 },
    canonicalStrategy: "self",
  },
  {
    slug: "mothers-day",
    displayName: "Mother's Day",
    scope: "country",
    appliesToCountries: ["uk"],
    rule: { type: "easter-offset", offsetDays: -21 },
    canonicalStrategy: "self",
  },
  {
    slug: "thanksgiving",
    displayName: "Thanksgiving",
    scope: "country",
    appliesToCountries: ["us"],
    rule: { type: "nth-weekday", month: 11, weekday: 4, occurrence: 4 },
    canonicalStrategy: "self",
  },
  {
    slug: "fathers-day",
    displayName: "Father's Day",
    scope: "country",
    appliesToCountries: ["us"],
    rule: { type: "nth-weekday", month: 6, weekday: 0, occurrence: 3 },
    canonicalStrategy: "self",
  },
];

function appliesToCountry(event: LocalizedEventDefinition, countryCode: CountryCode): boolean {
  return event.appliesToCountries === "all" || event.appliesToCountries?.includes(countryCode) === true;
}

export function getLocalizedEventsForCountry(countryCode: CountryCode): LocalizedEventDefinition[] {
  return localizedEvents.filter(
    (event) => event.scope !== "region" && appliesToCountry(event, countryCode),
  );
}

export function getEventsForCountry(countryCode: CountryCode): LocalizedEventDefinition[] {
  return getLocalizedEventsForCountry(countryCode);
}

export function getEventsForRegion(region: RegionDefinition): LocalizedEventDefinition[] {
  return localizedEvents.filter((event) => {
    if (event.scope !== "region") {
      return false;
    }

    return event.appliesToRegions?.includes(`${region.countryCode}/${region.slug}`) === true;
  });
}

export function getLocalizedEventByCountryAndSlug(
  countryCode: CountryCode,
  slug: string,
): LocalizedEventDefinition | null {
  return (
    getLocalizedEventsForCountry(countryCode).find((event) => event.slug === slug) ?? null
  );
}

export function getRegionEventByRegionAndSlug(
  region: RegionDefinition,
  slug: string,
): LocalizedEventDefinition | null {
  return getEventsForRegion(region).find((event) => event.slug === slug) ?? null;
}

export function getLocalizedEventCanonicalPath(
  countryCode: CountryCode,
  event: LocalizedEventDefinition,
): string {
  if (event.canonicalStrategy === "global") {
    return getSeoLandingPath(event.slug);
  }

  return `/${countryCode}/days-until/${event.slug}`;
}
