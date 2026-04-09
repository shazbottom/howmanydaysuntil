import referenceAttributions from "../data/referenceAttributions.json";

export interface RegionPublicHolidayRow {
  name: string;
  date?: string;
  label?: string;
  notes?: string;
  notesHref?: string;
}

export interface RegionSchoolTermRow {
  term: string;
  start?: string;
  end?: string;
  startLabel?: string;
  endLabel?: string;
  notes?: string;
  notesHref?: string;
}

export interface RegionYearData {
  publicHolidays: RegionPublicHolidayRow[];
  schoolTerms: RegionSchoolTermRow[];
}

export interface RegionReferenceData {
  publicHolidays: Record<number, RegionPublicHolidayRow[]>;
  schoolTerms: Record<number, RegionSchoolTermRow[]>;
}

export interface RegionReferenceAttributions {
  publicHolidays: import("./countryData").ReferenceAttribution;
  schoolTerms: import("./countryData").ReferenceAttribution;
}

export const regionData: Record<string, RegionReferenceData> = {
  "au-vic": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Labour Day", date: "2026-03-09" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Saturday", date: "2026-04-04" },
        { name: "Easter Sunday", date: "2026-04-05" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "King's Birthday", date: "2026-06-08" },
        {
          name: "Friday before AFL Grand Final",
          label: "Date varies each year",
          notes: "Usually observed on the Friday before the AFL Grand Final.",
        },
        { name: "Melbourne Cup", date: "2026-11-03" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day additional public holiday", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Term 1", start: "2026-01-28", end: "2026-04-02" },
        { term: "Term 2", start: "2026-04-20", end: "2026-06-26" },
        { term: "Term 3", start: "2026-07-13", end: "2026-09-18" },
        { term: "Term 4", start: "2026-10-05", end: "2026-12-18" },
      ],
    },
  },
  "au-nsw": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Saturday", date: "2026-04-04" },
        { name: "Easter Sunday", date: "2026-04-05" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "ANZAC Day additional public holiday", date: "2026-04-27" },
        { name: "King's Birthday", date: "2026-06-08" },
        { name: "Labour Day", date: "2026-10-05" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day additional public holiday", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Term 1", start: "2026-02-02", end: "2026-04-02" },
        { term: "Term 2", start: "2026-04-22", end: "2026-07-03" },
        { term: "Term 3", start: "2026-07-21", end: "2026-09-25" },
        { term: "Term 4", start: "2026-10-13", end: "2026-12-17" },
      ],
    },
  },
  "au-qld": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Day after Good Friday", date: "2026-04-04" },
        { name: "Easter Sunday", date: "2026-04-05" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "Labour Day", date: "2026-05-04" },
        { name: "King's Birthday", date: "2026-10-05" },
        { name: "Christmas Eve (part-day)", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day additional public holiday", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Term 1", start: "2026-01-27", end: "2026-04-02" },
        { term: "Term 2", start: "2026-04-20", end: "2026-06-26" },
        { term: "Term 3", start: "2026-07-13", end: "2026-09-18" },
        { term: "Term 4", start: "2026-10-06", end: "2026-12-11" },
      ],
    },
  },
  "au-sa": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Adelaide Cup Day", date: "2026-03-09" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Saturday", date: "2026-04-04" },
        { name: "Easter Sunday", date: "2026-04-05" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "King's Birthday", date: "2026-06-08" },
        { name: "Labour Day", date: "2026-10-05" },
        { name: "Christmas Eve (part-day)", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Proclamation Day", date: "2026-12-26" },
        { name: "Proclamation Day additional public holiday", date: "2026-12-28" },
        { name: "New Year's Eve (part-day)", date: "2026-12-31" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Term 1", start: "2026-01-27", end: "2026-04-10" },
        { term: "Term 2", start: "2026-04-27", end: "2026-07-03" },
        { term: "Term 3", start: "2026-07-20", end: "2026-09-25" },
        { term: "Term 4", start: "2026-10-12", end: "2026-12-11" },
      ],
    },
  },
  "au-wa": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Labour Day", date: "2026-03-02" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Sunday", date: "2026-04-05" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "ANZAC Day additional public holiday", date: "2026-04-27" },
        { name: "Western Australia Day", date: "2026-06-01" },
        { name: "King's Birthday", date: "2026-09-28" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day additional public holiday", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Term 1", start: "2026-02-02", end: "2026-04-02" },
        { term: "Term 2", start: "2026-04-20", end: "2026-07-03" },
        { term: "Term 3", start: "2026-07-20", end: "2026-09-25" },
        { term: "Term 4", start: "2026-10-12", end: "2026-12-17" },
      ],
    },
  },
  "au-tas": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Eight Hours Day", date: "2026-03-09" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "Easter Tuesday", date: "2026-04-07" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "King's Birthday", date: "2026-06-08" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day additional public holiday", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Term 1", start: "2026-02-05", end: "2026-04-17" },
        { term: "Term 2", start: "2026-05-04", end: "2026-07-10" },
        { term: "Term 3", start: "2026-07-27", end: "2026-10-02" },
        { term: "Term 4", start: "2026-10-19", end: "2026-12-18" },
      ],
    },
  },
  "au-act": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Canberra Day", date: "2026-03-09" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Saturday", date: "2026-04-04" },
        { name: "Easter Sunday", date: "2026-04-05" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "ANZAC Day additional public holiday", date: "2026-04-27" },
        { name: "Reconciliation Day", date: "2026-06-01" },
        { name: "King's Birthday", date: "2026-06-08" },
        { name: "Labour Day", date: "2026-10-05" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day additional public holiday", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Term 1", start: "2026-02-02", end: "2026-04-02" },
        { term: "Term 2", start: "2026-04-21", end: "2026-07-03" },
        { term: "Term 3", start: "2026-07-21", end: "2026-09-25" },
        { term: "Term 4", start: "2026-10-13", end: "2026-12-18" },
      ],
    },
  },
  "au-nt": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Australia Day", date: "2026-01-26" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Saturday", date: "2026-04-04" },
        { name: "Easter Sunday", date: "2026-04-05" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "ANZAC Day", date: "2026-04-25" },
        { name: "May Day", date: "2026-05-04" },
        { name: "King's Birthday", date: "2026-06-08" },
        { name: "Picnic Day", date: "2026-08-03" },
        { name: "Christmas Eve (part-day)", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
        { name: "Boxing Day additional public holiday", date: "2026-12-28" },
        { name: "New Year's Eve (part-day)", date: "2026-12-31" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Term 1", start: "2026-01-29", end: "2026-04-02" },
        { term: "Term 2", start: "2026-04-14", end: "2026-06-19" },
        { term: "Term 3", start: "2026-07-14", end: "2026-09-18" },
        { term: "Term 4", start: "2026-10-06", end: "2026-12-10" },
      ],
    },
  },
  "ca-ab": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Alberta Family Day", date: "2026-02-16" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Victoria Day", date: "2026-05-18" },
        { name: "Canada Day", date: "2026-07-01" },
        { name: "Labour Day", date: "2026-09-07" },
        { name: "Thanksgiving Day", date: "2026-10-12" },
        { name: "Remembrance Day", date: "2026-11-11" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School year",
          startLabel: "September 2026",
          endLabel: "June 2027",
          notes: "Alberta describes the school year as September to June.",
          notesHref: "https://www.alberta.ca/albertas-school-system",
        },
        {
          term: "Summer holidays",
          startLabel: "July 2026",
          endLabel: "August 2026",
          notes: "Official Alberta guidance says summer holidays are two months in July and August.",
          notesHref: "https://www.alberta.ca/albertas-school-system",
        },
        {
          term: "Winter holidays",
          startLabel: "Late December",
          endLabel: "Early January",
          notes: "Official Alberta guidance says winter holidays are two weeks at the end of December.",
          notesHref: "https://www.alberta.ca/albertas-school-system",
        },
        {
          term: "Spring break",
          startLabel: "Late March or early April",
          endLabel: "One week",
          notes: "Official Alberta guidance says spring break is one week either late March or early April.",
          notesHref: "https://www.alberta.ca/albertas-school-system",
        },
      ],
    },
  },
  "ca-bc": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Family Day", date: "2026-02-16" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Victoria Day", date: "2026-05-18" },
        { name: "Canada Day", date: "2026-07-01" },
        { name: "B.C. Day", date: "2026-08-03" },
        { name: "Labour Day", date: "2026-09-07" },
        { name: "National Day for Truth and Reconciliation", date: "2026-09-30" },
        { name: "Thanksgiving Day", date: "2026-10-12" },
        { name: "Remembrance Day", date: "2026-11-11" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by board",
          endLabel: "Varies by board",
          notes: "B.C. boards of education set school calendars and submit them to the ministry.",
          notesHref: "https://www2.gov.bc.ca/gov/content/education-training/k-12/administration/legislation-policy/school-calendars",
        },
        {
          term: "Winter break",
          startLabel: "Varies by board",
          endLabel: "Varies by board",
          notes: "Check your board-approved school calendar on the B.C. school calendars guidance page.",
          notesHref: "https://www2.gov.bc.ca/gov/content/education-training/k-12/administration/legislation-policy/school-calendars",
        },
        {
          term: "Spring break",
          startLabel: "Varies by board",
          endLabel: "Varies by board",
          notes: "Check your board-approved school calendar on the B.C. school calendars guidance page.",
          notesHref: "https://www2.gov.bc.ca/gov/content/education-training/k-12/administration/legislation-policy/school-calendars",
        },
      ],
    },
  },
  "ca-on": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Family Day", date: "2026-02-16" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Victoria Day", date: "2026-05-18" },
        { name: "Canada Day", date: "2026-07-01" },
        { name: "Labour Day", date: "2026-09-07" },
        { name: "Thanksgiving Day", date: "2026-10-12" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day", date: "2026-12-26" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Christmas break", start: "2026-12-22", end: "2027-01-02" },
        { term: "Family Day", start: "2026-02-16", end: "2026-02-16" },
        { term: "Mid-winter break", start: "2026-03-16", end: "2026-03-20" },
        { term: "Good Friday and Easter Monday", start: "2026-04-03", end: "2026-04-06" },
        { term: "Victoria Day", start: "2026-05-18", end: "2026-05-18" },
      ],
    },
  },
  "ca-qc": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Good Friday or Easter Monday", label: "3 April or 6 April", notes: "The employer chooses either Good Friday or Easter Monday as the paid holiday.", notesHref: "https://www.cnesst.gouv.qc.ca/fr/conditions-travail/conges/jours-feries/liste-jours-feries" },
        { name: "National Patriots' Day", date: "2026-05-18" },
        { name: "Saint-Jean-Baptiste Day", date: "2026-06-24" },
        { name: "Canada Day", date: "2026-07-01" },
        { name: "Labour Day", date: "2026-09-07" },
        { name: "Thanksgiving Day", date: "2026-10-12" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by service centre or school board",
          endLabel: "Varies by service centre or school board",
          notes: "Quebec school calendars are published by each centre de services scolaire or school board.",
          notesHref: "https://www.quebec.ca/education/trouver-organisme-scolaire",
        },
        {
          term: "Winter break",
          startLabel: "Varies locally",
          endLabel: "Varies locally",
          notes: "Use the Quebec school finder to reach the correct school service centre calendar.",
          notesHref: "https://www.quebec.ca/education/trouver-organisme-scolaire",
        },
        {
          term: "Spring break",
          startLabel: "Varies locally",
          endLabel: "Varies locally",
          notes: "Use the Quebec school finder to reach the correct school service centre calendar.",
          notesHref: "https://www.quebec.ca/education/trouver-organisme-scolaire",
        },
      ],
    },
  },
  "us-ca": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Presidents' Day", date: "2026-02-16" },
        { name: "Cesar Chavez Day", date: "2026-03-31" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Independence Day", date: "2026-07-04" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "California school districts publish their own calendars. Use the official CDE school directory to reach your district calendar.",
          notesHref: "https://www.cde.ca.gov/schooldirectory/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district's calendar through the California Department of Education directory.",
          notesHref: "https://www.cde.ca.gov/schooldirectory/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district's calendar through the California Department of Education directory.",
          notesHref: "https://www.cde.ca.gov/schooldirectory/",
        },
      ],
    },
  },
  "us-fl": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Eve", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "New Year's Eve", date: "2026-12-31" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Florida district school boards publish their own calendars. Use the official district data page to reach your district.",
          notesHref: "https://www.fldoe.org/accountability/data-sys/C329G124/default.stml",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Florida Department of Education district data page.",
          notesHref: "https://www.fldoe.org/accountability/data-sys/C329G124/default.stml",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Florida Department of Education district data page.",
          notesHref: "https://www.fldoe.org/accountability/data-sys/C329G124/default.stml",
        },
      ],
    },
  },
  "us-az": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. / Civil Rights Day", date: "2026-01-19" },
        { name: "President's Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day / Indigenous People's Day", date: "2026-10-12" },
        { name: "Veterans' Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Arizona districts publish their own calendars. Use the official Arizona School Report Cards district directory to reach your district details.",
          notesHref: "https://azreportcards.azed.gov/districts/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Arizona's official district directory.",
          notesHref: "https://azreportcards.azed.gov/districts/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Arizona's official district directory.",
          notesHref: "https://azreportcards.azed.gov/districts/",
        },
      ],
    },
  },
  "us-ga": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr.'s Birthday", date: "2026-01-19" },
        { name: "State Holiday (Good Friday)", date: "2026-04-03" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day", date: "2026-10-12" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "State Holiday", date: "2026-11-27" },
        { name: "Washington's Birthday (observed)", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Georgia school districts publish their own calendars. Use Georgia Department of Education resources and your district website for local term dates.",
          notesHref: "https://georgiainsights.gadoe.org/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar for winter break dates in Georgia.",
          notesHref: "https://georgiainsights.gadoe.org/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar for spring break dates in Georgia.",
          notesHref: "https://georgiainsights.gadoe.org/",
        },
      ],
    },
  },
  "us-il": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Lincoln's Birthday", date: "2026-02-12" },
        { name: "Presidents' Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day", date: "2026-10-12" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Illinois districts publish their own calendars. Use the official public school district lookup to find your district.",
          notesHref: "https://www.isbe.net/Pages/Public-School-District-Lookup.aspx",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Illinois public school district lookup.",
          notesHref: "https://www.isbe.net/Pages/Public-School-District-Lookup.aspx",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Illinois public school district lookup.",
          notesHref: "https://www.isbe.net/Pages/Public-School-District-Lookup.aspx",
        },
      ],
    },
  },
  "us-ma": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Washington's Birthday", date: "2026-02-16" },
        { name: "Patriots' Day", date: "2026-04-20" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth Independence Day", date: "2026-06-19" },
        { name: "Independence Day", date: "2026-07-04" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day", date: "2026-10-12" },
        { name: "Veterans' Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Massachusetts districts publish their own calendars. Use the official DESE School and District Profiles directory to find your district.",
          notesHref: "https://profiles.doe.mass.edu/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Massachusetts School and District Profiles directory.",
          notesHref: "https://profiles.doe.mass.edu/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Massachusetts School and District Profiles directory.",
          notesHref: "https://profiles.doe.mass.edu/",
        },
      ],
    },
  },
  "us-mi": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "President's Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "General Election Day", date: "2026-11-03" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Eve", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "New Year's Eve", date: "2026-12-31" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Michigan is a local-control state for school calendars. Use official Michigan education resources and your district website for local dates.",
          notesHref: "https://www.michigan.gov/mde/contact-us",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through official Michigan education resources.",
          notesHref: "https://www.michigan.gov/mde/contact-us",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through official Michigan education resources.",
          notesHref: "https://www.michigan.gov/mde/contact-us",
        },
      ],
    },
  },
  "us-nj": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Presidents Day", date: "2026-02-16" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day", date: "2026-10-12" },
        { name: "Election Day", date: "2026-11-03" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "New Jersey districts publish their own calendars. Use the official NJ school directory to reach your district calendar.",
          notesHref: "https://www.nj.gov/nj/education/direct",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the official New Jersey school directory.",
          notesHref: "https://www.nj.gov/nj/education/direct",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the official New Jersey school directory.",
          notesHref: "https://www.nj.gov/nj/education/direct",
        },
      ],
    },
  },
  "us-nc": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Birthday", date: "2026-01-19" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Eve", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Christmas Day additional holiday", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "North Carolina public school units publish their own calendars. Use the official NCDPI education directory to find your district.",
          notesHref: "https://www.dpi.nc.gov/nceddirectory/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the NCDPI education directory.",
          notesHref: "https://www.dpi.nc.gov/nceddirectory/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the NCDPI education directory.",
          notesHref: "https://www.dpi.nc.gov/nceddirectory/",
        },
      ],
    },
  },
  "us-ny": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Lincoln's Birthday", date: "2026-02-12" },
        { name: "Washington's Birthday", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day", date: "2026-10-12" },
        { name: "Election Day", date: "2026-11-03" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "New York school districts publish their own calendars. Use the official district websites directory to reach your district.",
          notesHref: "https://www.nysed.gov/state-assessment/directory-school-district-websites",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the New York State Education Department district directory.",
          notesHref: "https://www.nysed.gov/state-assessment/directory-school-district-websites",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the New York State Education Department district directory.",
          notesHref: "https://www.nysed.gov/state-assessment/directory-school-district-websites",
        },
      ],
    },
  },
  "us-oh": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Presidents' Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Ohio districts publish their own calendars. Use the official ODEW organization search to find your district website.",
          notesHref: "https://oeds.education.ohio.gov/searchorg",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Ohio organization search.",
          notesHref: "https://oeds.education.ohio.gov/searchorg",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Ohio organization search.",
          notesHref: "https://oeds.education.ohio.gov/searchorg",
        },
      ],
    },
  },
  "us-pa": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Presidents' Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth National Freedom Day", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Indigenous Peoples' Day", date: "2026-10-12" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Pennsylvania districts publish their own calendars. Use the official EdNA search to reach your district details and website.",
          notesHref: "https://www.edna.pa.gov/Screens/wfSearchEntity.aspx",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Pennsylvania's official EdNA search.",
          notesHref: "https://www.edna.pa.gov/Screens/wfSearchEntity.aspx",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Pennsylvania's official EdNA search.",
          notesHref: "https://www.edna.pa.gov/Screens/wfSearchEntity.aspx",
        },
      ],
    },
  },
  "us-tx": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Presidents' Day", date: "2026-02-16" },
        { name: "Texas Independence Day", date: "2026-03-02" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Emancipation Day in Texas", date: "2026-06-19" },
        { name: "Independence Day", date: "2026-07-04" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Eve", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Texas districts publish their own calendars. Use the official Texas school directory to reach your district.",
          notesHref: "https://tea.texas.gov/texas-schools/general-information/finding-a-school-for-your-child/texas-school-directory",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Texas school directory.",
          notesHref: "https://tea.texas.gov/texas-schools/general-information/finding-a-school-for-your-child/texas-school-directory",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the Texas school directory.",
          notesHref: "https://tea.texas.gov/texas-schools/general-information/finding-a-school-for-your-child/texas-school-directory",
        },
      ],
    },
  },
  "us-va": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King, Jr. Day", date: "2026-01-19" },
        { name: "George Washington Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day & Yorktown Victory Day", date: "2026-10-12" },
        { name: "Election Day", date: "2026-11-03" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Eve", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by division",
          endLabel: "Varies by division",
          notes: "Virginia school divisions publish their own calendars. Use the official VDOE school directories and division listings to reach your local calendar.",
          notesHref: "https://www.doe.virginia.gov/about-vdoe/virginia-school-directories",
        },
        {
          term: "Winter break",
          startLabel: "Varies by division",
          endLabel: "Varies by division",
          notes: "Check your division calendar through the Virginia school directories.",
          notesHref: "https://www.doe.virginia.gov/about-vdoe/virginia-school-directories",
        },
        {
          term: "Spring break",
          startLabel: "Varies by division",
          endLabel: "Varies by division",
          notes: "Check your division calendar through the Virginia school directories.",
          notesHref: "https://www.doe.virginia.gov/about-vdoe/virginia-school-directories",
        },
      ],
    },
  },
  "us-wa": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Presidents' Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth Day", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans' Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Native American Heritage Day", date: "2026-11-27" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Washington school districts publish their own calendars. Use the official OSPI district websites and contact directory to find your district calendar.",
          notesHref: "https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the official Washington district directory.",
          notesHref: "https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through the official Washington district directory.",
          notesHref: "https://ospi.k12.wa.us/about-ospi/about-school-districts/websites-and-contact-info",
        },
      ],
    },
  },
  "us-tn": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "New Year's Day additional closure", date: "2026-01-02" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Presidents' Day", date: "2026-02-16" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Eve", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "New Year's Eve", date: "2026-12-31" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Tennessee school districts publish their own calendars. Use the official TDOE school directory to find your district and local calendar.",
          notesHref: "https://www.tn.gov/education/districts/lea-operations/school-resources/school-directory.html",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Tennessee's official school directory.",
          notesHref: "https://www.tn.gov/education/districts/lea-operations/school-resources/school-directory.html",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Tennessee's official school directory.",
          notesHref: "https://www.tn.gov/education/districts/lea-operations/school-resources/school-directory.html",
        },
      ],
    },
  },
  "us-in": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King, Jr. Day", date: "2026-01-19" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Primary Election Day", date: "2026-05-05" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day", date: "2026-10-12" },
        { name: "General Election Day", date: "2026-11-03" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Lincoln's Birthday", date: "2026-11-27" },
        { name: "Washington's Birthday", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Indiana school corporations publish their own calendars. Use the official IDOE data center and school directory resources to locate your district.",
          notesHref: "https://www.in.gov/doe/it/data-center-and-reports/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Indiana's official school directory resources.",
          notesHref: "https://www.in.gov/doe/it/data-center-and-reports/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Indiana's official school directory resources.",
          notesHref: "https://www.in.gov/doe/it/data-center-and-reports/",
        },
      ],
    },
  },
  "us-mo": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King, Jr.'s Birthday", date: "2026-01-19" },
        { name: "Lincoln's Birthday", date: "2026-02-12" },
        { name: "Washington's Birthday", date: "2026-02-16" },
        { name: "Truman Day", date: "2026-05-08" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day", date: "2026-10-12" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Missouri districts publish their own calendars. Use the official Missouri School Directory to locate your district and local calendar.",
          notesHref: "https://dese.mo.gov/directory",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Missouri's official school directory.",
          notesHref: "https://dese.mo.gov/directory",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Missouri's official school directory.",
          notesHref: "https://dese.mo.gov/directory",
        },
      ],
    },
  },
  "us-md": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Dr. Martin Luther King, Jr. Birthday", date: "2026-01-19" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "General Election Day", date: "2026-11-03" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by school system",
          endLabel: "Varies by school system",
          notes: "Maryland school systems publish local calendars. Use the official opening and closing dates page to compare district schedules.",
          notesHref: "https://www.marylandpublicschools.org/about/Pages/School-Systems/OpenClosingDates20242025.aspx",
        },
        {
          term: "Winter break",
          startLabel: "Varies by school system",
          endLabel: "Varies by school system",
          notes: "Check your local school system calendar through Maryland's official opening and closing dates page.",
          notesHref: "https://www.marylandpublicschools.org/about/Pages/School-Systems/OpenClosingDates20242025.aspx",
        },
        {
          term: "Spring break",
          startLabel: "Varies by school system",
          endLabel: "Varies by school system",
          notes: "Check your local school system calendar through Maryland's official opening and closing dates page.",
          notesHref: "https://www.marylandpublicschools.org/about/Pages/School-Systems/OpenClosingDates20242025.aspx",
        },
      ],
    },
  },
  "us-wi": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King, Jr.'s Birthday", date: "2026-01-19" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Independence Day", date: "2026-07-04" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Eve Day", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "New Year's Eve Day", date: "2026-12-31" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Wisconsin districts publish their own calendars. Use the official DPI district report card portal to find district information.",
          notesHref: "https://apps6.dpi.wi.gov/reportcards/home",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Wisconsin's official district resources.",
          notesHref: "https://apps6.dpi.wi.gov/reportcards/home",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Wisconsin's official district resources.",
          notesHref: "https://apps6.dpi.wi.gov/reportcards/home",
        },
      ],
    },
  },
  "us-co": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "President's Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Frances Xavier Cabrini Day", date: "2026-10-05" },
        { name: "Veteran's Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Colorado districts publish their own calendars. Use the official Colorado education directory to find district websites and opening and closing day resources.",
          notesHref: "https://cde.state.co.us/cdegen/educationdirectory",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Colorado's official education directory.",
          notesHref: "https://cde.state.co.us/cdegen/educationdirectory",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Colorado's official education directory.",
          notesHref: "https://cde.state.co.us/cdegen/educationdirectory",
        },
      ],
    },
  },
  "us-mn": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Presidents' Day", date: "2026-02-16" },
        { name: "Memorial Day", date: "2026-05-25" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Thanksgiving Friday", date: "2026-11-27" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Minnesota districts publish their own calendars. Use the official Minnesota School Directory to find district websites and local term dates.",
          notesHref: "https://education.mn.gov/MDE/fam/schools/directory/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Minnesota's official school directory.",
          notesHref: "https://education.mn.gov/MDE/fam/schools/directory/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through Minnesota's official school directory.",
          notesHref: "https://education.mn.gov/MDE/fam/schools/directory/",
        },
      ],
    },
  },
  "us-al": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King, Jr. & Robert E. Lee's Birthday", date: "2026-01-19" },
        { name: "George Washington & Thomas Jefferson's Birthday", date: "2026-02-16" },
        { name: "Mardi Gras", date: "2026-02-17", notes: "Observed only in Baldwin and Mobile Counties." },
        { name: "Confederate Memorial Day", date: "2026-04-27" },
        { name: "National Memorial Day", date: "2026-05-25" },
        { name: "Jefferson Davis' Birthday", date: "2026-06-01" },
        { name: "Juneteenth", date: "2026-06-19" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Columbus Day, Fraternal Day & American Indian Heritage Day", date: "2026-10-12" },
        { name: "Veterans' Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Alabama systems publish their own calendars. Use the official ALSDE education directory to find your local system and school websites.",
          notesHref: "https://eddir.alsde.edu/siteinfo/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your local system calendar through Alabama's official education directory.",
          notesHref: "https://eddir.alsde.edu/siteinfo/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your local system calendar through Alabama's official education directory.",
          notesHref: "https://eddir.alsde.edu/siteinfo/",
        },
      ],
    },
  },
  "us-sc": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Martin Luther King, Jr. Day", date: "2026-01-19" },
        { name: "George Washington's Birthday / Presidents Day", date: "2026-02-16" },
        { name: "Confederate Memorial Day", date: "2026-05-11" },
        { name: "National Memorial Day", date: "2026-05-25" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Day after Thanksgiving", date: "2026-11-27" },
        { name: "Christmas Eve", date: "2026-12-24" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Day after Christmas", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "South Carolina districts publish their own calendars. Use the official SCDE district information pages to find local calendars and websites.",
          notesHref: "https://ed.sc.gov/districts-schools/schools/school-directory/district-information/",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through South Carolina's official district directory.",
          notesHref: "https://ed.sc.gov/districts-schools/schools/school-directory/district-information/",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your district calendar through South Carolina's official district directory.",
          notesHref: "https://ed.sc.gov/districts-schools/schools/school-directory/district-information/",
        },
      ],
    },
  },
  "us-la": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Day After New Year's", date: "2026-01-02" },
        { name: "Martin Luther King Jr. Day", date: "2026-01-19" },
        { name: "Mardi Gras", date: "2026-02-17" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Independence Day (observed)", date: "2026-07-03" },
        { name: "Labor Day", date: "2026-09-07" },
        { name: "Election Day", date: "2026-11-03" },
        { name: "Veterans Day", date: "2026-11-11" },
        { name: "Thanksgiving Day", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "School calendar",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Louisiana school systems publish their own calendars. Use official Louisiana school performance and system resources to reach your local district.",
          notesHref: "https://www.louisianabelieves.com/data/sps/Default_tst.aspx",
        },
        {
          term: "Winter break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your local system calendar through Louisiana's official school resources.",
          notesHref: "https://www.louisianabelieves.com/data/sps/Default_tst.aspx",
        },
        {
          term: "Spring break",
          startLabel: "Varies by district",
          endLabel: "Varies by district",
          notes: "Check your local system calendar through Louisiana's official school resources.",
          notesHref: "https://www.louisianabelieves.com/data/sps/Default_tst.aspx",
        },
      ],
    },
  },
  "nz-auckland": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Day after New Year's Day", date: "2026-01-02" },
        { name: "Auckland Anniversary Day", date: "2026-01-26" },
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
    schoolTerms: {
      2026: [
        {
          term: "Term 1",
          startLabel: "Between Monday 26 January and Monday 9 February",
          end: "2026-04-02",
          notes: "Official Ministry of Education range. Individual schools choose their start date within the allowed window.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
        {
          term: "Term 2",
          start: "2026-04-20",
          end: "2026-07-03",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
          notes: "Official Ministry of Education term dates.",
        },
        {
          term: "Term 3",
          start: "2026-07-20",
          end: "2026-09-25",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
          notes: "Official Ministry of Education term dates.",
        },
        {
          term: "Term 4",
          start: "2026-10-12",
          endLabel: "No later than Friday 18 December",
          notes: "Official Ministry of Education latest end date. Individual schools may finish earlier.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
      ],
    },
  },
  "nz-canterbury": {
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
        { name: "Canterbury Anniversary Day", date: "2026-11-13" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day (observed)", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "Term 1",
          startLabel: "Between Monday 26 January and Monday 9 February",
          end: "2026-04-02",
          notes: "Official Ministry of Education range. Individual schools choose their start date within the allowed window.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
        {
          term: "Term 2",
          start: "2026-04-20",
          end: "2026-07-03",
          notes: "Official Ministry of Education term dates.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
        {
          term: "Term 3",
          start: "2026-07-20",
          end: "2026-09-25",
          notes: "Official Ministry of Education term dates.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
        {
          term: "Term 4",
          start: "2026-10-12",
          endLabel: "No later than Friday 18 December",
          notes: "Official Ministry of Education latest end date. Individual schools may finish earlier.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
      ],
    },
  },
  "nz-wellington": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Day after New Year's Day", date: "2026-01-02" },
        { name: "Wellington Anniversary Day", date: "2026-01-19" },
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
    schoolTerms: {
      2026: [
        {
          term: "Term 1",
          startLabel: "Between Monday 26 January and Monday 9 February",
          end: "2026-04-02",
          notes: "Official Ministry of Education range. Individual schools choose their start date within the allowed window.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
        {
          term: "Term 2",
          start: "2026-04-20",
          end: "2026-07-03",
          notes: "Official Ministry of Education term dates.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
        {
          term: "Term 3",
          start: "2026-07-20",
          end: "2026-09-25",
          notes: "Official Ministry of Education term dates.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
        {
          term: "Term 4",
          start: "2026-10-12",
          endLabel: "No later than Friday 18 December",
          notes: "Official Ministry of Education latest end date. Individual schools may finish earlier.",
          notesHref: "https://www.education.govt.nz/term-dates-and-holidays",
        },
      ],
    },
  },
  "uk-england": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "Early May bank holiday", date: "2026-05-04" },
        { name: "Spring bank holiday", date: "2026-05-25" },
        { name: "Summer bank holiday", date: "2026-08-31" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day (substitute day)", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "February half term holidays",
          start: "2026-02-16",
          end: "2026-02-20",
          notes: "Approximate dates. Check GOV.UK school term and holiday dates",
          notesHref: "https://www.gov.uk/school-term-holiday-dates",
        },
        {
          term: "Easter school holidays",
          start: "2026-03-30",
          end: "2026-04-10",
          notes: "Approximate dates. Check GOV.UK school term and holiday dates",
          notesHref: "https://www.gov.uk/school-term-holiday-dates",
        },
        {
          term: "May half term holidays",
          start: "2026-05-25",
          end: "2026-05-29",
          notes: "Approximate dates. Check GOV.UK school term and holiday dates",
          notesHref: "https://www.gov.uk/school-term-holiday-dates",
        },
        {
          term: "Summer school holidays",
          start: "2026-07-20",
          end: "2026-08-28",
          notes: "Approximate dates. Check GOV.UK school term and holiday dates",
          notesHref: "https://www.gov.uk/school-term-holiday-dates",
        },
        {
          term: "October half term holidays",
          start: "2026-10-26",
          end: "2026-10-30",
          notes: "Approximate dates. Check GOV.UK school term and holiday dates",
          notesHref: "https://www.gov.uk/school-term-holiday-dates",
        },
        {
          term: "Christmas holidays 2026",
          start: "2026-12-21",
          end: "2027-01-04",
          notes: "Approximate dates. Check GOV.UK school term and holiday dates",
          notesHref: "https://www.gov.uk/school-term-holiday-dates",
        },
      ],
    },
  },
  "uk-scotland": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "2nd January", date: "2026-01-02" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Early May bank holiday", date: "2026-05-04" },
        { name: "Spring bank holiday", date: "2026-05-25" },
        { name: "World Cup bank holiday", date: "2026-06-15" },
        { name: "Summer bank holiday", date: "2026-08-03" },
        { name: "St Andrew's Day", date: "2026-11-30" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day (substitute day)", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        {
          term: "Spring term",
          startLabel: "Usually early January",
          endLabel: "Usually early April",
          notes: "Scottish local authorities set exact term dates and holiday breaks.",
        },
        {
          term: "Summer term",
          startLabel: "Usually late April",
          endLabel: "Usually late June",
          notes: "Scottish local authorities set exact term dates and holiday breaks.",
        },
        {
          term: "Autumn term",
          startLabel: "Usually second or third week of August",
          endLabel: "Usually late December",
          notes: "Scottish local authorities set exact term dates and holiday breaks.",
        },
      ],
    },
  },
  "uk-wales": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "Early May bank holiday", date: "2026-05-04" },
        { name: "Spring bank holiday", date: "2026-05-25" },
        { name: "Summer bank holiday", date: "2026-08-31" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day (substitute day)", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Spring term", start: "2026-01-05", end: "2026-03-27" },
        { term: "Summer term", start: "2026-04-13", end: "2026-07-20" },
        { term: "Autumn term", start: "2026-09-01", end: "2026-12-18" },
      ],
    },
  },
  "uk-northern-ireland": {
    publicHolidays: {
      2026: [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "St Patrick's Day", date: "2026-03-17" },
        { name: "Good Friday", date: "2026-04-03" },
        { name: "Easter Monday", date: "2026-04-06" },
        { name: "Early May bank holiday", date: "2026-05-04" },
        { name: "Spring bank holiday", date: "2026-05-25" },
        { name: "Battle of the Boyne (Orangemen's Day) substitute day", date: "2026-07-13" },
        { name: "Summer bank holiday", date: "2026-08-31" },
        { name: "Christmas Day", date: "2026-12-25" },
        { name: "Boxing Day (substitute day)", date: "2026-12-28" },
      ],
    },
    schoolTerms: {
      2026: [
        { term: "Spring term", start: "2026-01-05", end: "2026-04-02" },
        { term: "Summer term", start: "2026-04-13", end: "2026-06-30" },
        { term: "Autumn term", start: "2026-09-01", end: "2026-12-18" },
      ],
    },
  },
};

