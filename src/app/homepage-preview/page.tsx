import type { Metadata } from "next";
import { HomepagePreviewClient } from "../../components/HomepagePreviewClient";

export const metadata: Metadata = {
  title: "Homepage Preview | DaysUntil",
  description: "Experimental homepage preview route for internal review.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomepagePreviewPage() {
  return <HomepagePreviewClient />;
}
