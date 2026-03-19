import type { MetadataRoute } from "next";
import { seoHubEvents } from "../data/seoHubEvents";
import {
  getExactDateRoutePath,
  getExactDateStaticParams,
} from "../lib/exactDatePages";
import { countries } from "../lib/countries";
import { getLocalizedEventsForCountry } from "../lib/events";
import { getSeoLandingPath } from "../lib/seoLandingPages";

const SITE_URL = "https://daysuntil.is";

export default function sitemap(): MetadataRoute.Sitemap {
  const hubPages: MetadataRoute.Sitemap = seoHubEvents
    .filter((event) => event.indexable)
    .map((event) => ({
      url: `${SITE_URL}${getSeoLandingPath(event.slug)}`,
    changeFrequency: "daily",
      priority: event.category === "holiday" ? 0.9 : 0.8,
    }));

  const datePages: MetadataRoute.Sitemap = getExactDateStaticParams().map((params) => ({
    url: `${SITE_URL}${getExactDateRoutePath(
      new Date(Number(params.year), Number(params.month) - 1, Number(params.day)),
    )}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const localizedCountryPages: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${SITE_URL}/${country.code}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const localizedEventPages: MetadataRoute.Sitemap = countries.flatMap((country) =>
    getLocalizedEventsForCountry(country.code).map((event) => ({
      url: `${SITE_URL}/${country.code}/days-until/${event.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
  );

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...hubPages,
    ...datePages,
    ...localizedCountryPages,
    ...localizedEventPages,
  ];
}
