import type { CountryCode } from "./countries";
import type { RegionDefinition } from "./regions";
import { buildRegionEventUrl, getRegionById, getRegionId } from "./regions";
import { getSeoLandingPath } from "./seoLandingPages";
import { hasRegionReferenceData } from "./regionData";

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
  internalKey: string;
  slug: string;
  alternativeSlugs?: string[];
  displayName: string;
  scope: "global" | "country" | "region";
  appliesToCountries?: CountryCode[] | "all";
  appliesToRegions?: string[];
  featured?: {
    regions?: string[];
  };
  rule: LocalizedEventRule;
  canonicalStrategy: "global" | "country" | "region" | "self";
  indexable: boolean;
}

const NORTHERN_HEMISPHERE_COUNTRIES: CountryCode[] = ["ca", "uk", "us"];
const SOUTHERN_HEMISPHERE_COUNTRIES: CountryCode[] = ["au", "nz"];

function createCountrySeasonEvent(
  internalKey: string,
  slug: string,
  displayName: string,
  countries: CountryCode[],
  month: number,
  day: number,
  alternativeSlugs?: string[],
): LocalizedEventDefinition {
  return {
    internalKey,
    slug,
    alternativeSlugs,
    displayName,
    scope: "country",
    appliesToCountries: countries,
    rule: { type: "fixed-date", month, day },
    canonicalStrategy: "country",
    indexable: true,
  };
}

const countrySeasonEvents: LocalizedEventDefinition[] = [
  createCountrySeasonEvent("north-spring", "spring", "Spring", NORTHERN_HEMISPHERE_COUNTRIES, 3, 1),
  createCountrySeasonEvent("north-summer", "summer", "Summer", NORTHERN_HEMISPHERE_COUNTRIES, 6, 1),
  createCountrySeasonEvent("north-autumn", "autumn", "Autumn", ["ca", "uk"], 9, 1, ["fall"]),
  createCountrySeasonEvent("us-fall", "fall", "Fall", ["us"], 9, 1, ["autumn"]),
  createCountrySeasonEvent("north-winter", "winter", "Winter", NORTHERN_HEMISPHERE_COUNTRIES, 12, 1),
  createCountrySeasonEvent("south-autumn", "autumn", "Autumn", SOUTHERN_HEMISPHERE_COUNTRIES, 3, 1, ["fall"]),
  createCountrySeasonEvent("south-winter", "winter", "Winter", SOUTHERN_HEMISPHERE_COUNTRIES, 6, 1),
  createCountrySeasonEvent("south-spring", "spring", "Spring", SOUTHERN_HEMISPHERE_COUNTRIES, 9, 1),
  createCountrySeasonEvent("south-summer", "summer", "Summer", SOUTHERN_HEMISPHERE_COUNTRIES, 12, 1),
];

