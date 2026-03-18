import { notFound } from "next/navigation";
import { formatFullDate } from "../../../lib/dateFormat";
import {
  createCountdownOgImage,
  ogImageContentType,
  ogImageSize,
} from "../../../lib/ogImage";
import { resolveSeoHubEventCountdown } from "../../../lib/seoHubEventResolver";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const runtime = "nodejs";

interface EventPageOgImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OgImage({ params }: EventPageOgImageProps) {
  try {
    const { slug } = await params;
    const resolvedCountdown = resolveSeoHubEventCountdown(slug);

    if (!resolvedCountdown) {
      notFound();
    }

    return createCountdownOgImage({
      count: resolvedCountdown.countdown.daysRemaining,
      label: resolvedCountdown.event.name,
      footer: formatFullDate(resolvedCountdown.targetDate, "en-GB"),
    });
  } catch {
    return createCountdownOgImage({
      count: "—",
      label: "countdown",
      footer: "DaysUntil",
    });
  }
}
