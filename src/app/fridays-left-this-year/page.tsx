import type { Metadata } from "next";
import { YearPlanningPage } from "../../components/YearPlanningPage";
import { getYearPlanningData } from "../../lib/yearPlanning";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const data = getYearPlanningData("fridays");
  const pageTitle = `${data.title} | DaysUntil`;
  return {
    title: pageTitle,
    description: data.description,
    alternates: { canonical: "/fridays-left-this-year" },
    openGraph: {
      title: pageTitle,
      description: data.description,
      url: "/fridays-left-this-year",
      type: "website",
    },
    twitter: { card: "summary", title: pageTitle, description: data.description },
  };
}

export default function FridaysLeftThisYearPage() {
  return <YearPlanningPage kind="fridays" />;
}
