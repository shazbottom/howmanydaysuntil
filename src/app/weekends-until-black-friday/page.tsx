import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";

export const revalidate = 3600;

export function generateMetadata() {
  return generateCountdownClusterMetadata("weekends-until-black-friday");
}

export default function WeekendsUntilBlackFridayPage() {
  return <CountdownClusterPage slug="weekends-until-black-friday" />;
}
