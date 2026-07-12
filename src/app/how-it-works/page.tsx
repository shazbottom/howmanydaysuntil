import type { Metadata } from "next";
import Link from "next/link";
import { InformationPageShell } from "../../components/InformationPageShell";

const title = "How DaysUntil calculates dates";
const description =
  "See how DaysUntil handles calendar days, live countdowns, business days, recurring events, timezones, and source data.";

export const metadata: Metadata = {
  title: `${title} | DaysUntil`,
  description,
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: `${title} | DaysUntil`,
    description,
    url: "/how-it-works",
    type: "article",
  },
};

export default function HowItWorksPage() {
  return (
    <InformationPageShell
      eyebrow="Calculation methodology"
      title={title}
      intro="Different calendar questions need different counting rules. This page explains the assumptions used across DaysUntil."
    >
      <h2>Calendar-day countdowns</h2>
      <p>
        The large day number on a date countdown represents the difference between the start of
        today and the start of the target date in the relevant local calendar. Today therefore
        shows as zero days remaining. Tomorrow shows as one day remaining, even if there are fewer
        than 24 hours left before midnight.
      </p>
      <p>
        Weeks and days are derived from that calendar-day total. For example, 17 remaining days are
        displayed as two weeks and three days. This is intentionally different from dividing the
        live millisecond timer by 24 hours, which can be affected by the current time of day and
        daylight-saving transitions.
      </p>

      <h2>Hours, minutes, and seconds</h2>
      <p>
        The live hour, minute, and second totals measure the actual elapsed time between now and the
        target timestamp. Date-only event pages count toward the start of the event date. A custom
        countdown may also include a specific time and IANA timezone, in which case the stored time
        and timezone are used for its live timer and calendar export.
      </p>

      <h2>Recurring events</h2>
      <p>
        Annual events use one of several explicit rules. A fixed-date event such as Christmas uses
        the same month and day each year. Events such as US Thanksgiving use an nth-weekday rule.
        Easter is calculated for the relevant year and can also act as the base for events defined
        by an offset from Easter.
      </p>
      <p>
        If this year&apos;s occurrence has already passed, the countdown advances to the next valid
        occurrence. Country and regional pages use the timezone assigned to that location when
        deciding what &quot;today&quot; means.
      </p>

      <h2>Days between two dates</h2>
      <p>
        The standard date-difference calculator uses date-only values and returns the signed number
        of calendar boundaries between them. It does not remove weekends or holidays. Reversing the
        two dates reverses the sign of the result.
      </p>

      <h2>Business-day calculations</h2>
      <p>
        Business-day tools exclude Saturdays and Sundays. The start date is excluded and the end
        date is included when it is an eligible working day. When a supported country or region is
        selected, weekday public holidays in the maintained holiday table are also removed.
      </p>
      <p>
        Holiday treatment is a planning aid. It does not account for every employer shutdown,
        substitute day, industry award, bank closure, or local school schedule. When regional data
        is unavailable, the calculator falls back to supported country-level holidays.
      </p>

      <h2>Adding months and years</h2>
      <p>
        Adding days or weeks moves forward by that exact number of calendar days. Month and year
        calculations preserve the day of the month where possible. If the destination month does
        not contain that day, the result is clamped to the final valid day. For example, adding one
        month to 31 January produces the final day of February rather than rolling into March.
      </p>

      <h2>Retirement countdowns</h2>
      <p>
        The retirement calculator uses only the date of birth and retirement age entered by the
        user. It does not look up an official pension, superannuation, Social Security, or state
        retirement age. The result is a personal target-date calculation, not financial or legal
        advice.
      </p>

      <h2>Public holidays and school calendars</h2>
      <p>
        Holiday and school-calendar references are gathered from government departments, education
        authorities, and other primary public sources where available. Relevant country and region
        pages display clickable source links and a last-checked date. Some education systems set
        dates by district or school; in those cases the site identifies that limitation and links
        to the official directory.
      </p>

      <h2>Exact-date result pages</h2>
      <p>
        Any valid supported future date can be calculated through the homepage. These results are
        generated on demand for the user. Only a deliberately selected subset with demonstrated
        search demand is included in the public sitemap; this keeps the published collection
        focused while preserving the usefulness of the calculator.
      </p>

      <h2>Reporting an issue</h2>
      <p>
        For important deadlines, always confirm the result with the organisation responsible. To
        report an error, use the <Link href="/contact">contact page</Link> or email
        {" "}<a href="mailto:daysuntil.is@gmail.com">daysuntil.is@gmail.com</a> and include the URL,
        expected result, and source if applicable.
      </p>

      <h2>Last reviewed</h2>
      <p>This methodology was last reviewed on 13 July 2026.</p>
    </InformationPageShell>
  );
}
