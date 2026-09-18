"use client";

import { useState } from "react";
import { summerSelectionLabel, type SummerSelection } from "../lib/summerSelection";

export function SummerSeasonControls({ selection, path }: { selection: SummerSelection; path: string }) {
  const [method, setMethod] = useState(selection.method);
  return (
    <details className="w-full max-w-[34rem] rounded-xl border border-black/10 px-3 py-2 text-left text-sm dark:border-white/15">
      <summary className="cursor-pointer py-1 leading-5">
        <span className="font-medium">{summerSelectionLabel(selection)}</span>
        <span className="mt-1 block underline underline-offset-2">Change season settings</span>
      </summary>
      <form action={path} method="get" className="mt-3">
      <fieldset>
        <legend className="font-semibold">Choose what summer means</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">Season definition
            <select name="method" value={method} onChange={(event) => setMethod(event.target.value as SummerSelection["method"])} className="min-h-11 w-full rounded-lg border border-black/20 bg-background px-2 dark:border-white/25">
              <option value="legacy">Original: June 21 (approximate north)</option>
              <option value="meteorological">Meteorological: calendar months</option>
              <option value="astronomical">Astronomical: sourced solstice</option>
            </select>
          </label>
          <label className="grid gap-1">Hemisphere
            <select name="hemisphere" defaultValue={selection.hemisphere} disabled={method === "legacy"} className="min-h-11 w-full rounded-lg border border-black/20 bg-background px-2 disabled:opacity-60 dark:border-white/25">
              <option value="north">Northern Hemisphere</option>
              <option value="south">Southern Hemisphere</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-black/75 dark:text-white/80">Original keeps the June 21 target. Explicit seasonal choices use UTC. Country selection does not change these settings.</p>
        <button type="submit" className="mt-3 min-h-11 rounded-lg bg-[#416bab] px-4 py-2 font-semibold text-white">Apply season settings</button>
        <a className="ml-4 inline-block py-2 underline" href={path}>Reset to original</a>
      </fieldset>
      </form>
    </details>
  );
}
