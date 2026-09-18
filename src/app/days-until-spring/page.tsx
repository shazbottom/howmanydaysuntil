import { SeasonLandingPage } from "../../components/SeasonLandingPage";
import { getSeasonLandingMetadata } from "../../lib/seasonLandingPages";

export const metadata = getSeasonLandingMetadata("spring");

export default function DaysUntilSpringPage() {
  return <SeasonLandingPage season="spring" />;
}
