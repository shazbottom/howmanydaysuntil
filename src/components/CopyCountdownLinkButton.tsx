"use client";

import { useState } from "react";

export function CopyCountdownLinkButton() {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      className="rounded-full bg-black/[0.055] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.085] active:bg-black/[0.11]"
    >
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
