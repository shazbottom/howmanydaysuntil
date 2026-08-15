import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-summer");
}

export default function FridaysUntilSummerPage() {
  return <CountdownClusterPage slug="fridays-until-summer" />;
}
