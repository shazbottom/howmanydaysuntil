import type { Metadata } from "next";
import { CountdownWidget } from "../../../components/CountdownWidget";
import { parseCountdownWidgetConfig } from "../../../lib/countdownWidget";

export const metadata: Metadata = {
  title: "Embedded countdown | DaysUntil",
  robots: {
    index: false,
    follow: false,
  },
};

interface EmbeddedCountdownPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EmbeddedCountdownPage({
  searchParams,
}: EmbeddedCountdownPageProps) {
  const config = parseCountdownWidgetConfig(await searchParams);

  return <CountdownWidget config={config} />;
}
