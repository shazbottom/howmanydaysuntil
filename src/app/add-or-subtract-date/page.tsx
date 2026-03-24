import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorMetadata } from "../../lib/calculatorPages";

export const metadata = getCalculatorMetadata("add-or-subtract-date");

export default function AddOrSubtractDatePage() {
  return <CalculatorPreviewShell activeCalculator="add-or-subtract-date" />;
}
