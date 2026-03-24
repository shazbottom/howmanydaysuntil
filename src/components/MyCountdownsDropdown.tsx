"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getSavedCountdowns,
  removeSavedCountdownSlug,
  type SavedCountdownReference,
} from "../lib/myCountdowns";

export function MyCountdownsDropdown() {
  const [countdowns, setCountdowns] = useState<SavedCountdownReference[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCountdowns(getSavedCountdowns(5));
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

  function handleRemoveCountdown(slug: string) {
    removeSavedCountdownSlug(slug);
    setCountdowns((currentCountdowns) =>
      currentCountdowns.filter((countdown) => countdown.slug !== slug),
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
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
            {isReady && countdowns.length === 0 ? (
              <div className="px-4 py-3 text-sm text-black/46 dark:text-white/46">
                No saved countdowns yet
              </div>
            ) : (
              countdowns.map((countdown) => (
                <div
                  key={countdown.slug}
                  className="group flex items-center gap-2 px-2"
                >
                  <Link
                    href={`/c/${countdown.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="min-w-0 flex-1 rounded-[0.95rem] px-2 py-3 text-sm text-black/74 transition hover:bg-[#f6f6f6] hover:text-black dark:text-white/74 dark:hover:bg-white/6 dark:hover:text-white"
                  >
                    <span className="block truncate">{countdown.title}</span>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Remove ${countdown.title} from saved countdowns`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleRemoveCountdown(countdown.slug);
                    }}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.85rem] text-black/32 transition hover:bg-black/[0.04] hover:text-black/58 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 dark:text-white/28 dark:hover:bg-white/8 dark:hover:text-white/56 dark:focus-visible:ring-[#4ab494]/28"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4.5 5.5h11" />
                      <path d="M7.5 5.5V4.4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1.1" />
                      <path d="M6.2 5.5l.55 8.1c.04.7.63 1.24 1.33 1.24h3.8c.7 0 1.29-.54 1.33-1.24l.55-8.1" />
                      <path d="M8.6 8.2v4.4" />
                      <path d="M11.4 8.2v4.4" />
                    </svg>
                  </button>
                </div>
              ))
            )}
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
