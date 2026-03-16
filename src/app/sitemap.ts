import type { MetadataRoute } from "next";
import { seoHubEvents } from "../data/seoHubEvents";

const SITE_URL = "https://daysuntil.is";

export default function sitemap(): MetadataRoute.Sitemap {
  const hubPages: MetadataRoute.Sitemap = seoHubEvents
    .filter((event) => event.indexable)
    .map((event) => ({
      url: `${SITE_URL}/days-until/${event.slug}`,
    changeFrequency: "daily",
      priority: event.category === "holiday" || event.category === "season" ? 0.9 : 0.8,
    }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...hubPages,
  ];
}