const regionAttributions =
  referenceAttributions.regionAttributions as Record<string, RegionReferenceAttributions>;

function toUtcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  occurrence: number,
): Date {
  const date = toUtcDate(year, month, 1);

  while (date.getUTCDay() !== weekday) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  date.setUTCDate(date.getUTCDate() + (occurrence - 1) * 7);
  return date;
}

function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const date = toUtcDate(year, month + 1, 0);

  while (date.getUTCDay() !== weekday) {
    date.setUTCDate(date.getUTCDate() - 1);
  }

  return date;
}

function nearestWeekdayToDate(year: number, month: number, day: number, weekday: number): Date {
  const target = toUtcDate(year, month, day);
  let bestMatch = target;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let offset = -6; offset <= 6; offset += 1) {
    const candidate = addDays(target, offset);

    if (candidate.getUTCDay() !== weekday) {
      continue;
    }

    const distance = Math.abs(offset);

    if (distance < bestDistance || (distance === bestDistance && offset < 0)) {
      bestMatch = candidate;
      bestDistance = distance;
    }
  }

  return bestMatch;
}

function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return toUtcDate(year, month, day);
}

function mondayizeIfWeekend(date: Date): Date {
  const weekday = date.getUTCDay();

  if (weekday === 6) {
    return addDays(date, 2);
  }

  if (weekday === 0) {
    return addDays(date, 1);
  }

  return date;
}

