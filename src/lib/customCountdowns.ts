import { getCountdown } from "./countdown";
import { formatFullDate } from "./dateFormat";

export interface CustomCountdown {
  id: string;
  title: string;
  slug: string;
  targetDate: string;
  timezone?: string;
  note?: string;
  createdAt: string;
  isPublic: boolean;
  noindex: boolean;
}

export interface CreateCustomCountdownInput {
  title: string;
  targetDate: string;
  timezone?: string;
  note?: string;
}

export interface CustomCountdownPageData {
  record: CustomCountdown;
  targetDate: Date;
  countdown: ReturnType<typeof getCountdown> | null;
}
const SLUG_SUFFIX_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function collapseWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function createLocalDateFromIso(isoDate: string): Date | null {
  const match = isoDate.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/,
  );

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText, hourText = "0", minuteText = "0"] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hours = Number(hourText);
  const minutes = Number(minuteText);
  const date = new Date(year, month - 1, day, hours, minutes);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hours ||
    date.getMinutes() !== minutes
  ) {
    return null;
  }

  return date;
}

function hasExplicitTime(value: string): boolean {
  return value.includes("T");
}

export function formatCustomCountdownDate(date: Date, locale = "en-GB"): string {
  if (date.getHours() === 0 && date.getMinutes() === 0) {
    return formatFullDate(date, locale);
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat("en-GB", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export function slugifyTitle(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseSlug || "countdown";
}

export function createSlugSuffix(length = 5): string {
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);

    return Array.from(bytes, (byte) => SLUG_SUFFIX_ALPHABET[byte % SLUG_SUFFIX_ALPHABET.length]).join("");
  }

  return Array.from({ length }, () =>
    SLUG_SUFFIX_ALPHABET[Math.floor(Math.random() * SLUG_SUFFIX_ALPHABET.length)],
  ).join("");
}

export function createCountdownId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `countdown-${Date.now()}-${createSlugSuffix(8)}`;
}

export function validateCustomCountdownInput(input: CreateCustomCountdownInput): {
  title?: string;
  targetDate?: string;
  timezone?: string;
  note?: string;
} {
  const errors: {
    title?: string;
    targetDate?: string;
    timezone?: string;
    note?: string;
  } = {};

  const title = collapseWhitespace(input.title);
  const note = collapseWhitespace(input.note ?? "");
  const timezone = collapseWhitespace(input.timezone ?? "");
  const parsedDate = createLocalDateFromIso(input.targetDate);
  const now = new Date();
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!title) {
    errors.title = "Enter a title for your countdown.";
  }

  if (!parsedDate) {
    errors.targetDate = "Choose a valid target date and time.";
  } else if (
    (hasExplicitTime(input.targetDate) && parsedDate < now) ||
    (!hasExplicitTime(input.targetDate) && parsedDate < nowStart)
  ) {
    errors.targetDate = "Choose a target date and time that is in the future.";
  }

  if (timezone && !isValidTimeZone(timezone)) {
    errors.timezone = "Enter a valid IANA timezone, for example Australia/Sydney.";
  }

  if (note.length > 140) {
    errors.note = "Keep the note to 140 characters or fewer.";
  }

  return errors;
}

export function buildCustomCountdownRecord(
  input: CreateCustomCountdownInput,
  slug: string,
): CustomCountdown {
  const title = collapseWhitespace(input.title);
  const note = collapseWhitespace(input.note ?? "");
  const timezone = collapseWhitespace(input.timezone ?? "");

  return {
    id: createCountdownId(),
    title,
    slug,
    targetDate: input.targetDate,
    timezone: timezone || undefined,
    note: note || undefined,
    createdAt: new Date().toISOString(),
    isPublic: true,
    noindex: true,
  };
}
