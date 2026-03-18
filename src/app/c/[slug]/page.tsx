import type { Metadata } from "next";
import { CustomCountdownPageClient } from "../../../components/CustomCountdownPageClient";
import { formatCustomCountdownDate } from "../../../lib/customCountdowns";
import { getCustomCountdownPageDataFromRedis } from "../../../lib/customCountdownStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const title = pageData ? `${pageData.record.title} | DaysUntil` : `Custom Countdown | DaysUntil`;
  const description = pageData
    ? pageData.record.note ??
      `A shareable countdown to ${formatCustomCountdownDate(pageData.targetDate, "en-GB")}.`
    : `A shareable custom countdown.`;
  const imageQuery = new URLSearchParams({
    count: pageData?.countdown ? String(pageData.countdown.daysRemaining) : "—",
    label: pageData?.record.title ?? "countdown",
    footer: pageData ? formatCustomCountdownDate(pageData.targetDate, "en-GB") : "DaysUntil",
  });
  const imageUrl = `/api/og/custom?${imageQuery.toString()}`;

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      url: `/c/${slug}`,
      type: "website",
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
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
