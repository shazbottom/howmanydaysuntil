import { SeasonLandingPage } from "../../components/SeasonLandingPage";
import { getSeasonLandingMetadata } from "../../lib/seasonLandingPages";

export const metadata = getSeasonLandingMetadata("autumn");

export default function DaysUntilAutumnPage() {
  return <SeasonLandingPage season="autumn" />;
}
