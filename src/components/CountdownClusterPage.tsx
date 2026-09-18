import { notFound } from "next/navigation";
import Link from "next/link";
import { getCountdownActions } from "../lib/countdownActions";
import { CountdownLinkList } from "./CountdownLinkList";
import { SeoCountdownPage } from "./SeoCountdownPage";
import {
  buildCountdownClusterMetadata,
  getCountdownClusterPageData,
} from "../lib/countdownClusters";
import { createBreadcrumbJsonLd, createWebPageJsonLd } from "../lib/structuredData";
import { SummerSeasonControls } from "./SummerSeasonControls";
import { parseSummerSelection, summerSelectionLabel, type SummerSearchParams } from "../lib/summerSelection";
import { SUMMER_SOLSTICE_CHECKED, SUMMER_SOLSTICE_SOURCE } from "../data/summerSolstices";

export function generateCountdownClusterMetadata(slug: string, searchParams: SummerSearchParams = {}) {
  return buildCountdownClusterMetadata(slug, new Date(), searchParams);
}

export function CountdownClusterPage({ slug, searchParams = {} }: { slug: string; searchParams?: SummerSearchParams }) {
  const selection = parseSummerSelection(searchParams);
  const pageData = getCountdownClusterPageData(slug, new Date(), selection);
  const isSummer = slug === "fridays-until-summer" || slug === "weekends-until-summer";

  if (!pageData) {
    if (isSummer && selection.method === "astronomical") return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-3xl font-semibold">Astronomical summer dates unavailable</h1>
        <p className="mt-4">Our sourced solstice table covers 2026-2035. No approximate date has been substituted. Choose meteorological summer or explicitly return to the original convention.</p>
        <SummerSeasonControls selection={selection} path={`/${slug}`} />
      </main>
    );
    notFound();
  }

  const {
    definition,
    event,
    title,
    lead,
    countdown,
    count,
    clusterLabel,
    detailLine,
    canonicalPath,
    yearRows,
    cardActionLinks,
    relatedLinks,
    howItWorks,
  } = pageData;
  const unitLabel =
    definition.kind === "fridays"
      ? `${count === 1 ? "Friday" : "Fridays"} remaining`
      : `${count === 1 ? "Weekend" : "Weekends"} remaining`;
  const actions = getCountdownActions(pageData.actionDate, isSummer ? summerSelectionLabel(selection) : event.name);
  const calendarEvent = pageData.isExplicitSummer ? {
    title: summerSelectionLabel(selection),
    date: pageData.targetDate.toISOString().slice(0, 10),
    description: `${pageData.seasonNote} Calendar export is an all-day marker for the selected UTC date, not a timed solstice appointment.`,
    url: `https://daysuntil.is${pageData.selectedPath}`,
    fileName: `${slug}-${selection.method}-${selection.hemisphere}`,
  } : undefined;
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: title, path: canonicalPath },
    ]),
    createWebPageJsonLd({
      name: title,
      description: lead,
      path: canonicalPath,
      about: event.name,
    }),
  ];

  return (
    <SeoCountdownPage
      eyebrow={definition.kind === "fridays" ? "Friday countdown" : "Weekend countdown"}
      title={title}
      lead={lead}
      countdownLabel={clusterLabel}
      countdown={countdown}
      countdownPrimaryValue={count}
      countdownPrimaryUnitLabel={unitLabel}
      countdownDetailLine={detailLine}
      countdownTimeZone={pageData.isExplicitSummer ? "UTC" : undefined}
      countdownControls={isSummer ? <SummerSeasonControls key={pageData.selectedPath} selection={selection} path={canonicalPath} /> : undefined}
      actionDateOverride={pageData.actionDate}
      calendarEventOverride={calendarEvent}
      cardActionLinks={cardActionLinks}
      calendarPath={pageData.selectedPath}
      supportingCopy={pageData.seasonNote ? [pageData.seasonNote] : []}
      relatedLinks={relatedLinks}
      structuredData={structuredData}
      showChristmasFlyby={event.slug === "christmas"}
      extraSection={
        <>
          {isSummer ? <section className="mt-5 w-full max-w-[34rem] text-left text-sm leading-6 text-black/75 dark:text-white/80">
            {selection.method === "astronomical" ? <>
              <p><a className="underline" href={SUMMER_SOLSTICE_SOURCE}>Solstice and Equinox Table Courtesy of Fred Espenak, www.Astropixels.com</a>.</p>
              <p>Source checked {SUMMER_SOLSTICE_CHECKED}. Published GMT times are represented as UTC to minute precision. Table stops at 2035; fewer future rows appear near that limit.</p>
              <p>Calendar, save and date-planning actions use the selected UTC calendar date. Calendar exports are all-day markers, not timed solstice appointments.</p>
            </> : <p><a className="underline" href="https://www.ncei.noaa.gov/news/meteorological-versus-astronomical-seasons">NOAA: season definitions</a>; <a className="underline" href="https://www.bom.gov.au/news-and-media/solstices-equinoxes-and-the-seasons">Bureau of Meteorology: Australian summer months</a>. The original option is a fixed approximate date, not sourced year-specific astronomy.</p>}
            {selection.method === "legacy" && Object.keys(searchParams).length && searchParams.method !== "legacy" ? <p>Unrecognized or incomplete season settings. Showing the explicitly labelled original convention; choose both a definition and hemisphere above.</p> : null}
          </section> : null}
          {pageData.remainingFridays.length ? (
            <details className="mt-8 w-full max-w-[34rem] rounded-2xl border border-black/10 p-5 text-left dark:border-white/15">
              <summary className="cursor-pointer text-sm font-semibold">View all {count} remaining Fridays</summary>
              <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {pageData.remainingFridays.map((friday) => <li key={friday.label}>
                  {friday.href ? <Link className="underline underline-offset-4" href={friday.href}>{friday.label}</Link> : <span>{friday.label}</span>}
                </li>)}
              </ul>
            </details>
          ) : null}
          <section className="mt-12 w-full max-w-[31.9rem] rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem] sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              {yearRows.length === 1 ? "Target date" : `Next ${yearRows.length} occurrences`}
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/70 dark:text-white/75">
              {pageData.baselineLabel}
            </p>
            <div className="mt-5 overflow-hidden rounded-[1.15rem] border border-black/6 dark:border-white/10">
              <div className="grid grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)_minmax(0,0.8fr)] bg-[#f3f2ee] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/48 dark:bg-[#1d1f1e] dark:text-white/50">
                <span>Year</span>
                <span>Date</span>
                <span>{definition.kind === "fridays" ? "Fridays" : "Weekends"}</span>
              </div>
              <div className="divide-y divide-black/6 dark:divide-white/10">
                {yearRows.map((row) => (
                  <div
                    key={`${slug}-${row.year}`}
                    className="grid grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)_minmax(0,0.8fr)] gap-4 bg-white/55 px-4 py-2.5 text-[13px] dark:bg-white/[0.02] sm:text-sm"
                  >
                    <span className="font-medium text-black dark:text-white/88">{row.year}</span>
                    <span className="text-black/62 dark:text-white/62">{row.dateLabel}</span>
                    <span className="text-black/72 dark:text-white/74">
                      {row.count.toLocaleString("en-GB")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 w-full max-w-[31.9rem] rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem] sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              How this count works
            </h2>
            <p className="mt-4 text-sm leading-6 text-black/60 dark:text-white/62">
              {howItWorks}
            </p>
          </section>

          <CountdownLinkList
            title="Planning tools"
            description={`Use the ${event.name} count in a wider calendar or working-day plan.`}
            links={[
              { href: actions.compare, label: `Compare ${event.name} with another date` },
              { href: actions.business, label: `Count business days until ${event.name}` },
              { href: "/year-planner", label: "Plan the rest of the year" },
              { href: "/calendar-days-vs-business-days", label: "Calendar days vs business days" },
            ]}
            centered
          />
        </>
      }
    />
  );
}
