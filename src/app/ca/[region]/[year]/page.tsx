import type { Metadata } from "next";
import {
  getRegionHubMetadata,
  getRegionHubYearStaticParams,
  renderRegionHub,
} from "../../../../lib/regionPages";

interface CanadaRegionYearPageProps {
  params: Promise<{
    region: string;
    year: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubYearStaticParams("ca");
}

export async function generateMetadata({
  params,
}: CanadaRegionYearPageProps): Promise<Metadata> {
  const { region, year } = await params;
  return getRegionHubMetadata("ca", region, Number(year));
}

export default async function CanadaRegionYearPage({
  params,
}: CanadaRegionYearPageProps) {
  const { region, year } = await params;
  return renderRegionHub("ca", region, Number(year));
}
