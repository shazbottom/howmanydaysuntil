import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata } from "../../lib/calculatorPages";

export const metadata = getCalculatorMetadata("days-between");

export default function DaysBetweenDatesPage() {
  return <CalculatorPreviewShell activeCalculator="days-between" />;
}
