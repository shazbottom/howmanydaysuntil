import Link from "next/link";
import { Brand } from "./Brand";
import { CalculatorNavButton } from "./CalculatorNavButton";
import { CountryHubDateInput } from "./CountryHubDateInput";
import { CountrySelectorDropdown } from "./CountrySelectorDropdown";
import { JsonLd } from "./JsonLd";
import { ThemeToggle } from "./ThemeToggle";
import type { CountryDefinition } from "../lib/countries";
import type { RegionDefinition } from "../lib/regions";
import type { RegionReferenceAttributions, RegionYearData } from "../lib/regionData";
import { getCountryReferenceData } from "../lib/countryData";
import type { HubYearLink } from "./CountryHubPage";
import { createBreadcrumbJsonLd, createCollectionPageJsonLd } from "../lib/structuredData";

export interface RegionHubPageProps {
  country: CountryDefinition;
  region: RegionDefinition;
  todayLabel: string;
  currentYear: number;
  referenceData: RegionYearData | null;
  attributions: RegionReferenceAttributions | null;
  siblingRegions: RegionDefinition[];
  yearLinks: HubYearLink[];
  currentPath?: string;
}

export function RegionHubPage({
  country,
  region,
  todayLabel,
  currentYear,
  referenceData,
  attributions,
  siblingRegions,
  yearLinks,
  currentPath,
}: RegionHubPageProps) {
  const regionQualifier = region.shortName ? `${region.name} (${region.shortName})` : region.name;
  const publicHolidayRows = referenceData?.publicHolidays ?? [];
  const schoolTermRows = referenceData?.schoolTerms ?? [];
  const showSchoolTermNotes = schoolTermRows.some((row) => Boolean(row.notes));
  const sortedSiblingRegions = [...siblingRegions].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const useSiblingRegionGrid = country.code === "us" && sortedSiblingRegions.length > 12;
  const countryHolidayNames = new Set(
    getCountryReferenceData(country.code, currentYear).map((row) => row.name),
  );

  function formatList(values: string[]): string {
    if (values.length === 0) {
      return "";
    }

    if (values.length === 1) {
      return values[0];
    }

    if (values.length === 2) {
      return `${values[0]} and ${values[1]}`;
    }

    return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
  }

  const nationalExamples = publicHolidayRows
    .map((row) => row.name)
    .filter((name) =>
      [
        "New Year's Day",
        "Good Friday",
        "Easter Monday",
        "ANZAC Day",
        "Christmas Day",
      ].includes(name) && countryHolidayNames.has(name),
    )
    .slice(0, 2);

  const regionalExamples = publicHolidayRows
    .map((row) => row.name)
    .filter(
      (name) =>
        !countryHolidayNames.has(name) &&
        !name.toLowerCase().includes("additional public holiday") &&
        !name.toLowerCase().includes("substitute day"),
    )
    .slice(0, 2);

  const regionHolidaySummary =
    nationalExamples.length > 0 && regionalExamples.length > 0
      ? `Public holidays in ${region.name} include national dates such as ${formatList(
          nationalExamples,
        )}, along with region-specific holidays such as ${formatList(regionalExamples)}.`
      : nationalExamples.length > 0
        ? `Public holidays in ${region.name} include dates such as ${formatList(
            nationalExamples,
          )}.`
        : `These are the main public holidays observed across ${region.name} in ${currentYear}.`;

  function formatShortDate(dateText: string) {
    const [year, month, day] = dateText.split("-").map(Number);

    return new Intl.DateTimeFormat(country.locale, {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  function formatDateValue(dateText?: string, label?: string) {
    if (!dateText) {
      return label ?? "";
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(dateText) ? formatShortDate(dateText) : dateText;
  }

  function renderNotes(notes?: string, notesHref?: string) {
    if (!notes) {
      return <span className="text-black/62 dark:text-white/62">-</span>;
    }

    if (!notesHref) {
      return <span className="text-black/62 dark:text-white/62">{notes}</span>;
    }

    const govUkLabel = "GOV.UK";

    if (notes.includes(govUkLabel)) {
      const [before, after] = notes.split(govUkLabel);

      return (
        <span className="text-black/62 dark:text-white/62">
          {before}
          <a
            href={notesHref}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 transition hover:text-black dark:hover:text-white"
          >
            {govUkLabel}
          </a>
          {after}
        </span>
      );
    }

    return (
      <span className="text-black/62 dark:text-white/62">
        {notes}{" "}
        <a
          href={notesHref}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 transition hover:text-black dark:hover:text-white"
        >
          Source
        </a>
      </span>
    );
  }

  function formatDisplayDate(dateText: string) {
    const [year, month, day] = dateText.split("-").map(Number);

    return new Intl.DateTimeFormat(country.locale, {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  function renderSources(
    sources: import("../lib/countryData").ReferenceSource[],
  ) {
    return sources.map((source, index) => (
      <span key={source.label}>
        {index > 0 ? ", " : ""}
        {source.href ? (
          <a
            href={source.href}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 transition hover:text-black dark:hover:text-white"
          >
            {source.label}
          </a>
        ) : (
          source.label
        )}
      </span>
    ));
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <JsonLd
        data={[
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: country.name, path: `/${country.code}` },
            { name: region.name, path: currentPath ?? `/${country.code}/${region.slug}` },
          ]),
          createCollectionPageJsonLd({
            name: `Public holidays and school holidays in ${regionQualifier} ${currentYear}`,
            description: `Public holidays, school term dates, and school holiday periods in ${regionQualifier}, ${country.name} for ${currentYear}.`,
            path: currentPath ?? `/${country.code}/${region.slug}`,
            about: ["Public holidays", "School term dates", region.name, country.name],
          }),
        ]}
      />
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black dark:text-white/72 dark:hover:text-white"
          >
            <Brand variant="horizontal" height={55} className="h-[55px] w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <CountrySelectorDropdown />
            <CalculatorNavButton />
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
            >
              Home
            </Link>
          </div>
        </div>
        <section className="mt-20 flex w-full flex-1 flex-col items-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42 dark:text-white/44">
            Regional countdowns
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
            {region.name}
          </h1>
          {yearLinks.length > 1 ? (
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm">
              <span className="text-black/42 dark:text-white/44">Years</span>
              {yearLinks.map((yearLink) => (
                <Link
                  key={yearLink.href}
                  href={yearLink.href}
                  className={
                    yearLink.active
                      ? "font-semibold text-black dark:text-white"
                      : "font-semibold text-black/72 underline-offset-4 transition hover:text-black hover:underline dark:text-white/76 dark:hover:text-white"
                  }
                  aria-current={yearLink.active ? "page" : undefined}
                >
                  {yearLink.label}
                </Link>
              ))}
            </div>
          ) : null}
          {sortedSiblingRegions.length > 0 ? (
            useSiblingRegionGrid ? (
              <section className="mt-7 w-full max-w-3xl text-center">
                <div className="flex items-center justify-center gap-3 text-sm">
                  <h2 className="text-black/42 dark:text-white/44">Other regions</h2>
                  <span className="text-xs text-black/36 dark:text-white/38">
                    {sortedSiblingRegions.length} total
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-8 justify-items-center gap-x-3 gap-y-3 text-sm sm:grid-cols-10 md:grid-cols-10">
                  {sortedSiblingRegions.map((siblingRegion) => (
                    <Link
                      key={siblingRegion.id}
                      href={`/${country.code}/${siblingRegion.slug}`}
                      className="min-w-[1.9rem] text-center font-semibold text-black/72 underline-offset-4 transition hover:text-black hover:underline dark:text-white/76 dark:hover:text-white"
                      title={siblingRegion.name}
                      aria-label={siblingRegion.name}
                    >
                      {siblingRegion.shortName ?? siblingRegion.name}
                    </Link>
                  ))}
                </div>
              </section>
            ) : (
              <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
                <span className="text-black/42 dark:text-white/44">Other regions</span>
                {sortedSiblingRegions.map((siblingRegion) => (
                  <Link
                    key={siblingRegion.id}
                    href={`/${country.code}/${siblingRegion.slug}`}
                    className="font-semibold text-black/72 underline-offset-4 transition hover:text-black hover:underline dark:text-white/76 dark:hover:text-white"
                  >
                    {siblingRegion.shortName ?? siblingRegion.name}
                  </Link>
                ))}
              </div>
            )
          ) : null}
          <p className="mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
            Check{" "}
            <a
              href="#public-holidays"
              className="font-semibold text-black/72 underline underline-offset-4 transition hover:text-black dark:text-white/76 dark:hover:text-white"
            >
              public holidays
            </a>{" "}
            and{" "}
            <a
              href="#school-term-dates"
              className="font-semibold text-black/72 underline underline-offset-4 transition hover:text-black dark:text-white/76 dark:hover:text-white"
            >
              school term dates
            </a>{" "}
            in {regionQualifier}, {country.name}. Below is a quick reference for region-wide
            holiday dates and school calendar periods.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/48 dark:text-white/52 sm:text-base">
            Today in {region.name} is {todayLabel}.
          </p>
          <div className="mt-10 w-full max-w-3xl rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-center ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              Try your own date
            </h2>
            <CountryHubDateInput countryCode={country.code} />
          </div>
          <div
            id="public-holidays"
            className="mt-12 w-full max-w-3xl scroll-mt-24 rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8"
          >
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              Public holidays in {regionQualifier} {currentYear}
            </h2>
            <p className="mt-4 text-sm leading-6 text-black/52 dark:text-white/56">
              {regionHolidaySummary}
            </p>
            {publicHolidayRows.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-black/6 dark:border-white/10">
                <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] bg-[#f3f2ee] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black/48 dark:bg-[#1d1f1e] dark:text-white/50">
                  <span>Holiday</span>
                  <span>Date</span>
                </div>
                <div className="divide-y divide-black/6 dark:divide-white/10">
                  {publicHolidayRows.map((row) => (
                    <div
                      key={`${row.name}-${row.date ?? row.label}`}
                      className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4 bg-white/55 px-4 py-3 text-sm dark:bg-white/[0.02]"
                    >
                      <span className="font-medium text-black dark:text-white/88">{row.name}</span>
                      <span className="text-black/62 dark:text-white/62">
                        {formatDateValue(row.date, row.label)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm leading-6 text-black/52 dark:text-white/56">
                Public holiday dates for {region.name} will be added here.
              </p>
            )}
            {attributions ? (
              <p className="mt-4 text-xs leading-6 text-black/48 dark:text-white/50 sm:text-sm">
                Source{attributions.publicHolidays.sources.length > 1 ? "s" : ""}:{" "}
                {renderSources(attributions.publicHolidays.sources)}. Last checked:{" "}
                {formatDisplayDate(attributions.publicHolidays.lastChecked)}.
              </p>
            ) : null}
          </div>
          <div
            id="school-term-dates"
            className="mt-10 w-full max-w-3xl scroll-mt-24 rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8"
          >
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              School term dates in {region.name} {currentYear}
            </h2>
            <p className="mt-4 text-sm leading-6 text-black/52 dark:text-white/56">
              These school dates are provided as a region-wide reference for {region.name} in{" "}
              {currentYear}.
            </p>
            {schoolTermRows.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-black/6 dark:border-white/10">
                <div
                  className={`grid bg-[#f3f2ee] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black/48 dark:bg-[#1d1f1e] dark:text-white/50 ${
                    showSchoolTermNotes
                      ? "grid-cols-[minmax(0,0.7fr)_minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,1fr)]"
                      : "grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]"
                  }`}
                >
                  <span>Period</span>
                  <span>Start</span>
                  <span>End</span>
                  {showSchoolTermNotes ? <span>Notes</span> : null}
                </div>
                <div className="divide-y divide-black/6 dark:divide-white/10">
                  {schoolTermRows.map((row) => (
                    <div
                      key={row.term}
                      className={`grid gap-4 bg-white/55 px-4 py-3 text-sm dark:bg-white/[0.02] ${
                        showSchoolTermNotes
                          ? "grid-cols-[minmax(0,0.7fr)_minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,1fr)]"
                          : "grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]"
                      }`}
                    >
                      <span className="font-medium text-black dark:text-white/88">{row.term}</span>
                      <span className="text-black/62 dark:text-white/62">
                        {formatDateValue(row.start, row.startLabel)}
                      </span>
                      <span className="text-black/62 dark:text-white/62">
                        {formatDateValue(row.end, row.endLabel)}
                      </span>
                      {showSchoolTermNotes ? renderNotes(row.notes, row.notesHref) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm leading-6 text-black/52 dark:text-white/56">
                School term dates for {region.name} will be added here.
              </p>
            )}
            {attributions ? (
              <p className="mt-4 text-xs leading-6 text-black/48 dark:text-white/50 sm:text-sm">
                Source{attributions.schoolTerms.sources.length > 1 ? "s" : ""}:{" "}
                {renderSources(attributions.schoolTerms.sources)}. Last checked:{" "}
                {formatDisplayDate(attributions.schoolTerms.lastChecked)}.
              </p>
            ) : null}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href={`/${country.code}`}
              className="text-black/65 underline-offset-4 transition hover:text-black hover:underline dark:text-white/66 dark:hover:text-white"
            >
              {country.name}
            </Link>
            <Link
              href="/"
              className="text-black/65 underline-offset-4 transition hover:text-black hover:underline dark:text-white/66 dark:hover:text-white"
            >
              Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
