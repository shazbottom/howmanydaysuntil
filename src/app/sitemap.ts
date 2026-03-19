import type { MetadataRoute } from "next";
import { seoHubEvents } from "../data/seoHubEvents";
import {
  getExactDateRoutePath,
  getExactDateStaticParams,
} from "../lib/exactDatePages";
import { countries } from "../lib/countries";
import {
  getLocalizedEventCanonicalPath,
  getLocalizedEventsForCountry,
} from "../lib/events";
import { regions } from "../lib/regions";
import { getAllRegionEventStaticParams } from "../lib/regionPages";
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

  const localizedRegionHubPages: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${SITE_URL}/${region.countryCode}/${region.slug}`,
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  const localizedRegionalEventPages: MetadataRoute.Sitemap = countries.flatMap((country) =>
    getLocalizedEventsForCountry(country.code)
      .filter((event) => event.canonicalStrategy === "self")
      .map((event) => ({
        url: `${SITE_URL}${getLocalizedEventCanonicalPath(country.code, event)}`,
        changeFrequency: "daily" as const,
        priority: 0.75,
      })),
  );

  const localizedRegionEventPages: MetadataRoute.Sitemap = countries.flatMap((country) =>
    getAllRegionEventStaticParams(country.code).map((params) => ({
      url: `${SITE_URL}/${country.code}/${params.region}/days-until/${params.event}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
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
    ...localizedRegionHubPages,
    ...localizedRegionalEventPages,
    ...localizedRegionEventPages,
  ];
}
