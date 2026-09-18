# Summer options handoff

Implementation complete. No browser UI, commit, deploy, or production build in this task. Parent can build now.

## Behavior

- No-query summer cluster URLs retain original approximate June 21 Northern Hemisphere behavior. Internal method remains legacy; visible labels say Original.
- Closed-by-default details control shows the current convention and Change season settings. Explicit GET submission selects astronomical/meteorological and north/south. No keystroke analytics or personal data tracking.
- Explicit selections use UTC for dates, today, Friday/weekend counts, live target timestamps, date labels, and occurrence tables. Meteorological dates are June 1 north / December 1 south at 00:00 UTC.
- The selected UTC date remains the target throughout that UTC day, even after the astronomical instant. Timer clamps to zero; next occurrence begins on the next UTC day. Today and the target day are included when eligible. This is stated on-page.
- Astronomical June/December solstice instants cover 2026-2035 to published minute precision. Future rows truncate at 2035. With no maintained next occurrence, the page explains unavailability and offers explicit alternate choices; no approximate date is silently substituted.
- Sibling links retain settings. Calendar URL retains settings and its description includes the convention and instant. Date-planning/save actions receive the selected UTC civil date, not the host-local date of the timestamp. Calendar exports remain explicitly disclosed all-day markers, not timed appointments. Save is a fixed date snapshot, not a recurring season subscription.
- All summer query variants are noindex/follow, canonical to the original base URL. Invalid/incomplete selection visibly reverts to Original with an explanation.
- Localized summer pages link to meteorological south for AU/NZ and meteorological north for US/UK/CA.
- Friday list retains all dates but emits exact-date links only within existing route eligibility, including the 2030 horizon and host-local today guard. Unsupported/past dates are plain text.

## Sources and precision

- Primary calculations: Fred Espenak, https://www.astropixels.com/ephemeris/soleq2001.html . Full required credit appears on-page and in data comments. Source explicitly permits table reproduction with that credit. Checked 2026-09-18.
- This is one consistent table, not mixed USNO and Espenak minute values. Source labels its times GMT; represented as UTC to minute precision for planning. No sub-minute astronomical accuracy is claimed. Source predictions can differ from other ephemerides by roughly a minute.
- USNO definitions were checked at https://aa.usno.navy.mil/data/Earth_Seasons and its API documentation. The research reader could retrieve 2026/2027 calculated pages but not later-year responses; USNO was not falsely attributed as the dataset source.
- Meteorological definitions: https://www.ncei.noaa.gov/news/meteorological-versus-astronomical-seasons and https://www.bom.gov.au/news-and-media/solstices-equinoxes-and-the-seasons . Both linked on-page.
- No local-timezone selector; explicit selections intentionally use UTC. No weather forecast, school-calendar assumption, or inference that all climates follow four seasons.

## Validation

- TypeScript noEmit/incremental false: passed.
- Targeted ESLint: zero errors; pre-existing LocalizedCountdownPage img warning remains.
- 16 focused tests passed: 11 summer helper/integration tests, 4 cluster tests, 1 controls static-render test.
- All 15 helper/cluster tests additionally passed under America/Los_Angeles and Australia/Sydney TZ values.
- Coverage: leap day, leap-year solstice date, source minute precision, hemispheres, target-day/UTC/year rollover, list/headline/table consistency, preserved actions/siblings, invalid selection, noindex/canonical policy, coverage limit, exact-date horizon, localized defaults, and closed accessible GET controls.
- Output is under .next/season-tests. Compile with `npx tsc src/lib/summerSelection.test.ts src/lib/countdownClusters.test.ts src/components/SummerSeasonControls.test.tsx --outDir .next/season-tests --module commonjs --moduleResolution node --target es2021 --esModuleInterop --resolveJsonModule --skipLibCheck --jsx react-jsx`.
- Run `node --test .next/season-tests/lib/summerSelection.test.js .next/season-tests/lib/countdownClusters.test.js .next/season-tests/components/SummerSeasonControls.test.js`.

## Ownership

Owned changes: countdownClusters.ts; CountdownClusterPage.tsx; both summer cluster app pages; LocalizedCountdownPage.tsx; new summerSelection helper/test, summerSolstices data, SummerSeasonControls component/test.

Shared SeoCountdownPage props were requested by message and implemented by its owner. This task consumes countdownControls, countdownTimeZone, calendarEventOverride, and actionDateOverride; it did not edit SeoCountdownPage, CountdownDisplay, countdown.ts, or exactDatePages.ts. Parent/layout owner handles shared UTC live-tick/day math.
