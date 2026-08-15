"use client";

export function CountdownCalendarActions() {
  return (
    <div className="daysuntil-print-hide flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-11 items-center rounded-[1rem] bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#313131] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/15 dark:bg-[#f5f3ee] dark:text-[#171717] dark:hover:bg-white"
      >
        Print or save as PDF
      </button>
      <a
        href="/2026-countdown-calendar/download"
        download
        className="inline-flex h-11 items-center rounded-[1rem] border border-black/8 bg-white px-5 text-sm font-semibold text-black no-underline transition hover:bg-[#f2efe8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/10 dark:border-white/12 dark:bg-[#1b1d1c] dark:text-white dark:hover:bg-[#242725]"
      >
        Download calendar (.ics)
      </a>
    </div>
  );
}
