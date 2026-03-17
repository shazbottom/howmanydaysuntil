"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CustomCountdown } from "../lib/customCountdowns";
import {
  buildGoogleCalendarUrl,
  downloadIcsFile,
  getCustomCountdownCalendarDates,
} from "../lib/calendarEvent";

interface AddToCalendarMenuProps {
  record: CustomCountdown;
}

export function AddToCalendarMenu({ record }: AddToCalendarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const googleCalendarUrl = useMemo(
    () => (currentUrl ? buildGoogleCalendarUrl(record, currentUrl) : null),
    [currentUrl, record],
  );

  useEffect(() => {
    setCurrentUrl(window.location.href);
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

  if (!getCustomCountdownCalendarDates(record)) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
      >
        Add to calendar
      </button>
      {isOpen ? (
        <div className="absolute left-1/2 top-full z-30 mt-3 w-[min(14rem,70vw)] -translate-x-1/2 overflow-hidden rounded-[1.25rem] border border-black/8 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#171717] dark:shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <div className="py-2">
            {googleCalendarUrl ? (
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-left text-sm text-black/74 transition hover:bg-[#f6f6f6] hover:text-black dark:text-white/74 dark:hover:bg-white/6 dark:hover:text-white"
              >
                Google Calendar
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (currentUrl) {
                  downloadIcsFile(record, currentUrl);
                }
                setIsOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm text-black/74 transition hover:bg-[#f6f6f6] hover:text-black dark:text-white/74 dark:hover:bg-white/6 dark:hover:text-white"
            >
              Download .ics
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
