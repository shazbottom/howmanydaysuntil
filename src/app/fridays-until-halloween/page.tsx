import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-halloween");
}

export default function FridaysUntilHalloweenPage() {
  return <CountdownClusterPage slug="fridays-until-halloween" />;
}
