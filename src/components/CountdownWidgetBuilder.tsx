"use client";

import { useState } from "react";
import {
  buildCountdownWidgetEmbedCode,
  buildCountdownWidgetPath,
  countdownWidgetSizes,
  type CountdownWidgetConfig,
  type CountdownWidgetSize,
  type CountdownWidgetTheme,
} from "../lib/countdownWidget";

const fieldClassName =
  "mt-2 h-12 w-full rounded-[1rem] border border-black/8 bg-white px-4 text-sm text-black outline-none transition focus:border-[#5c5a73]/45 focus:ring-4 focus:ring-[#5c5a73]/10 dark:border-white/10 dark:bg-[#111312] dark:text-white";

export function CountdownWidgetBuilder({
  initialConfig,
  minimumDate,
}: {
  initialConfig: CountdownWidgetConfig;
  minimumDate: string;
}) {
  const [title, setTitle] = useState(initialConfig.title);
  const [targetDate, setTargetDate] = useState(initialConfig.targetDate);
  const [theme, setTheme] = useState<CountdownWidgetTheme>(initialConfig.theme);
  const [accent, setAccent] = useState(initialConfig.accent);
  const [size, setSize] = useState<CountdownWidgetSize>("standard");
  const [copied, setCopied] = useState(false);
  const config: CountdownWidgetConfig = { title, targetDate, theme, accent };
  const previewPath = buildCountdownWidgetPath(config);
  const embedCode = buildCountdownWidgetEmbedCode(config, size);
  const dimensions = countdownWidgetSizes[size];

  async function copyEmbedCode() {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="my-10 overflow-hidden rounded-[2rem] border border-[#d9d2c3] bg-[linear-gradient(180deg,#fffdf8_0%,#f6f1e6_100%)] shadow-[0_18px_45px_rgba(76,62,35,0.1)] dark:border-[#403a33] dark:bg-[linear-gradient(180deg,#1f1c19_0%,#181614_100%)]">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-black/8 p-6 dark:border-white/10 lg:border-r lg:border-b-0 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8b642b] dark:text-[#e0b66f]">
            Widget settings
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <label className="text-sm font-medium">
              Countdown title
              <input
                value={title}
                maxLength={60}
                onChange={(event) => setTitle(event.target.value)}
                className={fieldClassName}
              />
            </label>
            <label className="text-sm font-medium">
              Target date
              <input
                type="date"
                min={minimumDate}
                max="2100-12-31"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                className={fieldClassName}
              />
            </label>
            <label className="text-sm font-medium">
              Theme
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value as CountdownWidgetTheme)}
                className={fieldClassName}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Size
              <select
                value={size}
                onChange={(event) => setSize(event.target.value as CountdownWidgetSize)}
                className={fieldClassName}
              >
                {Object.entries(countdownWidgetSizes).map(([value, definition]) => (
                  <option key={value} value={value}>
                    {definition.label} ({definition.width} x {definition.height})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium sm:col-span-2 lg:col-span-1">
              Accent colour
              <span className="mt-2 flex h-12 items-center gap-3 rounded-[1rem] border border-black/8 bg-white px-3 dark:border-white/10 dark:bg-[#111312]">
                <input
                  type="color"
                  value={accent}
                  onChange={(event) => setAccent(event.target.value)}
                  className="h-8 w-11 cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="font-mono text-xs uppercase text-black/55 dark:text-white/58">
                  {accent}
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="min-w-0 p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5c5a73] dark:text-[#c8c5e6]">
            Live preview
          </p>
          <div className="mt-6 overflow-x-auto rounded-[1.5rem] bg-[radial-gradient(circle_at_1px_1px,rgba(77,68,52,0.14)_1px,transparent_0)] bg-[size:18px_18px] p-4 dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.09)_1px,transparent_0)]">
            <iframe
              src={previewPath}
              title={`${title || "Countdown"} widget preview`}
              width={dimensions.width}
              height={dimensions.height}
              className="mx-auto block max-w-none rounded-[1.5rem] border-0"
            />
          </div>
          <label className="mt-6 block text-sm font-medium">
            Embed code
            <textarea
              readOnly
              value={embedCode}
              rows={5}
              className="mt-2 w-full resize-none rounded-[1rem] border border-black/8 bg-[#111312] p-4 font-mono text-xs leading-5 text-[#f5f3ee] outline-none dark:border-white/10"
            />
          </label>
          <button
            type="button"
            onClick={copyEmbedCode}
            className="mt-4 inline-flex h-11 items-center rounded-[1rem] bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#313131] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/15 dark:bg-[#f5f3ee] dark:text-[#171717] dark:hover:bg-white"
          >
            {copied ? "Copied" : "Copy embed code"}
          </button>
        </div>
      </div>
    </section>
  );
}
