import type { Metadata } from "next";
import { CalculatorPreviewShell } from "../../../components/calculators/CalculatorPreviewShell";

export const metadata: Metadata = {
  title: "Business Days Between Dates Calculator | DaysUntil",
  description: "Calculate the number of business days between two dates.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WorkingDaysBetweenDatesPreviewPage() {
  return <CalculatorPreviewShell activeCalculator="business-days-between" />;
}
