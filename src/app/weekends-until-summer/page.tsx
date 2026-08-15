import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-summer");
}

export default function WeekendsUntilSummerPage() {
  return <CountdownClusterPage slug="weekends-until-summer" />;
}
