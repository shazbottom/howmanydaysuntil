import Link from "next/link";
import { AddToCalendarMenu } from "./AddToCalendarMenu";
import { Brand } from "./Brand";
import { CalculatorNavButton } from "./CalculatorNavButton";
import { CountrySelectorDropdown } from "./CountrySelectorDropdown";
import { CopyCountdownLinkButton } from "./CopyCountdownLinkButton";
import { CountdownDisplay } from "./CountdownDisplay";
import { ThemeToggle } from "./ThemeToggle";
import {
  formatCustomCountdownDate,
  type CustomCountdownPageData,
} from "../lib/customCountdowns";

interface CustomCountdownPageClientProps {
  pageData: CustomCountdownPageData | null;
}

export function CustomCountdownPageClient({ pageData }: CustomCountdownPageClientProps) {
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
            <CountrySelectorDropdown />
            <CalculatorNavButton />
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
            >
              Home
            </Link>
          </div>
        </div>
        <section className="mt-16 flex w-full flex-1 flex-col items-center text-center sm:mt-20">
          {!pageData ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-black/42 dark:text-white/44">
                Custom countdown
              </p>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.6rem,9vw,5.2rem)] font-semibold tracking-tight">
                Countdown not found
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
                This countdown could not be found or may no longer be available.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/create"
                  className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
                >
                  Create a countdown
                </Link>
                <Link
                  href="/"
                  className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
                >
                  Back home
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-black/42 dark:text-white/44">
                Custom countdown
              </p>
              <h1 className="mt-4 max-w-4xl text-[clamp(2.9rem,10vw,6rem)] font-semibold tracking-tight">
                {pageData.record.title}
              </h1>
              {pageData.record.note ? (
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
                  {pageData.record.note}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-black/48 dark:text-white/48">
                <span>{formatCustomCountdownDate(pageData.targetDate, "en-GB")}</span>
                {pageData.record.timezone ? <span>&middot;</span> : null}
                {pageData.record.timezone ? <span>{pageData.record.timezone}</span> : null}
              </div>
              <div className="mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
                <CountdownDisplay label={pageData.record.title} countdown={pageData.countdown} />
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <AddToCalendarMenu record={pageData.record} />
                <CopyCountdownLinkButton />
                <Link
                  href="/create"
                  className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
                >
                  Create another countdown
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
