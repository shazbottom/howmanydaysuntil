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
  return getCountryEventStaticParams("us");
}

export async function generateMetadata({ params }: CountryEventPageProps): Promise<Metadata> {
  const { event } = await params;
  return getCountryEventMetadata("us", event);
}

export default async function UnitedStatesEventPage({ params }: CountryEventPageProps) {
  const { event } = await params;
  return renderCountryEventPage("us", event);
}
