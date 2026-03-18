import { notFound } from "next/navigation";
import { formatFullDate, formatLongDate } from "../../../../../../lib/dateFormat";
import {
  isExactDateInRolloutRange,
} from "../../../../../../lib/exactDatePages";
import {
  parseExactDateParams,
  resolveExactDateCountdown,
  type ExactDateParams,
} from "../../../../../../lib/exactDateCountdown";
import {
  createCountdownOgImage,
  ogImageContentType,
  ogImageSize,
} from "../../../../../../lib/ogImage";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const runtime = "nodejs";

interface ExactDateOgImageProps {
  params: Promise<ExactDateParams>;
}

export default async function OgImage({ params }: ExactDateOgImageProps) {
  try {
    const resolvedParams = await params;
    const targetDate = parseExactDateParams(resolvedParams);

    if (!targetDate || !isExactDateInRolloutRange(targetDate)) {
      notFound();
    }

    const resolvedCountdown = resolveExactDateCountdown(resolvedParams);

    if (!resolvedCountdown) {
      notFound();
    }

    return createCountdownOgImage({
      count: resolvedCountdown.countdown.daysRemaining,
      label: formatLongDate(targetDate, "en-GB"),
      footer: formatFullDate(targetDate, "en-GB"),
    });
  } catch {
    return createCountdownOgImage({
      count: "—",
      label: "date",
      footer: "DaysUntil",
    });
  }
}