function pushRegionHolidayYear(regionId: string, year: number, rows: RegionPublicHolidayRow[]) {
  regionData[regionId].publicHolidays[year] = rows;
}

function buildAustralianRegionHolidays(regionId: string, year: number): RegionPublicHolidayRow[] {
  const easter = easterSunday(year);
  const goodFriday = addDays(easter, -2);
  const easterSaturday = addDays(easter, -1);
  const easterMonday = addDays(easter, 1);
  const easterTuesday = addDays(easter, 2);
  const anzacDay = toUtcDate(year, 4, 25);
  const christmasDay = toUtcDate(year, 12, 25);
  const boxingDay = toUtcDate(year, 12, 26);
  const rows: RegionPublicHolidayRow[] = [
    { name: "New Year's Day", date: toIsoDate(toUtcDate(year, 1, 1)) },
    { name: "Australia Day", date: toIsoDate(toUtcDate(year, 1, 26)) },
  ];

  if (toUtcDate(year, 1, 1).getUTCDay() === 6 || toUtcDate(year, 1, 1).getUTCDay() === 0) {
    rows.push({
      name: "New Year's Day additional public holiday",
      date: toIsoDate(mondayizeIfWeekend(toUtcDate(year, 1, 1))),
    });
  }

  switch (regionId) {
    case "au-vic":
      rows.push(
        { name: "Labour Day", date: toIsoDate(nthWeekdayOfMonth(year, 3, 1, 2)) },
        { name: "Good Friday", date: toIsoDate(goodFriday) },
        { name: "Easter Saturday", date: toIsoDate(easterSaturday) },
        { name: "Easter Sunday", date: toIsoDate(easter) },
        { name: "Easter Monday", date: toIsoDate(easterMonday) },
        { name: "ANZAC Day", date: toIsoDate(anzacDay) },
        { name: "King's Birthday", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 2)) },
        {
          name: "Friday before AFL Grand Final",
          label: "Date varies each year",
          notes: "Usually observed on the Friday before the AFL Grand Final.",
        },
        { name: "Melbourne Cup", date: toIsoDate(nthWeekdayOfMonth(year, 11, 2, 1)) },
      );
      break;
    case "au-nsw":
      rows.push(
        { name: "Good Friday", date: toIsoDate(goodFriday) },
        { name: "Easter Saturday", date: toIsoDate(easterSaturday) },
        { name: "Easter Sunday", date: toIsoDate(easter) },
        { name: "Easter Monday", date: toIsoDate(easterMonday) },
        { name: "ANZAC Day", date: toIsoDate(anzacDay) },
        { name: "King's Birthday", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 2)) },
        { name: "Labour Day", date: toIsoDate(nthWeekdayOfMonth(year, 10, 1, 1)) },
      );
      if (anzacDay.getUTCDay() === 6 || anzacDay.getUTCDay() === 0) {
        rows.push({
          name: "ANZAC Day additional public holiday",
          date: toIsoDate(mondayizeIfWeekend(anzacDay)),
        });
      }
      break;
    case "au-qld":
      rows.push(
        { name: "Good Friday", date: toIsoDate(goodFriday) },
        { name: "Day after Good Friday", date: toIsoDate(easterSaturday) },
        { name: "Easter Sunday", date: toIsoDate(easter) },
        { name: "Easter Monday", date: toIsoDate(easterMonday) },
        { name: "ANZAC Day", date: toIsoDate(anzacDay) },
        { name: "Labour Day", date: toIsoDate(nthWeekdayOfMonth(year, 5, 1, 1)) },
        { name: "King's Birthday", date: toIsoDate(nthWeekdayOfMonth(year, 10, 1, 1)) },
        { name: "Christmas Eve (part-day)", date: toIsoDate(toUtcDate(year, 12, 24)) },
      );
      break;
    case "au-sa":
      rows.push(
        { name: "Adelaide Cup Day", date: toIsoDate(nthWeekdayOfMonth(year, 3, 1, 2)) },
        { name: "Good Friday", date: toIsoDate(goodFriday) },
        { name: "Easter Saturday", date: toIsoDate(easterSaturday) },
        { name: "Easter Sunday", date: toIsoDate(easter) },
        { name: "Easter Monday", date: toIsoDate(easterMonday) },
        { name: "ANZAC Day", date: toIsoDate(anzacDay) },
        { name: "King's Birthday", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 2)) },
        { name: "Labour Day", date: toIsoDate(nthWeekdayOfMonth(year, 10, 1, 1)) },
        { name: "Christmas Eve (part-day)", date: toIsoDate(toUtcDate(year, 12, 24)) },
        { name: "Proclamation Day", date: toIsoDate(boxingDay) },
        { name: "New Year's Eve (part-day)", date: toIsoDate(toUtcDate(year, 12, 31)) },
      );
      if (boxingDay.getUTCDay() === 6 || boxingDay.getUTCDay() === 0) {
        rows.push({
          name: "Proclamation Day additional public holiday",
          date: toIsoDate(toUtcDate(year, 12, 28)),
        });
      }
      break;
    case "au-wa":
      rows.push(
        { name: "Labour Day", date: toIsoDate(nthWeekdayOfMonth(year, 3, 1, 1)) },
        { name: "Good Friday", date: toIsoDate(goodFriday) },
        { name: "Easter Sunday", date: toIsoDate(easter) },
        { name: "Easter Monday", date: toIsoDate(easterMonday) },
        { name: "ANZAC Day", date: toIsoDate(anzacDay) },
        { name: "Western Australia Day", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 1)) },
        { name: "King's Birthday", date: toIsoDate(lastWeekdayOfMonth(year, 9, 1)) },
      );
      if (anzacDay.getUTCDay() === 6 || anzacDay.getUTCDay() === 0) {
        rows.push({
          name: "ANZAC Day additional public holiday",
          date: toIsoDate(mondayizeIfWeekend(anzacDay)),
        });
      }
      break;
    case "au-tas":
      rows.push(
        { name: "Eight Hours Day", date: toIsoDate(nthWeekdayOfMonth(year, 3, 1, 2)) },
        { name: "Good Friday", date: toIsoDate(goodFriday) },
        { name: "Easter Monday", date: toIsoDate(easterMonday) },
        { name: "Easter Tuesday", date: toIsoDate(easterTuesday) },
        { name: "ANZAC Day", date: toIsoDate(anzacDay) },
        { name: "King's Birthday", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 2)) },
      );
      break;
    case "au-act":
      rows.push(
        { name: "Canberra Day", date: toIsoDate(nthWeekdayOfMonth(year, 3, 1, 2)) },
        { name: "Good Friday", date: toIsoDate(goodFriday) },
        { name: "Easter Saturday", date: toIsoDate(easterSaturday) },
        { name: "Easter Sunday", date: toIsoDate(easter) },
        { name: "Easter Monday", date: toIsoDate(easterMonday) },
        { name: "ANZAC Day", date: toIsoDate(anzacDay) },
        { name: "Reconciliation Day", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 1)) },
        { name: "King's Birthday", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 2)) },
        { name: "Labour Day", date: toIsoDate(nthWeekdayOfMonth(year, 10, 1, 1)) },
      );
      if (anzacDay.getUTCDay() === 6 || anzacDay.getUTCDay() === 0) {
        rows.push({
          name: "ANZAC Day additional public holiday",
          date: toIsoDate(mondayizeIfWeekend(anzacDay)),
        });
      }
      break;
    case "au-nt":
      rows.push(
        { name: "Good Friday", date: toIsoDate(goodFriday) },
        { name: "Easter Saturday", date: toIsoDate(easterSaturday) },
        { name: "Easter Sunday", date: toIsoDate(easter) },
        { name: "Easter Monday", date: toIsoDate(easterMonday) },
        { name: "ANZAC Day", date: toIsoDate(anzacDay) },
        { name: "May Day", date: toIsoDate(nthWeekdayOfMonth(year, 5, 1, 1)) },
        { name: "King's Birthday", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 2)) },
        { name: "Picnic Day", date: toIsoDate(nthWeekdayOfMonth(year, 8, 1, 1)) },
        { name: "Christmas Eve (part-day)", date: toIsoDate(toUtcDate(year, 12, 24)) },
        { name: "New Year's Eve (part-day)", date: toIsoDate(toUtcDate(year, 12, 31)) },
      );
      break;
    default:
      return [];
  }

  rows.push(
    { name: "Christmas Day", date: toIsoDate(christmasDay) },
    { name: "Boxing Day", date: toIsoDate(boxingDay) },
  );

  if (christmasDay.getUTCDay() === 6 || christmasDay.getUTCDay() === 0) {
    rows.push({
      name: "Christmas Day additional public holiday",
      date: toIsoDate(toUtcDate(year, 12, 27)),
    });
  }

  if (boxingDay.getUTCDay() === 6 || boxingDay.getUTCDay() === 0) {
    rows.push({
      name:
        regionId === "au-sa" ? "Proclamation Day additional public holiday" : "Boxing Day additional public holiday",
      date: toIsoDate(toUtcDate(year, 12, 28)),
    });
  }

  return rows;
}

