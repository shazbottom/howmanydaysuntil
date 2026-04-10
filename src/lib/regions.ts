import type { CountryCode } from "./countries";

export interface RegionDefinition {
  id: string;
  countryCode: CountryCode;
  slug: string;
  legacySlugs?: string[];
  name: string;
  shortName?: string;
  timezone: string;
  seoName?: string;
}

export interface ResolvedRegionMatch {
  region: RegionDefinition;
  isLegacyMatch: boolean;
  matchedSlug: string;
}

export const regions: RegionDefinition[] = [
  {
    id: "au-act",
    countryCode: "au",
    slug: "australian-capital-territory",
    legacySlugs: ["act"],
    name: "Australian Capital Territory",
    shortName: "ACT",
    timezone: "Australia/Sydney",
  },
  {
    id: "au-nsw",
    countryCode: "au",
    slug: "new-south-wales",
    legacySlugs: ["nsw"],
    name: "New South Wales",
    shortName: "NSW",
    timezone: "Australia/Sydney",
  },
  {
    id: "au-nt",
    countryCode: "au",
    slug: "northern-territory",
    legacySlugs: ["nt"],
    name: "Northern Territory",
    shortName: "NT",
    timezone: "Australia/Darwin",
  },
  {
    id: "au-qld",
    countryCode: "au",
    slug: "queensland",
    legacySlugs: ["qld"],
    name: "Queensland",
    shortName: "QLD",
    timezone: "Australia/Brisbane",
  },
  {
    id: "au-sa",
    countryCode: "au",
    slug: "south-australia",
    legacySlugs: ["sa"],
    name: "South Australia",
    shortName: "SA",
    timezone: "Australia/Adelaide",
  },
  {
    id: "au-tas",
    countryCode: "au",
    slug: "tasmania",
    legacySlugs: ["tas"],
    name: "Tasmania",
    shortName: "TAS",
    timezone: "Australia/Hobart",
  },
  {
    id: "au-vic",
    countryCode: "au",
    slug: "victoria",
    legacySlugs: ["vic"],
    name: "Victoria",
    shortName: "VIC",
    timezone: "Australia/Melbourne",
  },
  {
    id: "au-wa",
    countryCode: "au",
    slug: "western-australia",
    legacySlugs: ["wa"],
    name: "Western Australia",
    shortName: "WA",
    timezone: "Australia/Perth",
  },
  {
    id: "ca-ab",
    countryCode: "ca",
    slug: "alberta",
    legacySlugs: ["ab"],
    name: "Alberta",
    shortName: "AB",
    timezone: "America/Edmonton",
  },
  {
    id: "ca-bc",
    countryCode: "ca",
    slug: "british-columbia",
    legacySlugs: ["bc"],
    name: "British Columbia",
    shortName: "BC",
    timezone: "America/Vancouver",
  },
  {
    id: "ca-on",
    countryCode: "ca",
    slug: "ontario",
    legacySlugs: ["on"],
    name: "Ontario",
    shortName: "ON",
    timezone: "America/Toronto",
  },
  {
    id: "ca-qc",
    countryCode: "ca",
    slug: "quebec",
    legacySlugs: ["qc"],
    name: "Quebec",
    shortName: "QC",
    timezone: "America/Toronto",
  },
  {
    id: "nz-auckland",
    countryCode: "nz",
    slug: "auckland",
    name: "Auckland",
    timezone: "Pacific/Auckland",
  },
  {
    id: "nz-canterbury",
    countryCode: "nz",
    slug: "canterbury",
    name: "Canterbury",
    timezone: "Pacific/Auckland",
  },
  {
    id: "nz-wellington",
    countryCode: "nz",
    slug: "wellington",
    name: "Wellington",
    timezone: "Pacific/Auckland",
  },
  {
    id: "uk-england",
    countryCode: "uk",
    slug: "england",
    name: "England",
    timezone: "Europe/London",
  },
  {
    id: "uk-northern-ireland",
    countryCode: "uk",
    slug: "northern-ireland",
    name: "Northern Ireland",
    shortName: "NI",
    timezone: "Europe/London",
  },
  {
    id: "uk-scotland",
    countryCode: "uk",
    slug: "scotland",
    name: "Scotland",
    timezone: "Europe/London",
  },
  {
    id: "uk-wales",
    countryCode: "uk",
    slug: "wales",
    name: "Wales",
    timezone: "Europe/London",
  },
  {
    id: "us-ca",
    countryCode: "us",
    slug: "california",
    shortName: "CA",
    name: "California",
    timezone: "America/Los_Angeles",
  },
  {
    id: "us-az",
    countryCode: "us",
    slug: "arizona",
    shortName: "AZ",
    name: "Arizona",
    timezone: "America/Phoenix",
  },
  {
    id: "us-fl",
    countryCode: "us",
    slug: "florida",
    shortName: "FL",
    name: "Florida",
    timezone: "America/New_York",
  },
  {
    id: "us-ga",
    countryCode: "us",
    slug: "georgia",
    shortName: "GA",
    name: "Georgia",
    timezone: "America/New_York",
  },
  {
    id: "us-il",
    countryCode: "us",
    slug: "illinois",
    shortName: "IL",
    name: "Illinois",
    timezone: "America/Chicago",
  },
  {
    id: "us-ma",
    countryCode: "us",
    slug: "massachusetts",
    shortName: "MA",
    name: "Massachusetts",
    timezone: "America/New_York",
  },
  {
    id: "us-mi",
    countryCode: "us",
    slug: "michigan",
    shortName: "MI",
    name: "Michigan",
    timezone: "America/Detroit",
  },
  {
    id: "us-nj",
    countryCode: "us",
    slug: "new-jersey",
    shortName: "NJ",
    name: "New Jersey",
    timezone: "America/New_York",
  },
  {
    id: "us-nc",
    countryCode: "us",
    slug: "north-carolina",
    shortName: "NC",
    name: "North Carolina",
    timezone: "America/New_York",
  },
  {
    id: "us-ny",
    countryCode: "us",
    slug: "new-york",
    shortName: "NY",
    name: "New York",
    timezone: "America/New_York",
  },
  {
    id: "us-oh",
    countryCode: "us",
    slug: "ohio",
    shortName: "OH",
    name: "Ohio",
    timezone: "America/New_York",
  },
  {
    id: "us-pa",
    countryCode: "us",
    slug: "pennsylvania",
    shortName: "PA",
    name: "Pennsylvania",
    timezone: "America/New_York",
  },
  {
    id: "us-tx",
    countryCode: "us",
    slug: "texas",
    shortName: "TX",
    name: "Texas",
    timezone: "America/Chicago",
  },
  {
    id: "us-va",
    countryCode: "us",
    slug: "virginia",
    shortName: "VA",
    name: "Virginia",
    timezone: "America/New_York",
  },
  {
    id: "us-wa",
    countryCode: "us",
    slug: "washington",
    shortName: "WA",
    name: "Washington",
    timezone: "America/Los_Angeles",
  },
  {
    id: "us-tn",
    countryCode: "us",
    slug: "tennessee",
    shortName: "TN",
    name: "Tennessee",
    timezone: "America/Chicago",
  },
  {
    id: "us-in",
    countryCode: "us",
    slug: "indiana",
    shortName: "IN",
    name: "Indiana",
    timezone: "America/Indiana/Indianapolis",
  },
  {
    id: "us-mo",
    countryCode: "us",
    slug: "missouri",
    shortName: "MO",
    name: "Missouri",
    timezone: "America/Chicago",
  },
  {
    id: "us-md",
    countryCode: "us",
    slug: "maryland",
    shortName: "MD",
    name: "Maryland",
    timezone: "America/New_York",
  },
  {
    id: "us-wi",
    countryCode: "us",
    slug: "wisconsin",
    shortName: "WI",
    name: "Wisconsin",
    timezone: "America/Chicago",
  },
  {
    id: "us-co",
    countryCode: "us",
    slug: "colorado",
    shortName: "CO",
    name: "Colorado",
    timezone: "America/Denver",
  },
  {
    id: "us-mn",
    countryCode: "us",
    slug: "minnesota",
    shortName: "MN",
    name: "Minnesota",
    timezone: "America/Chicago",
  },
  {
    id: "us-al",
    countryCode: "us",
    slug: "alabama",
    shortName: "AL",
    name: "Alabama",
    timezone: "America/Chicago",
  },
  {
    id: "us-sc",
    countryCode: "us",
    slug: "south-carolina",
    shortName: "SC",
    name: "South Carolina",
    timezone: "America/New_York",
  },
  {
    id: "us-la",
    countryCode: "us",
    slug: "louisiana",
    shortName: "LA",
    name: "Louisiana",
    timezone: "America/Chicago",
  },
  {
    id: "us-or",
    countryCode: "us",
    slug: "oregon",
    shortName: "OR",
    name: "Oregon",
    timezone: "America/Los_Angeles",
  },
  {
    id: "us-nv",
    countryCode: "us",
    slug: "nevada",
    shortName: "NV",
    name: "Nevada",
    timezone: "America/Los_Angeles",
  },
  {
    id: "us-ky",
    countryCode: "us",
    slug: "kentucky",
    shortName: "KY",
    name: "Kentucky",
    timezone: "America/New_York",
  },
  {
    id: "us-ok",
    countryCode: "us",
    slug: "oklahoma",
    shortName: "OK",
    name: "Oklahoma",
    timezone: "America/Chicago",
  },
  {
    id: "us-ar",
    countryCode: "us",
    slug: "arkansas",
    shortName: "AR",
    name: "Arkansas",
    timezone: "America/Chicago",
  },
  {
    id: "us-ut",
    countryCode: "us",
    slug: "utah",
    shortName: "UT",
    name: "Utah",
    timezone: "America/Denver",
  },
  {
    id: "us-ia",
    countryCode: "us",
    slug: "iowa",
    shortName: "IA",
    name: "Iowa",
    timezone: "America/Chicago",
  },
  {
    id: "us-ks",
    countryCode: "us",
    slug: "kansas",
    shortName: "KS",
    name: "Kansas",
    timezone: "America/Chicago",
  },
  {
    id: "us-ms",
    countryCode: "us",
    slug: "mississippi",
    shortName: "MS",
    name: "Mississippi",
    timezone: "America/Chicago",
  },
  {
    id: "us-ne",
    countryCode: "us",
    slug: "nebraska",
    shortName: "NE",
    name: "Nebraska",
    timezone: "America/Chicago",
  },
];

