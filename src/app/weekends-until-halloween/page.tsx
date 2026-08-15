import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-halloween");
}

export default function WeekendsUntilHalloweenPage() {
  return <CountdownClusterPage slug="weekends-until-halloween" />;
}
