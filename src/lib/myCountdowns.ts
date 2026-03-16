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

export function saveCountdownSlug(slug: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const existingSlugs = readSavedCountdownSlugs().filter((existingSlug) => existingSlug !== slug);
  const nextSlugs = [slug, ...existingSlugs].slice(0, MAX_SAVED_COUNTDOWNS);

  window.localStorage.setItem(MY_COUNTDOWNS_STORAGE_KEY, JSON.stringify(nextSlugs));
}

export function removeSavedCountdownSlug(slug: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const nextSlugs = readSavedCountdownSlugs().filter((existingSlug) => existingSlug !== slug);
  window.localStorage.setItem(MY_COUNTDOWNS_STORAGE_KEY, JSON.stringify(nextSlugs));
}
