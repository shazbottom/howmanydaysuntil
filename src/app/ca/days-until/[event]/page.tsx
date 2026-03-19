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
  return getCountryEventStaticParams("ca");
}

export async function generateMetadata({ params }: CountryEventPageProps): Promise<Metadata> {
  const { event } = await params;
  return getCountryEventMetadata("ca", event);
}

export default async function CanadaEventPage({ params }: CountryEventPageProps) {
  const { event } = await params;
  return renderCountryEventPage("ca", event);
}
