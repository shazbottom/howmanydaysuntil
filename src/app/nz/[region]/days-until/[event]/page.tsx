import type { Metadata } from "next";
import {
  getAllRegionEventStaticParams,
  getRegionEventMetadata,
  renderRegionEventPage,
} from "../../../../../lib/regionPages";

interface NewZealandRegionEventPageProps {
  params: Promise<{
    region: string;
    event: string;
  }>;
}

export async function generateStaticParams() {
  return getAllRegionEventStaticParams("nz");
}

export async function generateMetadata({ params }: NewZealandRegionEventPageProps): Promise<Metadata> {
  const { region, event } = await params;
  return getRegionEventMetadata("nz", region, event);
}

export default async function NewZealandRegionEventPage({ params }: NewZealandRegionEventPageProps) {
  const { region, event } = await params;
  return renderRegionEventPage("nz", region, event);
}
