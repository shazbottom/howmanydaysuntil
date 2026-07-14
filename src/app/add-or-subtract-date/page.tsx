import { JsonLd } from "../../components/JsonLd";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata, getCalculatorPage } from "../../lib/calculatorPages";
import {
  applyCalculatorShareRobots,
  parseCalculatorSearchParams,
  type CalculatorSearchPageProps,
} from "../../lib/calculatorShare";
import { createBreadcrumbJsonLd } from "../../lib/structuredData";

export async function generateMetadata({ searchParams }: CalculatorSearchPageProps) {
  return applyCalculatorShareRobots(
    getCalculatorMetadata("add-or-subtract-date"),
    await searchParams,
  );
}

export default async function AddOrSubtractDatePage({ searchParams }: CalculatorSearchPageProps) {
  const calculatorPage = getCalculatorPage("add-or-subtract-date");
  const initialValues = parseCalculatorSearchParams(await searchParams);

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Add or Subtract Date", path: calculatorPage.path },
        ])}
      />
      <CalculatorPreviewShell
        activeCalculator="add-or-subtract-date"
        initialValues={initialValues}
      />
    </>
  );
}
