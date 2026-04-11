import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-halloween");
}

export default function FridaysUntilHalloweenPage() {
  return <CountdownClusterPage slug="fridays-until-halloween" />;
}
