import { JsonLd } from "../../components/JsonLd";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorHubMetadata } from "../../lib/calculatorPages";
import {
  applyCalculatorShareRobots,
  parseCalculatorSearchParams,
  type CalculatorSearchPageProps,
} from "../../lib/calculatorShare";
import { createBreadcrumbJsonLd } from "../../lib/structuredData";

export async function generateMetadata({ searchParams }: CalculatorSearchPageProps) {
  return applyCalculatorShareRobots(getCalculatorHubMetadata(), await searchParams);
}

export default async function CalculatorsPage({ searchParams }: CalculatorSearchPageProps) {
  const initialValues = parseCalculatorSearchParams(await searchParams);

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
        ])}
      />
      <CalculatorPreviewShell activeCalculator="days-between" initialValues={initialValues} />
    </>
  );
}
