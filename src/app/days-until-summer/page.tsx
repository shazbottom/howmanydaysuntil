import { SeasonLandingPage } from "../../components/SeasonLandingPage";
import { getSeasonLandingMetadata } from "../../lib/seasonLandingPages";

export const metadata = getSeasonLandingMetadata("summer");

export default function DaysUntilSummerPage() {
  return <SeasonLandingPage season="summer" />;
}
