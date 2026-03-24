import type { Metadata } from "next";
import { LegalPageShell } from "../../components/LegalPageShell";

const title = "Contact Us | DaysUntil";
const description = "Contact DaysUntil with questions about the website, countdowns, calculators, or legal pages.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://daysuntil.is/contact",
  },
  openGraph: {
    title,
    description,
    url: "https://daysuntil.is/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function ContactPage() {
  return (
    <LegalPageShell
      eyebrow="Contact"
      title="Contact Us"
      intro="Get in touch with DaysUntil for general questions, site issues, or privacy and legal requests."
    >
      <p>
        If you need to contact DaysUntil, you can email:{" "}
        <a href="mailto:daysuntil.is@gmail.com">daysuntil.is@gmail.com</a>
      </p>
    </LegalPageShell>
  );
}
