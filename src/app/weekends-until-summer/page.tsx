import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";
import type { SummerSearchParams } from "../../lib/summerSelection";

export const revalidate = 3600;

export async function generateMetadata({ searchParams }: { searchParams: Promise<SummerSearchParams> }) {
  return generateCountdownClusterMetadata("weekends-until-summer", await searchParams);
}

export default async function WeekendsUntilSummerPage({ searchParams }: { searchParams: Promise<SummerSearchParams> }) {
  return <CountdownClusterPage slug="weekends-until-summer" searchParams={await searchParams} />;
}
