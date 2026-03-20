import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoCountdownPage } from "../../components/SeoCountdownPage";
import { formatFullDate } from "../../lib/dateFormat";
import { resolveSeoHubEventCountdown } from "../../lib/seoHubEventResolver";
import { getSeoHubRelatedLinks } from "../../lib/seoHubRelatedLinks";
import {
  findSeoLandingEventByLandingSlug,
  getSeoLandingPath,
  seoLandingPages,
} from "../../lib/seoLandingPages";

interface LandingPageProps {
  params: Promise<{
    landing: string;
  }>;
}

export function generateStaticParams() {
  return seoLandingPages.map((page) => ({
    landing: page.landingSlug,
  }));
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { landing } = await params;
  const event = findSeoLandingEventByLandingSlug(landing);

  if (!event) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const resolvedCountdown = resolveSeoHubEventCountdown(event.slug);

  if (!resolvedCountdown) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const { targetDate, countdown } = resolvedCountdown;
  const targetYear = targetDate.getFullYear();
  const eventLabel =
    event.category === "year" || event.name.includes(String(targetYear))
      ? event.name
      : `${event.name} ${targetYear}`;
  const title = `How Many Days Until ${eventLabel}? (Live Countdown)`;
  const description = `There are ${countdown.daysRemaining} days until ${eventLabel}. See a live countdown including weeks, hours, and minutes remaining.`;
  const canonicalPath = getSeoLandingPath(event.slug);
  const ogImageUrl = `/days-until/${event.slug}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { landing } = await params;
  const event = findSeoLandingEventByLandingSlug(landing);

  if (!event) {
    notFound();
  }

  const resolvedCountdown = resolveSeoHubEventCountdown(event.slug);

  if (!resolvedCountdown) {
    notFound();
  }

  const { countdown, targetDate } = resolvedCountdown;
  const relatedEvents = getSeoHubRelatedLinks(event);
  const eyebrow =
    event.category === "year"
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
      showChristmasFlyby={event.slug === "christmas"}
    />
  );
}
