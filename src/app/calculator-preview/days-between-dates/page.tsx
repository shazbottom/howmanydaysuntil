import type { Metadata } from "next";
import { CalculatorPreviewShell } from "../../../components/calculators/CalculatorPreviewShell";

export const metadata: Metadata = {
  title: "Days Between Dates Calculator | DaysUntil",
  description: "Calculate the number of calendar days between two dates.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DaysBetweenDatesPreviewPage() {
  return <CalculatorPreviewShell activeCalculator="days-between" />;
}
