import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountdownLinkList } from "../../../../../../components/CountdownLinkList";
import { ExactDatePlanner } from "../../../../../../components/ExactDatePlanner";
import { SeoCountdownPage } from "../../../../../../components/SeoCountdownPage";
import { formatLongDate } from "../../../../../../lib/dateFormat";
import {
  getExactDateDetails,
  getExactDateFactSections,
  getExactDateNearbyLinks,
  getExactDateRelatedLinks,
  getExactDateRoutePath,
  getExactDateStaticParams,
  isExactDateIndexable,
  isExactDateInRolloutRange,
} from "../../../../../../lib/exactDatePages";
import {
  parseExactDateParams,
  resolveExactDateCountdown,
  type ExactDateParams,
} from "../../../../../../lib/exactDateCountdown";
import { createBreadcrumbJsonLd, createWebPageJsonLd } from "../../../../../../lib/structuredData";
import { getExactDatePlanningData } from "../../../../../../lib/datePlanning";

interface ExactDatePageProps {
  params: Promise<ExactDateParams>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return getExactDateStaticParams();
}

export async function generateMetadata({
  params,
}: ExactDatePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const targetDate = parseExactDateParams(resolvedParams);

  if (!targetDate || !isExactDateInRolloutRange(targetDate)) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const resolvedCountdown = resolveExactDateCountdown(resolvedParams);

  if (!resolvedCountdown) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const longDate = formatLongDate(targetDate, "en-GB");
  const title = `How Many Days Until ${longDate}? (Live Countdown)`;
  const description = `There are ${resolvedCountdown.countdown.daysRemaining} days until ${longDate}. See a live countdown including weeks, hours, and minutes remaining.`;
  const imageUrl = `${getExactDateRoutePath(targetDate)}/opengraph-image`;
  const indexable = isExactDateIndexable(targetDate);

  return {
    title,
    description,
    robots: {
      index: indexable,
      follow: indexable,
    },
    alternates: {
      canonical: getExactDateRoutePath(targetDate),
    },
    openGraph: {
      title,
      description,
      url: getExactDateRoutePath(targetDate),
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

export default async function ExactDatePage({ params }: ExactDatePageProps) {
  const resolvedParams = await params;
  const targetDate = parseExactDateParams(resolvedParams);

  if (!targetDate || !isExactDateInRolloutRange(targetDate)) {
    notFound();
  }

  const resolvedCountdown = resolveExactDateCountdown(resolvedParams);

  if (!resolvedCountdown) {
    notFound();
  }

  const longDate = formatLongDate(targetDate, "en-GB");
  const nearbyLinks = getExactDateNearbyLinks(targetDate);
  const dateDetails = getExactDateDetails(targetDate, resolvedCountdown.countdown);
  const factSections = getExactDateFactSections(targetDate, resolvedCountdown.countdown);
  const planningData = getExactDatePlanningData(targetDate);
  const currentPath = getExactDateRoutePath(targetDate);
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: longDate, path: currentPath },
    ]),
    createWebPageJsonLd({
      name: longDate,
      description: `Live countdown to ${longDate}.`,
      path: currentPath,
      about: longDate,
    }),
  ];

  return (
    <SeoCountdownPage
      eyebrow="Exact date countdown"
      title={`How many days until ${longDate}?`}
      countdownLabel={longDate}
      countdown={resolvedCountdown.countdown}
      calendarPath={currentPath}
      supportingCopy={[]}
      relatedLinks={getExactDateRelatedLinks(targetDate)}
      extraSection={
        <>
          <ExactDatePlanner data={planningData} />
          <section className="mt-12 w-full max-w-[31.9rem] px-5 text-left sm:max-w-[34rem]">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              Date details
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-black/62 dark:text-white/66 sm:text-base">
              {dateDetails.map((detail) => (
                <p key={detail}>{detail}</p>
              ))}
            </div>
          </section>
          <div className="mt-12 grid w-full max-w-[31.9rem] gap-5 sm:max-w-[34rem]">
            {factSections.map((section) => (
              <section
                key={section.title}
                className="rounded-[1.6rem] bg-[#fdfcf9] px-6 py-6 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-7"
              >
                <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-6 text-black/62 dark:text-white/66 sm:text-base">
                  {section.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <CountdownLinkList
            title="Use this date"
            description="Compare the target with another date, switch to a regional working-day count, or use it in an embedded countdown."
            links={[
              { href: "/days-between-dates", label: "Compare with another date" },
              { href: "/business-days-until", label: "Count business days until this date" },
              { href: "/add-or-subtract-date", label: "Add or subtract time from this date" },
              { href: "/countdown-widget", label: "Create an embeddable countdown" },
              { href: "/calendar-days-vs-business-days", label: "Understand the different day counts" },
            ]}
            centered
          />
          <CountdownLinkList title="Nearby dates" links={nearbyLinks} centered />
        </>
      }
      structuredData={structuredData}
    />
  );
}
