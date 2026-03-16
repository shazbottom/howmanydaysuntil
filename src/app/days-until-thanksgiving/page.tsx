import type { Metadata } from "next";
import { SeoEventPage } from "../../components/SeoEventPage";
import { buildSeoEventMetadata } from "../../lib/seoEventPages";

export const metadata: Metadata = buildSeoEventMetadata("days-until-thanksgiving");

export default function DaysUntilThanksgivingPage() {
  return <SeoEventPage routePath="days-until-thanksgiving" />;
}
