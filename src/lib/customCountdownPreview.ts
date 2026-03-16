import { getCountdown } from "./countdown";
import { formatFullDate, formatShortDate } from "./dateFormat";

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

export function buildCustomCountdownPreview(input: {
  title: string;
  targetDate: string;
  timezone?: string;
  note?: string;
}) {
  const title = collapseWhitespace(input.title) || "Your countdown";
  const note = collapseWhitespace(input.note ?? "") || undefined;
  const timezone = collapseWhitespace(input.timezone ?? "") || undefined;
  const targetDate = createLocalDateFromIso(input.targetDate);

  if (!targetDate) {
    return {
      title,
      note,
      timezone,
      targetDate: null,
      countdown: null,
      formattedDate: null,
      shortDate: null,
    };
  }

  let countdown: ReturnType<typeof getCountdown> | null = null;

  try {
    countdown = getCountdown(targetDate);
  } catch {
    countdown = null;
  }

  return {
    title,
    note,
    timezone,
    targetDate,
    countdown,
    formattedDate: formatFullDate(targetDate, "en-GB"),
    shortDate: formatShortDate(targetDate, "en-GB"),
  };
}
