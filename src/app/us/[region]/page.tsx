import type { Metadata } from "next";
import { getRegionHubMetadata, getRegionHubStaticParams, renderRegionHub } from "../../../lib/regionPages";

interface UnitedStatesRegionPageProps {
  params: Promise<{
    region: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubStaticParams("us");
}

export async function generateMetadata({
  params,
}: UnitedStatesRegionPageProps): Promise<Metadata> {
  const { region } = await params;
  return getRegionHubMetadata("us", region);
}

export default async function UnitedStatesRegionPage({
  params,
}: UnitedStatesRegionPageProps) {
  const { region } = await params;
  return renderRegionHub("us", region);
}
