"use client";

import { track } from "@vercel/analytics";

type Action = "calculation" | "calendar_google" | "calendar_download" | "countdown_saved" | "widget_copy" | "tool_followthrough";

export function trackAction(action: Action) {
  // Fixed event names only: never send entered dates, titles, notes or share URLs.
  if (process.env.NODE_ENV !== "production") return;
  try {
    track(action);
  } catch {
    // Analytics must never prevent a visitor from completing an action.
  }
}
