"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getRecentCustomCountdowns, type CustomCountdown } from "../lib/customCountdowns";

export function MyCountdownsDropdown() {
  const [countdowns, setCountdowns] = useState<CustomCountdown[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCountdowns(getRecentCustomCountdowns(5));
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!isReady || countdowns.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
      >
        <span>My countdowns</span>
        <span
          aria-hidden="true"
          className={`text-[10px] text-black/60 transition-transform dark:text-white/58 ${isOpen ? "rotate-180" : ""}`}
        >
          v
        </span>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-full z-30 mt-[14px] w-[min(20rem,80vw)] overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#171717] dark:shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <div className="border-b border-black/6 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42 dark:border-white/10 dark:text-white/44">
            Your countdowns
          </div>
          <div className="py-2">
            {countdowns.map((countdown) => (
              <Link
                key={countdown.slug}
                href={`/c/${countdown.slug}`}
                onClick={() => setIsOpen(false)}
                className="block cursor-pointer px-4 py-3 text-sm text-black/74 transition hover:bg-[#f6f6f6] hover:text-black dark:text-white/74 dark:hover:bg-white/6 dark:hover:text-white"
              >
                {countdown.title}
              </Link>
            ))}
          </div>
          <div className="border-t border-black/6 p-2 dark:border-white/10">
            <Link
              href="/create"
              onClick={() => setIsOpen(false)}
              className="block rounded-[0.95rem] px-4 py-3 text-sm font-medium text-black transition hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 dark:text-white/88 dark:hover:bg-white/8 dark:focus-visible:ring-[#4ab494]/28"
            >
              Create new countdown
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
