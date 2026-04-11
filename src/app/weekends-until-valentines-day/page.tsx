import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-valentines-day");
}

export default function WeekendsUntilValentinesDayPage() {
  return <CountdownClusterPage slug="weekends-until-valentines-day" />;
}
