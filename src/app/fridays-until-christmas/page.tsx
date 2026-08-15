import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-christmas");
}

export default function FridaysUntilChristmasPage() {
  return <CountdownClusterPage slug="fridays-until-christmas" />;
}
