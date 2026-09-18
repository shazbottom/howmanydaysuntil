import Link from "next/link";
import { InformationPageShell } from "./InformationPageShell";
import { JsonLd } from "./JsonLd";
import { createBreadcrumbJsonLd } from "../lib/structuredData";
import { getSeasonChoices, getSeasonName, seasonSlugs, type SeasonSlug } from "../lib/seasonLandingPages";

export function SeasonLandingPage({ season }: { season: SeasonSlug }) {
  const name = getSeasonName(season);
  const choices = getSeasonChoices(season);
  return (
    <InformationPageShell
      eyebrow="Season countdowns"
      title={`How many days until ${name}?`}
      intro="Seasons start at different times in the Northern and Southern Hemispheres. Choose your country for its live countdown."
    >
      <JsonLd data={createBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name, path: `/days-until-${season}` },
      ])} />
      <div className="grid gap-3 sm:grid-cols-2">
        {choices.map(choice => (
          <Link key={choice.href} href={choice.href} className="block rounded-2xl border border-black/10 bg-[#f3f2ee] p-5 !no-underline transition-colors hover:bg-[#e8eee9] focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-white/10 dark:bg-[#1d1f1e] dark:hover:bg-[#26352d]">
            <span className="block text-lg font-semibold">{choice.country}</span>
            <span className="block text-sm opacity-75">Starts {choice.start} · {choice.hemisphere} Hemisphere</span>
            <span className="mt-2 block text-sm">View countdown &rarr;</span>
          </Link>
        ))}
      </div>
      <h2>Which start date do these countdowns use?</h2>
      <p>These country countdowns use meteorological seasons: three-month calendar blocks starting on the first day of March, June, September or December. The start date repeats each year; each country page counts down to its next occurrence.</p>
      <p>Astronomical seasons instead begin at an equinox or solstice. Those dates can vary by year and time zone, so a meteorological countdown can differ from an astronomical one. These dates describe calendar conventions, not a prediction of local weather.</p>
      <h2>Explore other seasons</h2>
      <div className="flex flex-wrap gap-4">
        {seasonSlugs.filter(other => other !== season).map(other => (
          <Link key={other} href={`/days-until-${other}`}>{getSeasonName(other)}</Link>
        ))}
      </div>
    </InformationPageShell>
  );
}
