import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-halloween");
}

export default function WeekendsUntilHalloweenPage() {
  return <CountdownClusterPage slug="weekends-until-halloween" />;
}
