import type { MetadataRoute } from "next";
import { seoHubEvents } from "../data/seoHubEvents";
import {
  getExactDateRoutePath,
  getExactDateStaticParams,
} from "../lib/exactDatePages";
import { countries } from "../lib/countries";
import {
  getCanonicalUrl,
  getLocalizedEventsForCountry,
  getEventsForRegion,
  hasIndexableRegionContent,
} from "../lib/events";
import { getCountryHubPath, getCountryHubYearStaticParams } from "../lib/localizedPages";
import { getRegionId, regions } from "../lib/regions";
import { getRegionHubPath, getRegionHubYearStaticParams } from "../lib/regionPages";
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

  const localizedCountryYearPages: MetadataRoute.Sitemap = countries.flatMap((country) =>
    getCountryHubYearStaticParams(country.code).map((params) => ({
      url: `${SITE_URL}${getCountryHubPath(country.code, Number(params.year))}`,
      changeFrequency: "weekly" as const,
      priority: 0.68,
    })),
  );

  const localizedRegionHubPages: MetadataRoute.Sitemap = regions
    .filter((region) => hasIndexableRegionContent(getRegionId(region)))
    .map((region) => ({
      url: `${SITE_URL}/${region.countryCode}/${region.slug}`,
      changeFrequency: "weekly",
      priority: 0.65,
    }));

  const localizedRegionYearPages: MetadataRoute.Sitemap = countries.flatMap((country) =>
    getRegionHubYearStaticParams(country.code).map((params) => {
      const region = regions.find(
        (candidateRegion) =>
          candidateRegion.countryCode === country.code && candidateRegion.slug === params.region,
      );

      if (!region) {
        return [];
      }

      return [{
        url: `${SITE_URL}${getRegionHubPath(region, Number(params.year))}`,
        changeFrequency: "weekly" as const,
        priority: 0.63,
      }];
    }).flat(),
  );

  const localizedCountryEventPages: MetadataRoute.Sitemap = countries.flatMap((country) =>
    getLocalizedEventsForCountry(country.code)
      .flatMap((event) => {
        const currentUrl = `/${country.code}/days-until/${event.slug}`;
        const canonicalUrl = getCanonicalUrl(event, {
          countryCode: country.code,
          currentUrl,
        });

        if (!event.indexable || canonicalUrl !== currentUrl) {
          return [];
        }

        return [{
          url: `${SITE_URL}${currentUrl}`,
          changeFrequency: "daily" as const,
          priority: 0.75,
        }];
      }),
  );

  const localizedRegionEventPages: MetadataRoute.Sitemap = regions.flatMap((region) =>
    getEventsForRegion(region)
      .flatMap((event) => {
        const currentUrl = `/${region.countryCode}/${region.slug}/days-until/${event.slug}`;
        const canonicalUrl = getCanonicalUrl(event, {
          countryCode: region.countryCode,
          region,
          currentUrl,
        });

        if (!event.indexable || canonicalUrl !== currentUrl) {
          return [];
        }

        return [{
          url: `${SITE_URL}${currentUrl}`,
          changeFrequency: "daily" as const,
          priority: 0.7,
        }];
      }),
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
    ...localizedCountryYearPages,
    ...localizedRegionHubPages,
    ...localizedRegionYearPages,
    ...localizedCountryEventPages,
    ...localizedRegionEventPages,
  ];
}
