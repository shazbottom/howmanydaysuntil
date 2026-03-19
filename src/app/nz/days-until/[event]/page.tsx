import type { Metadata } from "next";
import {
  getCountryEventMetadata,
  getCountryEventStaticParams,
  renderCountryEventPage,
} from "../../../../lib/localizedPages";

interface CountryEventPageProps {
  params: Promise<{
    event: string;
  }>;
}

export function generateStaticParams() {
  return getCountryEventStaticParams("nz");
}

export async function generateMetadata({ params }: CountryEventPageProps): Promise<Metadata> {
  const { event } = await params;
  return getCountryEventMetadata("nz", event);
}

export default async function NewZealandEventPage({ params }: CountryEventPageProps) {
  const { event } = await params;
  return renderCountryEventPage("nz", event);
}
