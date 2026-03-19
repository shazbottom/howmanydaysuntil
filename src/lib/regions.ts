import type { CountryCode } from "./countries";

export interface RegionDefinition {
  countryCode: CountryCode;
  regionCode: string;
  slug: string;
  displayName: string;
  timezone: string;
  seoName?: string;
}

export const regions: RegionDefinition[] = [
  { countryCode: "au", regionCode: "act", slug: "act", displayName: "Australian Capital Territory", timezone: "Australia/Sydney" },
  { countryCode: "au", regionCode: "nsw", slug: "nsw", displayName: "New South Wales", timezone: "Australia/Sydney" },
  { countryCode: "au", regionCode: "nt", slug: "nt", displayName: "Northern Territory", timezone: "Australia/Darwin" },
  { countryCode: "au", regionCode: "qld", slug: "qld", displayName: "Queensland", timezone: "Australia/Brisbane" },
  { countryCode: "au", regionCode: "sa", slug: "sa", displayName: "South Australia", timezone: "Australia/Adelaide" },
  { countryCode: "au", regionCode: "tas", slug: "tas", displayName: "Tasmania", timezone: "Australia/Hobart" },
  { countryCode: "au", regionCode: "vic", slug: "vic", displayName: "Victoria", timezone: "Australia/Melbourne" },
  { countryCode: "au", regionCode: "wa", slug: "wa", displayName: "Western Australia", timezone: "Australia/Perth" },
  { countryCode: "ca", regionCode: "ab", slug: "ab", displayName: "Alberta", timezone: "America/Edmonton" },
  { countryCode: "ca", regionCode: "bc", slug: "bc", displayName: "British Columbia", timezone: "America/Vancouver" },
  { countryCode: "ca", regionCode: "on", slug: "on", displayName: "Ontario", timezone: "America/Toronto" },
  { countryCode: "ca", regionCode: "qc", slug: "qc", displayName: "Quebec", timezone: "America/Toronto" },
  { countryCode: "nz", regionCode: "auckland", slug: "auckland", displayName: "Auckland", timezone: "Pacific/Auckland" },
  { countryCode: "nz", regionCode: "canterbury", slug: "canterbury", displayName: "Canterbury", timezone: "Pacific/Auckland" },
  { countryCode: "nz", regionCode: "wellington", slug: "wellington", displayName: "Wellington", timezone: "Pacific/Auckland" },
  { countryCode: "uk", regionCode: "england", slug: "england", displayName: "England", timezone: "Europe/London" },
  { countryCode: "uk", regionCode: "northern-ireland", slug: "northern-ireland", displayName: "Northern Ireland", timezone: "Europe/London" },
  { countryCode: "uk", regionCode: "scotland", slug: "scotland", displayName: "Scotland", timezone: "Europe/London" },
  { countryCode: "uk", regionCode: "wales", slug: "wales", displayName: "Wales", timezone: "Europe/London" },
];

export function getRegionsForCountry(countryCode: CountryCode): RegionDefinition[] {
  return regions.filter((region) => region.countryCode === countryCode);
}

export function getRegionByCountryAndSlug(
  countryCode: CountryCode,
  slug: string,
): RegionDefinition | null {
  return getRegionsForCountry(countryCode).find((region) => region.slug === slug) ?? null;
}
