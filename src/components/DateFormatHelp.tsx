"use client";

import { useEffect, useRef, useState } from "react";

export interface DateFormatHelpProps {
  onDatePick: (value: string) => void;
  onClear: () => void;
  hasValue: boolean;
}

export function DateFormatHelp({
  onDatePick,
  onClear,
  hasValue,
}: DateFormatHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <div className="mt-4 flex flex-col items-center gap-y-1.5 text-center text-xs text-black/38">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Try:</span>
          <span>25 Dec 2026</span>
          <span aria-hidden="true">&middot;</span>
          <span>2026-12-25</span>
          <span aria-hidden="true">&middot;</span>
          <span>25/12/26</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="underline decoration-black/18 underline-offset-4 transition hover:text-black hover:decoration-black/40"
          >
            Accepted formats
          </button>
          <span aria-hidden="true">&middot;</span>
          <button
            type="button"
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
            className="underline decoration-black/18 underline-offset-4 transition hover:text-black hover:decoration-black/40"
          >
            Pick a date
          </button>
          {hasValue ? (
            <>
              <span aria-hidden="true">&middot;</span>
              <button
                type="button"
                onClick={onClear}
                className="underline decoration-black/18 underline-offset-4 transition hover:text-black hover:decoration-black/40"
              >
                Clear
              </button>
            </>
          ) : null}
        </div>
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
      </div>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="date-format-title"
            className="w-full max-w-md rounded-[1.5rem] bg-white p-6 text-left ring-1 ring-black/8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="date-format-title"
                  className="text-lg font-semibold tracking-tight text-black"
                >
                  Accepted date formats
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm text-black/45 transition hover:text-black"
              >
                Close
              </button>
            </div>
            <div className="mt-5 space-y-5 text-sm text-black/72">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-black/42">
                  ISO
                </h3>
                <p className="mt-2">2026-12-25</p>
                <p>26-12-25</p>
              </section>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-black/42">
                  Day-first numeric
                </h3>
                <p className="mt-2">25/12/2026 or 25/12/26</p>
                <p>25-12-2026 or 25-12-26</p>
              </section>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-black/42">
                  Month name
                </h3>
                <p className="mt-2">25 Dec 2026</p>
                <p>25 December 2026</p>
                <p>Dec 25 2026</p>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
