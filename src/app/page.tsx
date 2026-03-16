"use client";

import Link from "next/link";
import { useState } from "react";
import { Brand } from "../components/Brand";
import { CountdownLinkList } from "../components/CountdownLinkList";
import { CountdownDisplay } from "../components/CountdownDisplay";
import { DateFormatHelp } from "../components/DateFormatHelp";
import { EventChipList, type EventChip } from "../components/EventChipList";
import { EventInput } from "../components/EventInput";
import { MyCountdownsDropdown } from "../components/MyCountdownsDropdown";
import { events } from "../data/events";
import { getCountdown, startOfLocalDay, type CountdownResult } from "../lib/countdown";
import { formatShortDate } from "../lib/dateFormat";
import { resolveEventDate } from "../lib/eventCountdown";
import { getNextEasterDate } from "../lib/easterDate";
import { getNextDecadeDate, getNextMonthDate, getNextYearDate } from "../lib/milestoneDates";
import { parseInput, type ParseResult } from "../lib/parseInput";

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
  { href: "/days-until/christmas", label: "Days until Christmas" },
  { href: "/days-until/halloween", label: "Days until Halloween" },
  { href: "/days-until/new-year", label: "Days until New Year" },
  { href: "/days-until/valentines-day", label: "Days until Valentine's Day" },
  { href: "/days-until/thanksgiving", label: "Days until Thanksgiving" },
];

const MILESTONE_BUTTONS = [
  { label: "Next Month", getTargetDate: getNextMonthDate },
  { label: "Next Year", getTargetDate: getNextYearDate },
  { label: "Next Decade", getTargetDate: getNextDecadeDate },
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

export default function Home() {
  const defaultCountdown = buildStateFromQuery("Christmas");
  const [query, setQuery] = useState(defaultCountdown.state?.inputValue ?? "Christmas");
  const [resolvedState, setResolvedState] = useState<ResolvedCountdownState | null>(
    defaultCountdown.state,
  );
  const [error, setError] = useState<string | null>(defaultCountdown.error);

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

  function clearQuery() {
    setQuery("");
    setResolvedState(null);
    setError(null);
  }

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
          <MyCountdownsDropdown />
        </div>
        <section className="mt-20 flex w-full flex-1 flex-col items-center text-center">
          <div className="w-full max-w-[46rem]">
            <EventInput
              value={query}
              onValueChange={setQuery}
              onSubmit={() => submitQuery(query)}
            />
          </div>
          <DateFormatHelp
            hasValue={query.trim().length > 0}
            onClear={clearQuery}
            onDatePick={(nextDate) => {
              setQuery(nextDate);
              submitQuery(nextDate);
            }}
          />
          <div className="mt-5 flex w-full max-w-[34rem] flex-wrap justify-center gap-3">
            {MILESTONE_BUTTONS.map((milestone) => (
              <button
                key={milestone.label}
                type="button"
                onClick={() => {
                  const targetDate = milestone.getTargetDate();
                  submitMilestone(milestone.label, targetDate);
                }}
                className="rounded-full bg-black/[0.055] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.085] active:bg-black/[0.11]"
              >
                {milestone.label}
              </button>
            ))}
          </div>
          <div className="mt-6 w-full max-w-[34rem]">
            <EventChipList
              events={QUICK_EVENT_CHIPS}
              selectedSlug={resolvedState?.selectedSlug ?? null}
              onSelect={submitQuickChip}
            />
          </div>
          {error ? (
            <p className="mt-5 text-sm text-red-600">{error}</p>
          ) : (
            <p className="mt-5 text-sm text-black/45">
              Supports common events, years, weekdays, and exact dates.
            </p>
          )}
          <div className="mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
            <CountdownDisplay
              label={resolvedState?.label ?? "Countdown"}
              countdown={resolvedState?.countdown ?? null}
            />
          </div>
        </section>
        <CountdownLinkList
          title="Popular countdowns"
          links={POPULAR_COUNTDOWN_LINKS}
          centered
        />
      </div>
    </main>
  );
}
