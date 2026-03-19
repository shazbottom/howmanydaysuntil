import type { Metadata } from "next";
import { getRegionHubMetadata, getRegionHubStaticParams, renderRegionHub } from "../../../lib/regionPages";

interface UnitedKingdomRegionPageProps {
  params: Promise<{
    region: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubStaticParams("uk");
}

export async function generateMetadata({ params }: UnitedKingdomRegionPageProps): Promise<Metadata> {
  const { region } = await params;
  return getRegionHubMetadata("uk", region);
}

export default async function UnitedKingdomRegionPage({ params }: UnitedKingdomRegionPageProps) {
  const { region } = await params;
  return renderRegionHub("uk", region);
}
