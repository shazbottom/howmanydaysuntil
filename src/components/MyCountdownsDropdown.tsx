"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  readSavedCountdownSlugs,
  removeSavedCountdownSlug,
} from "../lib/myCountdowns";

interface SavedCountdownLink {
  slug: string;
  title: string;
  path: string;
}

export function MyCountdownsDropdown() {
  const [countdowns, setCountdowns] = useState<SavedCountdownLink[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadCountdowns() {
      const savedSlugs = readSavedCountdownSlugs().slice(0, 5);

      if (savedSlugs.length === 0) {
        if (!isCancelled) {
          setCountdowns([]);
          setIsReady(true);
        }
        return;
      }

      const resolvedCountdowns = await Promise.all(
        savedSlugs.map(async (slug) => {
          try {
            const response = await fetch(`/api/custom-countdowns/${slug}`, {
              cache: "no-store",
            });

            if (!response.ok) {
              removeSavedCountdownSlug(slug);
              return null;
            }

            const payload = (await response.json()) as SavedCountdownLink;
            return payload;
          } catch {
            return null;
          }
        }),
      );

      if (!isCancelled) {
        setCountdowns(
          resolvedCountdowns.filter(
            (countdown): countdown is SavedCountdownLink => countdown !== null,
          ),
        );
        setIsReady(true);
      }
    }

    void loadCountdowns();

    return () => {
      isCancelled = true;
    };
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
        className="inline-flex items-center gap-2 rounded-full bg-black/[0.055] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.085] active:bg-black/[0.11]"
      >
        <span>My countdowns</span>
        <span
          aria-hidden="true"
          className={`text-[10px] text-black/60 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          v
        </span>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-full z-30 mt-[14px] w-[min(20rem,80vw)] overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div className="border-b border-black/6 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42">
            Your countdowns
          </div>
          <div className="py-2">
            {countdowns.map((countdown) => (
              <Link
                key={countdown.slug}
                href={countdown.path}
                onClick={() => setIsOpen(false)}
                className="block cursor-pointer px-4 py-3 text-sm text-black/74 transition hover:bg-[#f6f6f6] hover:text-black"
              >
                {countdown.title}
              </Link>
            ))}
          </div>
          <div className="border-t border-black/6 p-2">
            <Link
              href="/create"
              onClick={() => setIsOpen(false)}
              className="block rounded-[1rem] px-4 py-3 text-sm font-medium text-black transition hover:bg-black/[0.04]"
            >
              Create new countdown
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
