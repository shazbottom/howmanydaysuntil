import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountdownLinkList } from "../../components/CountdownLinkList";
import { SeoHubFactsSection } from "../../components/SeoHubFactsSection";
import { SeoCountdownPage } from "../../components/SeoCountdownPage";
import { formatFullDate } from "../../lib/dateFormat";
import { getCountdownClusterButtonsForEvent } from "../../lib/countdownClusters";
import { getSeoHubFacts } from "../../lib/seoHubFacts";
import { getSeoHubOccurrenceRows } from "../../lib/seoHubPageContent";
import { resolveSeoHubEventCountdown } from "../../lib/seoHubEventResolver";
import { getSeoHubRelatedLinks } from "../../lib/seoHubRelatedLinks";
import {
  findSeoLandingEventByLandingSlug,
  getSeoLandingPath,
  seoLandingPages,
} from "../../lib/seoLandingPages";
import {
  createBreadcrumbJsonLd,
  createEventJsonLd,
} from "../../lib/structuredData";

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
  const currentPath = getSeoLandingPath(event.slug);
  const occurrenceRows = getSeoHubOccurrenceRows(event, new Date());
  const factSet = getSeoHubFacts(event.slug);
  const clusterButtons = getCountdownClusterButtonsForEvent(event.slug);
  const eyebrow =
    event.category === "year"
      ? "Year countdown"
      : event.category === "weekday" || event.category === "weekend"
        ? "Recurring countdown"
        : "Event countdown";
  const lead = `${event.name} ${targetDate.getFullYear()} falls on ${formatFullDate(targetDate, "en-US")}.`;
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: event.name, path: currentPath },
    ]),
    createEventJsonLd({
      name: event.name,
      description: event.seoDescription || lead,
      startDate: targetDate,
      path: currentPath,
    }),
  ];

  return (
    <SeoCountdownPage
      eyebrow={eyebrow}
      title={`How many days until ${event.name}?`}
      lead={event.seoDescription || lead}
      countdownLabel={event.name}
      countdown={countdown}
      cardActionLinks={clusterButtons}
      supportingCopy={[]}
      relatedLinks={relatedEvents}
      showChristmasFlyby={event.slug === "christmas"}
      structuredData={structuredData}
      extraSection={
        <>
          {occurrenceRows.length > 0 ? (
            <section className="mt-12 w-full max-w-[31.9rem] rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem] sm:px-8">
              <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
                Next 5 years
              </h2>
              <div className="mt-5 overflow-hidden rounded-[1.15rem] border border-black/6 dark:border-white/10">
                <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.45fr)] bg-[#f3f2ee] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/48 dark:bg-[#1d1f1e] dark:text-white/50">
                  <span>Year</span>
                  <span>Date</span>
                </div>
                <div className="divide-y divide-black/6 dark:divide-white/10">
                  {occurrenceRows.map((row) => (
                    <div
                      key={`${event.slug}-${row.year}`}
                      className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.45fr)] gap-4 bg-white/55 px-4 py-2.5 text-[13px] dark:bg-white/[0.02] sm:text-sm"
                    >
                      <span className="font-medium text-black dark:text-white/88">{row.year}</span>
                      <span className="text-black/62 dark:text-white/62">{row.dateLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
          {factSet ? <SeoHubFactsSection factSet={factSet} /> : null}
          <CountdownLinkList
            title="Planning tools"
            description="Use our calculators to work out exact date differences, business days, or add and subtract dates around this event."
            links={[
              { href: "/days-between-dates", label: "Days between dates" },
              { href: "/business-days-between-dates", label: "Business days between dates" },
              { href: "/add-or-subtract-date", label: "Add or subtract date" },
            ]}
            centered
          />
        </>
      }
    />
  );
}
