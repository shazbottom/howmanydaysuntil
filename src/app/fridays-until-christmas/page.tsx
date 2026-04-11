import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-christmas");
}

export default function FridaysUntilChristmasPage() {
  return <CountdownClusterPage slug="fridays-until-christmas" />;
}
