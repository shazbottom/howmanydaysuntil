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
        { name: "Friday before AFL Grand Final", label: "TBD" },
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
