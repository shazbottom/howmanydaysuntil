import type { Metadata } from "next";
import { LegalPageShell } from "../../components/LegalPageShell";

const title = "Privacy Policy | DaysUntil";
const description =
  "Privacy Policy for DaysUntil, including analytics, local storage, custom countdowns, and advertising disclosures.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://daysuntil.is/privacy-policy",
  },
  openGraph: {
    title,
    description,
    url: "https://daysuntil.is/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="Starter privacy notice for DaysUntil covering analytics, saved preferences, custom countdowns, and future advertising use."
    >
      <p>
        <strong>Last updated:</strong> 24 March 2026
      </p>

      <p>
        This Privacy Policy explains how DaysUntil collects, uses, and stores information when you
        use the website.
      </p>

      <h2>Information we collect</h2>
      <p>Depending on how you use the site, DaysUntil may collect or process:</p>
      <ul>
        <li>basic usage and analytics data about visits and page views</li>
        <li>technical information such as browser, device, and approximate location data</li>
        <li>preferences stored in your browser, such as theme selection</li>
        <li>saved countdown references stored in your browser</li>
        <li>custom countdown details that you choose to create and store through the site</li>
      </ul>

      <h2>How we use information</h2>
      <p>We use information to:</p>
      <ul>
        <li>operate and improve the website</li>
        <li>measure traffic and usage trends</li>
        <li>remember preferences and saved countdowns</li>
        <li>generate and retrieve custom countdown pages you create</li>
        <li>support future advertising or monetisation features</li>
      </ul>

      <h2>Analytics</h2>
      <p>
        DaysUntil uses Vercel Analytics to understand site usage and performance. Analytics data
        may include page views, referrers, browser information, device information, and related
        usage signals.
      </p>

      <h2>Local storage and similar browser storage</h2>
      <p>The site may store information in your browser, including:</p>
      <ul>
        <li>theme preference</li>
        <li>saved countdown references</li>
      </ul>
      <p>
        This information is stored locally on your device so the site can remember settings and
        improve your experience.
      </p>

      <h2>Custom countdowns</h2>
      <p>
        If you create a custom countdown, the countdown title, date, and generated slug may be
        stored using the site's server-side storage provider so the countdown page can be viewed
        later.
      </p>

      <h2>Advertising</h2>
      <p>
        DaysUntil may display advertising now or in the future, including ads served by Google
        AdSense or other advertising partners. Advertising providers may use cookies or similar
        technologies to deliver, personalise, and measure ads, subject to their own policies and
        any consent requirements that apply.
      </p>

      <h2>Third-party services</h2>
      <p>The site currently relies on third-party services that may process data, including:</p>
      <ul>
        <li>Vercel, for hosting and analytics</li>
        <li>Upstash Redis or equivalent storage, where configured, for custom countdown storage</li>
        <li>future advertising providers such as Google AdSense</li>
      </ul>

      <h2>Data retention</h2>
      <p>
        Browser-stored preferences remain on your device until you clear them. Server-side custom
        countdown records may remain available until they are deleted, expired, or otherwise
        removed by the site operator.
      </p>

      <h2>Your choices</h2>
      <p>You can:</p>
      <ul>
        <li>clear your browser's local storage and cookies</li>
        <li>use browser privacy controls or ad settings provided by third parties</li>
        <li>choose not to create custom countdowns if you do not want them stored</li>
      </ul>

      <h2>Children's privacy</h2>
      <p>
        DaysUntil is a general audience website and is not intended to knowingly collect personal
        information from children in violation of applicable law.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        This Privacy Policy may be updated from time to time. The latest version will be published
        on this page with the updated date shown above.
      </p>

      <h2>Contact</h2>
      <p>
        If you need to contact the site operator about this Privacy Policy, email{" "}
        <a href="mailto:daysuntil.is@gmail.com">daysuntil.is@gmail.com</a>.
      </p>
    </LegalPageShell>
  );
}
