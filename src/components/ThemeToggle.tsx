"use client";

import { useEffect, useState } from "react";
import {
  applyThemePreference,
  getStoredThemePreference,
  persistThemePreference,
  type ThemePreference,
} from "../lib/theme";

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialPreference = getStoredThemePreference();
    setPreference(initialPreference);
    applyThemePreference(initialPreference);
    setIsReady(true);
  }, []);

  function toggleTheme() {
    const nextPreference: ThemePreference = preference === "dark" ? "light" : "dark";
    setPreference(nextPreference);
    persistThemePreference(nextPreference);
    applyThemePreference(nextPreference);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isReady && preference === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={preference === "dark"}
      className="relative inline-flex h-10 w-[4.4rem] items-center rounded-[999px] border border-black/8 bg-[#f3f2ee] px-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] transition-[background-color,border-color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] active:bg-[#e5e2db] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.05)] dark:hover:bg-[#232625] dark:active:bg-[#292c2b] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
    >
      <span className="sr-only">
        {isReady && preference === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </span>
      <span className="flex w-full items-center justify-between px-1 text-[13px] text-black/42 dark:text-white/42">
        <span aria-hidden="true">☀</span>
        <span aria-hidden="true">☾</span>
      </span>
      <span
        aria-hidden="true"
        className={`absolute flex h-7 w-7 items-center justify-center rounded-full border border-black/6 bg-white text-[13px] text-black shadow-[0_2px_8px_rgba(16,24,40,0.12)] transition-transform duration-200 dark:border-white/10 dark:bg-[#121313] dark:text-white dark:shadow-[0_6px_16px_rgba(0,0,0,0.35)] ${
          preference === "dark" ? "translate-x-[2rem]" : "translate-x-0"
        }`}
      >
        {preference === "dark" ? "☾" : "☀"}
      </span>
    </button>
  );
}
