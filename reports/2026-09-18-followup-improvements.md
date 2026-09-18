# Follow-up improvements - 18 September 2026

## Scope

### Follow-up status

The user reports deploying the follow-up batch and season landing-page restoration. Git is clean except the old temporary export folders. Live deployment and Google indexing have not been independently verified. Earlier local-only/pending-export statements below describe the original audit stage and are superseded by this update.

All three issue-detail exports have now been reviewed against local policy:

- Noindex: 955 URLs. 899 deliberately excluded future dates, 30 expired dates, five country holiday duplicates, and 21 recovered date pages. All 21 are in the recovered65 cohort and current local sitemap; their reported crawls predate the recovery change.
- Crawled, not indexed: 215 URLs. 58 assets (57 OpenGraph images and a favicon), 48 deliberately excluded date pages, eight expired dates, three legacy URLs, and 98 eligible page URLs (41 dates and 57 other page URL entries, including host variants). Recorded crawls run from March 19 to August 27. Some URLs earned clicks in the later performance window, so this list is not proof of their present index state.
- Not found: 101 URLs. 94 expired date URLs, one versioned font asset, three seasonal legacy URLs, and three 2026 year URL variants. All 94 date targets were already past at their reported crawl. The year destination exists in the local build; historical year errors need current URL Inspection, not a speculative redirect.

Restored all four root season pages with country/hemisphere choices using existing meteorological event data. Added canonical metadata, sitemap inclusion, and permanent fall-to-autumn alias redirects. Existing legacy season redirects now lead to useful pages rather than explicit notFound handlers. No domain normalization or expired-date policy changes were made.

Priority manual checks: live-test the recovered dates 2029/04/30, 2028/08/20 and 2027/12/31; inspect days-until-2026 and the legacy season URLs. Only request indexing for eligible content pages, not image assets. No further blanket indexing expansion is justified by these exports.

Audit tooling now reads the exported issue name and separates assets from content-page exclusions without assuming that broken assets are harmless. Remaining work is live verification and a complete post-deployment measurement window, not more speculative page expansion.

User approved all four remaining recommendations: season controls, desktop planner layout, indexing investigation and outcome measurement. Work remains local until the user deploys this batch. The preceding batch was pushed as b196a90 on September 18; Vercel readiness was not independently verified.

## Season and layout changes

- Summer Friday/weekend pages offer Northern/Southern Hemisphere and meteorological/astronomical definitions. The original no-query June 21 approximation remains available and is labelled, rather than silently changing a search landing page's meaning.
- Explicit choices use UTC civil dates for day counts and source precision for astronomical instants. Sibling links preserve the choice. Parameter variants canonicalize to the base URL and remain noindex, follow.
- Astronomical dates are maintained for 2026-2035. Outside that table the page must state unavailability, not manufacture a solstice. Calendar exports are clearly described as all-day date markers rather than timed astronomical appointments.
- Reference: [Fred Espenak's solstice table](https://www.astropixels.com/ephemeris/soleq2001.html), [NOAA season definitions](https://www.ncei.noaa.gov/news/meteorological-versus-astronomical-seasons).
- Exact-date landing pages show countdown/actions/editor alongside the planner on wide desktops, while preserving the stacked mobile order. Other pages do not reserve an empty sidebar.
- Core calendar-day and day-of-year arithmetic now compares calendar dates without a DST-induced one-day loss. Selected-zone live updates retain the server snapshot's timezone convention.

## Indexing investigation

The September coverage ZIP contains Chart.csv, Critical issues.csv, Non-critical issues.csv and Metadata.csv only. There are **no affected URL examples**. It reports 101 not-found and 215 crawled-not-indexed pages; neither total identifies a broken route. User has agreed to provide both issue-detail exports. No blanket redirects, noindex removal or removal requests were performed.

The locally generated sitemap contained 368 unique canonical URLs, including 161 currently eligible exact dates. No duplicates, private records, query variants, legacy root redirect URLs or expired exact-date URLs were found. This is a local build result, not a live Google index audit. Added hourly sitemap revalidation because eligible exact dates expire without a code deployment.

Offline triage is ready for the detail exports:

```powershell
python -B scripts/triage_indexing.py "path/to/issue-details.zip" --as-of 2026-09-18 --sitemap .next/server/app/sitemap.xml.body
```

It distinguishes local policy expectations (expired/invalid date, intentional exclusion, eligible date, legacy redirect, sitemap-listed page, unknown route). Every unverified live state remains explicit. It exits 2 for a summary-only export rather than falsely reporting zero problems. This script does not access the site or Search Console.

Once examples arrive: inspect eligible/live pages first, compare Google's last crawl and canonical with the live test, and fix confirmed broken internal links. Removed pages without a relevant replacement can correctly remain 404; exclusions are not automatically errors. [Google's Page indexing guidance](https://support.google.com/webmasters/answer/7440203?hl=en).

## Outcome measurement

Frozen cohort: `data/reports/recovered65-baseline-2026-09-18.json`. The supplied August 19-September 15 window shows **71 clicks, 11,184 impressions and 0.635% CTR** for those 65 dates. These are cohort page totals, not whole-site totals.

```powershell
python -B scripts/compare_search_cohort.py --as-of 2026-09-18
python -B scripts/compare_search_cohort.py --post "path/to/new-performance.zip" --verified-live-date YYYY-MM-DD --as-of YYYY-MM-DD
```

Use an actual independently verified live date. September 19-October 16 is only the earliest candidate 28-day post-window if the prior deployment went live September 18. Allow Search Console data to settle before exporting. There is no new result to measure today.

The comparison checks complete equal windows, filter compatibility, future/overlapping periods, missing rows and cohort expiry. It also compares the same unexpired dates in both windows. It does not turn missing export rows into confirmed zeroes or claim that observed changes prove causation. Page-weighted position remains approximate. On-site action analytics are separate evidence and require a Vercel Analytics export/dashboard review; no private analytics account was accessed.

No reminder or recurring automation was created. No live browser inspection was attempted because the saved permission denial remains unresolved. Visual checks on localhost at mobile and desktop sizes remain for the user before deployment.

## Validation

Production build passed with 421 generated pages; summer choice pages are server-rendered for their search parameters. The complete local run passed 97 TypeScript/SSR tests and 26 Python tests. Additional calendar/timezone/season tests passed under both New York and Sydney timezones; core calendar-day tests also passed under UTC and London. Changed-file lint reports zero errors and two existing seasonal-image warnings. No code was committed or pushed in this follow-up batch.