export const localizedEvents: LocalizedEventDefinition[] = [
  {
    internalKey: "global-christmas",
    slug: "christmas",
    displayName: "Christmas",
    scope: "global",
    appliesToCountries: "all",
    rule: { type: "fixed-date", month: 12, day: 25 },
    canonicalStrategy: "global",
    indexable: true,
  },
  {
    internalKey: "global-new-year",
    slug: "new-year",
    displayName: "New Year",
    scope: "global",
    appliesToCountries: "all",
    rule: { type: "fixed-date", month: 1, day: 1 },
    canonicalStrategy: "global",
    indexable: true,
  },
  {
    internalKey: "global-halloween",
    slug: "halloween",
    displayName: "Halloween",
    scope: "global",
    appliesToCountries: "all",
    rule: { type: "fixed-date", month: 10, day: 31 },
    canonicalStrategy: "global",
    indexable: true,
  },
  {
    internalKey: "au-australia-day",
    slug: "australia-day",
    displayName: "Australia Day",
    scope: "country",
    appliesToCountries: ["au"],
    rule: { type: "fixed-date", month: 1, day: 26 },
    canonicalStrategy: "country",
    indexable: true,
  },
  {
    internalKey: "au-anzac-day",
    slug: "anzac-day",
    displayName: "ANZAC Day",
    scope: "country",
    appliesToCountries: ["au"],
    rule: { type: "fixed-date", month: 4, day: 25 },
    canonicalStrategy: "country",
    indexable: true,
  },
  {
    internalKey: "uk-bonfire-night",
    slug: "bonfire-night",
    displayName: "Bonfire Night",
    scope: "country",
    appliesToCountries: ["uk"],
    rule: { type: "fixed-date", month: 11, day: 5 },
    canonicalStrategy: "country",
    indexable: true,
  },
  {
    internalKey: "uk-mothers-day",
    slug: "mothers-day",
    displayName: "Mother's Day",
    scope: "country",
    appliesToCountries: ["uk"],
    rule: { type: "easter-offset", offsetDays: -21 },
    canonicalStrategy: "country",
    indexable: true,
  },
  {
    internalKey: "us-thanksgiving",
    slug: "thanksgiving",
    displayName: "Thanksgiving",
    scope: "country",
    appliesToCountries: ["us"],
    rule: { type: "nth-weekday", month: 11, weekday: 4, occurrence: 4 },
    canonicalStrategy: "country",
    indexable: true,
  },
  {
    internalKey: "us-fathers-day",
    slug: "fathers-day",
    displayName: "Father's Day",
    scope: "country",
    appliesToCountries: ["us"],
    rule: { type: "nth-weekday", month: 6, weekday: 0, occurrence: 3 },
    canonicalStrategy: "country",
    indexable: true,
  },
  ...countrySeasonEvents,
  {
    internalKey: "au-vic-melbourne-cup",
    slug: "melbourne-cup",
    displayName: "Melbourne Cup",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-vic"],
    featured: {
      regions: ["au-vic"],
    },
    rule: { type: "nth-weekday", month: 11, weekday: 2, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-vic-labour-day",
    slug: "labour-day",
    displayName: "Labour Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-vic"],
    featured: {
      regions: ["au-vic"],
    },
    rule: { type: "nth-weekday", month: 3, weekday: 1, occurrence: 2 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-nsw-labour-day",
    slug: "labour-day",
    displayName: "Labour Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-nsw"],
    featured: {
      regions: ["au-nsw"],
    },
    rule: { type: "nth-weekday", month: 10, weekday: 1, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-qld-labour-day",
    slug: "labour-day",
    displayName: "Labour Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-qld"],
    featured: {
      regions: ["au-qld"],
    },
    rule: { type: "nth-weekday", month: 5, weekday: 1, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-sa-adelaide-cup-day",
    slug: "adelaide-cup-day",
    displayName: "Adelaide Cup Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-sa"],
    featured: {
      regions: ["au-sa"],
    },
    rule: { type: "nth-weekday", month: 3, weekday: 1, occurrence: 2 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-sa-labour-day",
    slug: "labour-day",
    displayName: "Labour Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-sa"],
    featured: {
      regions: ["au-sa"],
    },
    rule: { type: "nth-weekday", month: 10, weekday: 1, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-wa-labour-day",
    slug: "labour-day",
    displayName: "Labour Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-wa"],
    featured: {
      regions: ["au-wa"],
    },
    rule: { type: "nth-weekday", month: 3, weekday: 1, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-wa-western-australia-day",
    slug: "western-australia-day",
    displayName: "Western Australia Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-wa"],
    featured: {
      regions: ["au-wa"],
    },
    rule: { type: "nth-weekday", month: 6, weekday: 1, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-tas-eight-hours-day",
    slug: "eight-hours-day",
    displayName: "Eight Hours Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-tas"],
    featured: {
      regions: ["au-tas"],
    },
    rule: { type: "nth-weekday", month: 3, weekday: 1, occurrence: 2 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-act-canberra-day",
    slug: "canberra-day",
    displayName: "Canberra Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-act"],
    featured: {
      regions: ["au-act"],
    },
    rule: { type: "nth-weekday", month: 3, weekday: 1, occurrence: 2 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-act-reconciliation-day",
    slug: "reconciliation-day",
    displayName: "Reconciliation Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-act"],
    featured: {
      regions: ["au-act"],
    },
    rule: { type: "nth-weekday", month: 3, weekday: 1, occurrence: 3 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-act-labour-day",
    slug: "labour-day",
    displayName: "Labour Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-act"],
    featured: {
      regions: ["au-act"],
    },
    rule: { type: "nth-weekday", month: 10, weekday: 1, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-nt-may-day",
    slug: "may-day",
    displayName: "May Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-nt"],
    featured: {
      regions: ["au-nt"],
    },
    rule: { type: "nth-weekday", month: 5, weekday: 1, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
  {
    internalKey: "au-nt-picnic-day",
    slug: "picnic-day",
    displayName: "Picnic Day",
    scope: "region",
    appliesToCountries: ["au"],
    appliesToRegions: ["au-nt"],
    featured: {
      regions: ["au-nt"],
    },
    rule: { type: "nth-weekday", month: 8, weekday: 1, occurrence: 1 },
    canonicalStrategy: "self",
    indexable: true,
  },
];

function appliesToCountry(event: LocalizedEventDefinition, countryCode: CountryCode): boolean {
  return event.appliesToCountries === "all" || event.appliesToCountries?.includes(countryCode) === true;
}

function eventMatchesSlug(event: LocalizedEventDefinition, slug: string): boolean {
  return event.slug === slug || event.alternativeSlugs?.includes(slug) === true;
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

    return event.appliesToRegions?.includes(region.id) === true;
  });
}

