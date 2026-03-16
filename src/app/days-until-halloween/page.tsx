import type { Metadata } from "next";
import { SeoEventPage } from "../../components/SeoEventPage";
import { buildSeoEventMetadata } from "../../lib/seoEventPages";

export const metadata: Metadata = buildSeoEventMetadata("days-until-halloween");

export default function DaysUntilHalloweenPage() {
  return <SeoEventPage routePath="days-until-halloween" />;
}
