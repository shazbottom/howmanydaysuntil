import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-new-year");
}

export default function WeekendsUntilNewYearPage() {
  return <CountdownClusterPage slug="weekends-until-new-year" />;
}
