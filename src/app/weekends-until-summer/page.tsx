import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-summer");
}

export default function WeekendsUntilSummerPage() {
  return <CountdownClusterPage slug="weekends-until-summer" />;
}
