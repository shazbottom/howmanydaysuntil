import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Brand } from "../../../components/Brand";
import { CopyCountdownLinkButton } from "../../../components/CopyCountdownLinkButton";
import { CountdownDisplay } from "../../../components/CountdownDisplay";
import { formatFullDate } from "../../../lib/dateFormat";
import { getCustomCountdownPageData } from "../../../lib/customCountdowns";

interface CustomCountdownPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CustomCountdownPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await getCustomCountdownPageData(slug);

  if (!pageData) {
    return {
      title: "Countdown Not Found | DaysUntil",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${pageData.record.title} | DaysUntil`,
    description:
      pageData.record.note ??
      `A private shareable countdown to ${formatFullDate(pageData.targetDate, "en-GB")}.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${pageData.record.title} | DaysUntil`,
      description:
        pageData.record.note ??
        `A private shareable countdown to ${formatFullDate(pageData.targetDate, "en-GB")}.`,
      url: `/c/${pageData.record.slug}`,
      type: "website",
    },
  };
}

export default async function CustomCountdownPage({ params }: CustomCountdownPageProps) {
  const { slug } = await params;
  const pageData = await getCustomCountdownPageData(slug);

  if (!pageData) {
    notFound();
  }

  const { record, countdown, targetDate } = pageData;

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black"
          >
            <Brand variant="horizontal" height={55} className="h-[55px] w-auto" />
          </Link>
          <Link
            href="/create"
            className="rounded-full bg-black/[0.055] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.085] active:bg-black/[0.11]"
          >
            Create another
          </Link>
        </div>
        <section className="mt-16 flex w-full flex-1 flex-col items-center text-center sm:mt-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-black/42">
            Custom countdown
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.9rem,10vw,6rem)] font-semibold tracking-tight">
            {record.title}
          </h1>
          {record.note ? (
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-black/55 sm:text-base">
              {record.note}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-black/48">
            <span>{formatFullDate(targetDate, "en-GB")}</span>
            {record.timezone ? <span>&middot;</span> : null}
            {record.timezone ? <span>{record.timezone}</span> : null}
          </div>
          <div className="mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
            <CountdownDisplay label={record.title} countdown={countdown} />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CopyCountdownLinkButton />
            <Link
              href="/create"
              className="rounded-full bg-black/[0.04] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.07] active:bg-black/[0.11]"
            >
              Create another countdown
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
