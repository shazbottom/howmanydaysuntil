import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-new-year");
}

export default function FridaysUntilNewYearPage() {
  return <CountdownClusterPage slug="fridays-until-new-year" />;
}
