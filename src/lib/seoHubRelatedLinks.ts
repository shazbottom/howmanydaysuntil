import {
  findSeoHubEventBySlug,
  seoHubEvents,
  type SeoHubEventDefinition,
} from "../data/seoHubEvents";
import type { CountdownLinkItem } from "../components/CountdownLinkList";

const MIN_RELATED_LINKS = 4;
const MAX_RELATED_LINKS = 6;

const categoryFallbackSlugs: Record<SeoHubEventDefinition["category"], string[]> = {
  holiday: ["new-year", "winter", "halloween", "friday", "christmas"],
  season: ["christmas", "new-year", "halloween", "friday", "summer", "winter"],
  weekday: ["friday", "weekend", "saturday", "monday", "christmas", "halloween"],
  weekend: ["friday", "saturday", "sunday", "monday", "christmas", "halloween"],
  year: ["new-year", "christmas", "summer", "halloween", "friday", "2028"],
};

function uniqueEvents(events: SeoHubEventDefinition[]): SeoHubEventDefinition[] {
  const seen = new Set<string>();

  return events.filter((event) => {
    if (seen.has(event.slug)) {
      return false;
    }

    seen.add(event.slug);
    return true;
  });
}

export function getSeoHubRelatedLinks(event: SeoHubEventDefinition): CountdownLinkItem[] {
  const explicitRelatedEvents = event.relatedEventSlugs
    .map((relatedSlug) => findSeoHubEventBySlug(relatedSlug))
    .filter(
      (relatedEvent): relatedEvent is SeoHubEventDefinition =>
        relatedEvent !== undefined && relatedEvent.slug !== event.slug && relatedEvent.indexable,
    );

  const fallbackEvents = [
    ...seoHubEvents.filter(
      (candidate) =>
        candidate.category === event.category &&
        candidate.slug !== event.slug &&
        candidate.indexable,
    ),
    ...categoryFallbackSlugs[event.category]
      .map((slug) => findSeoHubEventBySlug(slug))
      .filter(
        (candidate): candidate is SeoHubEventDefinition =>
          candidate !== undefined && candidate.slug !== event.slug && candidate.indexable,
      ),
  ];

  const selectedEvents = uniqueEvents([...explicitRelatedEvents, ...fallbackEvents]).slice(
    0,
    explicitRelatedEvents.length >= MIN_RELATED_LINKS ? MAX_RELATED_LINKS : MIN_RELATED_LINKS,
  );

  return selectedEvents.map((relatedEvent) => ({
    href: `/days-until/${relatedEvent.slug}`,
    label: `Days until ${relatedEvent.name}`,
  }));
}
