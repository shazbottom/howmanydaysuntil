"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "./Brand";
import type { CountdownLinkItem } from "./CountdownLinkList";
import { CountdownDisplay } from "./CountdownDisplay";
import { EventChipList, type EventChip } from "./EventChipList";
import { EventInput } from "./EventInput";
import { MyCountdownsDropdown } from "./MyCountdownsDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { events } from "../data/events";
import { getCountdown, startOfLocalDay, type CountdownResult } from "../lib/countdown";
import { formatLongDate, formatShortDate } from "../lib/dateFormat";
import { resolveEventDate } from "../lib/eventCountdown";
import { getNextEasterDate } from "../lib/easterDate";
import { getExactDateRoutePath } from "../lib/exactDatePages";
import { getNextDecadeDate, getNextMonthDate, getNextYearDate } from "../lib/milestoneDates";
import { parseInput, type ParseResult } from "../lib/parseInput";
import { getSeoLandingPath } from "../lib/seoLandingPages";

interface ResolvedCountdownState {
  label: string;
  inputValue: string;
  countdown: CountdownResult;
  selectedSlug: string | null;
}

const QUICK_EVENT_CHIPS: EventChip[] = [
  { slug: "christmas", label: "Christmas" },
  { slug: "halloween", label: "Halloween" },
  { slug: "new-year", label: "New Year" },
  { slug: "valentines-day", label: "Valentine's Day" },
  { slug: "thanksgiving", label: "Thanksgiving" },
  { slug: "easter", label: "Easter" },
];

const POPULAR_COUNTDOWN_LINKS = [
  { href: "/days-until-christmas", label: "Days until Christmas" },
  { href: "/days-until-halloween", label: "Days until Halloween" },
  { href: "/days-until-new-year", label: "Days until New Year" },
  { href: "/days-until-valentines-day", label: "Days until Valentine's Day" },
  { href: "/days-until-thanksgiving", label: "Days until Thanksgiving" },
];

const MILESTONE_BUTTONS = [
  { label: "Next Month", getTargetDate: getNextMonthDate },
  { label: "Next Year", getTargetDate: getNextYearDate },
  { label: "Next Decade", getTargetDate: getNextDecadeDate },
] as const;

const MAJOR_EVENT_SLUGS = [
  "christmas",
  "halloween",
  "new-year",
  "valentines-day",
  "thanksgiving",
  "easter",
] as const;

const CHRISTMAS_FLYBY_FRAMES = [
  "/seasonal/1.svg",
] as const;

function isSameLocalDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getNextWeekdayDate(weekday: number, now: Date): Date {
  const currentWeekday = now.getDay();
  const offset = (weekday - currentWeekday + 7) % 7;

  if (offset === 0) {
    return now;
  }

  const candidate = new Date(now);
  candidate.setDate(now.getDate() + offset);

  return startOfLocalDay(candidate);
}

