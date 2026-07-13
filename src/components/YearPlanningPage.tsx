import Link from "next/link";
import { CountdownLinkList } from "./CountdownLinkList";
import { SeoCountdownPage } from "./SeoCountdownPage";
import { getYearPlanningData, type YearPlanningKind } from "../lib/yearPlanning";
import { createBreadcrumbJsonLd, createWebPageJsonLd } from "../lib/structuredData";

export function YearPlanningPage({ kind }: { kind: YearPlanningKind }) {
  const data = getYearPlanningData(kind);
  const currentPath =
    kind === "fridays"
      ? "/fridays-left-this-year"
      : kind === "weekends"
        ? "/weekends-left-this-year"
        : "/working-days-left-this-year";
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Year planner", path: "/year-planner" },
      { name: data.title, path: currentPath },
    ]),
    createWebPageJsonLd({
      name: data.title,
      description: data.description,
      path: currentPath,
      about: `${data.countLabel} in ${data.year}`,
    }),
  ];

  return (
    <SeoCountdownPage
      eyebrow="Year planning"
      title={data.title}
      lead={data.lead}
      countdownLabel={String(data.year)}
      countdown={data.countdown}
      countdownPrimaryValue={data.count}
      countdownPrimaryUnitLabel={data.countLabel}
      countdownDetailLine={data.detailLine}
      supportingCopy={[]}
      relatedLinks={data.relatedLinks}
      structuredData={structuredData}
      extraSection={
        <>
          <section className="mt-12 w-full max-w-[31.9rem] overflow-hidden rounded-[2rem] bg-[#fdfcf9] text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem]">
            <div className="border-b border-black/7 px-6 py-6 dark:border-white/9 sm:px-8">
              <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
                Month-by-month breakdown
              </h2>
              <p className="mt-3 text-sm leading-6 text-black/54 dark:text-white/57">
                The first row begins today. Later rows cover the complete calendar month.
              </p>
            </div>
            <div className="divide-y divide-black/7 dark:divide-white/9">
              {data.monthRows.map((row) => (
                <div key={row.month} className="flex items-center justify-between px-6 py-3.5 sm:px-8">
                  <span className="text-sm text-black/65 dark:text-white/66">{row.month}</span>
                  <span className="font-mono text-base font-semibold tabular-nums">{row.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 w-full max-w-[31.9rem] rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem] sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              How the count works
            </h2>
            <p className="mt-4 text-sm leading-6 text-black/60 dark:text-white/62 sm:text-base">
              {data.howItWorks}
            </p>
            {kind === "working-days" ? (
              <p className="mt-4 text-sm leading-6 text-black/60 dark:text-white/62 sm:text-base">
                For a holiday-aware result, use the{" "}
                <Link
                  href="/business-days-until"
                  className="font-semibold underline underline-offset-4 hover:text-black dark:hover:text-white"
                >
                  regional business-days calculator
                </Link>
                . It can remove supported public holidays for a selected country or state.
              </p>
            ) : null}
          </section>

          <CountdownLinkList
            title="More year-planning tools"
            description="Compare the remaining year using calendar days, weekdays, Fridays, and weekends."
            links={[
              { href: "/year-planner", label: "Year planner overview" },
              { href: "/business-days-until", label: "Business days until a date" },
              { href: "/days-between-dates", label: "Days between dates" },
              { href: "/fridays-until-summer", label: "Fridays until summer" },
              { href: "/calendar-days-vs-business-days", label: "Calendar days vs business days" },
              { href: "/how-leap-years-affect-date-calculations", label: "How leap years change date counts" },
            ]}
            centered
          />
        </>
      }
    />
  );
}
