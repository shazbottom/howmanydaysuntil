import Link from "next/link";
import { Brand } from "./Brand";
import type { CountryDefinition } from "../lib/countries";
import { CountryHubDateInput } from "./CountryHubDateInput";
import { CountrySelectorDropdown } from "./CountrySelectorDropdown";
import { ThemeToggle } from "./ThemeToggle";
import type { LocalizedHubEventLink } from "../lib/localizedCountdowns";
import type { RegionDefinition } from "../lib/regions";
import type { CountryPublicHolidayRow } from "../lib/countryData";

export interface CountryHubPageProps {
  country: CountryDefinition;
  todayLabel: string;
  popularLinks: LocalizedHubEventLink[];
  currentYear: number;
  nationalHolidayRows: CountryPublicHolidayRow[];
  regionLinks: RegionDefinition[];
}

export function CountryHubPage({
  country,
  todayLabel,
  popularLinks,
  currentYear,
  nationalHolidayRows,
  regionLinks,
}: CountryHubPageProps) {
  const regionLabel =
    country.code === "au"
      ? "States"
      : country.code === "ca"
        ? "Provinces"
        : country.code === "uk"
          ? "Countries"
          : "Regions";
  const showHolidayNotes = nationalHolidayRows.some((row) => Boolean(row.notes));

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

  const highlightedHolidayNames = [
    "New Year's Day",
    "Australia Day",
    "Canada Day",
    "Waitangi Day",
    "Good Friday",
    "Easter Monday",
    "Christmas Day",
    "Boxing Day",
    "Boxing Day (observed)",
  ]
    .filter((name) => nationalHolidayRows.some((row) => row.name === name))
    .slice(0, 4);

  const countryHolidaySummary =
    highlightedHolidayNames.length > 0
      ? `National public holidays in ${country.name} in ${currentYear} include ${formatList(
          highlightedHolidayNames,
        )}. Use the region links above for local public holidays and school dates.`
      : `This table covers national public holidays observed across ${country.name} in ${currentYear}. Use the region links above for local public holidays and school dates.`;

  function formatShortDate(dateText: string) {
    const [year, month, day] = dateText.split("-").map(Number);

    return new Intl.DateTimeFormat(country.locale, {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
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
            Country countdowns
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
            {country.name}
          </h1>
          {regionLinks.length > 0 ? (
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
              <span className="text-black/42 dark:text-white/44">{regionLabel}</span>
              {regionLinks.map((region) => (
                <Link
                  key={region.id}
                  href={`/${country.code}/${region.slug}`}
                  className="font-semibold text-black/72 underline-offset-4 transition hover:text-black hover:underline dark:text-white/76 dark:hover:text-white"
                >
                  {region.shortName ?? region.name}
                </Link>
              ))}
            </div>
          ) : null}
          <p className="mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
            Check public holidays in {country.name} and explore region pages for local public
            holidays, school term dates, and key dates. Use our live countdowns to track upcoming
            occasions across {country.name}.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/48 dark:text-white/52 sm:text-base">
            Today in {country.name} is {todayLabel}.
          </p>
          <div className="mt-10 w-full max-w-3xl rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-center ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              Try your own date
            </h2>
            <CountryHubDateInput countryCode={country.code} />
          </div>
          <div className="mt-12 w-full max-w-3xl rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              Popular in {country.name}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {popularLinks.map((eventLink) => (
                <Link
                  key={eventLink.href}
                  href={eventLink.href}
                  className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 py-2.5 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
                >
                  {eventLink.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-10 w-full max-w-3xl rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              National holidays {currentYear}
            </h2>
            <p className="mt-4 text-sm leading-6 text-black/52 dark:text-white/56">
              {countryHolidaySummary}
            </p>
            <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-black/6 dark:border-white/10">
              <div
                className={`grid bg-[#f3f2ee] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black/48 dark:bg-[#1d1f1e] dark:text-white/50 ${
                  showHolidayNotes
                    ? "grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)_minmax(0,0.9fr)]"
                    : "grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
                }`}
              >
                <span>Holiday</span>
                <span>Date</span>
                {showHolidayNotes ? <span>Notes</span> : null}
              </div>
              <div className="divide-y divide-black/6 dark:divide-white/10">
                {nationalHolidayRows.map((row) => (
                  <div
                    key={`${row.name}-${row.date ?? row.label}`}
                    className={`grid gap-4 bg-white/55 px-4 py-3 text-sm dark:bg-white/[0.02] ${
                      showHolidayNotes
                        ? "grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)_minmax(0,0.9fr)]"
                        : "grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
                    }`}
                  >
                    <span className="font-medium text-black dark:text-white/88">{row.name}</span>
                    <span className="text-black/62 dark:text-white/62">
                      {row.date ? formatShortDate(row.date) : row.label}
                    </span>
                    {showHolidayNotes ? (
                      <span className="text-black/62 dark:text-white/62">{row.notes ?? "-"}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
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
