import type { CountryCode } from "./countries";

export interface CountryPublicHolidayRow {
  name: string;
  date?: string;
  label?: string;
  notes?: string;
  notesHref?: string;
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
    },
  },
};

export function getCountryReferenceData(countryCode: CountryCode, year: number) {
  return countryData[countryCode]?.publicHolidays[year] ?? [];
}
