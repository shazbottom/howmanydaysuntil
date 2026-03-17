import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoCountdownPage } from "../../../../../../components/SeoCountdownPage";
import { formatLongDate } from "../../../../../../lib/dateFormat";
import {
  getExactDateRelatedLinks,
  getExactDateRoutePath,
  getExactDateStaticParams,
  getExactDateSupportingCopy,
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

function buildLead(targetDate: Date): string {
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(targetDate);
  return `${formatLongDate(targetDate, "en-GB")} falls on a ${weekday}.`;
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

  return (
    <SeoCountdownPage
      eyebrow="Exact date countdown"
      title={`How many days until ${longDate}?`}
      lead={buildLead(targetDate)}
      countdownLabel={longDate}
      countdown={resolvedCountdown.countdown}
      supportingCopy={getExactDateSupportingCopy(targetDate)}
      relatedLinks={getExactDateRelatedLinks(targetDate)}
    />
  );
}
