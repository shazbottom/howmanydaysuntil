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

export const CUSTOM_COUNTDOWNS_STORAGE_KEY = "daysuntil_custom_countdowns";
const MAX_CUSTOM_COUNTDOWNS = 50;
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

function slugifyTitle(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseSlug || "countdown";
}

function createSlugSuffix(length = 5): string {
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);

    return Array.from(bytes, (byte) => SLUG_SUFFIX_ALPHABET[byte % SLUG_SUFFIX_ALPHABET.length]).join("");
  }

  return Array.from({ length }, () =>
    SLUG_SUFFIX_ALPHABET[Math.floor(Math.random() * SLUG_SUFFIX_ALPHABET.length)],
  ).join("");
}

function createCountdownId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `countdown-${Date.now()}-${createSlugSuffix(8)}`;
}

export function readCustomCountdowns(): CustomCountdown[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(CUSTOM_COUNTDOWNS_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value): value is CustomCountdown => {
      if (!value || typeof value !== "object") {
        return false;
      }

      const candidate = value as Partial<CustomCountdown>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.title === "string" &&
        typeof candidate.slug === "string" &&
        typeof candidate.targetDate === "string" &&
        typeof candidate.createdAt === "string"
      );
    });
  } catch {
    return [];
  }
}

function writeCustomCountdowns(records: CustomCountdown[]): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(
      CUSTOM_COUNTDOWNS_STORAGE_KEY,
      JSON.stringify(records.slice(0, MAX_CUSTOM_COUNTDOWNS)),
    );
    return true;
  } catch {
    return false;
  }
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

export function createCustomCountdown(input: CreateCustomCountdownInput): {
  record?: CustomCountdown;
  errors?: {
    title?: string;
    targetDate?: string;
    timezone?: string;
    note?: string;
    form?: string;
  };
} {
  const errors = validateCustomCountdownInput(input);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const title = collapseWhitespace(input.title);
  const note = collapseWhitespace(input.note ?? "");
  const timezone = collapseWhitespace(input.timezone ?? "");
  const existingRecords = readCustomCountdowns();
  const titleSlug = slugifyTitle(title);

  let slug = `${titleSlug}-${createSlugSuffix()}`;

  while (existingRecords.some((record) => record.slug === slug)) {
    slug = `${titleSlug}-${createSlugSuffix(6)}`;
  }

  const record: CustomCountdown = {
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

  const nextRecords = [record, ...existingRecords.filter((existingRecord) => existingRecord.slug !== slug)];

  if (!writeCustomCountdowns(nextRecords)) {
    return {
      errors: {
        form: "Unable to save this countdown on this device.",
      },
    };
  }

  return { record };
}

export function findCustomCountdownBySlug(slug: string): CustomCountdown | null {
  return readCustomCountdowns().find((record) => record.slug === slug) ?? null;
}

export function getRecentCustomCountdowns(limit = 10): CustomCountdown[] {
  return readCustomCountdowns().slice(0, limit);
}

export function getCustomCountdownPageData(slug: string): CustomCountdownPageData | null {
  const record = findCustomCountdownBySlug(slug);

  if (!record) {
    return null;
  }

  const targetDate = createLocalDateFromIso(record.targetDate);

  if (!targetDate) {
    return null;
  }

  let countdown: ReturnType<typeof getCountdown> | null = null;

  try {
    countdown = getCountdown(targetDate);
  } catch {
    countdown = null;
  }

  return {
    record,
    targetDate,
    countdown,
  };
}
