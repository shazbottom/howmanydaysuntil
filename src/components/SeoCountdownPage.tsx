import Link from "next/link";
import { Brand } from "./Brand";
import { CountdownDisplay } from "./CountdownDisplay";
import { CountdownLinkList, type CountdownLinkItem } from "./CountdownLinkList";

export interface SeoCountdownPageProps {
  eyebrow: string;
  title: string;
  lead?: string;
  countdownLabel: string;
  countdown: Parameters<typeof CountdownDisplay>[0]["countdown"];
  supportingCopy: string[];
  relatedLinks: CountdownLinkItem[];
}

export function SeoCountdownPage({
  eyebrow,
  title,
  lead,
  countdownLabel,
  countdown,
  supportingCopy,
  relatedLinks,
}: SeoCountdownPageProps) {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black"
          >
            <Brand variant="horizontal" height={55} className="h-[55px] w-auto" />
          </Link>
          <Link
            href="/"
            className="rounded-full bg-black/[0.055] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black/[0.085] active:bg-black/[0.11]"
          >
            Home
          </Link>
        </div>
        <section className="mt-20 flex w-full flex-1 flex-col items-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-5 max-w-2xl text-sm leading-6 text-black/55 sm:text-base">
              {lead}
            </p>
          ) : null}
          <div className="mt-12 w-full max-w-[31.9rem] sm:max-w-[34rem]">
            <CountdownDisplay label={countdownLabel} countdown={countdown} />
          </div>
          <div className="mt-8 max-w-2xl space-y-4 text-left text-sm leading-6 text-black/65 sm:text-base">
            {supportingCopy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
        <CountdownLinkList title="Related countdowns" links={relatedLinks} />
      </div>
    </main>
  );
}
