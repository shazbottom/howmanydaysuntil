import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Brand } from "../../../../../../components/Brand";
import { CountdownLinkList } from "../../../../../../components/CountdownLinkList";
import { CountdownDisplay } from "../../../../../../components/CountdownDisplay";
import { ThemeToggle } from "../../../../../../components/ThemeToggle";
import {
  formatFullDate,
  formatLongDate,
} from "../../../../../../lib/dateFormat";
import {
  parseExactDateParams,
  resolveExactDateCountdown,
  type ExactDateParams,
} from "../../../../../../lib/exactDateCountdown";

interface ExactDatePageProps {
  params: Promise<ExactDateParams>;
}

const SAMPLE_STATIC_DATES: ExactDateParams[] = [
  { year: "2026", month: "12", day: "25" },
  { year: "2027", month: "1", day: "1" },
  { year: "2027", month: "6", day: "1" },
];

export function generateStaticParams() {
  return SAMPLE_STATIC_DATES;
}

export async function generateMetadata({
  params,
}: ExactDatePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const targetDate = parseExactDateParams(resolvedParams);

  if (!targetDate) {
    return {
      title: "Countdown Not Found",
      description: "The requested countdown page could not be found.",
    };
  }

  const longDate = formatLongDate(targetDate);

  return {
    title: `How Many Days Until ${longDate}?`,
    description: `See how many days until ${longDate} with a live countdown in days, weeks, hours, and minutes.`,
    alternates: {
      canonical: `/days-until/date/${resolvedParams.year}/${resolvedParams.month}/${resolvedParams.day}`,
    },
  };
}

export default async function ExactDatePage({ params }: ExactDatePageProps) {
  const resolvedParams = await params;
  const resolvedCountdown = resolveExactDateCountdown(resolvedParams);

  if (!resolvedCountdown) {
    notFound();
  }

  const { targetDate, countdown } = resolvedCountdown;
  const longDate = formatLongDate(targetDate);
  const fullDate = formatFullDate(targetDate);
  const relatedLinks = [
    { href: "/", label: "Countdown homepage" },
    { href: "/days-until/christmas", label: "Days until Christmas" },
    { href: "/days-until/new-year", label: "Days until New Year" },
    { href: "/days-until/thanksgiving", label: "Days until Thanksgiving" },
  ];

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center">
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
              href="/"
              className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
            >
              Home
            </Link>
          </div>
        </div>
        <section className="mt-20 flex w-full flex-1 flex-col items-center text-center">
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            How many days until {longDate}?
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-black/55 dark:text-white/58 sm:text-base">
            Track the live countdown to {fullDate} with total days, weeks and days,
            hours, and minutes remaining.
          </p>
          <div className="mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
            <CountdownDisplay label={longDate} countdown={countdown} />
          </div>
        </section>
        <CountdownLinkList
          title="Related countdowns"
          description="Move to another popular countdown page or head back to the homepage to search a different date."
          links={relatedLinks}
        />
      </div>
    </main>
  );
}
