import type { Metadata } from "next";
import {
  getRegionHubMetadata,
  getRegionHubYearStaticParams,
  renderRegionHub,
} from "../../../../lib/regionPages";

interface NewZealandRegionYearPageProps {
  params: Promise<{
    region: string;
    year: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubYearStaticParams("nz");
}

export async function generateMetadata({
  params,
}: NewZealandRegionYearPageProps): Promise<Metadata> {
  const { region, year } = await params;
  return getRegionHubMetadata("nz", region, Number(year));
}

export default async function NewZealandRegionYearPage({
  params,
}: NewZealandRegionYearPageProps) {
  const { region, year } = await params;
  return renderRegionHub("nz", region, Number(year));
}
