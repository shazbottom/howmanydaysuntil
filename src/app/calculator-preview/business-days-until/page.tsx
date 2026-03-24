import type { Metadata } from "next";
import { CalculatorPreviewShell } from "../../../components/calculators/CalculatorPreviewShell";

export const metadata: Metadata = {
  title: "Business Days Until Calculator | DaysUntil",
  description: "Calculate the number of business days remaining until a target date.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BusinessDaysUntilPreviewPage() {
  return <CalculatorPreviewShell activeCalculator="business-days-until" />;
}
