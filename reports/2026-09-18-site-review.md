# DaysUntil review - 18 September 2026

## Scope and evidence

Initial assessment followed by the implementation recorded below; not deployed by the agent. Three independent AI reviewers were assigned technical SEO, content/search intent, and UX/product design. Their output was checked against source and Search Console exports. They are AI reviewers, not human consultants.

Sources:
- C:/Users/paulr/Downloads/daysuntil.is-Performance-on-Search-2026-09-18.zip: Chart.csv, Pages.csv, Queries.csv, Countries.csv, Devices.csv, Filters.csv.
- C:/Users/paulr/Downloads/daysuntil.is-Coverage-2026-09-18.zip: Chart.csv and Critical issues.csv.
- C:/Users/paulr/Downloads/daysuntil.is-Performance-on-Search-2026-08-15.xlsx: Chart and Pages.
- Current repository source. Public text retrieved through web tools where available may be cached. Parent browser inspection was blocked by a saved permission; no complete desktop/mobile visual or performance audit was performed. Design recommendations are primarily source-supported.

## Performance diagnosis

| Metric | July 16-August 12 | August 19-September 15 | Change |
| --- | ---: | ---: | ---: |
| Clicks | 76 | 122 | +60.5% |
| Impressions | 95,873 | 119,352 | +24.5% |
| CTR (calculated from totals) | 0.0793% | 0.1022% | +0.0229 percentage points |
| Clicks per day | 2.71 | 4.36 | +1.65 |

These are two exported 28-day windows, not consecutive periods; August 13-18 is absent from this comparison. Growth is real but remains small in absolute terms. This does not attribute growth to any particular deployment.

Latest weekly sequence:

| Week | Clicks | Impressions |
| --- | ---: | ---: |
| August 19-25 | 17 | 25,000 |
| August 26-September 1 | 31 | 27,062 |
| September 2-8 | 38 | 27,031 |
| September 9-15 | 36 | 40,259 |

September 7 reached 10 clicks. The latest week's impressions rose sharply without a corresponding click increase. A sustained 10-click/day run means about 280 clicks per 28 days, versus 122 now.

| Page/cohort | Clicks | Page impressions | Average position |
| --- | ---: | ---: | ---: |
| Exact-date pages | 83 | 88,055 | 8.63 weighted approximation |
| /fridays-until-summer | 27 | 3,104 | 5.65 |
| /days-until-2027 | 6 | 10,294 | 10.44 |
| /days-until-friday | 1 | 7,354 | 10.16 |
| /business-days-until | 0 | 1,329 | 65.82 |
| /days-until-christmas | 0 | 471 | 78.23 |
| /2026-countdown-calendar | 1 | 52 | 31.83 |
| /countdown-widget | 0 | 43 | 60.63 |

Exact dates plus Fridays until summer supply 110/122 clicks (90.2%). The summer page grew from 4 clicks/769 impressions in the August workbook. Broad holiday and calculator pages have a ranking problem; the heavily shown Friday/year pages also warrant query-specific CTR investigation. A design refresh alone cannot be assumed to fix search acquisition.

Mobile accounts for 92/122 clicks (75.4%). US and UK account for 72/122 clicks (59.0%). Query export contains 1,000 rows but only 24 reported clicks; omitted/anonymized queries and export limits mean it is not a complete representation of demand. Use daily chart totals for site metrics; page impressions do not have to reconcile to site impressions because aggregation differs. Average positions are not literal fixed rankings and do not establish the presence of AI or direct-answer results.

## Priority 1: repair indexing selection

Current source requires exact dates to be in src/data/indexableExactDates.ts (116 keys) before allowing indexing. src/lib/exactDateMetadata.ts sets both index and follow to false for others. The same eligibility supports sitemap selection.

Joining Pages.csv against that list finds:
- 683 outside-list exact-date URLs generated 74 clicks and 73,487 impressions.
- Restricting to dates on/after September 18 leaves 627 URLs, 71 clicks and 69,197 impressions.
- 65 of those future URLs earned at least one click. That is the first recovery cohort.
- Examples: /days-until/date/2029/04/30 (4 clicks), /2028/08/20 (3), /2027/09/07 (2).

