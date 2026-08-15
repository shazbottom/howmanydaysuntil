import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-christmas");
}

export default function WeekendsUntilChristmasPage() {
  return <CountdownClusterPage slug="weekends-until-christmas" />;
}
