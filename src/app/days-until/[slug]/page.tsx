import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { seoHubEvents, findSeoHubEventBySlug } from "../../../data/seoHubEvents";
import { getSeoLandingPath } from "../../../lib/seoLandingPages";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return seoHubEvents
    .filter((event) => event.indexable)
    .map((event) => ({
    slug: event.slug,
    }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = findSeoHubEventBySlug(slug);

  if (!event) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }
  const canonicalPath = getSeoLandingPath(event.slug);
  const imageUrl = `/days-until/${event.slug}/opengraph-image`;
  const title = `How Many Days Until ${event.name}? (Live Countdown)`;
  const description = `Live countdown for ${event.name}. This legacy URL redirects to the canonical countdown page.`;

  return {
    title,
    description,
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

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = findSeoHubEventBySlug(slug);

  if (!event) {
    notFound();
  }

  permanentRedirect(getSeoLandingPath(event.slug));
}
