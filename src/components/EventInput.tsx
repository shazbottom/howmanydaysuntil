"use client";

"use client";

import { useRef } from "react";

export interface EventInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onDatePick?: (value: string) => void;
  placeholder?: string;
  fieldLabel?: string;
  submitButtonLabel?: string;
  variant?: "default" | "preview" | "compact";
}

function getValueSizeClasses(value: string): {
  input: string;
  punctuation: string;
} {
  const length = value.trim().length;

  if (length >= 20) {
    return {
      input: "text-[clamp(1.45rem,6.8vw,3.5rem)]",
      punctuation: "text-[clamp(1.4rem,6.1vw,3.4rem)]",
    };
  }

  if (length >= 12) {
    return {
      input: "text-[clamp(1.6rem,7.4vw,3.95rem)]",
      punctuation: "text-[clamp(1.55rem,6.8vw,3.85rem)]",
    };
  }

  return {
    input: "text-[clamp(1.75rem,8.1vw,4.4rem)]",
    punctuation: "text-[clamp(1.7rem,7.4vw,4.3rem)]",
  };
}

// Controlled input used to submit an event, year, or exact date query.
export function EventInput({
  value,
  onValueChange,
  onSubmit,
  onDatePick,
  placeholder = "Christmas",
  fieldLabel,
  submitButtonLabel,
  variant = "default",
}: EventInputProps) {
  const valueSizeClasses = getValueSizeClasses(value || placeholder);
  const isPreviewVariant = variant === "preview";
  const isCompactVariant = variant === "compact";
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  if (isPreviewVariant) {
    return (
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label htmlFor="event-input" className="sr-only">
          Event or date
        </label>
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-[38rem] sm:max-w-[44rem]">
            <div className="mx-auto max-w-[11ch] text-[clamp(2rem,10vw,5rem)] font-semibold leading-[0.94] tracking-[-0.08em] text-black dark:text-white sm:max-w-none sm:text-[clamp(2.45rem,5.8vw,5rem)]">
              <div>How many days until</div>
            </div>
            {fieldLabel ? (
              <p className="mt-7 text-sm font-medium text-black/52 dark:text-white/54">
                {fieldLabel}
              </p>
            ) : null}
            <div className="mx-auto mt-4 w-full max-w-[min(88vw,28rem)] sm:max-w-[min(70vw,34rem)]">
              <div className="flex items-center rounded-[0.95rem] border border-[#6495ED]/52 bg-[linear-gradient(180deg,rgba(248,246,241,0.96)_0%,rgba(241,238,229,0.98)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(194,188,173,0.24),inset_0_2px_6px_rgba(134,124,102,0.06),0_1px_2px_rgba(16,24,40,0.035)] transition-[border-color,box-shadow,background-image,background-color] duration-200 focus-within:border-[#6495ED] focus-within:bg-[linear-gradient(180deg,rgba(250,249,245,1)_0%,rgba(244,241,233,1)_100%)] focus-within:ring-4 focus-within:ring-[#6495ED]/14 dark:border-[#4b74be]/48 dark:bg-[linear-gradient(180deg,rgba(29,31,30,0.98)_0%,rgba(22,24,23,1)_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.035),inset_0_-1px_0_rgba(0,0,0,0.22),inset_0_2px_6px_rgba(0,0,0,0.16),0_1px_2px_rgba(0,0,0,0.16)] dark:focus-within:border-[#6495ED]/88 dark:focus-within:bg-[linear-gradient(180deg,rgba(33,35,34,1)_0%,rgba(25,27,26,1)_100%)] dark:focus-within:ring-[#6495ED]/16">
              <input
                id="event-input"
                name="event-input"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
                className="block h-[3.7rem] min-w-0 flex-1 bg-transparent px-4 text-center text-[41px] font-semibold text-black outline-none transition placeholder:text-[15px] placeholder:font-medium placeholder:text-black/38 dark:text-white dark:placeholder:text-white/34"
              />
              {onDatePick ? (
                <>
                  <div className="h-8 w-px bg-black/8 dark:bg-white/10" aria-hidden="true" />
                  <button
                    type="button"
                    aria-label="Pick a date"
                    onClick={() => {
                      const input = dateInputRef.current;

                      if (!input) {
                        return;
                      }

                      if (typeof input.showPicker === "function") {
                        input.showPicker();
                        return;
                      }

                      input.click();
                    }}
                    className="mr-2.5 flex h-10 w-10 items-center justify-center rounded-[0.8rem] text-black/48 transition hover:bg-black/[0.035] hover:text-black/68 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6495ED]/20 dark:text-white/46 dark:hover:bg-white/[0.05] dark:hover:text-white/68 dark:focus-visible:ring-[#6495ED]/24"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                      <path d="M7.5 3.75v3.5M16.5 3.75v3.5M3.5 9.25h17" />
                    </svg>
                  </button>
                  <input
                    ref={dateInputRef}
                    type="date"
                    className="sr-only"
                    onChange={(event) => {
                      const nextValue = event.target.value;

                      if (!nextValue) {
                        return;
                      }

                      onDatePick(nextValue);
                    }}
                  />
                </>
              ) : null}
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="sr-only">
          Calculate
        </button>
      </form>
    );
  }

  if (isCompactVariant) {
    return (
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label htmlFor="event-input" className="sr-only">
          Event or date
        </label>
        <div className="mx-auto flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="min-w-0 flex-1">
            <div className="flex items-center rounded-[0.95rem] border border-[#6495ED]/42 bg-[linear-gradient(180deg,rgba(248,246,241,0.96)_0%,rgba(241,238,229,0.98)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(194,188,173,0.2),inset_0_2px_6px_rgba(134,124,102,0.05),0_1px_2px_rgba(16,24,40,0.03)] transition-[border-color,box-shadow,background-image,background-color] duration-200 focus-within:border-[#6495ED] focus-within:bg-[linear-gradient(180deg,rgba(250,249,245,1)_0%,rgba(244,241,233,1)_100%)] focus-within:ring-4 focus-within:ring-[#6495ED]/12 dark:border-[#4b74be]/42 dark:bg-[linear-gradient(180deg,rgba(29,31,30,0.98)_0%,rgba(22,24,23,1)_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.18),inset_0_2px_6px_rgba(0,0,0,0.14),0_1px_2px_rgba(0,0,0,0.14)] dark:focus-within:border-[#6495ED]/82 dark:focus-within:bg-[linear-gradient(180deg,rgba(33,35,34,1)_0%,rgba(25,27,26,1)_100%)] dark:focus-within:ring-[#6495ED]/14">
              <input
                id="event-input"
                name="event-input"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
                className="block h-[3.2rem] min-w-0 flex-1 bg-transparent px-4 text-center text-[22px] font-semibold text-black outline-none transition placeholder:text-[14px] placeholder:font-medium placeholder:text-black/38 dark:text-white dark:placeholder:text-white/34"
              />
              {onDatePick ? (
                <>
                  <div className="h-7 w-px bg-black/8 dark:bg-white/10" aria-hidden="true" />
                  <button
                    type="button"
                    aria-label="Pick a date"
                    onClick={() => {
                      const input = dateInputRef.current;

                      if (!input) {
                        return;
                      }

                      if (typeof input.showPicker === "function") {
                        input.showPicker();
                        return;
                      }

                      input.click();
                    }}
                    className="mr-2 flex h-9 w-9 items-center justify-center rounded-[0.75rem] text-black/48 transition hover:bg-black/[0.035] hover:text-black/68 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6495ED]/20 dark:text-white/46 dark:hover:bg-white/[0.05] dark:hover:text-white/68 dark:focus-visible:ring-[#6495ED]/24"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-[17px] w-[17px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                      <path d="M7.5 3.75v3.5M16.5 3.75v3.5M3.5 9.25h17" />
                    </svg>
                  </button>
                  <input
                    ref={dateInputRef}
                    type="date"
                    className="sr-only"
                    onChange={(event) => {
                      const nextValue = event.target.value;

                      if (!nextValue) {
                        return;
                      }

                      onDatePick(nextValue);
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
          {submitButtonLabel ? (
            <button
              type="submit"
              className="inline-flex h-[3.2rem] items-center justify-center rounded-[0.95rem] border border-black/6 bg-[#f3f2ee] px-5 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d] sm:shrink-0"
            >
              {submitButtonLabel}
            </button>
          ) : null}
        </div>
        {!submitButtonLabel ? (
          <button type="submit" className="sr-only">
            Calculate
          </button>
        ) : null}
      </form>
    );
  }

  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="event-input" className="sr-only">
        Event or date
      </label>
      <div className="flex flex-col items-center text-center">
        <div className="w-full max-w-[38rem] sm:max-w-[44rem]">
          <div className="mx-auto max-w-[11ch] text-[clamp(2rem,10vw,5rem)] font-semibold leading-[0.94] tracking-[-0.08em] text-black dark:text-white sm:max-w-none sm:text-[clamp(2.45rem,5.8vw,5rem)]">
            <div>How many days until</div>
          </div>
          {fieldLabel ? (
            <p className="mt-6 text-sm font-medium text-black/52 dark:text-white/54">
              {fieldLabel}
            </p>
          ) : null}
          <div className="mx-auto mt-4 flex max-w-[min(88vw,24rem)] items-end justify-center gap-x-2 sm:max-w-[min(70vw,32rem)] sm:gap-x-3">
            <div className="min-w-0 flex-1">
              <input
                id="event-input"
                name="event-input"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                placeholder={placeholder}
                className={`block w-full border-b border-[#169c76]/35 bg-transparent px-2 pb-2 text-center font-semibold italic leading-[1.02] tracking-[-0.07em] text-[#169c76] outline-none transition placeholder:text-[#169c76]/36 focus:border-[#169c76] dark:border-[#4ab494]/40 dark:text-[#4ab494] dark:placeholder:text-[#4ab494]/34 dark:focus:border-[#4ab494] ${valueSizeClasses.input}`}
              />
            </div>
            <span className={`shrink-0 leading-none text-[#169c76] dark:text-[#4ab494] ${valueSizeClasses.punctuation}`}>
              ?
            </span>
          </div>
        </div>
      </div>
      <button type="submit" className="sr-only">
        Calculate
      </button>
    </form>
  );
}
