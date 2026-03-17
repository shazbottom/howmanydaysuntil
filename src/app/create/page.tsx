import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "../../components/Brand";
import { CreateCountdownForm } from "../../components/CreateCountdownForm";
import { ThemeToggle } from "../../components/ThemeToggle";

export const metadata: Metadata = {
  title: "Create your own countdown | DaysUntil",
  description: "Create a shareable personal countdown page for birthdays, weddings, trips, and more.",
};

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black dark:text-white/72 dark:hover:text-white"
          >
            <Brand variant="horizontal" height={55} className="h-[55px] w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-5 py-3 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
            >
              Home
            </Link>
          </div>
        </div>
        <section className="mt-16 w-full text-center sm:mt-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-black/42 dark:text-white/44">
            Custom countdown
          </p>
          <h1 className="mt-4 text-[clamp(2.75rem,10vw,5.8rem)] font-semibold tracking-tight">
            Create your own countdown
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
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
