import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-christmas");
}

export default function WeekendsUntilChristmasPage() {
  return <CountdownClusterPage slug="weekends-until-christmas" />;
}
