import type { Metadata } from "next";
import type { SeoHubEventDefinition } from "../data/seoHubEvents";
import type { CountdownResult } from "./countdown";
import { formatFullDate } from "./dateFormat";
import { getSeoLandingPath } from "./seoLandingPages";

function isRecurringEvent(event: SeoHubEventDefinition): boolean {
  return event.category === "weekday" || event.category === "weekend";
}

function getEventLabel(event: SeoHubEventDefinition, targetDate: Date): string {
  if (isRecurringEvent(event) || event.category === "year") {
    return event.name;
  }

  const targetYear = targetDate.getFullYear();
  return event.name.includes(String(targetYear))
    ? event.name
    : `${event.name} ${targetYear}`;
}

function getTimingSentence(event: SeoHubEventDefinition, countdown: CountdownResult): string {
  if (countdown.daysRemaining === 0) {
    return `${event.name} is today.`;
  }

  return `${event.name} is in ${countdown.daysRemaining} ${
    countdown.daysRemaining === 1 ? "day" : "days"
  }.`;
}

export function getSeoHubLandingLead(
  event: SeoHubEventDefinition,
  targetDate: Date,
  countdown: CountdownResult,
): string {
  if (!isRecurringEvent(event)) {
    return (
      event.seoDescription ||
      `${event.name} ${targetDate.getFullYear()} falls on ${formatFullDate(targetDate, "en-US")}.`
    );
  }

  return `${getTimingSentence(event, countdown)} The next occurrence falls on ${formatFullDate(
    targetDate,
    "en-US",
  )}, and this live countdown updates automatically each week.`;
}

export function buildSeoHubLandingMetadata(
  event: SeoHubEventDefinition,
  targetDate: Date,
  countdown: CountdownResult,
): Metadata {
  const eventLabel = getEventLabel(event, targetDate);
  const title = `How Many Days Until ${eventLabel}? | Live Countdown`;
  const description = isRecurringEvent(event)
    ? `${getTimingSentence(event, countdown)} See the next date and live countdown, then compare business days using a selected holiday calendar.`
    : `${countdown.daysRemaining} days until ${eventLabel}, on ${formatFullDate(targetDate, "en-US")}. See the live countdown and compare business-day estimates.`;
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
