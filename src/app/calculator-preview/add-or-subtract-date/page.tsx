import type { Metadata } from "next";
import { CalculatorPreviewShell } from "../../../components/calculators/CalculatorPreviewShell";

export const metadata: Metadata = {
  title: "Add or Subtract Date Calculator | DaysUntil",
  description: "Add to or subtract from a date using days, weeks, months, or years.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddOrSubtractDatePreviewPage() {
  return <CalculatorPreviewShell activeCalculator="add-or-subtract-date" />;
}