Action: verify deployed robots on representative URLs with URL Inspection, restore indexability and sitemap inclusion for the 65 future clicked dates, then review high-impression dates deliberately. Keep custom/private records excluded. Add a repeatable report comparison so future traffic winners do not depend on an obsolete hand-maintained list. Separate the follow decision from indexing eligibility where appropriate.

The earlier pruning strategy was too blunt for this site's current demand. This is a source-confirmed policy mismatch, not proof of lost clicks or of the exact deployment state. Google removes a page after processing noindex: https://developers.google.com/search/docs/crawling-indexing/block-indexing .

Coverage as of September 14: 658 indexed, 1,330 not indexed; 955 noindex, 215 crawled-not-indexed, 101 404, 37 alternate canonical, 22 redirect, zero redirect errors. The export has reasons but no affected-URL examples, so neither the 404s nor the 215 exclusions can be fully diagnosed here. Past exact-date URLs intentionally return 404 in current code, which may explain some, not necessarily all, of the 101.

Estimated effort: half to one day for recovery and safeguards, followed by recrawl monitoring.

## Priority 2: compact result and usable actions

Source-supported issues:
- Homepage editorial box precedes input and result; many shortcuts and generous spacing add height.
- The preview EventInput Calculate button has sr-only styling. Typed input can differ from the currently displayed countdown until submission.
- Shared landing page and countdown card have substantial padding; significant information uses 9-11px labels and low-opacity colors.
- Exact-date pages link to generic tools despite saying 'until this date'; the selected date is lost.

Proposed layout:
1. Compact navigation.
2. Target heading/date and immediately visible day count.
3. Small weeks/weekday summary with clear counting convention.
4. Visible date editor and Calculate button.
5. Add to calendar, Save countdown, and Business days actions that preserve the date.
6. Planner/calendar alongside the answer on desktop, below it on mobile.
7. Related occasions and sourced facts afterward.

Keep warm paper surfaces, restrained blue accents, seasonal accents where useful, and the established branding. Use readable 12-14px secondary labels and measured contrast. Test at 390x844 and 360px wide; the core answer and main action should be visible without scrolling. Label the hidden date input, associate validation with its field, and announce submitted results without announcing every tick.

Source: src/app/page.tsx; src/components/EventInput.tsx; src/components/CountdownDisplay.tsx; src/components/SeoCountdownPage.tsx; src/components/ExactDatePlanner.tsx.

Estimated effort: 1-2 days. Start with exact-date landing pages because they attract most visitors; include homepage submission fix.

## Priority 3: protect the strongest content

Fridays-until-summer is the clearest successful specialized page. Its headline counts from today; src/lib/countdownClusters.ts yearRows counts from January 1 of each displayed year. Clearly label different baselines or use one baseline. Avoid two seemingly contradictory counts.

Make season definition and hemisphere explicit. Current approximate fixed dates should not be presented as precise astronomical dates for every year/timezone. Use a visible method choice or accurate year-specific data and state its timezone. Do not silently change the meaning of the successful existing URL.

Improve 2027 with a practical year-end summary and prefilled planning actions. Replace internal language such as 'Seasonal content cluster' and the one-row 'Next 5 years' heading. Make existing counts useful: an actual list of remaining Fridays, selectable dates, print/export, and target-preserving links. Extend to existing Halloween/Thanksgiving pages only after correcting the shared logic; do not generate another large set of near-duplicate pages.

Estimated effort: 1-3 days depending on season method support.

## Priority 4: increase trust and repeat use

Show business-day holiday deductions, inclusion/exclusion of endpoints, selected region and any fallback. The engine already returns holiday records; use them to explain the answer and cite the applicable maintained source. Treat generic calculator acquisition as longer term given its current position.

Expose Save this countdown on successful results and seed the existing custom countdown flow with that date. Explain whether the record is browser-local or shareable. Avoid another account/signup layer without demonstrated need.

The 2026 calendar and widget have little search traction yet. Maintain them, but promotion/adoption should be tested before spending weeks adding template variants. The August link export being empty does not prove the site has no backlinks.

## Measurement and implementation order

