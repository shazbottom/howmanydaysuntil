export type CountryCode = "au" | "uk" | "us" | "ca" | "nz";

export interface CountryDefinition {
  code: CountryCode;
  name: string;
  timezone: string;
  locale: string;
}

export const countries: CountryDefinition[] = [
  {
    code: "au",
    name: "Australia",
    timezone: "Australia/Sydney",
    locale: "en-AU",
  },
  {
    code: "ca",
    name: "Canada",
    timezone: "America/Toronto",
    locale: "en-CA",
  },
  {
    code: "nz",
    name: "New Zealand",
    timezone: "Pacific/Auckland",
    locale: "en-NZ",
  },
  {
    code: "uk",
    name: "United Kingdom",
    timezone: "Europe/London",
    locale: "en-GB",
  },
  {
    code: "us",
    name: "United States",
    timezone: "America/New_York",
    locale: "en-US",
  },
];

export const countriesByCode: Record<CountryCode, CountryDefinition> = Object.fromEntries(
  countries.map((country) => [country.code, country]),
) as Record<CountryCode, CountryDefinition>;

export function getCountryByCode(code: string): CountryDefinition | null {
  return countriesByCode[code as CountryCode] ?? null;
}
