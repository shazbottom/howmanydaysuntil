import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-easter");
}

export default function WeekendsUntilEasterPage() {
  return <CountdownClusterPage slug="weekends-until-easter" />;
}
