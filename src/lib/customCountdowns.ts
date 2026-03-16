import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCountdown } from "./countdown";

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

const STORAGE_PATH = path.join(process.cwd(), "data", "custom-countdowns.json");
const SLUG_SUFFIX_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function collapseWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function createLocalDateFromIso(isoDate: string): Date | null {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
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
  let result = "";

  while (result.length < length) {
    const bytes = randomBytes(length);

    for (const byte of bytes) {
      result += SLUG_SUFFIX_ALPHABET[byte % SLUG_SUFFIX_ALPHABET.length];

      if (result.length === length) {
        break;
      }
    }
  }

  return result;
}

async function ensureStorageFile(): Promise<void> {
  await mkdir(path.dirname(STORAGE_PATH), { recursive: true });

  try {
    await readFile(STORAGE_PATH, "utf8");
  } catch {
    await writeFile(STORAGE_PATH, "[]\n", "utf8");
  }
}

async function readCustomCountdowns(): Promise<CustomCountdown[]> {
  await ensureStorageFile();
  const fileContents = await readFile(STORAGE_PATH, "utf8");

  try {
    const parsed = JSON.parse(fileContents) as CustomCountdown[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCustomCountdowns(records: CustomCountdown[]): Promise<void> {
  await ensureStorageFile();
  await writeFile(STORAGE_PATH, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

function validateCustomCountdownInput(input: CreateCustomCountdownInput): {
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
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (!title) {
    errors.title = "Enter a title for your countdown.";
  }

  if (!parsedDate) {
    errors.targetDate = "Choose a valid target date.";
  } else if (parsedDate < todayStart) {
    errors.targetDate = "Choose a target date that is today or in the future.";
  }

  if (timezone && !isValidTimeZone(timezone)) {
    errors.timezone = "Enter a valid IANA timezone, for example Australia/Sydney.";
  }

  if (note.length > 140) {
    errors.note = "Keep the note to 140 characters or fewer.";
  }

  return errors;
}

export async function createCustomCountdown(input: CreateCustomCountdownInput): Promise<{
  record?: CustomCountdown;
  errors?: {
    title?: string;
    targetDate?: string;
    timezone?: string;
    note?: string;
  };
}> {
  const errors = validateCustomCountdownInput(input);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const title = collapseWhitespace(input.title);
  const note = collapseWhitespace(input.note ?? "");
  const timezone = collapseWhitespace(input.timezone ?? "");
  const existingRecords = await readCustomCountdowns();
  const titleSlug = slugifyTitle(title);

  let slug = `${titleSlug}-${createSlugSuffix()}`;

  while (existingRecords.some((record) => record.slug === slug)) {
    slug = `${titleSlug}-${createSlugSuffix(6)}`;
  }

  const record: CustomCountdown = {
    id: randomUUID(),
    title,
    slug,
    targetDate: input.targetDate,
    timezone: timezone || undefined,
    note: note || undefined,
    createdAt: new Date().toISOString(),
    isPublic: true,
    noindex: true,
  };

  await writeCustomCountdowns([...existingRecords, record]);

  return { record };
}

export async function findCustomCountdownBySlug(slug: string): Promise<CustomCountdown | null> {
  const records = await readCustomCountdowns();

  return records.find((record) => record.slug === slug) ?? null;
}

export async function getCustomCountdownPageData(slug: string): Promise<CustomCountdownPageData | null> {
  const record = await findCustomCountdownBySlug(slug);

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
