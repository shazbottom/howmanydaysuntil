import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-summer");
}

export default function FridaysUntilSummerPage() {
  return <CountdownClusterPage slug="fridays-until-summer" />;
}
