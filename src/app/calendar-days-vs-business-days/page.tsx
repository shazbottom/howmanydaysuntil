import type { Metadata } from "next";
import Link from "next/link";
import { InformationPageShell } from "../../components/InformationPageShell";
import { JsonLd } from "../../components/JsonLd";
import { createBreadcrumbJsonLd, createWebPageJsonLd } from "../../lib/structuredData";

const title = "Calendar days vs business days";
const description =
  "Learn the difference between calendar days and business days, how weekends and public holidays change a deadline, and which date calculator to use.";
const path = "/calendar-days-vs-business-days";

export const metadata: Metadata = {
  title: title + " | DaysUntil",
  description,
  alternates: { canonical: path },
  openGraph: {
    title: title + " | DaysUntil",
    description,
    url: path,
    type: "article",
  },
  twitter: { card: "summary", title: title + " | DaysUntil", description },
};

const comparisonRows = [
  {
    question: "Are Saturdays and Sundays counted?",
    calendar: "Yes",
    business: "Usually no",
  },
  {
    question: "Are public holidays counted?",
    calendar: "Yes",
    business: "Usually no, when the holiday calendar is known",
  },
  {
    question: "Best used for",
    calendar: "Birthdays, trips, events and elapsed time",
    business: "Office deadlines, delivery windows and processing times",
  },
  {
    question: "Does location matter?",
    calendar: "Normally no",
    business: "Yes, because public holidays vary",
  },
];

export default function CalendarDaysVsBusinessDaysPage() {
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: title, path },
    ]),
    createWebPageJsonLd({
      name: title,
      description,
      path,
      about: "Calendar days and business days",
    }),
  ];

  return (
    <InformationPageShell
      eyebrow="Date planning guide"
      title={title}
      intro="The same two dates can produce two correct answers. The right one depends on whether every date counts or only working days count."
    >
      <JsonLd data={structuredData} />

      <h2>The short answer</h2>
      <p>
        <strong>Calendar days</strong> include every date on the calendar: weekdays, weekends and
        public holidays. <strong>Business days</strong> normally mean Monday to Friday after
        weekends have been removed. A location-aware calculation may also remove public holidays
        for the selected country, state or region.
      </p>
      <p>
        A holiday countdown is normally a calendar-day question. A promise to respond within five
        business days is a working-day question. Mixing the two can move an expected deadline by
        several days.
      </p>

      <div className="my-8 overflow-x-auto rounded-[1.4rem] border border-black/8 dark:border-white/10">
        <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
          <thead className="bg-[#f3f2ee] text-black/65 dark:bg-[#1d1f1e] dark:text-white/68">
            <tr>
              <th className="px-4 py-3 font-semibold">Question</th>
              <th className="px-4 py-3 font-semibold">Calendar days</th>
              <th className="px-4 py-3 font-semibold">Business days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/7 bg-[#fdfcf9] dark:divide-white/9 dark:bg-[#171717]">
            {comparisonRows.map((row) => (
              <tr key={row.question}>
                <th className="px-4 py-3 font-medium text-black/72 dark:text-white/74">
                  {row.question}
                </th>
                <td className="px-4 py-3 text-black/60 dark:text-white/62">{row.calendar}</td>
                <td className="px-4 py-3 text-black/60 dark:text-white/62">{row.business}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>A worked example</h2>
      <p>
        Consider Monday 14 December to Monday 21 December 2026. The dates are seven calendar days
        apart. If the start date is excluded and the end date is included, there are five
        Monday-to-Friday business days in that interval: Tuesday through Friday, then Monday.
      </p>
      <p>
        That five-day result assumes no relevant public holiday. If a weekday holiday falls inside
        the range, a location-aware business-day result can fall again. The calendar-day result
        remains seven because weekends and holidays never leave the calendar.
      </p>

      <h2>Does the first day count?</h2>
      <p>
        This is a separate decision from choosing calendar or business days. Some instructions
        count both the start and end dates. Others begin on the day after an action. DaysUntil&apos;s
        difference and business-day tools exclude the start date and count forward to the end
        date. That matches common deadline wording such as &quot;within five days after&quot;, but a
        contract, court or employer may define its own rule.
      </p>

      <h2>Why public holidays need a location</h2>
      <p>
        Weekends are predictable, but holiday calendars are not universal. A date can be a normal
        working day in one country and a public holiday in another. State and regional holidays can
        create differences inside the same country. Choose a country and region when the deadline
        depends on actual office or government opening days.
      </p>

      <h2>Choose the right calculator</h2>
      <ul>
        <li>
          Use <Link href="/days-between-dates">days between dates</Link> when every calendar date
          should count.
        </li>
        <li>
          Use <Link href="/business-days-between-dates">business days between dates</Link> for a
          fixed start and end date with weekends and supported holidays removed.
        </li>
        <li>
          Use <Link href="/business-days-until">business days until a date</Link> when the starting
          point is today.
        </li>
        <li>
          Use the <Link href="/year-planner">year planner</Link> for a quick view of the Fridays,
          weekends and Monday-to-Friday days still available this year.
        </li>
      </ul>

      <h2>Common mistakes</h2>
      <p>
        Check whether the start date is included, whether the end date itself must be a working
        day, and whether a deadline rolls forward when it lands on a weekend. For formal legal,
        banking or employment deadlines, use the calculator as a planning check and confirm the
        final interpretation with the organisation that set the rule.
      </p>

      <h2>Related date rules</h2>
      <p>
        Long date ranges can also cross February 29. Read{" "}
        <Link href="/how-leap-years-affect-date-calculations">
          how leap years affect date calculations
        </Link>{" "}
        before comparing annual periods or moving a date by whole years.
      </p>
    </InformationPageShell>
  );
}
