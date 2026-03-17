import {
  findCustomCountdownBySlug,
  type CustomCountdown,
} from "./customCountdowns";

export const MY_COUNTDOWNS_STORAGE_KEY = "daysuntil_my_countdowns";
const MAX_SAVED_COUNTDOWNS = 10;

export function readSavedCountdownSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(MY_COUNTDOWNS_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

function writeSavedCountdownSlugs(slugs: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    MY_COUNTDOWNS_STORAGE_KEY,
    JSON.stringify(slugs.slice(0, MAX_SAVED_COUNTDOWNS)),
  );
}

export function saveCountdownSlug(slug: string): void {
  const existingSlugs = readSavedCountdownSlugs().filter((existingSlug) => existingSlug !== slug);
  writeSavedCountdownSlugs([slug, ...existingSlugs]);
}

export function removeSavedCountdownSlug(slug: string): void {
  writeSavedCountdownSlugs(
    readSavedCountdownSlugs().filter((existingSlug) => existingSlug !== slug),
  );
}

export function getSavedCountdowns(limit = 5): CustomCountdown[] {
  const resolvedCountdowns: CustomCountdown[] = [];
  const missingSlugs: string[] = [];

  for (const slug of readSavedCountdownSlugs()) {
    const countdown = findCustomCountdownBySlug(slug);

    if (!countdown) {
      missingSlugs.push(slug);
      continue;
    }

    resolvedCountdowns.push(countdown);

    if (resolvedCountdowns.length === limit) {
      break;
    }
  }

  if (missingSlugs.length > 0) {
    writeSavedCountdownSlugs(
      readSavedCountdownSlugs().filter((slug) => !missingSlugs.includes(slug)),
    );
  }

  return resolvedCountdowns;
}
