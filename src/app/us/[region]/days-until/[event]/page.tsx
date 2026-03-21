import type { Metadata } from "next";
import {
  getAllRegionEventStaticParams,
  getRegionEventMetadata,
  renderRegionEventPage,
} from "../../../../../lib/regionPages";

interface UnitedStatesRegionEventPageProps {
  params: Promise<{
    region: string;
    event: string;
  }>;
}

export async function generateStaticParams() {
  return getAllRegionEventStaticParams("us");
}

export async function generateMetadata({
  params,
}: UnitedStatesRegionEventPageProps): Promise<Metadata> {
  const { region, event } = await params;
  return getRegionEventMetadata("us", region, event);
}

export default async function UnitedStatesRegionEventPage({
  params,
}: UnitedStatesRegionEventPageProps) {
  const { region, event } = await params;
  return renderRegionEventPage("us", region, event);
}
