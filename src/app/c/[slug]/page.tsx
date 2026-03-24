import type { Metadata } from "next";
import { CustomCountdownPageClient } from "../../../components/CustomCountdownPageClient";
import { formatCustomCountdownDate } from "../../../lib/customCountdowns";
import { getCustomCountdownPageDataFromRedis } from "../../../lib/customCountdownStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://daysuntil.is";

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
  const title = pageData ? `${pageData.record.title} | DaysUntil` : "Custom Countdown | DaysUntil";
  const description = pageData
    ? pageData.record.note ??
      `A shareable countdown to ${formatCustomCountdownDate(pageData.targetDate, "en-GB")}.`
    : "A shareable custom countdown.";
  const canonicalUrl = `${SITE_URL}/c/${slug}`;
  const imageQuery = new URLSearchParams({
    count: pageData?.countdown ? String(pageData.countdown.daysRemaining) : "-",
    label: pageData?.record.title ?? "countdown",
    footer: pageData ? formatCustomCountdownDate(pageData.targetDate, "en-GB") : "DaysUntil",
  });
  const imageUrl = `${SITE_URL}/api/og/custom?${imageQuery.toString()}`;

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
      url: canonicalUrl,
      siteName: "DaysUntil",
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
      canonical: canonicalUrl,
    },
  };
}

export default async function CustomCountdownPage({ params }: CustomCountdownPageProps) {
  const { slug } = await params;
  const pageData = await getCustomCountdownPageDataFromRedis(slug);

  return <CustomCountdownPageClient pageData={pageData} />;
}
