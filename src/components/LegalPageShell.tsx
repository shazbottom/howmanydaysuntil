import Link from "next/link";
import { Brand } from "./Brand";

interface LegalPageShellProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}

export function LegalPageShell({ eyebrow, title, intro, children }: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black dark:text-white/72 dark:hover:text-white"
          >
            <Brand variant="horizontal" height={55} className="h-[55px] w-auto" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
          >
            Home
          </Link>
        </div>

        <section className="mx-auto mt-20 w-full max-w-3xl flex-1">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42 dark:text-white/44">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-center text-4xl font-semibold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
            {intro}
          </p>

          <div className="mt-10 px-1 text-black/74 dark:text-white/72">
            <div className="max-w-none text-[15px] leading-7 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_p]:leading-7 [&_ul]:my-1 [&_ul]:pl-0 [&_ul]:list-none [&_li]:leading-7">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
