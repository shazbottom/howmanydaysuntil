import type { Metadata } from "next";
import {
  getAllRegionEventStaticParams,
  getRegionEventMetadata,
  renderRegionEventPage,
} from "../../../../../lib/regionPages";

interface AustraliaRegionEventPageProps {
  params: Promise<{
    region: string;
    event: string;
  }>;
}

export async function generateStaticParams() {
  return getAllRegionEventStaticParams("au");
}

export async function generateMetadata({ params }: AustraliaRegionEventPageProps): Promise<Metadata> {
  const { region, event } = await params;
  return getRegionEventMetadata("au", region, event);
}

export default async function AustraliaRegionEventPage({ params }: AustraliaRegionEventPageProps) {
  const { region, event } = await params;
  return renderRegionEventPage("au", region, event);
}