function resolveParseResultToState(
  parseResult: ParseResult,
  rawInput: string,
  now: Date,
): { state: ResolvedCountdownState | null; error: string | null } {
  if (parseResult.type === "invalid") {
    return {
      state: null,
      error: "Invalid date. Try formats like: 25 Dec 2026, 2026-12-25, or 25/12/2026.",
    };
  }

  if (parseResult.type === "date") {
    const targetDate = isSameLocalDay(parseResult.value.date, now)
      ? now
      : startOfLocalDay(parseResult.value.date);

    if (targetDate < now && !isSameLocalDay(targetDate, now)) {
      return {
        state: null,
        error: "That date has already passed. Enter a future date instead.",
      };
    }

    return {
      state: {
        label: formatShortDate(targetDate, "en-GB"),
        inputValue: formatShortDate(targetDate, "en-GB"),
        countdown: getCountdown(targetDate, now),
        selectedSlug: null,
      },
      error: null,
    };
  }

  if (parseResult.type === "year") {
    const targetDate = new Date(parseResult.value.year, 0, 1);

    if (targetDate < startOfLocalDay(now)) {
      return {
        state: null,
        error: "That year has already started. Enter a future year instead.",
      };
    }

    return {
      state: {
        label: parseResult.value.year.toString(),
        inputValue: rawInput,
        countdown: getCountdown(targetDate, now),
        selectedSlug: null,
      },
      error: null,
    };
  }

  if (parseResult.type === "weekday") {
    const targetDate = getNextWeekdayDate(parseResult.value.weekday, now);

    return {
      state: {
        label: parseResult.value.label,
        inputValue: rawInput,
        countdown: getCountdown(targetDate, now),
        selectedSlug: parseResult.value.label.toLowerCase(),
      },
      error: null,
    };
  }

  const targetDate = resolveEventDate(parseResult.event, now);

  if (!targetDate) {
    return {
      state: null,
      error: "That event is not supported yet.",
    };
  }

  return {
    state: {
      label: parseResult.event.name,
      inputValue: parseResult.event.name,
      countdown: getCountdown(targetDate, now),
      selectedSlug: parseResult.event.slug,
    },
    error: null,
  };
}

function buildStateFromQuery(input: string, now: Date = new Date()): {
  state: ResolvedCountdownState | null;
  error: string | null;
} {
  return resolveParseResultToState(parseInput(input), input, now);
}

function buildStateFromTargetDate(
  label: string,
  targetDate: Date,
  selectedSlug: string | null = null,
  now: Date = new Date(),
): { state: ResolvedCountdownState | null; error: string | null } {
  const normalizedTargetDate = startOfLocalDay(targetDate);

  if (normalizedTargetDate < startOfLocalDay(now)) {
    return {
      state: null,
      error: "That date has already passed. Enter a future date instead.",
    };
  }

  return {
    state: {
      label,
      inputValue: label,
      countdown: getCountdown(normalizedTargetDate, now),
      selectedSlug,
    },
    error: null,
  };
}

function getNearestMajorEventLink(now: Date): CountdownLinkItem | null {
  const candidates = MAJOR_EVENT_SLUGS.map((slug) => {
    const event = events.find((candidate) => candidate.slug === slug);
    const targetDate = event ? resolveEventDate(event, now) : null;

    if (!event || !targetDate) {
      return null;
    }

      return {
      href: getSeoLandingPath(event.slug),
      label: `Days until ${event.name}`,
      targetDate,
    };
  }).filter(
    (
      candidate,
    ): candidate is {
      href: string;
      label: string;
      targetDate: Date;
    } => candidate !== null,
  );

  candidates.sort((left, right) => left.targetDate.getTime() - right.targetDate.getTime());
  return candidates[0] ?? null;
}

function getComingUpSoonLinks(now: Date): CountdownLinkItem[] {
  const nextMonth = getNextMonthDate();
  const nextYear = getNextYearDate();
  const nearestMajorEvent = getNearestMajorEventLink(now);

  const links: CountdownLinkItem[] = [
    { href: "/days-until-friday", label: "Days until Friday" },
    { href: "/days-until-weekend", label: "Days until the weekend" },
    {
      href: getExactDateRoutePath(nextMonth),
      label: `Next month (${new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(nextMonth)})`,
    },
    {
      href: getExactDateRoutePath(nextYear),
      label: `Next year (${nextYear.getFullYear()})`,
    },
  ];

  if (nearestMajorEvent) {
    links.push(nearestMajorEvent);
  }

  return links;
}

function getExploreByMonthLinks(now: Date): CountdownLinkItem[] {
  return Array.from({ length: 4 }, (_, index) => {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth() + index + 1, 1);
    return {
      href: getExactDateRoutePath(firstDayOfMonth),
      label: new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
      }).format(firstDayOfMonth),
    };
  });
}

