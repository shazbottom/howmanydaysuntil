This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Custom Countdowns

Custom countdowns are created at `/create` and published at `/c/[slug]`.

- Slugs use a readable title plus a short random suffix, for example `our-wedding-a8k3x`.
- Records are stored in a local JSON file at `data/custom-countdowns.json`, which is created on demand.
- Custom countdown pages are marked `noindex` by default and are intended for sharing rather than SEO.
- Newly created custom countdown slugs are also saved in browser `localStorage` under `daysuntil_my_countdowns` so the homepage can show a lightweight `Your countdowns` section for the most recent items.

This file-backed storage is the lightest v1 persistence approach for a single-instance deployment. If you later add accounts, private countdowns, or multi-instance hosting, the next step is to replace the JSON file with a shared database table while keeping the same `slug`-based page routes.
