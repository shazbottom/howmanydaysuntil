import type { Metadata } from "next";
import Link from "next/link";
import { InformationPageShell } from "../../components/InformationPageShell";

const title = "About DaysUntil";
const description =
  "Learn what DaysUntil publishes, how its date information is reviewed, and how to report a correction.";

export const metadata: Metadata = {
  title: `${title} | DaysUntil`,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${title} | DaysUntil`,
    description,
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <InformationPageShell
      eyebrow="About the site"
      title={title}
      intro="DaysUntil is an independent date utility for checking upcoming dates, planning around calendars, and creating personal countdowns."
    >
      <h2>What DaysUntil does</h2>
      <p>
        DaysUntil turns calendar questions into direct, usable answers. You can check the time
        remaining until a named event, enter an exact future date, compare two dates, count
        business days, add or subtract calendar units, or create a private shareable countdown.
        The aim is to answer the question first and then provide enough calendar context to help
        with planning.
      </p>
      <p>
        The site covers international events as well as country and regional calendars for
        Australia, Canada, New Zealand, the United Kingdom, and the United States. Regional pages
        are intended to be practical references, not replacements for official government,
        employer, school, or legal advice.
      </p>

      <h2>How the site is maintained</h2>
      <p>
        Countdown calculations are produced by the site&apos;s own date tools. Named event rules,
        public holiday tables, school-calendar references, and supporting facts are maintained as
        structured site data. Changes are tested locally before they are published.
      </p>
      <p>
        Pages containing public holiday or school-calendar information display their sources and
        the date those sources were last checked. Where school calendars are controlled locally,
        DaysUntil links to the relevant official directory rather than presenting one local
        district&apos;s dates as if they apply everywhere.
      </p>

      <h2>Editorial approach</h2>
      <p>
        A useful date page should do more than repeat a number. DaysUntil prioritises clear date
        labels, transparent calculation rules, related planning tools, and source attribution.
        Automatically calculated values are kept separate from factual claims that require an
        external source. Exact-date results remain available as a tool, but only selected dates
        with demonstrated public interest are published as search landing pages.
      </p>
      <p>
        Supporting facts are reviewed for relevance and clarity before publication. The site does
        not accept paid changes to holiday dates or calculator results. If advertising is enabled
        in the future, it will not determine the dates, calculations, or editorial conclusions
        shown on the site.
      </p>

      <h2>Accuracy and corrections</h2>
      <p>
        Calendar rules can change, and regional holidays may be observed differently by employers,
        schools, or local authorities. Users should confirm important deadlines against the
        organisation responsible for them. The <Link href="/how-it-works">calculation methodology</Link>
        explains the assumptions used by each tool.
      </p>
      <p>
        If you find an incorrect date, broken source, or unclear explanation, email
        {" "}<a href="mailto:daysuntil.is@gmail.com">daysuntil.is@gmail.com</a> with the page URL and
        the correction you believe is needed.
      </p>

      <h2>Last reviewed</h2>
      <p>This page was last reviewed on 13 July 2026.</p>
    </InformationPageShell>
  );
}
