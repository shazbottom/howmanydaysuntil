import { getBusinessDayExplanation } from "../../lib/businessDayExplanation";
import type { CountryCode } from "../../lib/countries";

export function BusinessDayExplanation({ end, start, countryCode, regionId, now }: { end: string; start?: string; countryCode: CountryCode; regionId?: string; now?: Date }) {
  const audit = getBusinessDayExplanation(end, countryCode, regionId, start, now);
  if (!audit) return null;
  const holidays = audit.result.includedHolidays;
  return (
    <section className="mt-6 rounded-2xl border border-black/10 p-5 text-sm leading-6 text-black/75 dark:border-white/15 dark:text-white/80">
      <h3 className="font-semibold text-black dark:text-white">How this result is calculated</h3>
      <p className="mt-2">Using {audit.jurisdiction} holiday calendar.</p>
      <p>{audit.startDate} (excluded) to {audit.endDate} (included if a working day). Counts Monday to Friday; Saturdays and Sundays are excluded.</p>
      {audit.todayTimeZone ? <p>Today is determined using {audit.todayTimeZone}.</p> : null}
      <p>{audit.weekdays} weekdays minus {holidays.length} weekday public holidays = {audit.result.businessDays} business days.</p>
      {audit.reversed ? <p>The dates were entered in reverse order. This breakdown uses chronological order; the displayed result is negative.</p> : null}
      <h4 className="mt-4 font-semibold">Public holidays deducted</h4>
      {holidays.length ? <ul className="list-disc pl-5">
        {holidays.map((holiday, index) => <li key={`${holiday.date}-${index}`}>{holiday.date}: {holiday.name}</li>)}
      </ul> : <p>No dated weekday holidays from the maintained tables fall within this interval.</p>}
      <h4 className="mt-4 font-semibold">Holiday coverage and sources</h4>
      <ul className="space-y-3">
        {audit.coverage.map((coverage) => <li key={coverage.year}>
          <p>{coverage.year}: {coverage.level === "missing"
            ? "No maintained holiday dates available. Weekends only are excluded for this year; the result may overstate working days."
            : `${coverage.jurisdiction} ${coverage.level === "region" ? "regional" : "country-level"} holiday table.`}
            {coverage.fallback && coverage.level !== "missing" ? " Regional data unavailable: country-level fallback used; local holidays may be missing." : ""}</p>
          {coverage.undatedHolidays.length ? <p>Not deducted because no date is maintained: {coverage.undatedHolidays.join(", ")}.</p> : null}
          {coverage.attribution ? <>
            <p>Sources: {coverage.attribution.sources.map((source, index) => <span key={`${source.href}-${index}`}>
              {index ? "; " : ""}{source.href ? <a className="underline underline-offset-2" href={source.href}>{source.label}</a> : source.label}
            </span>)}</p>
            <p>Last checked: {coverage.attribution.lastChecked}.</p>
          </> : null}
        </li>)}
      </ul>
      <p className="mt-4">Employer closures, personal leave and individual work schedules are not included. Confirm important deadlines with the responsible organisation.</p>
    </section>
  );
}