export function getRegionId(region: Pick<RegionDefinition, "id">): string {
  return region.id;
}

export function getRegionsForCountry(countryCode: CountryCode): RegionDefinition[] {
  return regions.filter((region) => region.countryCode === countryCode);
}

export function resolveRegionByCountryAndSlug(
  countryCode: CountryCode,
  slug: string,
): ResolvedRegionMatch | null {
  const canonicalMatch = getRegionsForCountry(countryCode).find((region) => region.slug === slug);

  if (canonicalMatch) {
    return {
      region: canonicalMatch,
      isLegacyMatch: false,
      matchedSlug: slug,
    };
  }

  const legacyMatch = getRegionsForCountry(countryCode).find(
    (region) => region.legacySlugs?.includes(slug) === true,
  );

  if (!legacyMatch) {
    return null;
  }

  return {
    region: legacyMatch,
    isLegacyMatch: true,
    matchedSlug: slug,
  };
}

export function getRegionByCountryAndSlug(
  countryCode: CountryCode,
  slug: string,
): RegionDefinition | null {
  return resolveRegionByCountryAndSlug(countryCode, slug)?.region ?? null;
}

export function getRegionById(regionId: string): RegionDefinition | null {
  return regions.find((region) => region.id === regionId) ?? null;
}

export function buildRegionUrl(region: Pick<RegionDefinition, "countryCode" | "slug">): string {
  return `/${region.countryCode}/${region.slug}`;
}

export function buildRegionEventUrl(
  region: Pick<RegionDefinition, "countryCode" | "slug">,
  eventSlug: string,
): string {
  return `${buildRegionUrl(region)}/days-until/${eventSlug}`;
}
