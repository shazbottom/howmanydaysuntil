import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/6 px-6 py-5 text-sm text-black/54 dark:border-white/10 dark:text-white/56">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p>© {new Date().getFullYear()} DaysUntil</p>
        <nav className="flex items-center gap-4">
          <Link href="/contact" className="transition hover:text-black dark:hover:text-white">
            Contact
          </Link>
          <Link href="/privacy-policy" className="transition hover:text-black dark:hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-black dark:hover:text-white">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
