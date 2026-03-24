import type { CountryCode } from "./countries";
import referenceAttributions from "../data/referenceAttributions.json";

export interface CountryPublicHolidayRow {
  name: string;
  date?: string;
  label?: string;
  notes?: string;
  notesHref?: string;
}

export interface ReferenceSource {
  label: string;
  href?: string;
}

export interface ReferenceAttribution {
  sources: ReferenceSource[];
  lastChecked: string;
}

export interface CountryReferenceData {
  publicHolidays: Record<number, CountryPublicHolidayRow[]>;
}

export const countryData: Record<CountryCode, CountryReferenceData> = {
  au: {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Saturday", date: "2026-04-04" },
        { name: "Easter Sunday", date: "2026-04-05" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day additional public holiday", date: "2026-12-28" },
      ],
      2027: [
        { name: "New Year's Day", date: "2027-01-01" },
        { name: "Australia Day", date: "2027-01-26" },
        { name: "Good Friday", date: "2027-03-26" },
        { name: "Easter Saturday", date: "2027-03-27" },
        { name: "Easter Sunday", date: "2027-03-28" },
        { name: "Easter Monday", date: "2027-03-29" },
        { name: "ANZAC Day", date: "2027-04-25" },
        { name: "Christmas Day additional public holiday", date: "2027-12-27" },
        { name: "Boxing Day additional public holiday", date: "2027-12-28" },
      ],
      2028: [
        { name: "New Year's Day", date: "2028-01-01" },
        { name: "Australia Day", date: "2028-01-26" },
        { name: "Good Friday", date: "2028-04-14" },
        { name: "Easter Saturday", date: "2028-04-15" },
        { name: "Easter Sunday", date: "2028-04-16" },
        { name: "Easter Monday", date: "2028-04-17" },
        { name: "ANZAC Day", date: "2028-04-25" },
        { name: "Christmas Day", date: "2028-12-25" },
        { name: "Boxing Day", date: "2028-12-26" },
      ],
    },
  },
  ca: {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Victoria Day", date: "2026-05-18" },
        { name: "Canada Day", date: "2026-07-01" },
        { name: "Labour Day", date: "2026-09-07" },
        { name: "National Day for Truth and Reconciliation", date: "2026-09-30" },
        { name: "Thanksgiving Day", date: "2026-10-12" },
        { name: "Remembrance Day", date: "2026-11-11" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
      ],
      2027: [
        { name: "New Year's Day", date: "2027-01-01" },
        { name: "Good Friday", date: "2027-03-26" },
        { name: "Victoria Day", date: "2027-05-24" },
        { name: "Canada Day", date: "2027-07-01" },
        { name: "Labour Day", date: "2027-09-06" },
        { name: "National Day for Truth and Reconciliation", date: "2027-09-30" },
        { name: "Thanksgiving Day", date: "2027-10-11" },
        { name: "Remembrance Day", date: "2027-11-11" },
        { name: "Christmas Day", date: "2027-12-25" },
        { name: "Boxing Day", date: "2027-12-26" },
      ],
      2028: [
        { name: "New Year's Day", date: "2028-01-01" },
        { name: "Good Friday", date: "2028-04-14" },
        { name: "Victoria Day", date: "2028-05-22" },
        { name: "Canada Day", date: "2028-07-01" },
        { name: "Labour Day", date: "2028-09-04" },
        { name: "National Day for Truth and Reconciliation", date: "2028-09-30" },
        { name: "Thanksgiving Day", date: "2028-10-09" },
        { name: "Remembrance Day", date: "2028-11-11" },
        { name: "Christmas Day", date: "2028-12-25" },
        { name: "Boxing Day", date: "2028-12-26" },
      ],
    },
  },
  nz: {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Day after New Year's Day", date: "2026-01-02" },
        { name: "Waitangi Day", date: "2026-02-06" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day (observed)", date: "2026-04-27" },
        { name: "King's Birthday", date: "2026-06-01" },
        { name: "Matariki", date: "2026-07-10" },
        { name: "Labour Day", date: "2026-10-26" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day (observed)", date: "2026-12-28" },
      ],
      2027: [
        { name: "New Year's Day", date: "2027-01-01" },
        { name: "Day after New Year's Day", date: "2027-01-04" },
        { name: "Waitangi Day (observed)", date: "2027-02-08" },
        { name: "Good Friday", date: "2027-03-26" },
        { name: "Easter Monday", date: "2027-03-29" },
        { name: "ANZAC Day (observed)", date: "2027-04-26" },
        { name: "King's Birthday", date: "2027-06-07" },
        { name: "Matariki", date: "2027-06-25" },
        { name: "Labour Day", date: "2027-10-25" },
        { name: "Christmas Day (observed)", date: "2027-12-27" },
        { name: "Boxing Day (observed)", date: "2027-12-28" },
      ],
      2028: [
        { name: "New Year's Day", date: "2028-01-03" },
        { name: "Day after New Year's Day", date: "2028-01-04" },
        { name: "Waitangi Day", date: "2028-02-06" },
        { name: "Good Friday", date: "2028-04-14" },
        { name: "Easter Monday", date: "2028-04-17" },
        { name: "ANZAC Day", date: "2028-04-25" },
        { name: "King's Birthday", date: "2028-06-05" },
        { name: "Matariki", date: "2028-07-14" },
        { name: "Labour Day", date: "2028-10-23" },
        { name: "Christmas Day", date: "2028-12-25" },
        { name: "Boxing Day", date: "2028-12-26" },
      ],
    },
  },
  uk: {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "Early May bank holiday", date: "2026-05-04" },
        { name: "Spring bank holiday", date: "2026-05-25" },
        { name: "Summer bank holiday", date: "2026-08-31" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day (substitute day)", date: "2026-12-28" },
      ],
      2027: [
        { name: "New Year's Day", date: "2027-01-01" },
        { name: "Good Friday", date: "2027-03-26" },
        { name: "Easter Monday", date: "2027-03-29" },
        { name: "Early May bank holiday", date: "2027-05-03" },
        { name: "Spring bank holiday", date: "2027-05-31" },
        { name: "Summer bank holiday", date: "2027-08-30" },
        { name: "Christmas Day (substitute day)", date: "2027-12-27" },
        { name: "Boxing Day (substitute day)", date: "2027-12-28" },
      ],
      2028: [
        { name: "New Year's Day", date: "2028-01-03" },
        { name: "Good Friday", date: "2028-04-14" },
        { name: "Easter Monday", date: "2028-04-17" },
        { name: "Early May bank holiday", date: "2028-05-01" },
        { name: "Spring bank holiday", date: "2028-05-29" },
        { name: "Summer bank holiday", date: "2028-08-28" },
        { name: "Christmas Day", date: "2028-12-25" },
        { name: "Boxing Day", date: "2028-12-26" },
      ],
    },
  },
  us: {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Washington's Birthday", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth National Independence Day", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day", date: "2026-10-12" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
      2027: [
        { name: "New Year's Day", date: "2027-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2027-01-18" },
        { name: "Washington's Birthday", date: "2027-02-15" },
        { name: "Memorial Day", date: "2027-05-31" },
        { name: "Juneteenth National Independence Day", date: "2027-06-18" },
        { name: "Independence Day (observed)", date: "2027-07-05" },
        { name: "Labor Day", date: "2027-09-06" },
        { name: "Columbus Day", date: "2027-10-11" },
        { name: "Veterans Day", date: "2027-11-11" },
        { name: "Thanksgiving Day", date: "2027-11-25" },
        { name: "Christmas Day", date: "2027-12-24" },
      ],
      2028: [
        { name: "New Year's Day", date: "2028-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2028-01-17" },
        { name: "Washington's Birthday", date: "2028-02-21" },
        { name: "Memorial Day", date: "2028-05-29" },
        { name: "Juneteenth National Independence Day", date: "2028-06-19" },
        { name: "Independence Day", date: "2028-07-04" },
        { name: "Labor Day", date: "2028-09-04" },
        { name: "Columbus Day", date: "2028-10-09" },
        { name: "Veterans Day", date: "2028-11-10" },
        { name: "Thanksgiving Day", date: "2028-11-23" },
        { name: "Christmas Day", date: "2028-12-25" },
      ],
    },
  },
};

const countryHolidayAttributions =
  referenceAttributions.countryHolidayAttributions as Record<CountryCode, ReferenceAttribution>;

export function getCountryReferenceData(countryCode: CountryCode, year: number) {
  return countryData[countryCode]?.publicHolidays[year] ?? [];
}

export function getCountryReferenceYears(countryCode: CountryCode): number[] {
  return Object.keys(countryData[countryCode]?.publicHolidays ?? {})
    .map((year) => Number(year))
    .sort((left, right) => left - right);
}

export function getCountryHolidayAttribution(
  countryCode: CountryCode,
): ReferenceAttribution | null {
  return countryHolidayAttributions[countryCode] ?? null;
}
