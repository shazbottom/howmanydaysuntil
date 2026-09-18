import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountdownLinkList } from "../../components/CountdownLinkList";
import { SeoHubFactsSection } from "../../components/SeoHubFactsSection";
import { SeoCountdownPage } from "../../components/SeoCountdownPage";
import { getCountdownClusterButtonsForEvent } from "../../lib/countdownClusters";
import { getCountdownActions } from "../../lib/countdownActions";
import { getSeoHubFacts } from "../../lib/seoHubFacts";
import {
  getSeoHubOccurrenceRows,
  getSeoHubRecurringDateRows,
  getOccurrenceHeading,
} from "../../lib/seoHubPageContent";
import {
  buildSeoHubLandingMetadata,
  getSeoHubLandingLead,
} from "../../lib/seoHubMetadata";
import { resolveSeoHubEventCountdown } from "../../lib/seoHubEventResolver";
import { getSeoHubRelatedLinks } from "../../lib/seoHubRelatedLinks";
import {
  findSeoLandingEventByLandingSlug,
  getSeoLandingPath,
  seoLandingPages,
} from "../../lib/seoLandingPages";
import {
  createBreadcrumbJsonLd,
  createWebPageJsonLd,
} from "../../lib/structuredData";

interface LandingPageProps {
  params: Promise<{
    landing: string;
  }>;
}

export const revalidate = 3600;

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

  return buildSeoHubLandingMetadata(
    event,
    resolvedCountdown.targetDate,
    resolvedCountdown.countdown,
  );
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
  const actions = getCountdownActions(targetDate, event.name);
  const relatedEvents = getSeoHubRelatedLinks(event);
  const currentPath = getSeoLandingPath(event.slug);
  const occurrenceRows = getSeoHubOccurrenceRows(event, new Date());
  const recurringDateRows =
    event.slug === "friday" ? getSeoHubRecurringDateRows(event, new Date()) : [];
  const factSet = getSeoHubFacts(event.slug);
  const clusterButtons = getCountdownClusterButtonsForEvent(event.slug);
  const eyebrow =
    event.category === "year"
      ? "Year countdown"
      : event.category === "weekday" || event.category === "weekend"
        ? "Recurring countdown"
        : "Event countdown";
  const lead = getSeoHubLandingLead(event, targetDate, countdown);
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: event.name, path: currentPath },
    ]),
    createWebPageJsonLd({
      name: event.name,
      description: event.seoDescription || lead,
      path: currentPath,
      about: event.name,
    }),
  ];

  return (
    <SeoCountdownPage
      eyebrow={eyebrow}
      title={`How many days until ${event.name}?`}
      lead={lead}
      countdownLabel={event.name}
      countdown={countdown}
      cardActionLinks={clusterButtons}
      calendarPath={currentPath}
      supportingCopy={[]}
      relatedLinks={relatedEvents}
      showChristmasFlyby={event.slug === "christmas"}
      structuredData={structuredData}
      extraSection={
        <>
          {occurrenceRows.length > 0 ? (
            <section className="mt-12 w-full max-w-[31.9rem] rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem] sm:px-8">
              <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
                {getOccurrenceHeading(occurrenceRows.length)}
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
          {recurringDateRows.length > 0 ? (
            <section className="mt-12 w-full max-w-[31.9rem] rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem] sm:px-8">
              <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
                Upcoming Fridays
              </h2>
              <p className="mt-3 text-sm leading-6 text-black/58 dark:text-white/60">
                The countdown always targets the next Friday. These are the next six Friday dates.
              </p>
              <div className="mt-5 overflow-hidden rounded-[1.15rem] border border-black/6 dark:border-white/10">
                <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,0.7fr)] bg-[#f3f2ee] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/48 dark:bg-[#1d1f1e] dark:text-white/50">
                  <span>Date</span>
                  <span>From today</span>
                </div>
                <div className="divide-y divide-black/6 dark:divide-white/10">
                  {recurringDateRows.map((row) => (
                    <div
                      key={row.dateLabel}
                      className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,0.7fr)] gap-4 bg-white/55 px-4 py-2.5 text-[13px] dark:bg-white/[0.02] sm:text-sm"
                    >
                      <span className="font-medium text-black dark:text-white/88">
                        {row.dateLabel}
                      </span>
                      <span className="text-black/62 dark:text-white/62">
                        {row.daysAway === 0
                          ? "Today"
                          : `${row.daysAway} ${row.daysAway === 1 ? "day" : "days"}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
          {factSet ? <SeoHubFactsSection factSet={factSet} /> : null}
          <CountdownLinkList
            title="Planning tools"
            description={`Turn the ${event.name} countdown into a practical plan or add a live version to another website.`}
            links={[
              { href: actions.business, label: `Count business days until ${event.name}` },
              { href: actions.compare, label: "Compare this date with another date" },
              { href: actions.adjust, label: `Plan before or after ${event.name}` },
              { href: actions.widget, label: "Add a countdown to your website" },
              { href: "/calendar-days-vs-business-days", label: "Calendar days vs business days" },
            ]}
            centered
          />
        </>
      }
    />
  );
}