export function getRegionEventBySlug(
  regionId: string,
  slug: string,
): LocalizedEventDefinition | null {
  const region = getRegionById(regionId);

  if (!region) {
    return null;
  }

  return getEventsForRegion(region).find((event) => event.slug === slug) ?? null;
}

export function getLocalizedEventByCountryAndSlug(
  countryCode: CountryCode,
  slug: string,
): LocalizedEventDefinition | null {
  return (
    getLocalizedEventsForCountry(countryCode).find((event) => eventMatchesSlug(event, slug)) ?? null
  );
}

export function getRegionEventByRegionAndSlug(
  region: RegionDefinition,
  slug: string,
): LocalizedEventDefinition | null {
  return getRegionEventBySlug(getRegionId(region), slug);
}

export interface CanonicalContext {
  countryCode?: CountryCode;
  region?: RegionDefinition | null;
  currentUrl?: string;
}

export function getCanonicalUrl(
  event: LocalizedEventDefinition,
  context: CanonicalContext = {},
): string {
  if (event.canonicalStrategy === "global") {
    return getSeoLandingPath(event.slug);
  }

  if (event.canonicalStrategy === "country") {
    const countryCode = context.countryCode ?? context.region?.countryCode;

    if (!countryCode) {
      return getSeoLandingPath(event.slug);
    }

    return `/${countryCode}/days-until/${event.slug}`;
  }

  if (event.canonicalStrategy === "region") {
  if (context.region) {
      return buildRegionEventUrl(context.region, event.slug);
  }

    return context.currentUrl ?? getSeoLandingPath(event.slug);
  }

  if (context.currentUrl) {
    return context.currentUrl;
  }

  if (context.region) {
    return buildRegionEventUrl(context.region, event.slug);
  }

  if (context.countryCode) {
    return `/${context.countryCode}/days-until/${event.slug}`;
  }

  return getSeoLandingPath(event.slug);
}

export function hasIndexableRegionContent(regionId: string): boolean {
  const region = getRegionById(regionId);

  if (!region) {
    return false;
  }

  const currentYear = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: region.timezone,
      year: "numeric",
    }).format(new Date()),
  );

  if (hasRegionReferenceData(regionId, currentYear)) {
    return true;
  }

  return getEventsForRegion(region).some((event) => {
    if (!event.indexable) {
      return false;
    }

    const currentUrl = `/${region.countryCode}/${region.slug}/days-until/${event.slug}`;
    return getCanonicalUrl(event, { region, currentUrl }) === currentUrl;
  });
}
