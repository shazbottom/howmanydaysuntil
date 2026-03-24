import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata } from "../../lib/calculatorPages";

export const metadata = getCalculatorMetadata("business-days-between");

export default function BusinessDaysBetweenDatesPage() {
  return <CalculatorPreviewShell activeCalculator="business-days-between" />;
}
