import type { Metadata } from "next";
import {
  getRegionHubMetadata,
  getRegionHubYearStaticParams,
  renderRegionHub,
} from "../../../../lib/regionPages";

interface UnitedKingdomRegionYearPageProps {
  params: Promise<{
    region: string;
    year: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubYearStaticParams("uk");
}

export async function generateMetadata({
  params,
}: UnitedKingdomRegionYearPageProps): Promise<Metadata> {
  const { region, year } = await params;
  return getRegionHubMetadata("uk", region, Number(year));
}

export default async function UnitedKingdomRegionYearPage({
  params,
}: UnitedKingdomRegionYearPageProps) {
  const { region, year } = await params;
  return renderRegionHub("uk", region, Number(year));
}
