import type { Metadata } from "next";
import {
  getAllRegionEventStaticParams,
  getRegionEventMetadata,
  renderRegionEventPage,
} from "../../../../../lib/regionPages";

interface UnitedKingdomRegionEventPageProps {
  params: Promise<{
    region: string;
    event: string;
  }>;
}

export async function generateStaticParams() {
  return getAllRegionEventStaticParams("uk");
}

export async function generateMetadata({ params }: UnitedKingdomRegionEventPageProps): Promise<Metadata> {
  const { region, event } = await params;
  return getRegionEventMetadata("uk", region, event);
}

export default async function UnitedKingdomRegionEventPage({ params }: UnitedKingdomRegionEventPageProps) {
  const { region, event } = await params;
  return renderRegionEventPage("uk", region, event);
}
