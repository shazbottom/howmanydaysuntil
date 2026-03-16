import type { MetadataRoute } from "next";
import { events } from "../data/events";
import { seoLandingEvents } from "../lib/seoLandingPages";

const SITE_URL = "https://daysuntil.is";

export default function sitemap(): MetadataRoute.Sitemap {
  const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/days-until/${event.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));
  const seoLandingPages: MetadataRoute.Sitemap = seoLandingEvents.map((event) => ({
    url: `${SITE_URL}/${event.landingSlug}`,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...seoLandingPages,
    ...eventPages,
  ];
}
