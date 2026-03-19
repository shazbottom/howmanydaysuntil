import type { Metadata } from "next";
import { getRegionHubMetadata, getRegionHubStaticParams, renderRegionHub } from "../../../lib/regionPages";

interface AustraliaRegionPageProps {
  params: Promise<{
    region: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubStaticParams("au");
}

export async function generateMetadata({ params }: AustraliaRegionPageProps): Promise<Metadata> {
  const { region } = await params;
  return getRegionHubMetadata("au", region);
}

export default async function AustraliaRegionPage({ params }: AustraliaRegionPageProps) {
  const { region } = await params;
  return renderRegionHub("au", region);
}
