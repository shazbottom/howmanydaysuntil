import type { Metadata } from "next";
import { countries } from "./countries";
import { getLocalizedEventsForCountry } from "./events";

export const seasonSlugs = ["spring", "summer", "autumn", "winter"] as const;
export type SeasonSlug = (typeof seasonSlugs)[number];

export function getSeasonName(season: SeasonSlug) {
  return season === "autumn" ? "Autumn / Fall" : season[0].toUpperCase() + season.slice(1);
}

export function getSeasonChoices(season: SeasonSlug) {
  return countries.map(country => {
    const slug = season === "autumn" && country.code === "us" ? "fall" : season;
    const event = getLocalizedEventsForCountry(country.code).find(event => event.slug === slug);
    if (!event || event.rule.type !== "fixed-date") {
      throw new Error(`Missing season definition: ${country.code}/${slug}`);
    }
    return {
      country: country.name,
      hemisphere: country.code === "au" || country.code === "nz" ? "Southern" : "Northern",
      href: `/${country.code}/days-until/${slug}`,
      start: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" })
        .format(new Date(Date.UTC(2000, event.rule.month - 1, event.rule.day))),
    };
  });
}

export function getSeasonLandingMetadata(season: SeasonSlug): Metadata {
  const title = `Days Until ${getSeasonName(season)} | Choose Your Country`;
  const description = `Find your ${season} countdown for Australia, Canada, New Zealand, the UK or the US. Compare meteorological start dates in both hemispheres.`;
  const url = `/days-until-${season}`;
  return {
    title, description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
  };
}
