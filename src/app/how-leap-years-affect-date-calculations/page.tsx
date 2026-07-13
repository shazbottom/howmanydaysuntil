import type { Metadata } from "next";
import Link from "next/link";
import { InformationPageShell } from "../../components/InformationPageShell";
import { JsonLd } from "../../components/JsonLd";
import { createBreadcrumbJsonLd, createWebPageJsonLd } from "../../lib/structuredData";

const title = "How leap years affect date calculations";
const description =
  "Understand leap-year rules, why February 29 changes date differences, and what happens when adding months or years around leap day.";
const path = "/how-leap-years-affect-date-calculations";

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

const exampleYears = [
  { year: 2024, result: "Leap year", reason: "Divisible by 4" },
  { year: 2028, result: "Leap year", reason: "Divisible by 4" },
  { year: 1900, result: "Not a leap year", reason: "Century year not divisible by 400" },
  { year: 2000, result: "Leap year", reason: "Divisible by 400" },
  { year: 2100, result: "Not a leap year", reason: "Century year not divisible by 400" },
];

export default function LeapYearDateCalculationsPage() {
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: title, path },
    ]),
    createWebPageJsonLd({
      name: title,
      description,
      path,
      about: "Leap years and date calculations",
    }),
  ];

  return (
    <InformationPageShell
      eyebrow="Date planning guide"
      title={title}
      intro="February usually has 28 days. In a leap year it has 29, and that extra date can change annual comparisons, countdowns and date adjustments."
    >
      <JsonLd data={structuredData} />

      <h2>The leap-year rule</h2>
      <p>A Gregorian calendar year is a leap year when:</p>
      <ul>
        <li>the year is divisible by 4;</li>
        <li>unless it is also divisible by 100;</li>
        <li>but a year divisible by 400 is a leap year after all.</li>
      </ul>
      <p>
        The century exception is why 2000 contained February 29 but 1900 did not. It also means
        2100 will not be a leap year, even though a simple every-four-years pattern might suggest
        otherwise.
      </p>

      <div className="my-8 overflow-hidden rounded-[1.4rem] border border-black/8 dark:border-white/10">
        <div className="grid grid-cols-[0.6fr_1fr_1.8fr] bg-[#f3f2ee] px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/58 dark:bg-[#1d1f1e] dark:text-white/60">
          <span>Year</span>
          <span>Result</span>
          <span>Why</span>
        </div>
        <div className="divide-y divide-black/7 bg-[#fdfcf9] dark:divide-white/9 dark:bg-[#171717]">
          {exampleYears.map((example) => (
            <div
              key={example.year}
              className="grid grid-cols-[0.6fr_1fr_1.8fr] gap-3 px-4 py-3 text-sm"
            >
              <span className="font-mono font-semibold">{example.year}</span>
              <span>{example.result}</span>
              <span className="text-black/58 dark:text-white/60">{example.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <h2>How the extra day changes a date difference</h2>
      <p>
        A period crossing February can be one day longer when February 29 sits inside the range.
        For example, 1 January 2028 to 1 January 2029 spans 366 calendar days. The same dates across
        most neighbouring years span 365 days.
      </p>
      <p>
        The extra day matters to a total expressed in days, but it does not mean every anniversary
        is delayed. A fixed annual event such as Christmas still lands on December 25. The number
        of days between January and that event is simply one day larger when leap day is inside the
        interval.
      </p>

      <h2>Adding one year to February 29</h2>
      <p>
        February 29 does not exist in a normal year, so software needs an explicit fallback rule.
        DaysUntil clamps an annual adjustment to the last valid day of the destination month.
        Adding one year to 29 February 2028 therefore produces 28 February 2029 rather than rolling
        into March.
      </p>
      <p>
        The same principle applies at month ends. Adding one month to a date such as 31 January
        uses the final valid day in February. This preserves the idea of a month-based adjustment
        better than allowing the result to spill unpredictably into the following month.
      </p>

      <h2>Birthdays and anniversaries</h2>
      <p>
        People born on February 29 still become a year older each year, but the date used for a
        celebration or a legal age rule can vary by personal choice and local law. A calculator can
        apply a consistent calendar fallback, but it should not be treated as a legal ruling for
        eligibility, contracts or official deadlines.
      </p>

      <h2>Business-day calculations</h2>
      <p>
        Leap day is handled like any other calendar date. It counts as a potential business day
        when it falls Monday to Friday, unless a relevant holiday rule removes it. The additional
        date can therefore increase both a calendar-day count and a business-day count, but not
        necessarily by the same amount.
      </p>

      <h2>Check a date range</h2>
      <ul>
        <li>
          Use <Link href="/days-between-dates">days between dates</Link> to see whether February 29
          adds a day to a particular range.
        </li>
        <li>
          Use <Link href="/add-or-subtract-date">add or subtract a date</Link> to test a month-end or
          leap-day adjustment.
        </li>
        <li>
          Read <Link href="/calendar-days-vs-business-days">calendar days vs business days</Link>{" "}
          when weekends and public holidays also affect the answer.
        </li>
      </ul>
    </InformationPageShell>
  );
}
