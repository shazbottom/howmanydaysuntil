import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-thanksgiving");
}

export default function FridaysUntilThanksgivingPage() {
  return <CountdownClusterPage slug="fridays-until-thanksgiving" />;
}
