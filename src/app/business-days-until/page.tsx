import { JsonLd } from "../../components/JsonLd";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata, getCalculatorPage } from "../../lib/calculatorPages";
import { createBreadcrumbJsonLd } from "../../lib/structuredData";

export const metadata = getCalculatorMetadata("business-days-until");

export default function BusinessDaysUntilPage() {
  const calculatorPage = getCalculatorPage("business-days-until");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Business Days Until", path: calculatorPage.path },
        ])}
      />
      <CalculatorPreviewShell activeCalculator="business-days-until" />
    </>
  );
}
