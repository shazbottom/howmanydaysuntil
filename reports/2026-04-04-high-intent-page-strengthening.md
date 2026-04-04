## High-Intent Page Strengthening

Date: 4 April 2026

### Goal

Strengthen the existing high-intent SEO landing pages before adding more page types.

### What changed

- Added a reusable landing-page content helper for SEO hub pages.
- Added an `Upcoming dates` table to shared event landing pages.
- Added a `Common questions` section to shared event landing pages.
- Added contextual links from event pages into the public calculator tools.

### Why this is useful

- It makes the strongest countdown pages more complete without creating one-off page forks.
- It gives users more practical context: when the event falls over the next few years, and clear answers to common questions.
- It improves semantic coverage on pages that are already most likely to win impressions.

### Files

- `src/lib/seoHubPageContent.ts`
- `src/app/[landing]/page.tsx`

### Follow-up

- Consider tightening the shared supporting copy for the top holiday pages later.
- Consider excluding `reports/**` from TypeScript if repo-wide typecheck noise continues.
