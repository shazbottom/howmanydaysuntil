"use client";

import { useEffect, useRef, useState } from "react";
import { trackAction } from "../lib/actionAnalytics";
import {
  buildAllDayGoogleCalendarUrl,
  downloadAllDayIcsFile,
  type AllDayCalendarEvent,
} from "../lib/calendarEvent";

export function CalendarExportMenu({ event }: { event: AllDayCalendarEvent }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const googleCalendarUrl = buildAllDayGoogleCalendarUrl(event);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(clickEvent: MouseEvent) {
      if (!containerRef.current?.contains(clickEvent.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(keyboardEvent: KeyboardEvent) {
      if (keyboardEvent.key === "Escape") {
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

  if (!googleCalendarUrl) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:hover:bg-[#232625]"
      >
        Add to calendar
      </button>
      {isOpen ? (
        <div className="absolute left-1/2 top-full z-30 mt-3 w-[min(14rem,70vw)] -translate-x-1/2 overflow-hidden rounded-[1.25rem] border border-black/8 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#171717] dark:shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <div className="py-2">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => { trackAction("calendar_google"); setIsOpen(false); }}
              className="block px-4 py-3 text-left text-sm text-black/74 transition hover:bg-[#f6f6f6] hover:text-black dark:text-white/74 dark:hover:bg-white/6 dark:hover:text-white"
            >
              Google Calendar
            </a>
            <button
              type="button"
              onClick={() => {
                downloadAllDayIcsFile(event);
                trackAction("calendar_download");
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
