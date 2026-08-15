import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("fridays-until-valentines-day");
}

export default function FridaysUntilValentinesDayPage() {
  return <CountdownClusterPage slug="fridays-until-valentines-day" />;
}
