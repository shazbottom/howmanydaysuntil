import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "./Brand";
import { CalendarExportMenu } from "./CalendarExportMenu";
import { CalculatorNavButton } from "./CalculatorNavButton";
import { CountdownDisplay } from "./CountdownDisplay";
import { CountdownLinkList, type CountdownLinkItem } from "./CountdownLinkList";
import { CountrySelectorDropdown } from "./CountrySelectorDropdown";
import { JsonLd } from "./JsonLd";
import { ThemeToggle } from "./ThemeToggle";
import type { CountdownClusterLink } from "../lib/countdownClusters";
import { getCountdownActions } from "../lib/countdownActions";
import { CountdownActionLink } from "./CountdownActionLink";
import type { AllDayCalendarEvent } from "../lib/calendarEvent";

const CHRISTMAS_HEADER_COLOR_CLASS_NAME = "bg-[#E40A2D] dark:bg-[#b20d2c]";
const SITE_URL = "https://daysuntil.is";

function formatCalendarDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export interface SeoCountdownPageProps {
  eyebrow: string;
  title: string;
  lead?: string;
  countdownLabel: string;
  countdown: Parameters<typeof CountdownDisplay>[0]["countdown"];
  countdownDescription?: string;
  countdownPrimaryValue?: number | string;
  countdownPrimaryUnitLabel?: string;
  countdownDetailLine?: string;
  countdownTimeZone?: string;
  cardActionLinks?: CountdownClusterLink[];
  calendarPath?: string;
  calendarTitle?: string;
  calendarEventOverride?: AllDayCalendarEvent;
  actionDateOverride?: Date;
  supportingCopy: string[];
  relatedLinks: CountdownLinkItem[];
  extraSection?: ReactNode;
  countdownControls?: ReactNode;
  afterCardActions?: ReactNode;
  countdownAside?: ReactNode;
  showChristmasFlyby?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SeoCountdownPage({
  eyebrow,
  title,
  lead,
  countdownLabel,
  countdown,
  countdownDescription,
  countdownPrimaryValue,
  countdownPrimaryUnitLabel,
  countdownDetailLine,
  countdownTimeZone,
  cardActionLinks = [],
  calendarPath,
  calendarTitle: calendarTitleOverride,
  calendarEventOverride,
  actionDateOverride,
  supportingCopy,
  relatedLinks,
  extraSection,
  countdownControls,
  afterCardActions,
  countdownAside,
  showChristmasFlyby = false,
  structuredData,
}: SeoCountdownPageProps) {
  const actionDate = actionDateOverride ?? countdown?.targetDate;
  const calendarYear = actionDate?.getFullYear();
  const defaultCalendarTitle =
    calendarYear && !countdownLabel.includes(String(calendarYear))
      ? `${countdownLabel} ${calendarYear}`
      : countdownLabel;
  const calendarTitle = calendarTitleOverride ?? defaultCalendarTitle;
  const calendarEvent = calendarEventOverride ?? (calendarPath && countdown ? {
    title: calendarTitle,
    date: formatCalendarDate(countdown.targetDate),
    description: lead ?? `Live countdown to ${calendarTitle}.`,
    url: `${SITE_URL}${calendarPath}`,
    fileName: calendarPath.replace(/^\//, "").replaceAll("/", "-"),
  } : null);

  return (
    <main className="min-h-screen bg-background px-4 py-4 text-foreground sm:px-6 sm:py-10">
      {structuredData ? <JsonLd data={structuredData} /> : null}
      <div className={`mx-auto flex w-full flex-col items-center ${countdownAside ? "max-w-4xl xl:max-w-[70rem]" : "max-w-4xl"}`}>
        <div className="flex w-full max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black dark:text-white/72 dark:hover:text-white"
          >
            <Brand variant="horizontal" height={55} className="h-10 w-auto sm:h-[55px]" />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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
        <section className="mt-6 flex w-full flex-col items-center text-center sm:mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/70 dark:text-white/75">
            {eyebrow}
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:mt-4 sm:text-6xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
              {lead}
            </p>
          ) : null}
          {countdownControls ? (
            <div className="mt-5 w-full max-w-[31.9rem] sm:max-w-[34rem]">
              {countdownControls}
            </div>
          ) : null}
          <div
            data-countdown-layout={countdownAside ? "with-planner" : "single"}
            className={`mt-5 grid w-full grid-cols-1 items-start justify-items-center gap-12 sm:mt-8 ${countdownAside ? "xl:grid-cols-2 xl:gap-8" : ""}`}
          >
            <div className="flex w-full min-w-0 max-w-[31.9rem] flex-col items-center sm:max-w-[34rem]">
              <div className="relative w-full">
                {showChristmasFlyby ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-[4.8rem] z-10 h-7 overflow-hidden sm:h-[4.75rem]"
                  >
                    <div className="daysuntil-christmas-flyby absolute left-0 top-0">
                      <img
                        src="/seasonal/1.svg"
                        alt=""
                        className="h-auto w-[8rem] drop-shadow-[0_1px_1px_rgba(255,255,255,0.18)] dark:invert sm:w-[17.5rem]"
                      />
                    </div>
                  </div>
                ) : null}
                <CountdownDisplay
                  label={countdownLabel}
                  countdown={countdown}
                  description={countdownDescription}
                  primaryValue={countdownPrimaryValue}
                  primaryUnitLabel={countdownPrimaryUnitLabel}
                  detailLine={countdownDetailLine}
                  timeZone={countdownTimeZone}
                  headerColorClassName={
                    showChristmasFlyby
                      ? CHRISTMAS_HEADER_COLOR_CLASS_NAME
                      : undefined
                  }
                />
              </div>
              {cardActionLinks.length > 0 || countdown || calendarEvent ? (
                <div className="mt-6 flex w-full max-w-[34rem] flex-wrap justify-center gap-2 sm:gap-3">
                  {countdown ? (
                    <CountdownActionLink
                      href={getCountdownActions(actionDate ?? countdown.targetDate, countdownLabel).save}
                      className="inline-flex min-h-11 items-center rounded-[0.95rem] bg-[#315da8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#274b88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#315da8] dark:bg-[#4b74be]"
                    >
                      Save this countdown
                    </CountdownActionLink>
                  ) : null}
                  {calendarEvent ? (
                    <CalendarExportMenu event={calendarEvent} />
                  ) : null}
                  {cardActionLinks.map((link) => (
                    <CountdownActionLink
                      key={link.href}
                      href={link.href}
                      className="rounded-[0.95rem] border border-black/6 bg-[#f3f2ee] px-4 py-2.5 text-[13px] font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d] sm:px-5 sm:py-3 sm:text-sm"
                    >
                      {link.label}
                    </CountdownActionLink>
                  ))}
                </div>
              ) : null}
              {afterCardActions}
            </div>
            {countdownAside ? (
              <div className="w-full min-w-0 max-w-[31.9rem] sm:max-w-[34rem]">
                {countdownAside}
              </div>
            ) : null}
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
