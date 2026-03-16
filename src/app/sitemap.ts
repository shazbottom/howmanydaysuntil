import type { MetadataRoute } from "next";
import { events } from "../data/events";

const SITE_URL = "https://daysuntil.is";

export default function sitemap(): MetadataRoute.Sitemap {
  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/days-until/${event.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...eventPages,
  ];
}
