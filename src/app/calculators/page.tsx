import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";
import { getCalculatorHubMetadata } from "../../lib/calculatorPages";

export const metadata = getCalculatorHubMetadata();

export default function CalculatorsPage() {
  return <CalculatorPreviewShell activeCalculator="days-between" />;
}
