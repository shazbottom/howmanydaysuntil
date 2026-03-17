import type { Metadata } from "next";
import { CustomCountdownPageClient } from "../../../components/CustomCountdownPageClient";

interface CustomCountdownPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CustomCountdownPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Custom Countdown | DaysUntil`,
    description: `A private shareable countdown stored in this browser.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: undefined,
    alternates: {
      canonical: `/c/${slug}`,
    },
  };
}

export default async function CustomCountdownPage({ params }: CustomCountdownPageProps) {
  const { slug } = await params;

  return <CustomCountdownPageClient slug={slug} />;
}