function PreviewChipLinks({
  title,
  links,
  emphasis = "standard",
}: {
  title: string;
  links: CountdownLinkItem[];
  emphasis?: "primary" | "standard" | "muted";
}) {
  const sectionClasses =
    emphasis === "primary"
      ? "mt-20 w-full border-t border-black/10 pt-14 text-center dark:border-white/10"
      : emphasis === "muted"
        ? "mt-24 w-full border-t border-black/8 pt-14 text-center dark:border-white/8"
        : "mt-22 w-full border-t border-black/10 pt-14 text-center dark:border-white/10";
  const titleClasses =
    emphasis === "primary"
      ? "text-sm uppercase tracking-[0.24em] text-black/56 dark:text-white/58"
      : emphasis === "muted"
        ? "text-sm uppercase tracking-[0.24em] text-black/38 dark:text-white/40"
        : "text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46";
  const chipClasses =
    emphasis === "muted"
      ? "rounded-[0.95rem] border border-black/4 bg-[#f0ede6] px-4 py-2.5 text-[13px] font-medium text-black/60 shadow-[0_1px_2px_rgba(16,24,40,0.035)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-black/7 hover:bg-[#e9e5dc] hover:text-black/72 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/14 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/7 dark:bg-[#181a19] dark:text-white/60 dark:shadow-[0_1px_2px_rgba(0,0,0,0.12)] dark:hover:bg-[#1e201f] dark:hover:text-white/76 dark:focus-visible:ring-[#4ab494]/18 dark:focus-visible:ring-offset-[#0d0d0d]"
      : emphasis === "primary"
        ? "rounded-[0.95rem] border border-black/6 bg-[#f2f0ea] px-4 py-2.5 text-[13px] font-medium text-black/72 shadow-[0_1px_2px_rgba(16,24,40,0.045)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-black/9 hover:bg-[#ebe8e0] hover:text-black/84 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/16 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/9 dark:bg-[#1b1d1c] dark:text-white/72 dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)] dark:hover:bg-[#212423] dark:hover:text-white/84 dark:focus-visible:ring-[#4ab494]/22 dark:focus-visible:ring-offset-[#0d0d0d]"
        : "rounded-[0.95rem] border border-black/5 bg-[#f1efe9] px-4 py-2.5 text-[13px] font-medium text-black/68 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:border-black/8 hover:bg-[#ebe8e0] hover:text-black/78 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/16 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/8 dark:bg-[#1a1c1b] dark:text-white/68 dark:shadow-[0_1px_2px_rgba(0,0,0,0.14)] dark:hover:bg-[#202322] dark:hover:text-white/82 dark:focus-visible:ring-[#4ab494]/22 dark:focus-visible:ring-offset-[#0d0d0d]";

  return (
    <section className={sectionClasses}>
      <h2 className={titleClasses}>{title}</h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={chipClasses}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HomepagePreviewClient() {
  const [query, setQuery] = useState("");
  const [resolvedState, setResolvedState] = useState<ResolvedCountdownState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [christmasFrameIndex, setChristmasFrameIndex] = useState(0);

  const previewNow = useMemo(() => new Date(), []);
  const comingUpSoonLinks = useMemo(() => getComingUpSoonLinks(previewNow), [previewNow]);
  const exploreByMonthLinks = useMemo(() => getExploreByMonthLinks(previewNow), [previewNow]);

  function submitQuery(nextQuery: string) {
    const result = buildStateFromQuery(nextQuery);

    setQuery(nextQuery);
    setResolvedState(result.state);
    setError(result.error);
  }

  function submitMilestone(label: string, targetDate: Date) {
    const result = buildStateFromTargetDate(label, targetDate);

    setQuery(label);
    setResolvedState(result.state);
    setError(result.error);
  }

  function submitQuickChip(event: EventChip) {
    if (event.slug === "easter") {
      const result = buildStateFromTargetDate(event.label, getNextEasterDate(), event.slug);

      setQuery(event.label);
      setResolvedState(result.state);
      setError(result.error);
      return;
    }

    submitQuery(event.label);
  }

  const showChristmasPreview = resolvedState?.selectedSlug === "christmas";

  useEffect(() => {
    if (!showChristmasPreview) {
      setChristmasFrameIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setChristmasFrameIndex((currentFrameIndex) =>
        (currentFrameIndex + 1) % CHRISTMAS_FLYBY_FRAMES.length,
      );
    }, 150);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [showChristmasPreview]);

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
            <MyCountdownsDropdown />
          </div>
        </div>
        <section className="mt-20 flex w-full flex-1 flex-col items-center text-center">
          <p className="rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/52 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/54">
            Preview prototype
          </p>
          <div className="mt-6 w-full max-w-[46rem]">
            <EventInput
              value={query}
              onValueChange={setQuery}
              onSubmit={() => submitQuery(query)}
              onDatePick={(nextDate) => {
                setQuery(nextDate);
                submitQuery(nextDate);
              }}
              fieldLabel="Enter a date or event"
              placeholder="Try Christmas, Friday, or 25 Dec 2026"
              variant="preview"
            />
          </div>
          <div className="mt-5 flex w-full max-w-[34rem] flex-wrap justify-center gap-3">
            {MILESTONE_BUTTONS.map((milestone) => (
              (() => {
                const isSelected = resolvedState?.label === milestone.label;

                return (
              <button
                key={milestone.label}
                type="button"
                onClick={() => {
                  const targetDate = milestone.getTargetDate();
                  submitMilestone(milestone.label, targetDate);
                }}
                className={`rounded-[1.05rem] px-5 py-3 text-sm font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-200 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0d0d0d] ${
                  isSelected
                    ? "border border-[#B0C4DE] bg-[#B0C4DE] text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(16,24,40,0.04)] hover:bg-[#a7bdd8] focus-visible:ring-[#B0C4DE]/34 dark:border-[#7f96b1] dark:bg-[#7f96b1] dark:text-[#0d1117] dark:hover:bg-[#8ca3be] dark:focus-visible:ring-[#B0C4DE]/30"
                    : "border border-black/6 bg-[#f3f2ee] text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#eceae4] focus-visible:ring-[#169c76]/20 dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28"
                }`}
              >
                {milestone.label}
              </button>
                );
              })()
            ))}
          </div>
          <div className="mt-6 w-full max-w-[34rem]">
            <EventChipList
              events={QUICK_EVENT_CHIPS}
              selectedSlug={resolvedState?.selectedSlug ?? null}
              onSelect={submitQuickChip}
              variant="preview"
            />
          </div>
          {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}
          <div className="relative mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
            {showChristmasPreview ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[4.8rem] z-10 h-[4.75rem] overflow-hidden"
              >
                <div className="daysuntil-christmas-flyby absolute left-0 top-0">
                  <img
                    src={CHRISTMAS_FLYBY_FRAMES[christmasFrameIndex]}
                    alt=""
                    className="h-auto w-[15.5rem] drop-shadow-[0_1px_1px_rgba(255,255,255,0.18)] sm:w-[17.5rem]"
                  />
                </div>
              </div>
            ) : null}
            <CountdownDisplay
              label={resolvedState?.label ?? "Countdown"}
              countdown={resolvedState?.countdown ?? null}
              fullHeightWhenEmpty
              headerColorClassName="bg-[#6495ED] dark:bg-[#4b74be]"
            />
          </div>
        </section>
        <PreviewChipLinks title="Popular countdowns" links={POPULAR_COUNTDOWN_LINKS} emphasis="primary" />
        <PreviewChipLinks title="Coming up soon" links={comingUpSoonLinks} />
        <PreviewChipLinks title="Explore by month" links={exploreByMonthLinks} emphasis="muted" />
      </div>
    </main>
  );
}
