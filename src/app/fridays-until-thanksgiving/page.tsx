import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-thanksgiving");
}

export default function FridaysUntilThanksgivingPage() {
  return <CountdownClusterPage slug="fridays-until-thanksgiving" />;
}
