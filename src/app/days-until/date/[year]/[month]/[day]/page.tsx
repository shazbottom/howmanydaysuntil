import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountdownLinkList } from "../../../../../../components/CountdownLinkList";
import { ExactDatePlanner } from "../../../../../../components/ExactDatePlanner";
import { SeoCountdownPage } from "../../../../../../components/SeoCountdownPage";
import { formatLongDate } from "../../../../../../lib/dateFormat";
import { buildExactDateMetadata } from "../../../../../../lib/exactDateMetadata";
import {
  getExactDateDetails,
  getExactDateFactSections,
  getExactDateNearbyLinks,
  getExactDateRelatedLinks,
  getExactDateRoutePath,
  getExactDateStaticParams,
  isExactDateInRolloutRange,
} from "../../../../../../lib/exactDatePages";
import {
  parseExactDateParams,
  resolveExactDateCountdown,
  type ExactDateParams,
} from "../../../../../../lib/exactDateCountdown";
import { createBreadcrumbJsonLd, createWebPageJsonLd } from "../../../../../../lib/structuredData";
import { getExactDatePlanningData } from "../../../../../../lib/datePlanning";
import { formatActionDate, getCountdownActions } from "../../../../../../lib/countdownActions";
import { DateCountdownEditor } from "../../../../../../components/DateCountdownEditor";

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

  return buildExactDateMetadata(targetDate, resolvedCountdown.countdown);
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
  const actions = getCountdownActions(targetDate, longDate);
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
      cardActionLinks={[{ href: actions.business, label: "Business days" }]}
      supportingCopy={[]}
      relatedLinks={getExactDateRelatedLinks(targetDate)}
      extraSection={
        <>
          <DateCountdownEditor initialDate={formatActionDate(targetDate)} minimumDate={formatActionDate(new Date())} />
          <ExactDatePlanner data={planningData} businessDaysHref={actions.business} />
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
              { href: actions.compare, label: "Compare with another date" },
              { href: actions.business, label: "Count business days until this date" },
              { href: actions.adjust, label: "Add or subtract time from this date" },
              { href: actions.widget, label: "Create an embeddable countdown" },
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
