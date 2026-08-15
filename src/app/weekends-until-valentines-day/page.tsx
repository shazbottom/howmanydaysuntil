import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-valentines-day");
}

export default function WeekendsUntilValentinesDayPage() {
  return <CountdownClusterPage slug="weekends-until-valentines-day" />;
}
