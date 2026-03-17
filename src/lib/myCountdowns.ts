export const MY_COUNTDOWNS_STORAGE_KEY = "daysuntil_my_countdowns";
const MAX_SAVED_COUNTDOWNS = 10;

export interface SavedCountdownReference {
  slug: string;
  title: string;
}

function toSavedCountdownReference(value: unknown): SavedCountdownReference | null {
  if (typeof value === "string") {
    return {
      slug: value,
      title: value,
    };
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SavedCountdownReference>;

  if (typeof candidate.slug !== "string" || typeof candidate.title !== "string") {
    return null;
  }

  return {
    slug: candidate.slug,
    title: candidate.title,
  };
}

export function readSavedCountdowns(): SavedCountdownReference[] {
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

    return parsedValue
      .map((value) => toSavedCountdownReference(value))
      .filter((value): value is SavedCountdownReference => value !== null);
  } catch {
    return [];
  }
}

function writeSavedCountdowns(countdowns: SavedCountdownReference[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    MY_COUNTDOWNS_STORAGE_KEY,
    JSON.stringify(countdowns.slice(0, MAX_SAVED_COUNTDOWNS)),
  );
}

export function saveCountdownReference(countdown: SavedCountdownReference): void {
  const existingCountdowns = readSavedCountdowns().filter(
    (existingCountdown) => existingCountdown.slug !== countdown.slug,
  );
  writeSavedCountdowns([countdown, ...existingCountdowns]);
}

export function removeSavedCountdownSlug(slug: string): void {
  writeSavedCountdowns(
    readSavedCountdowns().filter((existingCountdown) => existingCountdown.slug !== slug),
  );
}

export function getSavedCountdowns(limit = 5): SavedCountdownReference[] {
  return readSavedCountdowns().slice(0, limit);
}
