import type { Metadata } from "next";

const SITE_URL = "https://daysuntil.is";

export type CalculatorKind =
  | "days-between"
  | "business-days-between"
  | "business-days-until"
  | "add-or-subtract-date";

export const calculatorPages = [
  {
    kind: "days-between" as const,
    path: "/days-between-dates",
    title: "Days Between Dates Calculator | DaysUntil",
    description: "Calculate the number of calendar days between two dates.",
  },
  {
    kind: "business-days-between" as const,
    path: "/business-days-between-dates",
    title: "Business Days Between Dates Calculator | DaysUntil",
    description: "Calculate the number of business days between two dates.",
  },
  {
    kind: "business-days-until" as const,
    path: "/business-days-until",
    title: "Business Days Until Calculator | DaysUntil",
    description: "Calculate the number of business days remaining until a target date.",
  },
  {
    kind: "add-or-subtract-date" as const,
    path: "/add-or-subtract-date",
    title: "Add or Subtract Date Calculator | DaysUntil",
    description: "Add to or subtract from a date using days, weeks, months, or years.",
  },
] satisfies Array<{
  kind: CalculatorKind;
  path: string;
  title: string;
  description: string;
}>;

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
  const calculatorPage = calculatorPages.find((page) => page.kind === kind);

  if (!calculatorPage) {
    throw new Error(`Unknown calculator kind: ${kind}`);
  }

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
