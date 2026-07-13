"use client";

import { useEffect, useState } from "react";
import type { CountdownWidgetConfig } from "../lib/countdownWidget";
import { parseWidgetTargetDate } from "../lib/countdownWidget";
import { getCountdown, type CountdownResult } from "../lib/countdown";

function resolveWidgetCountdown(targetDateText: string): CountdownResult | null {
  const parsedDate = parseWidgetTargetDate(targetDateText);

  if (!parsedDate) {
    return null;
  }

  const now = new Date();
  const targetDate = parsedDate.getTime() < now.getTime() ? now : parsedDate;

  return getCountdown(targetDate, now);
}

function formatTargetDate(targetDateText: string) {
  const targetDate = parseWidgetTargetDate(targetDateText);

  if (!targetDate) {
    return "Choose a future date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(targetDate);
}

function getClockParts(countdown: CountdownResult | null) {
  const totalSeconds = Math.max(
    0,
    Math.floor((countdown?.totalMillisecondsRemaining ?? 0) / 1000),
  );

  return {
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function padClockPart(value: number) {
  return String(value).padStart(2, "0");
}

export function CountdownWidget({ config }: { config: CountdownWidgetConfig }) {
  const [countdown, setCountdown] = useState<CountdownResult | null>(() =>
    resolveWidgetCountdown(config.targetDate),
  );

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(resolveWidgetCountdown(config.targetDate));
    };
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [config.targetDate]);

  const clock = getClockParts(countdown);
  const dark = config.theme === "dark";

  return (
    <main
      className={`flex min-h-screen w-full items-center justify-center p-3 ${
        dark ? "bg-[#111312] text-white" : "bg-[#f7f4ed] text-[#171717]"
      }`}
    >
      <section
        aria-label={`${config.title} countdown widget`}
        className={`relative flex h-full min-h-[12rem] w-full flex-col overflow-hidden rounded-[1.45rem] border px-5 py-4 shadow-[0_18px_45px_rgba(32,28,20,0.12)] ${
          dark
            ? "border-white/10 bg-[#191c1b]"
            : "border-black/8 bg-white"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: config.accent }} />
        <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] ${dark ? "text-white/45" : "text-black/42"}`}>
          Live countdown
        </p>
        <h1 className="mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">
          {config.title}
        </h1>
        <div className="mt-auto flex items-end justify-between gap-4 pt-3">
          <div>
            <p
              suppressHydrationWarning
              className="text-6xl font-semibold leading-none tracking-[-0.08em] sm:text-7xl"
            >
              {countdown?.daysRemaining ?? 0}
            </p>
            <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] ${dark ? "text-white/48" : "text-black/45"}`}>
              days remaining
            </p>
          </div>
          <div className="pb-1 text-right">
            <p suppressHydrationWarning className="font-mono text-sm tabular-nums">
              {padClockPart(clock.hours)}:{padClockPart(clock.minutes)}:{padClockPart(clock.seconds)}
            </p>
            <p className={`mt-2 max-w-[12rem] text-xs leading-5 ${dark ? "text-white/55" : "text-black/55"}`}>
              {formatTargetDate(config.targetDate)}
            </p>
          </div>
        </div>
        <a
          href="https://daysuntil.is/countdown-widget"
          target="_blank"
          rel="noopener"
          className={`mt-3 border-t pt-2 text-[10px] font-medium tracking-[0.08em] ${
            dark
              ? "border-white/8 text-white/42 hover:text-white/70"
              : "border-black/7 text-black/38 hover:text-black/65"
          }`}
        >
          Powered by DaysUntil
        </a>
      </section>
    </main>
  );
}
