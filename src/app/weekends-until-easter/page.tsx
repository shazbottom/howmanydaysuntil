import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-easter");
}

export default function WeekendsUntilEasterPage() {
  return <CountdownClusterPage slug="weekends-until-easter" />;
}
