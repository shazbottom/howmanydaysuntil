"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EventInput } from "./EventInput";
import { parseInput } from "../lib/parseInput";
import type { CountryCode } from "../lib/countries";

interface CountryHubDateInputProps {
  countryCode: CountryCode;
}

export function CountryHubDateInput({ countryCode }: CountryHubDateInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function submit(nextValue: string) {
    const result = parseInput(nextValue);

    if (result.type !== "date") {
      setError("Enter an exact date such as 25 Dec 2026.");
      return;
    }

    setError(null);
    router.push(`/${countryCode}/days-until/${result.value.isoDate}`);
  }

  return (
    <div className="mt-6 w-full">
      <EventInput
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue);
          if (error) {
            setError(null);
          }
        }}
        onSubmit={() => submit(value)}
        onDatePick={(nextDate) => submit(nextDate)}
        placeholder="Try 25 Dec 2026"
        submitButtonLabel="How many days until?"
        variant="compact"
      />
      {error ? (
        <p className="mt-3 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
