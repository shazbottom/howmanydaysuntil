import type { Metadata } from "next";
import { getRegionHubMetadata, getRegionHubStaticParams, renderRegionHub } from "../../../lib/regionPages";

interface CanadaRegionPageProps {
  params: Promise<{
    region: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubStaticParams("ca");
}

export async function generateMetadata({ params }: CanadaRegionPageProps): Promise<Metadata> {
  const { region } = await params;
  return getRegionHubMetadata("ca", region);
}

export default async function CanadaRegionPage({ params }: CanadaRegionPageProps) {
  const { region } = await params;
  return renderRegionHub("ca", region);
}
