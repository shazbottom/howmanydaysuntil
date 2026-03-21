import type { Metadata } from "next";
import {
  getRegionHubMetadata,
  getRegionHubYearStaticParams,
  renderRegionHub,
} from "../../../../lib/regionPages";

interface UnitedStatesRegionYearPageProps {
  params: Promise<{
    region: string;
    year: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubYearStaticParams("us");
}

export async function generateMetadata({
  params,
}: UnitedStatesRegionYearPageProps): Promise<Metadata> {
  const { region, year } = await params;
  return getRegionHubMetadata("us", region, Number(year));
}

export default async function UnitedStatesRegionYearPage({
  params,
}: UnitedStatesRegionYearPageProps) {
  const { region, year } = await params;
  return renderRegionHub("us", region, Number(year));
}
