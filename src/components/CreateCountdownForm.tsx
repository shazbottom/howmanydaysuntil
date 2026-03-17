"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CountdownDisplay } from "./CountdownDisplay";
import { buildCustomCountdownPreview } from "../lib/customCountdownPreview";
import { saveCountdownSlug } from "../lib/myCountdowns";

interface FormErrors {
  title?: string;
  targetDate?: string;
  timezone?: string;
  note?: string;
  form?: string;
}

export function CreateCountdownForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [timezone, setTimezone] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preview = useMemo(
    () => buildCustomCountdownPreview({ title, targetDate, timezone, note }),
    [title, targetDate, timezone, note],
  );

  return (
    <div className="w-full">
      <form
        className="mx-auto w-full max-w-[42rem] rounded-[2.25rem] border border-black/8 bg-[#fcfbf7] p-6 dark:border-white/10 dark:bg-[#171717] sm:p-8"
        onSubmit={async (event) => {
          event.preventDefault();
          setIsSubmitting(true);
          setErrors({});

          const response = await fetch("/api/custom-countdowns", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              targetDate,
              timezone,
              note,
            }),
          });

          const payload = (await response.json()) as {
            errors?: FormErrors;
            path?: string;
          };

          if (!response.ok) {
            setErrors(payload.errors ?? { form: "Unable to create countdown." });
            setIsSubmitting(false);
            return;
          }

          if (payload.path) {
            if (payload.path.startsWith("/c/")) {
              saveCountdownSlug(payload.path.replace("/c/", ""));
            }
            router.push(payload.path);
            return;
          }

          setErrors({ form: "Unable to create countdown." });
          setIsSubmitting(false);
        }}
      >
        <div className="border-b border-black/6 pb-6 text-left dark:border-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-black/40 dark:text-white/40">
            Create
          </p>
          <p className="mt-3 max-w-xl text-sm text-black/56 dark:text-white/58 sm:text-[15px]">
            Give it a title, choose a date, and share the finished countdown with one clean link.
          </p>
        </div>
        <div className="mt-6 grid gap-5">
          <label className="text-left">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/48 dark:text-white/48">
              Title
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-[1.4rem] border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:placeholder:text-white/24 dark:focus:border-white/22"
              placeholder="Our wedding"
            />
            {errors.title ? <p className="mt-2 text-sm text-red-600">{errors.title}</p> : null}
          </label>
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            <label className="text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/48 dark:text-white/48">
                Target date
              </span>
              <input
                type="date"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                className="mt-2 w-full rounded-[1.4rem] border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:focus:border-white/22"
              />
              {errors.targetDate ? (
                <p className="mt-2 text-sm text-red-600">{errors.targetDate}</p>
              ) : null}
            </label>
            <label className="text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/48 dark:text-white/48">
                Timezone
              </span>
              <input
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="mt-2 w-full rounded-[1.4rem] border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:placeholder:text-white/24 dark:focus:border-white/22"
                placeholder="Australia/Sydney"
              />
              {errors.timezone ? (
                <p className="mt-2 text-sm text-red-600">{errors.timezone}</p>
              ) : (
                <p className="mt-2 text-sm text-black/42 dark:text-white/42">Optional IANA timezone.</p>
              )}
            </label>
          </div>
          <label className="text-left">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/48 dark:text-white/48">
              Short note
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-[1.4rem] border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition focus:border-black/25 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:placeholder:text-white/24 dark:focus:border-white/22"
              placeholder="A quiet countdown for sharing with family and friends."
            />
            {errors.note ? <p className="mt-2 text-sm text-red-600">{errors.note}</p> : null}
          </label>
          {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-black/42 dark:text-white/42">Your page will be private-style and noindex by default.</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#1f6feb] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#175ed1] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create countdown"}
            </button>
          </div>
        </div>
      </form>
      <section className="mx-auto mt-12 w-full max-w-[42rem] text-center">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45 dark:text-white/45">
          Live preview
        </h2>
        <div className="mt-5 rounded-[2rem] border border-black/8 bg-white px-4 py-8 dark:border-white/10 dark:bg-[#111111] sm:px-6">
          <p className="text-[clamp(2rem,7vw,3.8rem)] font-semibold tracking-tight text-black dark:text-white">
            {preview.title}
          </p>
          {preview.note ? (
            <p className="mx-auto mt-3 max-w-xl text-sm text-black/55 dark:text-white/58 sm:text-base">
              {preview.note}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-black/45 dark:text-white/45">
            {preview.formattedDate ? <span>{preview.formattedDate}</span> : null}
            {preview.formattedDate && preview.timezone ? <span>&middot;</span> : null}
            {preview.timezone ? <span>{preview.timezone}</span> : null}
          </div>
          <div className="mx-auto mt-8 w-full max-w-[31.9rem] sm:max-w-[34rem]">
            <CountdownDisplay label={preview.title} countdown={preview.countdown} />
          </div>
        </div>
      </section>
    </div>
  );
}