function buildUnitedKingdomRegionHolidays(regionId: string, year: number): RegionPublicHolidayRow[] {
  const goodFriday = addDays(easterSunday(year), -2);
  const easterMonday = addDays(easterSunday(year), 1);
  const newYear = toUtcDate(year, 1, 1);
  const christmasDay = toUtcDate(year, 12, 25);
  const boxingDay = toUtcDate(year, 12, 26);

  if (regionId === "uk-england" || regionId === "uk-wales") {
    return [
      {
        name: newYear.getUTCDay() === 6 || newYear.getUTCDay() === 0 ? "New Year's Day (substitute day)" : "New Year's Day",
        date: toIsoDate(mondayizeIfWeekend(newYear)),
      },
      { name: "Good Friday", date: toIsoDate(goodFriday) },
      { name: "Easter Monday", date: toIsoDate(easterMonday) },
      { name: "Early May bank holiday", date: toIsoDate(nthWeekdayOfMonth(year, 5, 1, 1)) },
      { name: "Spring bank holiday", date: toIsoDate(lastWeekdayOfMonth(year, 5, 1)) },
      { name: "Summer bank holiday", date: toIsoDate(lastWeekdayOfMonth(year, 8, 1)) },
      {
        name:
          christmasDay.getUTCDay() === 6 || christmasDay.getUTCDay() === 0
            ? "Christmas Day (substitute day)"
            : "Christmas Day",
        date: toIsoDate(mondayizeIfWeekend(christmasDay)),
      },
      {
        name:
          boxingDay.getUTCDay() === 6 || boxingDay.getUTCDay() === 0
            ? "Boxing Day (substitute day)"
            : "Boxing Day",
        date: toIsoDate(
          boxingDay.getUTCDay() === 0 ? toUtcDate(year, 12, 28) : mondayizeIfWeekend(boxingDay),
        ),
      },
    ];
  }

  if (regionId === "uk-scotland") {
    return [
      {
        name: newYear.getUTCDay() === 6 || newYear.getUTCDay() === 0 ? "New Year's Day (substitute day)" : "New Year's Day",
        date: toIsoDate(mondayizeIfWeekend(newYear)),
      },
      {
        name: toUtcDate(year, 1, 2).getUTCDay() === 6 || toUtcDate(year, 1, 2).getUTCDay() === 0
          ? "2nd January (substitute day)"
          : "2nd January",
        date: toIsoDate(mondayizeIfWeekend(toUtcDate(year, 1, 2))),
      },
      { name: "Good Friday", date: toIsoDate(goodFriday) },
      { name: "Early May bank holiday", date: toIsoDate(nthWeekdayOfMonth(year, 5, 1, 1)) },
      { name: "Spring bank holiday", date: toIsoDate(lastWeekdayOfMonth(year, 5, 1)) },
      { name: "Summer bank holiday", date: toIsoDate(nthWeekdayOfMonth(year, 8, 1, 1)) },
      {
        name: "St Andrew's Day" + (toUtcDate(year, 11, 30).getUTCDay() === 6 || toUtcDate(year, 11, 30).getUTCDay() === 0 ? " (substitute day)" : ""),
        date: toIsoDate(mondayizeIfWeekend(toUtcDate(year, 11, 30))),
      },
      {
        name:
          christmasDay.getUTCDay() === 6 || christmasDay.getUTCDay() === 0
            ? "Christmas Day (substitute day)"
            : "Christmas Day",
        date: toIsoDate(mondayizeIfWeekend(christmasDay)),
      },
      {
        name:
          boxingDay.getUTCDay() === 6 || boxingDay.getUTCDay() === 0
            ? "Boxing Day (substitute day)"
            : "Boxing Day",
        date: toIsoDate(
          boxingDay.getUTCDay() === 0 ? toUtcDate(year, 12, 28) : mondayizeIfWeekend(boxingDay),
        ),
      },
    ];
  }

  return [
    {
      name: newYear.getUTCDay() === 6 || newYear.getUTCDay() === 0 ? "New Year's Day (substitute day)" : "New Year's Day",
      date: toIsoDate(mondayizeIfWeekend(newYear)),
    },
    {
      name: "St Patrick's Day" + (toUtcDate(year, 3, 17).getUTCDay() === 6 || toUtcDate(year, 3, 17).getUTCDay() === 0 ? " (substitute day)" : ""),
      date: toIsoDate(mondayizeIfWeekend(toUtcDate(year, 3, 17))),
    },
    { name: "Good Friday", date: toIsoDate(goodFriday) },
    { name: "Easter Monday", date: toIsoDate(easterMonday) },
    { name: "Early May bank holiday", date: toIsoDate(nthWeekdayOfMonth(year, 5, 1, 1)) },
    { name: "Spring bank holiday", date: toIsoDate(lastWeekdayOfMonth(year, 5, 1)) },
    {
      name:
        "Battle of the Boyne (Orangemen's Day)" +
        (toUtcDate(year, 7, 12).getUTCDay() === 6 || toUtcDate(year, 7, 12).getUTCDay() === 0
          ? " substitute day"
          : ""),
      date: toIsoDate(mondayizeIfWeekend(toUtcDate(year, 7, 12))),
    },
    { name: "Summer bank holiday", date: toIsoDate(lastWeekdayOfMonth(year, 8, 1)) },
    {
      name:
        christmasDay.getUTCDay() === 6 || christmasDay.getUTCDay() === 0
          ? "Christmas Day (substitute day)"
          : "Christmas Day",
      date: toIsoDate(mondayizeIfWeekend(christmasDay)),
    },
    {
      name:
        boxingDay.getUTCDay() === 6 || boxingDay.getUTCDay() === 0
          ? "Boxing Day (substitute day)"
          : "Boxing Day",
      date: toIsoDate(
        boxingDay.getUTCDay() === 0 ? toUtcDate(year, 12, 28) : mondayizeIfWeekend(boxingDay),
      ),
    },
  ];
}

