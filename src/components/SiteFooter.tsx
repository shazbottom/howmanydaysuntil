import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/6 px-6 py-5 text-sm text-black/54 dark:border-white/10 dark:text-white/56">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} DaysUntil</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/about" className="transition hover:text-black dark:hover:text-white">
            About
          </Link>
          <Link href="/how-it-works" className="transition hover:text-black dark:hover:text-white">
            How it works
          </Link>
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
