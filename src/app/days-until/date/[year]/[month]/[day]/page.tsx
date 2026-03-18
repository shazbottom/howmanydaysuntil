import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountdownLinkList } from "../../../../../../components/CountdownLinkList";
import { SeoCountdownPage } from "../../../../../../components/SeoCountdownPage";
import { formatLongDate } from "../../../../../../lib/dateFormat";
import {
  getExactDateDetails,
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

interface ExactDatePageProps {
  params: Promise<ExactDateParams>;
}

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

  return {
    title,
    description,
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

  return (
    <SeoCountdownPage
      eyebrow="Exact date countdown"
      title={`How many days until ${longDate}?`}
      countdownLabel={longDate}
      countdown={resolvedCountdown.countdown}
      supportingCopy={[]}
      relatedLinks={getExactDateRelatedLinks(targetDate)}
      extraSection={
        <>
          <section className="mt-12 w-full max-w-2xl text-left">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              Date details
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-black/62 dark:text-white/66 sm:text-base">
              {dateDetails.map((detail) => (
                <p key={detail}>{detail}</p>
              ))}
            </div>
          </section>
          <CountdownLinkList title="Nearby dates" links={nearbyLinks} centered />
        </>
      }
    />
  );
}
