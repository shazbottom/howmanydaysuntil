# daysuntil.is: targeted code map

Checked against source on 2026-10-05. Verify the affected code before relying on
this map; do not ingest every file for every task.

## Application

- Next.js 16.1.6 **App Router**, React 19.2.3, strict TypeScript, Tailwind 4,
  ESLint 9. Single application, not a monorepo. Vercel deployment.
- `src/app/layout.tsx`: Geist/Geist Mono/Caveat fonts, theme initialization,
  metadata base `https://daysuntil.is`, footer and Vercel Analytics.
- `src/app/page.tsx`: client homepage, input/chips and default countdown.
- `src/components/SeoCountdownPage.tsx`, `CountdownDisplay.tsx`: shared event
  presentation. Separate country/region/season/custom/widget/calculator shells.
- `src/lib/countdown*.ts`, `dateCalculators.ts`, `parseInput.ts`: date arithmetic
  and parsing. Distinguish civil calendar days from elapsed hours; check DST,
  leap years, locale and server/browser initial snapshots.
- `src/data/events.ts` is homepage input data; `src/data/seoHubEvents.ts` is SEO
  hub data. Localized definitions live in `src/lib/events.ts`. They are different
  representations: avoid updating only one when a change affects several flows.
- `src/lib/regionData.ts`, `countryData.ts`, `regions.ts` and
  `src/data/referenceAttributions.json`: regional/reference data and sources.
  Datasets have finite year/coverage limits; do not invent missing official dates.

## Routes and discovery

| Area | Actual routing / owning code |
| --- | --- |
| Named event | Flat `/days-until-christmas`, etc.; `src/app/[landing]/page.tsx`, `seoLandingPages.ts` |
| Legacy event | `/days-until/[slug]` redirects to flat route via `next.config.ts`; preserve deeper legacy OG paths |
| Exact date | `/days-until/date/YYYY/MM/DD`; `exactDateCountdown.ts`, `exactDatePages.ts`, `exactDateMetadata.ts` |
| Countries | Explicit `au`, `ca`, `nz`, `uk`, `us` trees; `localizedPages.tsx` |
| Regions | `/[country]/[region]`, `/[year]`, `/days-until/[event]`; `regionPages.tsx` |
| Seasons | Flat season hubs choose country; localized events use meteorological definitions; US uses `fall` |
| Summer clusters | Friday/weekend pages offer hemisphere/definition controls; maintained solstice data is finite |
| Calculators | Public routes in `calculatorPages.ts`; query prefill in `calculatorShare.ts`; old preview routes redirect |
| Personal countdowns | `/create`, `/c/[slug]`, `api/custom-countdowns` POST and `[slug]` DELETE |
| Widgets/calendar | `/countdown-widget`, `/embed/countdown`, calendar download Route Handlers and `calendarEvent.ts` |

Exact-date range is today through 2030-12-31. Past/out-of-range dates return 404;
in-range dates outside `src/data/indexableExactDates.ts` render with noindex/follow.
Only eligible allowlisted dates enter static params and the sitemap. Do not widen
this policy or redirect expired dates to unrelated pages without an explicit task.

`src/app/sitemap.ts` refreshes hourly. Include unique canonical public URLs and
exclude expired dates, private records, noncanonical country variants and query
variants. `src/app/robots.ts` disallows `/c/`; this is crawl guidance, not privacy.
Canonical strategies for localized events are global/country/region/self.

`src/lib/structuredData.ts` and `JsonLd.tsx` produce JSON-LD. No guarantee of rich
results follows from markup. Metadata is route/helper-specific; verify actual
generated title, description, robots, canonical and OG tags for affected routes.

`src/lib/ogImage.tsx` renders 1200x630 PNGs with `next/og`. Event/date image routes
use Edge runtime; `/api/og/custom` accepts share-image parameters. These image
URLs are assets, not separate SEO content pages.

## Storage and backend

`src/lib/redis.ts` is server-only. Configuration precedence:

1. `UPSTASH_REDIS_REST_URL` plus `UPSTASH_REDIS_REST_TOKEN`.
2. `KV_REST_API_URL` plus `KV_REST_API_TOKEN`.
3. `REDIS_URL` with `redis://` or `rediss://` (Node TCP/TLS).

Inspect variable **names**, not values, when documenting setup. Production custom
records use `countdown:${slug}`. `customCountdownStore.ts` falls back to
`.local-data/custom-countdowns.json` only in non-production when Redis is absent.
Configured development credentials therefore connect to Redis instead of local
storage. Use isolated development storage for write/delete tests.

`myCountdowns.ts` stores browser references under `daysuntil_my_countdowns`;
`theme.ts` uses `daysuntil_theme`. Removing a browser reference and deleting a
server record are different operations. Storage can be unavailable or malformed.

`vercel.json` schedules `api/redis-keepalive` daily at 03:00 UTC. It writes a Redis
key; production authorization uses `CRON_SECRET`. Do not use it as a read-only
health check. Noindex/shareability does not establish private record ownership.

## Existing verification and follow-ups

Tests are TypeScript `node:test` files and TSX static rendering tests under `src`;
Python audit tests live in `scripts`. No `npm test` script exists. Commands are in
`docs/AI_WORKFLOW.md`. `@/*` maps to the repository root, not `src`.

The inspection TypeScript check passed. Scoped lint of `src` and the reference
script reported 12 existing errors and six warnings. Capture the current baseline
for each task, rather than treating this historical count as permanently current.
Builds may fetch Google fonts; source verification fetches external URLs and
writes a report. Static rendering does not exercise browser events/hydration.

Separate follow-ups discovered during inspection (not changed in this setup):

- `.gitignore` ignores old `data/custom-countdowns.json` but not the current
  `.local-data/` store. Never stage personal runtime records.
- README persistence/routing descriptions are stale.
- Custom DELETE handler has no ownership check. Evaluate separately if asked;
  do not describe noindex as an authorization mechanism.
- Review and address the existing lint failures in a separate application task.
