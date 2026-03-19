import type { Metadata } from "next";
import { getRegionHubMetadata, getRegionHubStaticParams, renderRegionHub } from "../../../lib/regionPages";

interface NewZealandRegionPageProps {
  params: Promise<{
    region: string;
  }>;
}

export function generateStaticParams() {
  return getRegionHubStaticParams("nz");
}

export async function generateMetadata({ params }: NewZealandRegionPageProps): Promise<Metadata> {
  const { region } = await params;
  return getRegionHubMetadata("nz", region);
}

export default async function NewZealandRegionPage({ params }: NewZealandRegionPageProps) {
  const { region } = await params;
  return renderRegionHub("nz", region);
}
