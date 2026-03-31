import { JsonLd } from "../../components/JsonLd";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata, getCalculatorPage } from "../../lib/calculatorPages";
import { createBreadcrumbJsonLd } from "../../lib/structuredData";

export const metadata = getCalculatorMetadata("business-days-between");

export default function BusinessDaysBetweenDatesPage() {
  const calculatorPage = getCalculatorPage("business-days-between");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Business Days Between Dates", path: calculatorPage.path },
        ])}
      />
      <CalculatorPreviewShell activeCalculator="business-days-between" />
    </>
  );
}
