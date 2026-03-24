import Link from "next/link";
import { Brand } from "./Brand";
import { CalculatorNavButton } from "./CalculatorNavButton";
import { CountdownDisplay } from "./CountdownDisplay";
import { CountrySelectorDropdown } from "./CountrySelectorDropdown";
import { ThemeToggle } from "./ThemeToggle";
import type { LocalizedRegionCountdownPageData } from "../lib/localizedCountdowns";

export interface RegionalCountdownPageProps {
  data: LocalizedRegionCountdownPageData;
}

export function RegionalCountdownPage({ data }: RegionalCountdownPageProps) {
  const { country, region, event, countdown, targetDateLabel, todayLabel, occurrenceRows } = data;

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <Link href="/" className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black dark:text-white/72 dark:hover:text-white">
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
            Regional countdown
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            How many days until {event.displayName} in {region.name}?
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
            Today in {region.name}, {country.name} is {todayLabel}. The next {event.displayName} falls on {targetDateLabel}.
          </p>
          <div className="mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
            <CountdownDisplay label={event.displayName} countdown={countdown} />
          </div>
          <div className="mt-10 w-full max-w-3xl rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              Next 5 years
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[20rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/8 dark:border-white/10">
                    <th className="pb-3 font-semibold text-black/58 dark:text-white/62">Year</th>
                    <th className="pb-3 font-semibold text-black/58 dark:text-white/62">Date</th>
                    <th className="pb-3 font-semibold text-black/58 dark:text-white/62">Day</th>
                  </tr>
                </thead>
                <tbody>
                  {occurrenceRows.map((row) => (
                    <tr key={row.year} className="border-b border-black/6 dark:border-white/8">
                      <td className="py-3 text-black/74 dark:text-white/78">{row.year}</td>
                      <td className="py-3 text-black/74 dark:text-white/78">{row.formattedDate}</td>
                      <td className="py-3 text-black/60 dark:text-white/64">{row.dayOfWeek}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
            <Link href={`/${country.code}/${region.slug}`} className="text-black/65 underline-offset-4 transition hover:text-black hover:underline dark:text-white/66 dark:hover:text-white">
              Back to {region.name}
            </Link>
            <Link href={`/${country.code}`} className="text-black/65 underline-offset-4 transition hover:text-black hover:underline dark:text-white/66 dark:hover:text-white">
              Back to {country.name}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
