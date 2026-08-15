import {
  buildCountdownCalendarIcs,
  COUNTDOWN_CALENDAR_YEAR,
} from "../../../lib/countdownCalendar";

export function GET() {
  return new Response(buildCountdownCalendarIcs(COUNTDOWN_CALENDAR_YEAR), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="daysuntil-2026-countdown-calendar.ics"',
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
