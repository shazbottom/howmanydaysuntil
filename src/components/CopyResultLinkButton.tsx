"use client";

import { useState } from "react";
import { trackAction } from "../lib/actionAnalytics";
import type { CalculatorKind } from "../lib/calculatorPages";

const SITE_URL = "https://daysuntil.is";

async function copyText(value: string) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall back when Clipboard API access is unavailable in this context.
    }
  }

  const previousFocus = document.activeElement;
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("aria-label", "Result link");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  try {
    input.select();
    if (!document.execCommand("copy")) {
      throw new Error("Copy is unavailable");
    }
  } finally {
    input.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }
}

export function CopyResultLinkButton({ path, tool }: { path: string; tool?: CalculatorKind }) {
  const [status, setStatus] = useState<{ path: string; outcome: "copied" | "failed" } | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const outcome = status?.path === path ? status.outcome : null;

  async function handleCopy() {
    setIsCopying(true);
    try {
      await copyText(new URL(path, SITE_URL).toString());
      setStatus({ path, outcome: "copied" });
      trackAction("calculation_link_copy", { surface: "calculator", tool });
    } catch {
      setStatus({ path, outcome: "failed" });
    } finally {
      setIsCopying(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        disabled={isCopying}
        className="min-h-11 rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 disabled:opacity-60 dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:hover:bg-[#232625]"
      >
        {isCopying ? "Copying..." : outcome === "copied" ? "Link copied" : "Copy link to return to this result"}
      </button>
      <p role="status" aria-live="polite" aria-atomic="true" className="text-xs leading-5 text-black/60 dark:text-white/65">
        {outcome === "copied" ? "Link copied. Open it to restore these inputs and recalculate." : outcome === "failed" ? "Could not copy the link. Try again or copy the result link below." : ""}
      </p>
      <a href={path} className="inline-flex min-h-11 items-center text-xs text-black/70 underline underline-offset-2 focus-visible:outline-2 dark:text-white/75">Open link to bookmark</a>
    </div>
  );
}
