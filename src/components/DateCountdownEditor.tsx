"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackAction } from "../lib/actionAnalytics";

export function DateCountdownEditor({ initialDate, minimumDate }: { initialDate: string; minimumDate: string }) {
  const [date, setDate] = useState(initialDate);
  const router = useRouter();
  return (
    <form className="mt-5 flex w-full max-w-[34rem] flex-wrap items-end justify-center gap-3" onSubmit={(event) => {
      event.preventDefault();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      trackAction("calculation");
      router.push(`/days-until/date/${date.replaceAll("-", "/")}`);
    }}>
      <label className="text-left text-sm font-medium">
        Choose another date
        <input required type="date" min={minimumDate}
          max="2030-12-31" value={date} onChange={(event) => setDate(event.target.value)}
          className="mt-1 block min-h-11 rounded-xl border border-black/20 bg-background px-3 text-foreground dark:border-white/25" />
      </label>
      <button className="min-h-11 rounded-xl bg-[#315da8] px-4 text-sm font-semibold text-white" type="submit">Calculate</button>
    </form>
  );
}
