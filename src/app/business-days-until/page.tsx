import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata } from "../../lib/calculatorPages";

export const metadata = getCalculatorMetadata("business-days-until");

export default function BusinessDaysUntilPage() {
  return <CalculatorPreviewShell activeCalculator="business-days-until" />;
}
