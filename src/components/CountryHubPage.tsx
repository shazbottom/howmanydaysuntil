import Link from "next/link";
import { Brand } from "./Brand";
import type { CountryDefinition } from "../lib/countries";
import { CountryHubDateInput } from "./CountryHubDateInput";
import { CountrySelectorDropdown } from "./CountrySelectorDropdown";
import { ThemeToggle } from "./ThemeToggle";
import type {
  LocalizedHubEventLink,
  LocalizedUpcomingEventLink,
} from "../lib/localizedCountdowns";

export interface CountryHubPageProps {
  country: CountryDefinition;
  todayLabel: string;
  popularLinks: LocalizedHubEventLink[];
  upcomingLinks: LocalizedUpcomingEventLink[];
}

export function CountryHubPage({
  country,
  todayLabel,
  popularLinks,
  upcomingLinks,
}: CountryHubPageProps) {
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
          <p className="mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
            Find out how many days until important dates in {country.name}, including national
            holidays, celebrations, and key events. Use our live countdowns to track upcoming
            occasions.
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
              Upcoming events
            </h2>
            <div className="mt-6 space-y-3">
              {upcomingLinks.map((eventLink) => (
                <Link
                  key={eventLink.href}
                  href={eventLink.href}
                  className="flex items-center justify-between gap-4 rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 py-3 text-sm shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
                >
                  <span className="font-medium text-black dark:text-white/88">
                    {eventLink.label}
                  </span>
                  <span className="text-black/55 dark:text-white/58">
                    {eventLink.daysRemaining} days
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/"
            className="mt-10 text-sm text-black/65 underline-offset-4 transition hover:text-black hover:underline dark:text-white/66 dark:hover:text-white"
          >
            Back to homepage
          </Link>
        </section>
      </div>
    </main>
  );
}
