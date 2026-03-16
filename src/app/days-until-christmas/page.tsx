import type { Metadata } from "next";
import { SeoEventPage } from "../../components/SeoEventPage";
import { buildSeoEventMetadata } from "../../lib/seoEventPages";

export const metadata: Metadata = buildSeoEventMetadata("days-until-christmas");

export default function DaysUntilChristmasPage() {
  return <SeoEventPage routePath="days-until-christmas" />;
}
