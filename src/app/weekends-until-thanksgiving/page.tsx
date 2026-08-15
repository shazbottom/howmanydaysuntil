import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-thanksgiving");
}

export default function WeekendsUntilThanksgivingPage() {
  return <CountdownClusterPage slug="weekends-until-thanksgiving" />;
}
