import type { Metadata } from "next";
import { CalculatorPreviewShell } from "../../components/calculators/CalculatorPreviewShell";

export const metadata: Metadata = {
  title: "Date Calculators | DaysUntil",
  description: "Date calculators for days between dates, business days, and add or subtract date calculations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CalculatorPreviewPage() {
  return <CalculatorPreviewShell activeCalculator="days-between" />;
}
