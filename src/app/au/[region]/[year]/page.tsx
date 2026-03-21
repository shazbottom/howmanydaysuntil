import type { Metadata } from "next";
import {
  getRegionHubMetadata,
  getRegionHubYearStaticParams,
  renderRegionHub,
} from "../../../../lib/regionPages";

interface AustraliaRegionYearPageProps {
  params: Promise<{
    region: string;
    year: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubYearStaticParams("au");
}

export async function generateMetadata({
  params,
}: AustraliaRegionYearPageProps): Promise<Metadata> {
  const { region, year } = await params;
  return getRegionHubMetadata("au", region, Number(year));
}

export default async function AustraliaRegionYearPage({
  params,
}: AustraliaRegionYearPageProps) {
  const { region, year } = await params;
  return renderRegionHub("au", region, Number(year));
}
