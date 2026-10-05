import { getCountryByCode, type CountryCode } from "./countries";
import { getRegionById } from "./regions";

export interface CountdownActionContext {
  countryCode?: CountryCode;
  regionId?: string;
  timeZone?: string;
}

export function formatActionDate(date: Date, timeZone?: string) {
  if (timeZone) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(date);
    const part = (type: string) => parts.find((value) => value.type === type)?.value;
    return `${part("year")}-${part("month")}-${part("day")}`;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getCountdownActions(date: Date, title: string, context: CountdownActionContext = {}) {
  const target = formatActionDate(date, context.timeZone);
  const personal = new URLSearchParams({ date: target, title }).toString();
  const business = new URLSearchParams({ target });
  const country = getCountryByCode(context.countryCode ?? "");
  if (country) {
    business.set("country", country.code);
    const region = context.regionId ? getRegionById(context.regionId) : null;
    if (region?.countryCode === country.code) business.set("region", region.id);
  }
  return {
    business: `/business-days-until?${business.toString()}`,
    compare: `/days-between-dates?end=${target}`,
    adjust: `/add-or-subtract-date?start=${target}`,
    widget: `/countdown-widget?${personal}`,
    save: `/create?${personal}`,
  };
}

export function parseCountdownPrefill(params: Record<string, string | string[] | undefined>) {
  const single = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const date = single(params.date) ?? "";
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00`) : null;
  const valid = parsed && Number.isFinite(parsed.getTime()) && formatActionDate(parsed) === date
    && parsed.getFullYear() >= 1900 && parsed.getFullYear() <= 2100;
  return {
    title: (single(params.title) ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
    targetDate: valid ? `${date}T00:00` : "",
  };
}
