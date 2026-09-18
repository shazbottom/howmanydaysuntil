import { SeasonLandingPage } from "../../components/SeasonLandingPage";
import { getSeasonLandingMetadata } from "../../lib/seasonLandingPages";

export const metadata = getSeasonLandingMetadata("winter");

export default function DaysUntilWinterPage() {
  return <SeasonLandingPage season="winter" />;
}
