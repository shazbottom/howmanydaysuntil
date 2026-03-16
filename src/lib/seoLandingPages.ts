export interface SeoLandingEvent {
  landingSlug: string;
  eventSlug: string;
}

export const seoLandingEvents: SeoLandingEvent[] = [
  {
    landingSlug: "days-until-christmas",
    eventSlug: "christmas",
  },
  {
    landingSlug: "days-until-halloween",
    eventSlug: "halloween",
  },
  {
    landingSlug: "days-until-new-year",
    eventSlug: "new-year",
  },
  {
    landingSlug: "days-until-valentines-day",
    eventSlug: "valentines-day",
  },
  {
    landingSlug: "days-until-thanksgiving",
    eventSlug: "thanksgiving",
  },
];

export const seoLandingEventBySlug: Record<string, SeoLandingEvent> =
  Object.fromEntries(
    seoLandingEvents.map((event) => [event.landingSlug, event]),
  );

export function findSeoLandingEventBySlug(slug: string): SeoLandingEvent | undefined {
  return seoLandingEventBySlug[slug];
}