1. Week 1: verify and recover the 65-date cohort; correct lost-date actions and hidden Calculate; record deployment date.
2. Week 2: compact exact-date/mobile layout; correct summer counting labels and season assumptions; improve 2027 practical actions.
3. Following 28 days: compare cohort clicks, impressions, CTR and index status using matched query/country/device where available. Add privacy-conscious events for calculation, calendar export, tool follow-through, save and widget copy. Avoid sending entered personal titles or dates in event payloads.

Do not promise a CTR target or ranking deadline. At current impression volume, 280 clicks/28 days would require about 0.235% site CTR if impressions remained fixed; this is arithmetic, not a forecast. Track search acquisition separately from on-site task completion.

Reviewer synthesis: Curie identified the noindex conflict; Aquinas emphasized target-preserving tools, consistent counts and auditable business days; Helmholtz emphasized a reachable answer, visible submission and readable labels. All recommendations remain proposals; no application code was edited.

## Implementation follow-up - 18 September 2026

The initial proposals above are retained as the review record. The following changes were subsequently implemented locally:

- Recovered 65 future clicked exact dates: 181 allowlist entries in total. Robots metadata and sitemap eligibility share the policy, while unlisted dates remain noindex, follow. The supplied September export now has zero missing clicked, future, in-range dates.
- Added a read-only export audit: `python scripts/audit_exact_date_indexing.py <export.zip> --as-of YYYY-MM-DD --check`. Run against each new Search Console export; it reports candidates but never automatically adds pages. Impression-only dates remain a separate editorial decision.
- Compact mobile homepage and shared countdown cards, readable labels, visible Calculate controls, accessible input errors, and removal of the expired World Cup shortcut. Homepage editorial and shortcuts follow the primary result.
- Exact-date editor plus target-preserving calculator, widget and custom-countdown links. Save uses the existing online custom record and browser-local saved-reference list; it does not create an account system.
- Consistent today-based cluster tables, daylight-saving regression coverage, selectable remaining Fridays, visitor-facing headings, and explicit Northern Hemisphere approximate season wording. Existing June 21 summer URL semantics are retained, not relabelled as a precise astronomical calculation.
- Business-day deduction lists, endpoint convention, jurisdiction, per-year data coverage/fallback, undated holiday warnings, maintained source links and last-checked dates.
- Correct single-target occurrence headings and prefilled event planning actions. The fixed 2026 calendar remains a 2026 resource, with rolling-year alternatives and an expired-edition message after rollover. Calendar export line folding and widget clipboard failure handling improved.
- Fixed-name action events without personal event properties. Analytics URLs discard query strings/fragments and mask personal countdown slugs. Hosting logs and standard provider processing are separate from these client-side safeguards. Custom-event visibility depends on the project's Vercel Analytics entitlement; no plan upgrade was made.

### Validation and release checks

Automated checks cover indexability/canonicals/sitemap inputs, valid and invalid prefilled dates, leap dates, cluster counts, business-day deductions, calendar rollover and exports. Production build and targeted lint are run before handoff. Browser permission still blocks visual verification; no claim of tested 360px/390px appearance is made.

Final local result: production build passed (421 generated pages); 68 TypeScript/SSR tests and 5 Python audit tests passed. Changed-file lint had zero errors and two pre-existing seasonal-image warnings. The September export audit returned zero missing clicked future dates in range. No commit or deployment performed.

Before pushing, check localhost on mobile-width and desktop layouts: homepage, `/days-until/date/2029/04/30`, `/fridays-until-summer`, `/days-until-2027`, `/business-days-until?target=2026-12-25`, and the Save/widget flows. Confirm calendar and holiday notes remain readable in both themes.

After deployment, record the actual deployment date here, inspect two recovered URLs in Search Console using the live test, and confirm their sitemap inclusion. Request indexing for a small representative sample, not every page. Compare the recovered cohort over the next complete 28-day window and distinguish search clicks from on-site actions. Export affected URLs for the 404/crawled-not-indexed reasons before taking broad action; the aggregate coverage file cannot diagnose individual examples.

Remaining optional work: precise year/timezone astronomical dates or a season-method selector, desktop two-column planner composition after visual QA, and promotion of the existing widget. These were not substituted with more thin indexed pages or unsupported ranking promises.
