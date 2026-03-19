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
  return getCountryEventStaticParams("uk");
}

export async function generateMetadata({ params }: CountryEventPageProps): Promise<Metadata> {
  const { event } = await params;
  return getCountryEventMetadata("uk", event);
}

export default async function UnitedKingdomEventPage({ params }: CountryEventPageProps) {
  const { event } = await params;
  return renderCountryEventPage("uk", event);
}
