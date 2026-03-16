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
  compactHours: string;
  compactMinutes: string;
  compactSeconds: string;
}

function formatTotalUnit(value: number): string {
  return value.toLocaleString("en-GB");
}

function formatCompactTotalUnit(value: number): string {
  if (value < 10000) {
    return formatTotalUnit(value);
  }

  const compactUnits = [
    { value: 1_000_000_000, suffix: "B" },
    { value: 1_000_000, suffix: "M" },
    { value: 1_000, suffix: "K" },
  ];

  for (const unit of compactUnits) {
    if (value >= unit.value) {
      const compactValue = value / unit.value;
      const roundedValue =
        compactValue >= 100 ? compactValue.toFixed(0) : compactValue.toFixed(1);

      return `${roundedValue.replace(/\.0$/, "")}${unit.suffix}`;
    }
  }

  return formatTotalUnit(value);
}

function getLiveTimeParts(countdown: CountdownResult): LiveTimeParts {
  return {
    hours: formatTotalUnit(countdown.hoursRemaining),
    minutes: formatTotalUnit(countdown.minutesRemaining),
    seconds: formatTotalUnit(countdown.secondsRemaining),
    compactHours: formatCompactTotalUnit(countdown.hoursRemaining),
    compactMinutes: formatCompactTotalUnit(countdown.minutesRemaining),
    compactSeconds: formatCompactTotalUnit(countdown.secondsRemaining),
  };
}

function formatTargetDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
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
        <div className="px-8 py-[4.83rem]">
          <p className="text-sm text-black/50">Enter an event or date to start a countdown.</p>
        </div>
      </section>
    );
  }

  const liveTime = getLiveTimeParts(liveCountdown);
  const timeBlocks: Array<{ value: string; compactValue: string; label: string }> = [
    { value: liveTime.hours, compactValue: liveTime.compactHours, label: "hrs" },
    { value: liveTime.minutes, compactValue: liveTime.compactMinutes, label: "min" },
    { value: liveTime.seconds, compactValue: liveTime.compactSeconds, label: "sec" },
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
      <div className="px-5 py-[2.84rem] sm:px-8 sm:py-[3.31rem]">
        <p className="text-xs uppercase tracking-[0.24em] text-black/42">{label}</p>
        <div className="mt-7 border-b border-black/[0.05] pb-8">
          <p
            suppressHydrationWarning
            className="text-[clamp(4.35rem,22vw,5.5rem)] font-semibold leading-none tracking-[-0.08em] text-black sm:text-[7.3rem]"
          >
            {liveCountdown.daysRemaining}
          </p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-black/42">
            {liveCountdown.daysRemaining === 1 ? "day" : "days"} remaining
          </p>
        </div>
        <div className="mt-7 flex justify-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-5 min-[380px]:gap-x-6 sm:grid sm:grid-cols-3 sm:gap-10">
            {timeBlocks.map((timeBlock) => (
              <div
                key={timeBlock.label}
                className="min-w-[5.2rem] basis-[5.2rem] text-center sm:min-w-[4rem] sm:basis-auto sm:-translate-x-2"
              >
                <p
                  suppressHydrationWarning
                  className="font-mono text-lg font-semibold tabular-nums tracking-[0.01em] text-black min-[380px]:text-xl sm:text-2xl"
                >
                  <span className="sm:hidden">{timeBlock.compactValue}</span>
                  <span className="hidden sm:inline">{timeBlock.value}</span>
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
