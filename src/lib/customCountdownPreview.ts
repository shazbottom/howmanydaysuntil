import { getCountdown } from "./countdown";
import { formatShortDate } from "./dateFormat";
import {
  createLocalDateFromIso,
  formatCustomCountdownDate,
} from "./customCountdowns";

function collapseWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
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
    formattedDate: formatCustomCountdownDate(targetDate, "en-GB"),
    shortDate: formatShortDate(targetDate, "en-GB"),
  };
}
