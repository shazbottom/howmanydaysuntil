"use client";

import { useEffect, useState } from "react";
import type { CountdownResult } from "../lib/countdown";
import { getCountdown } from "../lib/countdown";

export interface CountdownDisplayProps {
  label: string;
  countdown: CountdownResult | null;
}

interface LiveTimeParts {
  hours: string;
  minutes: string;
  seconds: string;
}

function formatTotalUnit(value: number): string {
  return value.toLocaleString("en-GB");
}

function getLiveTimeParts(countdown: CountdownResult): LiveTimeParts {
  return {
    hours: formatTotalUnit(countdown.hoursRemaining),
    minutes: formatTotalUnit(countdown.minutesRemaining),
    seconds: formatTotalUnit(countdown.secondsRemaining),
  };
}

function formatTargetDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
}

// Component responsible for showing the computed countdown in a compact display card.
export function CountdownDisplay({
  label,
  countdown,
}: CountdownDisplayProps) {
  const [liveCountdown, setLiveCountdown] = useState<CountdownResult | null>(countdown);
  useEffect(() => {
    setLiveCountdown(countdown);
  }, [countdown]);

  useEffect(() => {
    if (!countdown) {
      return;
    }

    const intervalId = window.setInterval(() => {
      try {
        setLiveCountdown(getCountdown(countdown.targetDate));
      } catch {
        setLiveCountdown(getCountdown(countdown.targetDate, countdown.targetDate));
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [countdown]);

  if (!liveCountdown) {
    return (
      <section
        aria-label="Countdown display"
        className="w-full overflow-hidden rounded-[2rem] bg-[#fdfcf9] text-center ring-1 ring-black/6"
      >
        <div className="bg-[#18c28f] px-6 py-5 text-left text-white sm:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                Target date
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">-</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                Year
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">-</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-[4.6rem]">
          <p className="text-sm text-black/50">Enter an event or date to start a countdown.</p>
        </div>
      </section>
    );
  }

  const liveTime = getLiveTimeParts(liveCountdown);
  const timeBlocks: Array<{ value: string; label: string }> = [
    { value: liveTime.hours, label: "hrs" },
    { value: liveTime.minutes, label: "min" },
    { value: liveTime.seconds, label: "sec" },
  ];
  const targetDateLabel = formatTargetDateLabel(liveCountdown.targetDate);
  const targetYear = liveCountdown.targetDate.getFullYear();

  return (
    <section
      aria-label="Countdown display"
      className="w-full overflow-hidden rounded-[2rem] bg-[#fdfcf9] text-center ring-1 ring-black/6"
    >
      <div className="bg-[#18c28f] px-6 py-5 text-white sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
              Target date
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{targetDateLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
              Year
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{targetYear}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-[2.7rem] sm:px-8 sm:py-[3.15rem]">
          <p className="text-xs uppercase tracking-[0.24em] text-black/42">{label}</p>
        <div className="mt-7 border-b border-black/[0.05] pb-8">
          <p
            suppressHydrationWarning
            className="text-[5.5rem] font-semibold leading-none tracking-[-0.08em] text-black sm:text-[7.3rem]"
          >
            {liveCountdown.daysRemaining}
          </p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-black/42">
            {liveCountdown.daysRemaining === 1 ? "day" : "days"} remaining
          </p>
        </div>
        <div className="mt-7 flex justify-center">
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
            {timeBlocks.map((timeBlock) => (
              <div
                key={timeBlock.label}
                className="min-w-[3.25rem] -translate-x-1 sm:min-w-[4rem] sm:-translate-x-2"
              >
                <p
                  suppressHydrationWarning
                  className="font-mono text-xl font-semibold tabular-nums tracking-[0.02em] text-black sm:text-2xl"
                >
                  {timeBlock.value}
                </p>
                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-black/22 sm:text-[10px]">
                  {timeBlock.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
