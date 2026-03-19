import {
  findSeoHubEventBySlug,
  seoHubEvents,
  type SeoHubEventDefinition,
} from "../data/seoHubEvents";

export interface SeoLandingPageDefinition {
  landingSlug: string;
  eventSlug: string;
}

function supportsRootLandingPage(event: SeoHubEventDefinition): boolean {
  return event.indexable && event.category !== "season";
}

export const seoLandingPages: SeoLandingPageDefinition[] = seoHubEvents
  .filter(supportsRootLandingPage)
  .map((event) => ({
    landingSlug: `days-until-${event.slug}`,
    eventSlug: event.slug,
  }));

const seoLandingPagesByLandingSlug = new Map(
  seoLandingPages.map((page) => [page.landingSlug, page]),
);

export function getSeoLandingPath(slug: string): string {
  return `/days-until-${slug}`;
}

export function findSeoLandingPageByLandingSlug(landingSlug: string): SeoLandingPageDefinition | null {
  return seoLandingPagesByLandingSlug.get(landingSlug) ?? null;
}

export function findSeoLandingEventByLandingSlug(
  landingSlug: string,
): SeoHubEventDefinition | null {
  const landingPage = findSeoLandingPageByLandingSlug(landingSlug);

  if (!landingPage) {
    return null;
  }

  return findSeoHubEventBySlug(landingPage.eventSlug) ?? null;
}
