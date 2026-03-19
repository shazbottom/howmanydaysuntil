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
  return getCountryEventStaticParams("au");
}

export async function generateMetadata({ params }: CountryEventPageProps): Promise<Metadata> {
  const { event } = await params;
  return getCountryEventMetadata("au", event);
}

export default async function AustraliaEventPage({ params }: CountryEventPageProps) {
  const { event } = await params;
  return renderCountryEventPage("au", event);
}
