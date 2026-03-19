import type { Metadata } from "next";
import {
  getAllRegionEventStaticParams,
  getRegionEventMetadata,
  renderRegionEventPage,
} from "../../../../../lib/regionPages";

interface CanadaRegionEventPageProps {
  params: Promise<{
    region: string;
    event: string;
  }>;
}

export async function generateStaticParams() {
  return getAllRegionEventStaticParams("ca");
}

export async function generateMetadata({ params }: CanadaRegionEventPageProps): Promise<Metadata> {
  const { region, event } = await params;
  return getRegionEventMetadata("ca", region, event);
}

export default async function CanadaRegionEventPage({ params }: CanadaRegionEventPageProps) {
  const { region, event } = await params;
  return renderRegionEventPage("ca", region, event);
}
