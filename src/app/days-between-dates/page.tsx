import { JsonLd } from "../../components/JsonLd";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata, getCalculatorPage } from "../../lib/calculatorPages";
import { createBreadcrumbJsonLd } from "../../lib/structuredData";

export const metadata = getCalculatorMetadata("days-between");

export default function DaysBetweenDatesPage() {
  const calculatorPage = getCalculatorPage("days-between");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Days Between Dates", path: calculatorPage.path },
        ])}
      />
      <CalculatorPreviewShell activeCalculator="days-between" />
    </>
  );
}
