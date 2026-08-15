import type { Metadata } from "next";
import Link from "next/link";
import { CountdownCalendarActions } from "../../components/CountdownCalendarActions";
import { InformationPageShell } from "../../components/InformationPageShell";
import { JsonLd } from "../../components/JsonLd";
import {
  COUNTDOWN_CALENDAR_YEAR,
  getCountdownCalendarData,
  type CountdownCalendarEvent,
} from "../../lib/countdownCalendar";
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from "../../lib/structuredData";

const path = "/2026-countdown-calendar";
const title = "2026 Countdown Calendar: Major Dates, Fridays and Weekends";
const description =
  "Plan 2026 with major dates, live counts for remaining Fridays and weekends, a printable calendar, and a free calendar download.";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `${title} | DaysUntil`,
  description,
  alternates: { canonical: path },
  openGraph: {
    title: `${title} | DaysUntil`,
    description,
    url: path,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const categoryStyles: Record<CountdownCalendarEvent["category"], string> = {
  Celebration: "bg-[#fff0e7] text-[#984716] dark:bg-[#512913] dark:text-[#ffc49d]",
  Season: "bg-[#e8f3e8] text-[#28643c] dark:bg-[#193a27] dark:text-[#9ee0b4]",
  Planning: "bg-[#e9efff] text-[#31579e] dark:bg-[#1b2e55] dark:text-[#a9c5ff]",
};

export default function CountdownCalendar2026Page() {
  const now = new Date();
  const calendar = getCountdownCalendarData(now, COUNTDOWN_CALENDAR_YEAR);
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "2026 countdown calendar", path },
    ]),
    createCollectionPageJsonLd({
      name: title,
      description,
      path,
      about: ["2026 calendar", "Countdowns", "Major dates", "Fridays", "Weekends"],
    }),
  ];

  return (
    <InformationPageShell
      eyebrow="Free planning resource"
      title="2026 countdown calendar"
      intro="A practical, printable view of the year's major dates, with live counts for the time still available."
    >
      <JsonLd data={structuredData} />

      <section className="daysuntil-calendar-print my-10 overflow-hidden rounded-[2rem] border border-[#ded6c7] bg-[linear-gradient(145deg,#fffdf7_0%,#f3ecdd_100%)] p-6 shadow-[0_22px_55px_rgba(59,48,29,0.1)] dark:border-[#403a33] dark:bg-[linear-gradient(145deg,#211e1a_0%,#171614_100%)] sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#9a6a27] dark:text-[#e1b875]">
              Year at a glance
            </p>
            <p className="mt-3 font-mono text-6xl font-semibold tracking-[-0.08em] text-black dark:text-white sm:text-7xl">
              2026
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-black/58 dark:text-white/58">
              {calendar.nextEvent
                ? `Next on this calendar: ${calendar.nextEvent.name} on ${calendar.nextEvent.dateLabel}.`
                : "Every listed date in this calendar has now passed."}
            </p>
          </div>
          <CountdownCalendarActions />
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { value: calendar.daysRemaining, label: "calendar days left" },
            { value: calendar.fridaysRemaining, label: "Fridays left" },
            { value: calendar.weekendsRemaining, label: "weekends left" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.35rem] border border-black/6 bg-white/72 p-4 dark:border-white/8 dark:bg-white/5"
            >
              <p className="font-mono text-3xl font-semibold tracking-[-0.05em] text-black dark:text-white">
                {item.value}
              </p>
              <p className="mt-1 text-xs font-medium text-black/52 dark:text-white/52">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="calendar-dates-heading" className="mt-10">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42 dark:text-white/44">
              January to December
            </p>
            <h2 id="calendar-dates-heading" className="!mt-2">
              Major dates in 2026
            </h2>
          </div>
          <p className="text-xs text-black/48 dark:text-white/48">13 useful dates</p>
        </div>

        <div className="mt-5 space-y-3">
          {calendar.events.map((event) => (
            <article
              key={event.slug}
              className={`grid gap-4 rounded-[1.45rem] border border-black/7 p-5 dark:border-white/10 sm:grid-cols-[7rem_1fr_auto] sm:items-center ${
                event.daysAway < 0
                  ? "bg-black/[0.025] opacity-65 dark:bg-white/[0.025]"
                  : "bg-[#fdfcf9] shadow-[0_8px_24px_rgba(35,30,21,0.045)] dark:bg-[#171817]"
              }`}
            >
              <div>
                <p className="font-mono text-lg font-semibold text-black dark:text-white">
                  {event.shortDateLabel}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/42 dark:text-white/45">
                  {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(event.date)}
                </p>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {event.href ? (
                    <Link
                      href={event.href}
                      className="font-semibold text-black underline decoration-black/20 underline-offset-4 transition hover:decoration-black dark:text-white dark:decoration-white/25 dark:hover:decoration-white"
                    >
                      {event.name}
                    </Link>
                  ) : (
                    <h3 className="!mt-0 font-semibold text-black dark:text-white">{event.name}</h3>
                  )}
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${categoryStyles[event.category]}`}>
                    {event.category}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-black/52 dark:text-white/54">{event.note}</p>
              </div>
              <p className="font-mono text-xs font-semibold text-black/54 dark:text-white/56 sm:text-right">
                {event.statusLabel}
              </p>
            </article>
          ))}
        </div>
      </section>

      <h2>What this calendar includes</h2>
      <p>
        This is a focused planning calendar rather than a complete public-holiday register. It
        combines widely recognized annual celebrations, the four approximate astronomical season
        changes, US Thanksgiving, and Black Friday. Country and state holidays vary, so use the
        <Link href="/us">United States</Link>, <Link href="/uk">United Kingdom</Link>, or other
        country pages when local public holidays matter.
      </p>

      <h2>Print it or add it to your calendar</h2>
      <p>
        Use <strong>Print or save as PDF</strong> for a clean paper or digital copy. The calendar
        download is a standard <strong>.ics</strong> file containing all 13 dates as all-day events.
        It can be imported into Google Calendar, Apple Calendar, Outlook, and most other calendar
        applications.
      </p>

      <h2>Keep planning from today</h2>
      <p>
        The totals at the top update through the year. For a monthly breakdown, open the dedicated
        pages for <Link href="/fridays-left-this-year">Fridays left this year</Link> or
        {" "}<Link href="/weekends-left-this-year">weekends left this year</Link>. For an exact
        deadline, use the <Link href="/business-days-until">business-days calculator</Link>.
      </p>
    </InformationPageShell>
  );
}
