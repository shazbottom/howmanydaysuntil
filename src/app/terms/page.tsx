import type { Metadata } from "next";
import { LegalPageShell } from "../../components/LegalPageShell";

const title = "Terms | DaysUntil";
const description = "Basic terms for using DaysUntil and its countdown and calculator tools.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://daysuntil.is/terms",
  },
  openGraph: {
    title,
    description,
    url: "https://daysuntil.is/terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms"
      intro="Basic terms for using DaysUntil, including countdown pages, calculators, and custom countdown tools."
    >
      <p>
        <strong>Last updated:</strong> 24 March 2026
      </p>

      <p>
        By using DaysUntil, you agree to these Terms. If you do not agree, you should stop using
        the site.
      </p>

      <h2>Use of the site</h2>
      <p>
        DaysUntil provides date-based information, countdowns, calculators, and related tools for
        general informational use. You agree not to misuse the site, interfere with its operation,
        or attempt to access systems or data you are not authorised to access.
      </p>

      <h2>Accuracy</h2>
      <p>
        We try to keep countdown, holiday, school-term, and calculator information accurate, but we
        do not guarantee that all information is complete, current, or error-free. You should
        verify important dates with official sources where necessary.
      </p>

      <h2>Custom countdowns</h2>
      <p>
        If you create a custom countdown, you are responsible for the content you submit. Do not
        submit unlawful, harmful, or abusive content.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Unless stated otherwise, the site design, branding, and original content on DaysUntil are
        owned by the site operator or licensed for use on the site.
      </p>

      <h2>Third-party services and links</h2>
      <p>
        DaysUntil may rely on third-party services and may link to external websites. We are not
        responsible for the content, policies, or availability of third-party services or sites.
      </p>

      <h2>No warranty</h2>
      <p>
        The site is provided on an "as is" and "as available" basis without warranties of any kind,
        to the extent permitted by law.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, the site operator will not be liable for indirect,
        incidental, special, consequential, or business-related losses arising from use of the
        site.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms from time to time. Continued use of the site after changes are
        published means you accept the updated Terms.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these Terms, email{" "}
        <a href="mailto:daysuntil.is@gmail.com">daysuntil.is@gmail.com</a>.
      </p>
    </LegalPageShell>
  );
}
