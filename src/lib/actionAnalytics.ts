"use client";

import { track } from "@vercel/analytics";
import type { CalculatorKind } from "./calculatorPages";

type Action = "calculation" | "calendar_google" | "calendar_download" | "countdown_saved" | "widget_copy" | "tool_followthrough" | "calculation_link_copy";

export interface ActionContext {
  surface: "home" | "countdown" | "calculator";
  tool?: CalculatorKind;
}

export function trackAction(action: Action, context?: ActionContext) {
  // Fixed categories only: never send entered dates, titles, notes or share URLs.
  if (process.env.NODE_ENV !== "production") return;
  try {
    track(action, context ? { surface: context.surface, ...(context.tool ? { tool: context.tool } : {}) } : undefined);
  } catch {
    // Analytics must never prevent a visitor from completing an action.
  }
}
