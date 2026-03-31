import { JsonLd } from "../../components/JsonLd";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata, getCalculatorPage } from "../../lib/calculatorPages";
import { createBreadcrumbJsonLd } from "../../lib/structuredData";

export const metadata = getCalculatorMetadata("add-or-subtract-date");

export default function AddOrSubtractDatePage() {
  const calculatorPage = getCalculatorPage("add-or-subtract-date");

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Add or Subtract Date", path: calculatorPage.path },
        ])}
      />
      <CalculatorPreviewShell activeCalculator="add-or-subtract-date" />
    </>
  );
}
