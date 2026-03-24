"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { countries } from "../lib/countries";

export function CountrySelectorDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
      >
        <span>Country</span>
        <span
          aria-hidden="true"
          className={`text-[10px] text-black/60 transition-transform dark:text-white/58 ${isOpen ? "rotate-180" : ""}`}
        >
          v
        </span>
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-full z-30 mt-[14px] w-[min(18rem,80vw)] overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#171717] dark:shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <div className="p-2">
            {countries.map((country) => (
              <Link
                key={country.code}
                href={`/${country.code}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-[0.95rem] px-3 py-3 text-sm text-black/74 transition hover:bg-[#f6f6f6] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 dark:text-white/74 dark:hover:bg-white/6 dark:hover:text-white dark:focus-visible:ring-[#4ab494]/28"
              >
                <span>{country.name}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/36 dark:text-white/34">
                  {country.code}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
