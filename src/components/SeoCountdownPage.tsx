import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "./Brand";
import { CalculatorNavButton } from "./CalculatorNavButton";
import { CountdownDisplay } from "./CountdownDisplay";
import { CountdownLinkList, type CountdownLinkItem } from "./CountdownLinkList";
import { CountrySelectorDropdown } from "./CountrySelectorDropdown";
import { JsonLd } from "./JsonLd";
import { ThemeToggle } from "./ThemeToggle";

const CHRISTMAS_HEADER_COLOR_CLASS_NAME = "bg-[#E40A2D] dark:bg-[#b20d2c]";

export interface SeoCountdownPageProps {
  eyebrow: string;
  title: string;
  lead?: string;
  countdownLabel: string;
  countdown: Parameters<typeof CountdownDisplay>[0]["countdown"];
  supportingCopy: string[];
  relatedLinks: CountdownLinkItem[];
  extraSection?: ReactNode;
  showChristmasFlyby?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SeoCountdownPage({
  eyebrow,
  title,
  lead,
  countdownLabel,
  countdown,
  supportingCopy,
  relatedLinks,
  extraSection,
  showChristmasFlyby = false,
  structuredData,
}: SeoCountdownPageProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      {structuredData ? <JsonLd data={structuredData} /> : null}
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center">
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
        <section className="mt-20 flex w-full flex-1 flex-col items-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42 dark:text-white/44">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
              {lead}
            </p>
          ) : null}
          <div className="relative mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
            {showChristmasFlyby ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[4.8rem] z-10 h-[4.75rem] overflow-hidden"
              >
                <div className="daysuntil-christmas-flyby absolute left-0 top-0">
                  <img
                    src="/seasonal/1.svg"
                    alt=""
                    className="h-auto w-[15.5rem] drop-shadow-[0_1px_1px_rgba(255,255,255,0.18)] dark:invert sm:w-[17.5rem]"
                  />
                </div>
              </div>
            ) : null}
            <CountdownDisplay
              label={countdownLabel}
              countdown={countdown}
              headerColorClassName={
                showChristmasFlyby
                  ? CHRISTMAS_HEADER_COLOR_CLASS_NAME
                  : undefined
              }
            />
          </div>
          {supportingCopy.length > 0 ? (
            <div className="mt-8 max-w-2xl space-y-4 text-left text-sm leading-6 text-black/65 dark:text-white/66 sm:text-base">
              {supportingCopy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
        </section>
        {extraSection}
        <CountdownLinkList title="Related countdowns" links={relatedLinks} />
      </div>
    </main>
  );
}
