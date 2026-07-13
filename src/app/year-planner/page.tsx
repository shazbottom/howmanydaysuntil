import type { Metadata } from "next";
import Link from "next/link";
import { InformationPageShell } from "../../components/InformationPageShell";
import { JsonLd } from "../../components/JsonLd";
import { createBreadcrumbJsonLd, createWebPageJsonLd } from "../../lib/structuredData";
import { getYearPlanningData, yearPlanningPaths } from "../../lib/yearPlanning";

const description =
  "Plan the rest of the year with live counts for remaining Fridays, weekends, and Monday-to-Friday working days.";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const year = new Date().getFullYear();
  const pageTitle = `${year} Year Planner: Fridays, Weekends and Working Days | DaysUntil`;
  return {
    title: pageTitle,
    description,
    alternates: { canonical: "/year-planner" },
    openGraph: {
      title: pageTitle,
      description,
      url: "/year-planner",
      type: "website",
    },
    twitter: { card: "summary", title: pageTitle, description },
  };
}

export default function YearPlannerPage() {
  const now = new Date();
  const year = now.getFullYear();
  const cards = [
    getYearPlanningData("fridays", now),
    getYearPlanningData("weekends", now),
    getYearPlanningData("working-days", now),
  ];
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Year planner", path: "/year-planner" },
    ]),
    createWebPageJsonLd({
      name: `${year} year planner`,
      description,
      path: "/year-planner",
      about: `Planning the remainder of ${year}`,
    }),
  ];

  return (
    <InformationPageShell
      eyebrow="Calendar planning"
      title={`${year} year planner`}
      intro="A practical snapshot of the Fridays, weekends, and Monday-to-Friday working days still available this year."
    >
      <JsonLd data={structuredData} />
      <section className="my-10 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.kind}
            href={yearPlanningPaths[card.kind]}
            style={{ textDecoration: "none" }}
            className="group rounded-[1.6rem] border border-black/7 bg-[#fdfcf9] p-5 shadow-[0_10px_28px_rgba(33,29,20,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(33,29,20,0.1)] dark:border-white/10 dark:bg-[#171717]"
          >
            <p className="font-mono text-4xl font-semibold tracking-[-0.06em] text-black dark:text-white">
              {card.count}
            </p>
            <p className="mt-3 text-sm font-semibold text-black dark:text-white">
              {card.countLabel}
            </p>
            <p className="mt-2 text-xs leading-5 text-black/50 dark:text-white/52">
              View the monthly breakdown
            </p>
          </Link>
        ))}
      </section>

      <h2>Use the right count for the job</h2>
      <p>
        Fridays are useful for weekly deadlines and recurring plans. Weekends are useful for trips,
        events, and household projects. Working-day counts are useful for delivery windows and
        office planning, although public holidays must be considered separately for an accurate
        regional result.
      </p>

      <h2>What is included</h2>
      <p>
        Each count begins today and runs through December 31. Today is included when it matches the
        category being counted. The detail pages show how the remaining total is distributed across
        each month, making the result easier to use than a single annual number.
      </p>

      <h2>For public-holiday-aware planning</h2>
      <p>
        Use the <Link href="/business-days-until">business-days-until calculator</Link> when public
        holidays need to be removed. It supports country and regional calendars where maintained
        data is available.
      </p>
    </InformationPageShell>
  );
}
