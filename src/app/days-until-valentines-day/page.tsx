import type { Metadata } from "next";
import { SeoEventPage } from "../../components/SeoEventPage";
import { buildSeoEventMetadata } from "../../lib/seoEventPages";

export const metadata: Metadata = buildSeoEventMetadata("days-until-valentines-day");

export default function DaysUntilValentinesDayPage() {
  return <SeoEventPage routePath="days-until-valentines-day" />;
}
