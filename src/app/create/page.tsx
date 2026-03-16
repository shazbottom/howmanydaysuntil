import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "../../components/Brand";
import { CreateCountdownForm } from "../../components/CreateCountdownForm";

export const metadata: Metadata = {
  title: "Create your own countdown | DaysUntil",
  description: "Create a shareable personal countdown page for birthdays, weddings, trips, and more.",
};

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center">
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
        <section className="mt-16 w-full text-center sm:mt-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-black/42">
            Custom countdown
          </p>
          <h1 className="mt-4 text-[clamp(2.75rem,10vw,5.8rem)] font-semibold tracking-tight">
            Create your own countdown
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-black/55 sm:text-base">
            Make a shareable countdown for weddings, birthdays, trips, exams, and other personal
            milestones without adding any extra noise.
          </p>
          <div className="mt-12">
            <CreateCountdownForm />
          </div>
        </section>
      </div>
    </main>
  );
}
