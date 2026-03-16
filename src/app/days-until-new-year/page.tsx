import type { Metadata } from "next";
import { SeoEventPage } from "../../components/SeoEventPage";
import { buildSeoEventMetadata } from "../../lib/seoEventPages";

export const metadata: Metadata = buildSeoEventMetadata("days-until-new-year");

export default function DaysUntilNewYearPage() {
  return <SeoEventPage routePath="days-until-new-year" />;
}
