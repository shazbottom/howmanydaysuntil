import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoCountdownPage } from "../../../components/SeoCountdownPage";
import { seoHubEvents } from "../../../data/seoHubEvents";
import { formatFullDate } from "../../../lib/dateFormat";
import { resolveSeoHubEventCountdown } from "../../../lib/seoHubEventResolver";
import { getSeoHubRelatedLinks } from "../../../lib/seoHubRelatedLinks";

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
  const imageUrl = `/days-until/${event.slug}/opengraph-image`;
  const title = `How Many Days Until ${event.name} ${targetYear}? (Live Countdown)`;

  return {
    title,
    description,
    alternates: {
      canonical: `/days-until/${event.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/days-until/${event.slug}`,
      type: "website",
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
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
  const relatedEvents = getSeoHubRelatedLinks(event);
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
