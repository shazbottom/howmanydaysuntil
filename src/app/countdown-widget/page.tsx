import type { Metadata } from "next";
import { CountdownWidgetBuilder } from "../../components/CountdownWidgetBuilder";
import { InformationPageShell } from "../../components/InformationPageShell";
import { JsonLd } from "../../components/JsonLd";
import {
  formatWidgetDateInput,
  getDefaultCountdownWidgetConfig,
} from "../../lib/countdownWidget";
import { createBreadcrumbJsonLd, createWebPageJsonLd } from "../../lib/structuredData";

const title = "Free embeddable countdown widget";
const description =
  "Build a responsive countdown widget for a website or blog. Choose a date, title, theme, colour, and size, then copy the iframe code.";

export const metadata: Metadata = {
  title: `${title} | DaysUntil`,
  description,
  alternates: { canonical: "/countdown-widget" },
  openGraph: {
    title: `${title} | DaysUntil`,
    description,
    url: "/countdown-widget",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${title} | DaysUntil`,
    description,
  },
};

export default function CountdownWidgetPage() {
  const now = new Date();
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Countdown widget", path: "/countdown-widget" },
    ]),
    createWebPageJsonLd({
      name: title,
      description,
      path: "/countdown-widget",
      about: "Embeddable countdown widgets",
    }),
  ];

  return (
    <InformationPageShell
      eyebrow="Website tools"
      title={title}
      intro="Create a live countdown for your website without installing a plugin or writing JavaScript."
    >
      <JsonLd data={structuredData} />
      <CountdownWidgetBuilder
        initialConfig={getDefaultCountdownWidgetConfig(now)}
        minimumDate={formatWidgetDateInput(now)}
      />

      <h2>How to add the widget</h2>
      <p>
        Choose a title and future target date, select the visual style, and copy the generated
        iframe code. Paste that code into a custom HTML block in WordPress, Squarespace, Shopify,
        Ghost, or another site builder that accepts iframes. The widget is responsive up to the
        selected width, so it can shrink to fit a narrower content column.
      </p>

      <h2>What the widget contains</h2>
      <p>
        Each widget displays the calendar days remaining, a live hours-minutes-seconds clock, the
        target date, and the title you provide. The calculation runs inside the embedded page, so
        the host website does not need to update the number each day.
      </p>
      <ul>
        <li>Light and dark themes</li>
        <li>Custom accent colour</li>
        <li>Compact, standard, and wide dimensions</li>
        <li>No account, API key, or external JavaScript package required</li>
      </ul>

      <h2>Privacy and loading</h2>
      <p>
        The iframe requests the DaysUntil embed page when a visitor opens the host page. The widget
        itself does not ask visitors for personal information and does not expose a custom
        countdown database record. Standard hosting and analytics processing described in the
        DaysUntil privacy policy may still apply to the iframe request.
      </p>

      <h2>Attribution</h2>
      <p>
        The small Powered by DaysUntil link is part of the free widget. It gives visitors a route
        to build their own version and identifies the service responsible for the calculation.
        Do not place the iframe where it obscures navigation or could be mistaken for an
        advertisement.
      </p>
    </InformationPageShell>
  );
}