function buildNewZealandRegionHolidays(regionId: string, year: number): RegionPublicHolidayRow[] {
  const newYear = toUtcDate(year, 1, 1);
  const dayAfterNewYear = toUtcDate(year, 1, 2);
  const waitangi = toUtcDate(year, 2, 6);
  const anzacDay = toUtcDate(year, 4, 25);
  const christmasDay = toUtcDate(year, 12, 25);
  const boxingDay = toUtcDate(year, 12, 26);
  const easter = easterSunday(year);
  const matarikiByYear: Record<number, string> = {
    2027: "2027-06-25",
    2028: "2028-07-14",
  };
  const rows: RegionPublicHolidayRow[] = [
    {
      name: newYear.getUTCDay() === 6 || newYear.getUTCDay() === 0 ? "New Year's Day (observed)" : "New Year's Day",
      date: toIsoDate(mondayizeIfWeekend(newYear)),
    },
    {
      name:
        dayAfterNewYear.getUTCDay() === 6 || dayAfterNewYear.getUTCDay() === 0
          ? "Day after New Year's Day (observed)"
          : "Day after New Year's Day",
      date: toIsoDate(
        dayAfterNewYear.getUTCDay() === 6
          ? toUtcDate(year, 1, 4)
          : dayAfterNewYear.getUTCDay() === 0
            ? toUtcDate(year, 1, 4)
            : dayAfterNewYear,
      ),
    },
  ];

  if (regionId === "nz-auckland") {
    rows.push({ name: "Auckland Anniversary Day", date: toIsoDate(nearestWeekdayToDate(year, 1, 29, 1)) });
  } else if (regionId === "nz-wellington") {
    rows.push({ name: "Wellington Anniversary Day", date: toIsoDate(nearestWeekdayToDate(year, 1, 22, 1)) });
  } else if (regionId === "nz-canterbury") {
    const firstTuesday = nthWeekdayOfMonth(year, 11, 2, 1);
    rows.push({ name: "Canterbury Anniversary Day", date: toIsoDate(addDays(firstTuesday, 10)) });
  }

  rows.push(
    {
      name: waitangi.getUTCDay() === 6 || waitangi.getUTCDay() === 0 ? "Waitangi Day (observed)" : "Waitangi Day",
      date: toIsoDate(mondayizeIfWeekend(waitangi)),
    },
    { name: "Good Friday", date: toIsoDate(addDays(easter, -2)) },
    { name: "Easter Monday", date: toIsoDate(addDays(easter, 1)) },
    {
      name: anzacDay.getUTCDay() === 6 || anzacDay.getUTCDay() === 0 ? "ANZAC Day (observed)" : "ANZAC Day",
      date: toIsoDate(mondayizeIfWeekend(anzacDay)),
    },
    { name: "King's Birthday", date: toIsoDate(nthWeekdayOfMonth(year, 6, 1, 1)) },
    { name: "Matariki", date: matarikiByYear[year] },
    { name: "Labour Day", date: toIsoDate(nthWeekdayOfMonth(year, 10, 1, 4)) },
    {
      name: christmasDay.getUTCDay() === 6 || christmasDay.getUTCDay() === 0 ? "Christmas Day (observed)" : "Christmas Day",
      date: toIsoDate(mondayizeIfWeekend(christmasDay)),
    },
    {
      name: boxingDay.getUTCDay() === 6 || boxingDay.getUTCDay() === 0 ? "Boxing Day (observed)" : "Boxing Day",
      date: toIsoDate(
        boxingDay.getUTCDay() === 0 ? toUtcDate(year, 12, 28) : mondayizeIfWeekend(boxingDay),
      ),
    },
  );

  return rows;
}

