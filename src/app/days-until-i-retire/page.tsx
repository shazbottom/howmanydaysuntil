import { JsonLd } from "../../components/JsonLd";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata, getCalculatorPage } from "../../lib/calculatorPages";
import { createBreadcrumbJsonLd } from "../../lib/structuredData";

export const metadata = getCalculatorMetadata("days-until-i-retire");

export default function DaysUntilIRetirePage() {
  const calculatorPage = getCalculatorPage("days-until-i-retire");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Days Until I Retire", path: calculatorPage.path },
        ])}
      />
      <CalculatorPreviewShell activeCalculator="days-until-i-retire" />
    </>
  );
}
