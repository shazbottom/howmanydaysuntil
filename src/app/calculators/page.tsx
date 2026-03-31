import { JsonLd } from "../../components/JsonLd";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorHubMetadata } from "../../lib/calculatorPages";
import { createBreadcrumbJsonLd } from "../../lib/structuredData";

export const metadata = getCalculatorHubMetadata();

export default function CalculatorsPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
        ])}
      />
      <CalculatorPreviewShell activeCalculator="days-between" />
    </>
  );
}
