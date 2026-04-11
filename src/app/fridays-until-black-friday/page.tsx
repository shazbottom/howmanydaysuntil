import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-black-friday");
}

export default function FridaysUntilBlackFridayPage() {
  return <CountdownClusterPage slug="fridays-until-black-friday" />;
}
