import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Brand } from "../../../components/Brand";
import { CountdownLinkList } from "../../../components/CountdownLinkList";
import { CountdownDisplay } from "../../../components/CountdownDisplay";
import { events, findEventBySlug } from "../../../data/events";
import { formatShortDate } from "../../../lib/dateFormat";
import { resolveEventCountdown } from "../../../lib/eventCountdown";

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedCountdown = resolveEventCountdown(slug);

  if (!resolvedCountdown) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const { event, targetDate } = resolvedCountdown;

  return {
    title: `How Many Days Until ${event.name}?`,
    description: `See how many days until ${event.name} and the next target date of ${formatShortDate(targetDate)}.`,
    alternates: {
      canonical: `/days-until/${event.slug}`,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const resolvedCountdown = resolveEventCountdown(slug);

  if (!resolvedCountdown) {
    notFound();
  }

  const { event, countdown } = resolvedCountdown;
  const relatedEvents = event.relatedEventSlugs
    .map((relatedSlug) => findEventBySlug(relatedSlug))
    .filter((relatedEvent) => relatedEvent !== undefined)
    .slice(0, 36)
    .map((relatedEvent) => ({
      href: `/days-until/${relatedEvent.slug}`,
      label: `Days until ${relatedEvent.name}`,
    }));

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
        </section>
        <CountdownLinkList
          title="Related countdowns"
          description={`Explore more recurring countdown pages related to ${event.name.toLowerCase()}.`}
          links={relatedEvents}
        />
      </div>
    </main>
  );
}