for (const year of [2027, 2028]) {
  for (const regionId of [
    "au-vic",
    "au-nsw",
    "au-qld",
    "au-sa",
    "au-wa",
    "au-tas",
    "au-act",
    "au-nt",
  ]) {
    pushRegionHolidayYear(regionId, year, buildAustralianRegionHolidays(regionId, year));
  }

  for (const regionId of ["uk-england", "uk-scotland", "uk-wales", "uk-northern-ireland"]) {
    pushRegionHolidayYear(regionId, year, buildUnitedKingdomRegionHolidays(regionId, year));
  }

  for (const regionId of ["nz-auckland", "nz-canterbury", "nz-wellington"]) {
    pushRegionHolidayYear(regionId, year, buildNewZealandRegionHolidays(regionId, year));
  }
}

export function getRegionReferenceData(regionId: string, year: number): RegionYearData | null {
  const data = regionData[regionId];

  if (!data) {
    return null;
  }

  const publicHolidays = data.publicHolidays[year] ?? [];
  const schoolTerms = data.schoolTerms[year] ?? [];

  if (publicHolidays.length === 0 && schoolTerms.length === 0) {
    return null;
  }

  return {
    publicHolidays,
    schoolTerms,
  };
}

export function hasRegionReferenceData(regionId: string, year: number): boolean {
  return getRegionReferenceData(regionId, year) !== null;
}

export function getRegionReferenceYears(regionId: string): number[] {
  const data = regionData[regionId];

  if (!data) {
    return [];
  }

  return Array.from(
    new Set([
      ...Object.keys(data.publicHolidays).map((year) => Number(year)),
      ...Object.keys(data.schoolTerms).map((year) => Number(year)),
    ]),
  ).sort((left, right) => left - right);
}

export function getRegionAttributions(regionId: string): RegionReferenceAttributions | null {
  return regionAttributions[regionId] ?? null;
}
