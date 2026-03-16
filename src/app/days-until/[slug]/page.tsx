import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoCountdownPage } from "../../../components/SeoCountdownPage";
import { findSeoHubEventBySlug, seoHubEvents } from "../../../data/seoHubEvents";
import { formatFullDate } from "../../../lib/dateFormat";
import { resolveSeoHubEventCountdown } from "../../../lib/seoHubEventResolver";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return seoHubEvents
    .filter((event) => event.indexable)
    .map((event) => ({
    slug: event.slug,
    }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedCountdown = resolveSeoHubEventCountdown(slug);

  if (!resolvedCountdown) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const { event, targetDate, countdown } = resolvedCountdown;
  const targetYear = targetDate.getFullYear();
  const description = `There are ${countdown.daysRemaining} days until ${event.name} ${targetYear}. See a live countdown including weeks, hours, and minutes remaining.`;

  return {
    title: `How Many Days Until ${event.name} ${targetYear}? (Live Countdown)`,
    description,
    alternates: {
      canonical: `/days-until/${event.slug}`,
    },
    openGraph: {
      title: `How Many Days Until ${event.name} ${targetYear}? (Live Countdown)`,
      description,
      url: `/days-until/${event.slug}`,
      type: "website",
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const resolvedCountdown = resolveSeoHubEventCountdown(slug);

  if (!resolvedCountdown) {
    notFound();
  }

  const { event, countdown, targetDate } = resolvedCountdown;
  const relatedEvents = event.relatedEventSlugs
    .map((relatedSlug) => findSeoHubEventBySlug(relatedSlug))
    .filter((relatedEvent) => relatedEvent !== undefined)
    .slice(0, 36)
    .map((relatedEvent) => ({
      href: `/days-until/${relatedEvent.slug}`,
      label: `Days until ${relatedEvent.name}`,
    }));
  const eyebrow =
    event.category === "season"
      ? "Season countdown"
      : event.category === "year"
        ? "Year countdown"
        : event.category === "weekday" || event.category === "weekend"
          ? "Recurring countdown"
          : "Event countdown";
  const lead = `${event.name} ${targetDate.getFullYear()} falls on ${formatFullDate(targetDate, "en-US")}.`;

  return (
    <SeoCountdownPage
      eyebrow={eyebrow}
      title={`How many days until ${event.name}?`}
      lead={event.seoDescription || lead}
      countdownLabel={event.name}
      countdown={countdown}
      supportingCopy={event.supportingCopy}
      relatedLinks={relatedEvents}
    />
  );
}
