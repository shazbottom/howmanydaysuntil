import type { Metadata } from "next";
import { resolveEventCountdown } from "./eventCountdown";

export interface SeoEventPageConfig {
  routePath: string;
  eventSlug: string;
  title: string;
  description: string;
}

export const seoEventPages: SeoEventPageConfig[] = [
  {
    routePath: "days-until-christmas",
    eventSlug: "christmas",
    title: "How many days until Christmas? | DaysUntil",
    description: "Find out how many days until Christmas with a live countdown timer.",
  },
  {
    routePath: "days-until-halloween",
    eventSlug: "halloween",
    title: "How many days until Halloween? | DaysUntil",
    description: "Find out how many days until Halloween with a live countdown timer.",
  },
  {
    routePath: "days-until-new-year",
    eventSlug: "new-year",
    title: "How many days until New Year? | DaysUntil",
    description: "Find out how many days until New Year with a live countdown timer.",
  },
  {
    routePath: "days-until-valentines-day",
    eventSlug: "valentines-day",
    title: "How many days until Valentine's Day? | DaysUntil",
    description: "Find out how many days until Valentine's Day with a live countdown timer.",
  },
  {
    routePath: "days-until-thanksgiving",
    eventSlug: "thanksgiving",
    title: "How many days until Thanksgiving? | DaysUntil",
    description: "Find out how many days until Thanksgiving with a live countdown timer.",
  },
];

export function buildSeoEventMetadata(routePath: string): Metadata {
  const config = seoEventPages.find((page) => page.routePath === routePath);

  if (!config) {
    throw new Error(`Unknown SEO event page: ${routePath}`);
  }

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `/${config.routePath}`,
    },
  };
}

export function resolveSeoEventPage(routePath: string, now: Date = new Date()) {
  const config = seoEventPages.find((page) => page.routePath === routePath);

  if (!config) {
    return null;
  }

  const resolvedCountdown = resolveEventCountdown(config.eventSlug, now);

  if (!resolvedCountdown) {
    return null;
  }

  return {
    config,
    ...resolvedCountdown,
  };
}
