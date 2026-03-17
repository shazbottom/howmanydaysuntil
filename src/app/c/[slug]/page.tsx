import type { Metadata } from "next";
import { CustomCountdownPageClient } from "../../../components/CustomCountdownPageClient";
import { formatCustomCountdownDate } from "../../../lib/customCountdowns";
import { getCustomCountdownPageDataFromRedis } from "../../../lib/customCountdownStore";

interface CustomCountdownPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CustomCountdownPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await getCustomCountdownPageDataFromRedis(slug);

  return {
    title: pageData ? `${pageData.record.title} | DaysUntil` : `Custom Countdown | DaysUntil`,
    description: pageData
      ? pageData.record.note ??
        `A shareable countdown to ${formatCustomCountdownDate(pageData.targetDate, "en-GB")}.`
      : `A shareable custom countdown.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: pageData
      ? {
          title: `${pageData.record.title} | DaysUntil`,
          description:
            pageData.record.note ??
            `A shareable countdown to ${formatCustomCountdownDate(pageData.targetDate, "en-GB")}.`,
          url: `/c/${slug}`,
          type: "website",
        }
      : undefined,
    alternates: {
      canonical: `/c/${slug}`,
    },
  };
}

export default async function CustomCountdownPage({ params }: CustomCountdownPageProps) {
  const { slug } = await params;
  const pageData = await getCustomCountdownPageDataFromRedis(slug);

  return <CustomCountdownPageClient pageData={pageData} />;
}
