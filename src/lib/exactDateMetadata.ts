import type { Metadata } from "next";
import type { CountdownResult } from "./countdown";
import { formatLongDate } from "./dateFormat";
import { getExactDateRoutePath, isExactDateIndexable } from "./exactDatePages";

export function buildExactDateMetadata(
  targetDate: Date,
  countdown: CountdownResult,
  now: Date = new Date(),
): Metadata {
  const searchDate = formatLongDate(targetDate, "en-US");
  const title = `How Many Days Until ${searchDate}? | Live Countdown`;
  const description = `${searchDate} is in ${countdown.daysRemaining} ${
    countdown.daysRemaining === 1 ? "day" : "days"
  }. See the exact countdown in weeks, days, hours, minutes and seconds.`;
  const canonicalPath = getExactDateRoutePath(targetDate);
  const imageUrl = `${canonicalPath}/opengraph-image`;
  const indexable = isExactDateIndexable(targetDate, now);

  return {
    title,
    description,
    robots: {
      index: indexable,
      follow: indexable,
    },
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
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
