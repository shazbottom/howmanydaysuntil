import type { Metadata } from "next";

const SITE_URL = "https://daysuntil.is";

export type CalculatorKind =
  | "days-between"
  | "business-days-between"
  | "business-days-until"
  | "add-or-subtract-date"
  | "days-until-i-retire";

export interface CalculatorPageContent {
  kind: CalculatorKind;
  path: string;
  title: string;
  description: string;
  summary: string;
  howItWorks: string[];
  useCases: string[];
  example: {
    title: string;
    body: string;
  };
  watchFor: string[];
}

export const calculatorPages = [
  {
    kind: "days-between" as const,
    path: "/days-between-dates",
    title: "Days Between Dates Calculator | DaysUntil",
    description: "Calculate the number of calendar days between two dates.",
    summary:
      "Work out the raw calendar-day gap between two dates without excluding weekends or holidays.",
    howItWorks: [
      "Choose a start date and an end date.",
      "The calculator compares the two calendar dates directly and returns the difference in days.",
      "If the end date is earlier than the start date, the result becomes negative so you can see the direction of the difference.",
    ],
    useCases: [
      "Measuring the gap between two deadlines or milestones.",
      "Checking how long a project phase or holiday period lasts.",
      "Comparing two fixed dates without needing business-day rules.",
    ],
    example: {
      title: "Example",
      body: "If you compare March 23, 2026 with December 31, 2026, the tool returns the total number of calendar days between those two dates regardless of weekends or public holidays.",
    },
    watchFor: [
      "This page does not exclude weekends or public holidays.",
      "Date differences are based on calendar dates rather than office hours or working shifts.",
    ],
  },
  {
    kind: "business-days-between" as const,
    path: "/business-days-between-dates",
    title: "Business Days Between Dates Calculator | DaysUntil",
    description: "Calculate the number of business days between two dates.",
    summary:
      "Calculate the working-day gap between two dates while excluding weekends and using holiday calendars where available.",
    howItWorks: [
      "Pick a country, a region or state where available, and then set a start and end date.",
      "The calculator removes Saturdays, Sundays, and supported public holidays from the count.",
      "It returns the resulting business-day total between the two selected dates.",
    ],
    useCases: [
      "Estimating turnaround times for contracts, shipping windows, or payroll cycles.",
      "Checking how many working days are left in a project sprint or notice period.",
      "Planning around deadlines that are defined in business days instead of calendar days.",
    ],
    example: {
      title: "Example",
      body: "If a contract gives you 10 business days from a start date, this calculator shows the count after weekends and regional public holidays have been removed.",
    },
    watchFor: [
      "Holiday coverage depends on the selected country or region data available in the site.",
      "Business-day rules here are practical planning rules and not legal advice for contracts or employment matters.",
    ],
  },
  {
    kind: "business-days-until" as const,
    path: "/business-days-until",
    title: "Business Days Until Calculator | DaysUntil",
    description: "Calculate the number of business days remaining until a target date.",
    summary:
      "See how many working days remain until a target date after weekends and supported public holidays are removed.",
    howItWorks: [
      "Choose a country, region or state where available, and set the target date.",
      "The calculator starts from today and counts forward in business days only.",
      "Weekends and supported public holidays are excluded from the total.",
    ],
    useCases: [
      "Counting down to quarter end, settlement dates, or internal team deadlines.",
      "Checking working days left before a trip, launch, or invoice due date.",
      "Planning workloads when a simple calendar-day countdown is too rough.",
    ],
    example: {
      title: "Example",
      body: "If year end falls on a Thursday, this calculator can show the number of actual working days left rather than the larger calendar-day figure.",
    },
    watchFor: [
      "Results depend on the holiday calendar selected for the country or region.",
      "The count is intended for planning and may differ from formal workplace or legal calculations.",
    ],
  },
  {
    kind: "add-or-subtract-date" as const,
    path: "/add-or-subtract-date",
    title: "Add or Subtract Date Calculator | DaysUntil",
    description: "Add to or subtract from a date using days, weeks, months, or years.",
    summary:
      "Move a date forward or backward using days, weeks, months, or years and immediately see the resulting calendar date.",
    howItWorks: [
      "Choose the starting date, whether you want to add or subtract, the amount, and the unit.",
      "The calculator performs a calendar-date adjustment rather than a business-day adjustment.",
      "It then shows the resulting date and the size of the change that was applied.",
    ],
    useCases: [
      "Working out renewal dates, expiry dates, or reminder points.",
      "Planning dates a set number of weeks or months before an event.",
      "Checking what date lands a fixed number of days after a milestone.",
    ],
    example: {
      title: "Example",
      body: "If you add 30 days to March 24, 2026, the tool shows the resulting calendar date directly instead of making you count the days manually.",
    },
    watchFor: [
      "Month and year changes follow calendar rules, so month-end results can vary depending on the starting date.",
      "This tool does not exclude weekends or public holidays.",
    ],
  },
  {
    kind: "days-until-i-retire" as const,
    path: "/days-until-i-retire",
    title: "Days Until I Retire Calculator | DaysUntil",
    description: "Enter your date of birth and target retirement age to calculate your retirement date and countdown.",
    summary:
      "Estimate a personal retirement countdown based on your date of birth and the retirement age you choose.",
    howItWorks: [
      "Enter your date of birth and the retirement age you want to use.",
      "The calculator adds that age to your birth date to produce a target retirement date.",
      "It then shows the time remaining in days and in a years-months-days breakdown.",
    ],
    useCases: [
      "Personal planning for long-term savings or lifestyle goals.",
      "Comparing what different retirement ages would look like.",
      "Creating a rough countdown without needing official pension rules.",
    ],
    example: {
      title: "Example",
      body: "If you were born on April 1, 1990 and choose age 67, the calculator works out the matching retirement date and shows the countdown from today.",
    },
    watchFor: [
      "This is a personal planning tool and does not use government pension or employer-specific retirement rules.",
      "Different countries and schemes can have very different official eligibility rules.",
    ],
  },
] satisfies CalculatorPageContent[];

export function getCalculatorPage(kind: CalculatorKind) {
  const calculatorPage = calculatorPages.find((page) => page.kind === kind);

  if (!calculatorPage) {
    throw new Error(`Unknown calculator kind: ${kind}`);
  }

  return calculatorPage;
}

export function getCalculatorHubMetadata(): Metadata {
  const title = "Date Calculators | DaysUntil";
  const description =
    "Date calculators for days between dates, business days, and add or subtract date calculations.";
  const url = `${SITE_URL}/calculators`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function getCalculatorMetadata(kind: CalculatorKind): Metadata {
  const calculatorPage = getCalculatorPage(kind);

  const url = `${SITE_URL}${calculatorPage.path}`;

  return {
    title: calculatorPage.title,
    description: calculatorPage.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: calculatorPage.title,
      description: calculatorPage.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: calculatorPage.title,
      description: calculatorPage.description,
    },
  };
}
