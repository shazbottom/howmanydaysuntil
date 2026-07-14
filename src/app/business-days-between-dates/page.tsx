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
    getCalculatorMetadata("business-days-between"),
    await searchParams,
  );
}

export default async function BusinessDaysBetweenDatesPage({
  searchParams,
}: CalculatorSearchPageProps) {
  const calculatorPage = getCalculatorPage("business-days-between");
  const initialValues = parseCalculatorSearchParams(await searchParams);

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Business Days Between Dates", path: calculatorPage.path },
        ])}
      />
      <CalculatorPreviewShell
        activeCalculator="business-days-between"
        initialValues={initialValues}
      />
    </>
  );
}
