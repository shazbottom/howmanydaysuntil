import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-easter");
}

export default function FridaysUntilEasterPage() {
  return <CountdownClusterPage slug="fridays-until-easter" />;
}
