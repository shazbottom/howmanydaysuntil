import { formatCustomCountdownDate } from "../../../lib/customCountdowns";
import { getCustomCountdownPageDataFromRedis } from "../../../lib/customCountdownStore";
import {
  createCountdownOgImage,
  ogImageContentType,
  ogImageSize,
} from "../../../lib/ogImage";

export const alt = "DaysUntil custom countdown";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CustomCountdownOgImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OgImage({ params }: CustomCountdownOgImageProps) {
  const { slug } = await params;
  const pageData = await getCustomCountdownPageDataFromRedis(slug);

  if (!pageData) {
    return createCountdownOgImage({
      count: "—",
      label: "countdown",
      footer: "Countdown unavailable",
    });
  }

  return createCountdownOgImage({
    count: pageData.countdown
      ? pageData.countdown.daysRemaining.toLocaleString("en-GB")
      : "0",
    label: pageData.record.title,
    footer: formatCustomCountdownDate(pageData.targetDate, "en-GB"),
  });
}
