import type { Metadata } from "next";
import { YearPlanningPage } from "../../components/YearPlanningPage";
import { getYearPlanningData } from "../../lib/yearPlanning";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const data = getYearPlanningData("working-days");
  const pageTitle = `${data.title} | DaysUntil`;
  return {
    title: pageTitle,
    description: data.description,
    alternates: { canonical: "/working-days-left-this-year" },
    openGraph: {
      title: pageTitle,
      description: data.description,
      url: "/working-days-left-this-year",
      type: "website",
    },
    twitter: { card: "summary", title: pageTitle, description: data.description },
  };
}

export default function WorkingDaysLeftThisYearPage() {
  return <YearPlanningPage kind="working-days" />;
}
