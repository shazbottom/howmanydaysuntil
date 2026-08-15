import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-black-friday");
}

export default function FridaysUntilBlackFridayPage() {
  return <CountdownClusterPage slug="fridays-until-black-friday" />;
}
