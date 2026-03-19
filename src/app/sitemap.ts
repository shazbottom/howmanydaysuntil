import type { MetadataRoute } from "next";
import { seoHubEvents } from "../data/seoHubEvents";
import {
  getExactDateRoutePath,
  getExactDateStaticParams,
} from "../lib/exactDatePages";
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

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...hubPages,
    ...datePages,
  ];
}
