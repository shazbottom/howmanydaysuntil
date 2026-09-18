import {
  CountdownClusterPage,
  generateCountdownClusterMetadata,
} from "../../components/CountdownClusterPage";
import type { SummerSearchParams } from "../../lib/summerSelection";

export const revalidate = 3600;

export async function generateMetadata({ searchParams }: { searchParams: Promise<SummerSearchParams> }) {
  return generateCountdownClusterMetadata("fridays-until-summer", await searchParams);
}

export default async function FridaysUntilSummerPage({ searchParams }: { searchParams: Promise<SummerSearchParams> }) {
  return <CountdownClusterPage slug="fridays-until-summer" searchParams={await searchParams} />;
}
