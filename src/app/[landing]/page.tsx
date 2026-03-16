import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Brand } from "../../components/Brand";
import { CountdownDisplay } from "../../components/CountdownDisplay";
import { findEventBySlug } from "../../data/events";
import { formatShortDate } from "../../lib/dateFormat";
import { resolveEventCountdown } from "../../lib/eventCountdown";
import {
  findSeoLandingEventBySlug,
  seoLandingEvents,
} from "../../lib/seoLandingPages";

interface SeoLandingPageProps {
  params: Promise<{
    landing: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return seoLandingEvents.map((event) => ({
    landing: event.landingSlug,
  }));
}

export async function generateMetadata({
  params,
}: SeoLandingPageProps): Promise<Metadata> {
  const { landing } = await params;
  const landingEvent = findSeoLandingEventBySlug(landing);

  if (!landingEvent) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const resolvedCountdown = resolveEventCountdown(landingEvent.eventSlug);

  if (!resolvedCountdown) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const { event, targetDate } = resolvedCountdown;

  return {
    title: `How many days until ${event.name}?`,
    description: `Find out how many days until ${event.name} with a live countdown. Next date: ${formatShortDate(targetDate)}.`,
    alternates: {
      canonical: `/${landing}`,
    },
  };
}

export default async function SeoLandingPage({ params }: SeoLandingPageProps) {
  const { landing } = await params;
  const landingEvent = findSeoLandingEventBySlug(landing);

  if (!landingEvent) {
    notFound();
  }

  const resolvedCountdown = resolveEventCountdown(landingEvent.eventSlug);

  if (!resolvedCountdown) {
    notFound();
  }

  const { event, countdown } = resolvedCountdown;
  const seededEvent = findEventBySlug(event.slug);

  if (!seededEvent) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black"
          >
            <Brand variant="horizontal" height={55} className="h-[55px] w-auto" />
          </Link>
          <Link
            href="/"
            className="rounded-full bg-black/[0.055] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.085] active:bg-black/[0.11]"
          >
            Home
          </Link>
        </div>
        <section className="mt-20 flex w-full flex-1 flex-col items-center text-center">
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            How many days until {event.name}?
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-black/55 sm:text-base">
            {event.description} Check the live countdown below for the next {event.name.toLowerCase()}.
          </p>
          <div className="mt-12 w-full max-w-[30.4rem] sm:max-w-[32.4rem]">
            <CountdownDisplay label={event.name} countdown={countdown} />
          </div>
          <Link
            href="/"
            className="mt-8 text-sm text-black/68 underline-offset-4 transition hover:text-black hover:underline"
          >
            Back to main countdown calculator
          </Link>
        </section>
      </div>
    </main>
  );
}
