import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Brand } from "../../../components/Brand";
import { CopyCountdownLinkButton } from "../../../components/CopyCountdownLinkButton";
import { CountdownDisplay } from "../../../components/CountdownDisplay";
import { ThemeToggle } from "../../../components/ThemeToggle";
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
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black dark:text-white/72 dark:hover:text-white"
          >
            <Brand variant="horizontal" height={55} className="h-[55px] w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/create"
              className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
            >
              Create another
            </Link>
          </div>
        </div>
        <section className="mt-16 flex w-full flex-1 flex-col items-center text-center sm:mt-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-black/42 dark:text-white/44">
            Custom countdown
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.9rem,10vw,6rem)] font-semibold tracking-tight">
            {record.title}
          </h1>
          {record.note ? (
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
              {record.note}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-black/48 dark:text-white/48">
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
              className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
            >
              Create another countdown
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
