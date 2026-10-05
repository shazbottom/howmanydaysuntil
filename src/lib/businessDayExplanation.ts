import { getCountryByCode, type CountryCode } from "./countries";
import { getRegionById } from "./regions";
import { calculateBusinessDaysBetweenForCountry, calculateWorkingDaysBetween, getBusinessDayCoverage, getBusinessDayTimeZone } from "./dateCalculators";

export function getBusinessDayExplanation(end: string, countryCode: CountryCode, regionId?: string, start?: string, now = new Date()) {
  const country = getCountryByCode(countryCode)!;
  const timeZone = getBusinessDayTimeZone(countryCode, regionId);
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (name: string) => parts.find((item) => item.type === name)!.value;
  const originalStart = start ?? `${part("year")}-${part("month")}-${part("day")}`;
  const reversed = end < originalStart;
  const startDate = reversed ? end : originalStart;
  const endDate = reversed ? originalStart : end;
  const result = calculateBusinessDaysBetweenForCountry(startDate, endDate, countryCode, regionId);
  if (!result) return null;
  const coverage = [];
  for (let year = Number(startDate.slice(0, 4)); year <= Number(endDate.slice(0, 4)); year += 1) {
    coverage.push(getBusinessDayCoverage(countryCode, regionId, year));
  }
  const candidateRegion = regionId ? getRegionById(regionId) : null;
  const region = candidateRegion?.countryCode === countryCode ? candidateRegion : null;
  return {
    startDate, endDate, reversed, result, coverage,
    weekdays: calculateWorkingDaysBetween(startDate, endDate)!,
    jurisdiction: region ? `${region.name}, ${country.name}` : country.name,
    todayTimeZone: start ? null : timeZone,
  };
}
