import Link from "next/link";

export function CalculatorNavButton() {
  return (
    <Link
      href="/calculators"
      className="inline-flex h-10 items-center whitespace-nowrap rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
    >
      Calculators
    </Link>
  );
}
