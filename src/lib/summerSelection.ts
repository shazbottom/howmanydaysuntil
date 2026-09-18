import { summerSolstices } from "../data/summerSolstices";
import { getCountdown, type CountdownResult } from "./countdown";

export type SummerSearchParams = Record<string, string | string[] | undefined>;
export type SummerSelection = { method: "legacy" | "meteorological" | "astronomical"; hemisphere: "north" | "south" };
export const LEGACY_SUMMER: SummerSelection = { method: "legacy", hemisphere: "north" };

export function localizedSummerSelection(countryCode: string): SummerSelection {
  return { method: "meteorological", hemisphere: countryCode === "au" || countryCode === "nz" ? "south" : "north" };
}

export function parseSummerSelection(params: SummerSearchParams = {}): SummerSelection {
  if ((params.method !== "meteorological" && params.method !== "astronomical") ||
      (params.hemisphere !== "north" && params.hemisphere !== "south")) return LEGACY_SUMMER;
  return { method: params.method, hemisphere: params.hemisphere };
}

export function summerSelectionQuery(selection: SummerSelection): string {
  return selection.method === "legacy" ? "" : `?${new URLSearchParams({ method: selection.method, hemisphere: selection.hemisphere })}`;
}

export function summerSelectionLabel(selection: SummerSelection): string {
  if (selection.method === "legacy") return "Original: June 21 (approximate Northern Hemisphere)";
  return `${selection.hemisphere === "north" ? "Northern" : "Southern"} Hemisphere ${selection.method} summer (UTC)`;
}

// A local date carrier lets existing calendar-day counters work from UTC civil dates.
// Never use this carrier as the astronomical timestamp.
export function utcCivilDate(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function summerTargetForYear(selection: SummerSelection, year: number): Date | null {
  if (selection.method === "legacy") return new Date(year, 5, 21);
  if (selection.method === "meteorological") return new Date(Date.UTC(year, selection.hemisphere === "north" ? 5 : 11, 1));
  const instant = summerSolstices[year]?.[selection.hemisphere];
  return instant ? new Date(instant) : null;
}

export function getSelectedSummerTargets(selection: SummerSelection, now: Date, rowCount = 5): Date[] {
  if (selection.method === "legacy") throw new Error("Legacy summer uses the existing event resolver.");
  const today = now.toISOString().slice(0, 10);
  const currentYear = now.getUTCFullYear();
  const first = summerTargetForYear(selection, currentYear);
  // Missing maintained data is not permission to substitute an approximate date.
  if (!first) return [];
  const firstYear = first.toISOString().slice(0, 10) < today ? currentYear + 1 : currentYear;
  const targets: Date[] = [];
  for (let year = firstYear; targets.length < rowCount; year += 1) {
    const target = summerTargetForYear(selection, year);
    if (!target) break;
    targets.push(target);
  }
  return targets;
}

export function getSummerCountdown(target: Date, now: Date): CountdownResult {
  const result = getCountdown(target, now > target ? target : now);
  const daysRemaining = Math.max(0, Math.round((Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate()) -
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())) / 86_400_000));
  return { ...result, daysRemaining, weeksRemaining: { weeks: Math.floor(daysRemaining / 7), days: daysRemaining % 7 } };
}

export function formatSummerUtcDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date);
}

export function selectedSummerNote(selection: SummerSelection, target: Date): string {
  const base = `${summerSelectionLabel(selection)}. Dates, Fridays, weekends and today use UTC, not your device timezone. The target day remains selected until the next UTC day; eligible today and target days are included.`;
  return selection.method === "astronomical"
    ? `${base} Solstice: ${target.toISOString().slice(0, 16).replace("T", " ")} UTC, at the source's minute precision. GMT source times are represented as UTC for planning; no sub-minute accuracy is claimed. Maintained astronomical dates cover 2026-2035 only.`
    : `${base} This convention starts summer on ${selection.hemisphere === "north" ? "June 1" : "December 1"} at 00:00 UTC; it is not a weather forecast or school-holiday calendar.`;
}
