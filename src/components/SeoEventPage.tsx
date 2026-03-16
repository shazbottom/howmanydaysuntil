import Link from "next/link";
import { notFound } from "next/navigation";
import { Brand } from "./Brand";
import { CountdownDisplay } from "./CountdownDisplay";
import { resolveSeoEventPage } from "../lib/seoEventPages";

export interface SeoEventPageProps {
  routePath: string;
}

export function SeoEventPage({ routePath }: SeoEventPageProps) {
  const resolvedPage = resolveSeoEventPage(routePath);

  if (!resolvedPage) {
    notFound();
  }

  const { event, countdown } = resolvedPage;

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
          <div className="mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
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
