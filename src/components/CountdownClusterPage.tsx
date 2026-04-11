import { notFound } from "next/navigation";
import { CountdownLinkList } from "./CountdownLinkList";
import { SeoCountdownPage } from "./SeoCountdownPage";
import {
  buildCountdownClusterMetadata,
  getCountdownClusterPageData,
} from "../lib/countdownClusters";
import { createBreadcrumbJsonLd, createEventJsonLd } from "../lib/structuredData";

export function generateCountdownClusterMetadata(slug: string) {
  return buildCountdownClusterMetadata(slug);
}

export function CountdownClusterPage({ slug }: { slug: string }) {
  const pageData = getCountdownClusterPageData(slug);

  if (!pageData) {
    notFound();
  }

  const {
    definition,
    event,
    title,
    lead,
    targetDate,
    countdown,
    count,
    clusterLabel,
    detailLine,
    canonicalPath,
    yearRows,
    cardActionLinks,
    relatedLinks,
    howItWorks,
  } = pageData;
  const unitLabel =
    definition.kind === "fridays"
      ? `${count === 1 ? "Friday" : "Fridays"} remaining`
      : `${count === 1 ? "Weekend" : "Weekends"} remaining`;
  const structuredData = [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: title, path: canonicalPath },
    ]),
    createEventJsonLd({
      name: title,
      description: lead,
      startDate: targetDate,
      path: canonicalPath,
    }),
  ];

  return (
    <SeoCountdownPage
      eyebrow="Seasonal content cluster"
      title={title}
      lead={lead}
      countdownLabel={clusterLabel}
      countdown={countdown}
      countdownPrimaryValue={count}
      countdownPrimaryUnitLabel={unitLabel}
      countdownDetailLine={detailLine}
      cardActionLinks={cardActionLinks}
      supportingCopy={[]}
      relatedLinks={relatedLinks}
      structuredData={structuredData}
      showChristmasFlyby={event.slug === "christmas"}
      extraSection={
        <>
          <section className="mt-12 w-full max-w-[31.9rem] rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem] sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              Next 5 years
            </h2>
            <div className="mt-5 overflow-hidden rounded-[1.15rem] border border-black/6 dark:border-white/10">
              <div className="grid grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)_minmax(0,0.8fr)] bg-[#f3f2ee] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/48 dark:bg-[#1d1f1e] dark:text-white/50">
                <span>Year</span>
                <span>Date</span>
                <span>{definition.kind === "fridays" ? "Fridays" : "Weekends"}</span>
              </div>
              <div className="divide-y divide-black/6 dark:divide-white/10">
                {yearRows.map((row) => (
                  <div
                    key={`${slug}-${row.year}`}
                    className="grid grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)_minmax(0,0.8fr)] gap-4 bg-white/55 px-4 py-2.5 text-[13px] dark:bg-white/[0.02] sm:text-sm"
                  >
                    <span className="font-medium text-black dark:text-white/88">{row.year}</span>
                    <span className="text-black/62 dark:text-white/62">{row.dateLabel}</span>
                    <span className="text-black/72 dark:text-white/74">
                      {row.count.toLocaleString("en-GB")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 w-full max-w-[31.9rem] rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem] sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              How this count works
            </h2>
            <p className="mt-4 text-sm leading-6 text-black/60 dark:text-white/62">
              {howItWorks}
            </p>
          </section>

          <CountdownLinkList
            title="Planning tools"
            description={`Use our calculators to compare dates and plan around ${event.name}.`}
            links={[
              { href: "/days-between-dates", label: "Days between dates" },
              { href: "/business-days-between-dates", label: "Business days between dates" },
              { href: "/add-or-subtract-date", label: "Add or subtract date" },
            ]}
            centered
          />
        </>
      }
    />
  );
}
