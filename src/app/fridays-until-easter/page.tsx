import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-easter");
}

export default function FridaysUntilEasterPage() {
  return <CountdownClusterPage slug="fridays-until-easter" />;
}
