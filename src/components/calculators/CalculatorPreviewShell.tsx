"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "../Brand";
import { CalculatorNavButton } from "../CalculatorNavButton";
import { ThemeToggle } from "../ThemeToggle";
import { countries, type CountryCode } from "../../lib/countries";
import { calculatorPages, type CalculatorKind } from "../../lib/calculatorPages";
import { getRegionsForCountry } from "../../lib/regions";
import {
  calculateAddOrSubtractDate,
  calculateBusinessDaysBetweenForCountry,
  calculateBusinessDaysUntilForCountry,
  calculateDaysBetween,
  calculateRetirementCountdown,
} from "../../lib/dateCalculators";

interface CalculatorPreviewShellProps {
  activeCalculator: CalculatorKind;
}

function CalculatorLinkRow({ activeCalculator }: { activeCalculator: CalculatorKind }) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {calculatorPages.map((calculatorLink) => (
        <Link
          key={calculatorLink.path}
          href={calculatorLink.path}
          className={
            calculatorLink.kind === activeCalculator
              ? "rounded-[1.05rem] border border-black/8 bg-[#eceae4] px-4 py-2.5 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] dark:border-white/10 dark:bg-[#232625] dark:text-white"
              : "rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 py-2.5 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:hover:bg-[#232625]"
          }
        >
          {calculatorLink.title.replace(" Calculator | DaysUntil", "")}
        </Link>
      ))}
    </div>
  );
}

function ResultCard({
  title,
  label,
  value,
  note,
  outputLabel = "Calculation",
  outputValue,
  mainDisplay,
  summaryLine,
  detailBlocks,
  liveTargetDateText,
}: {
  title: string;
  label: string;
  value: number;
  note: string;
  outputLabel?: string;
  outputValue?: string;
  mainDisplay?: string;
  summaryLine?: string;
  detailBlocks?: Array<{ label: string; value: string }>;
  liveTargetDateText?: string;
}) {
  const absoluteDays = Math.abs(value);
  const weeks = Math.floor(absoluteDays / 7);
  const remainingDays = absoluteDays % 7;
  const weeksSummary =
    remainingDays === 0
      ? `${weeks} ${weeks === 1 ? "week" : "weeks"}`
      : `${weeks} ${weeks === 1 ? "week" : "weeks"}, ${remainingDays} ${
          remainingDays === 1 ? "day" : "days"
        }`;
  const defaultDetailBlocks = [
    {
      label: "hrs",
      value: (absoluteDays * 24).toLocaleString("en-GB"),
    },
    {
      label: "min",
      value: (absoluteDays * 24 * 60).toLocaleString("en-GB"),
    },
    {
      label: "sec",
      value: (absoluteDays * 24 * 60 * 60).toLocaleString("en-GB"),
    },
  ];
  const resolvedMainDisplay = mainDisplay ?? String(value);
  const resolvedSummaryLine = summaryLine ?? weeksSummary;
  const [liveDetailBlocks, setLiveDetailBlocks] = useState<Array<{ label: string; value: string }> | null>(null);

  useEffect(() => {
    if (!liveTargetDateText) {
      setLiveDetailBlocks(null);
      return;
    }

    const match = liveTargetDateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
      setLiveDetailBlocks(null);
      return;
    }

    const [, yearText, monthText, dayText] = match;
    const targetDate = new Date(Number(yearText), Number(monthText) - 1, Number(dayText) + 1);

    function updateLiveBlocks() {
      const diffMs = targetDate.getTime() - Date.now();

      if (diffMs <= 0) {
        setLiveDetailBlocks(null);
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(diffMs / (60 * 1000));
      const totalHours = Math.floor(diffMs / (60 * 60 * 1000));

      setLiveDetailBlocks([
        { label: "hrs", value: totalHours.toLocaleString("en-GB") },
        { label: "min", value: totalMinutes.toLocaleString("en-GB") },
        { label: "sec", value: totalSeconds.toLocaleString("en-GB") },
      ]);
    }

    updateLiveBlocks();
    const intervalId = window.setInterval(updateLiveBlocks, 1000);

    return () => window.clearInterval(intervalId);
  }, [liveTargetDateText]);

  const resolvedDetailBlocks = detailBlocks ?? liveDetailBlocks ?? defaultDetailBlocks;

  return (
    <section
      aria-label="Calculator result"
      className="mx-auto mt-6 w-full max-w-[31.9rem] overflow-hidden rounded-[2rem] bg-[#fdfcf9] text-center ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:max-w-[34rem]"
    >
      <div className="bg-[#6495ED] px-6 py-5 text-white dark:bg-[#4b74be] sm:px-8">
        <div className="text-left">
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
              {outputLabel}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{outputValue ?? title}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-[2.84rem] sm:px-8 sm:py-[3.31rem]">
        <p className="text-xs uppercase tracking-[0.24em] text-black/42 dark:text-white/44">
          Calculation result
        </p>
        <div className="mt-7 border-b border-black/[0.05] pb-8 dark:border-white/8">
          <p className="text-[clamp(4.35rem,22vw,5.5rem)] font-semibold leading-none tracking-[-0.08em] text-black dark:text-white sm:text-[7.3rem]">
            {resolvedMainDisplay}
          </p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-black/42 dark:text-white/42">
            {label}
          </p>
          {resolvedSummaryLine ? (
            <p className="mt-5 font-mono text-sm font-medium tabular-nums tracking-[-0.01em] text-black/56 dark:text-white/58 sm:text-[1rem]">
              {resolvedSummaryLine}
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex justify-center">
          <div
            className={`flex flex-wrap justify-center gap-x-4 gap-y-5 min-[380px]:gap-x-6 sm:grid sm:gap-10 ${
              resolvedDetailBlocks.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"
            }`}
          >
            {resolvedDetailBlocks.map((timeBlock) => (
              <div
                key={timeBlock.label}
                className="min-w-[5.2rem] basis-[5.2rem] text-center sm:min-w-[4rem] sm:basis-auto sm:-translate-x-2"
              >
                <p className="font-mono text-lg font-semibold tabular-nums tracking-[0.01em] text-black dark:text-white min-[380px]:text-xl sm:text-2xl">
                  {timeBlock.value}
                </p>
                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-black/22 dark:text-white/28 sm:text-[10px]">
                  {timeBlock.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 text-sm leading-6 text-black/54 dark:text-white/56">{note}</p>
      </div>
    </section>
  );
}

function formatResultDate(dateText: string) {
  const [year, month, day] = dateText.split("-").map(Number);

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function getAddSubtractSummaryLine(
  amount: number,
  unit: "days" | "weeks" | "months" | "years",
) {
  const years = unit === "years" ? amount : 0;
  const months = unit === "months" ? amount : 0;
  const weeks = unit === "weeks" ? amount : 0;
  const days = unit === "days" ? amount : 0;

  return `${years} years, ${months} months, ${weeks} weeks, ${days} days`;
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-black/68 dark:text-white/68">
      <span className="font-medium">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 rounded-[1rem] border border-black/8 bg-white px-4 text-sm text-black outline-none transition focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 dark:border-white/12 dark:bg-[#111111] dark:text-white dark:focus:border-[#6495ED] dark:focus:ring-[#6495ED]/25"
      />
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (nextValue: T) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-black/68 dark:text-white/68">
      <span className="font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-11 rounded-[1rem] border border-black/8 bg-white px-4 text-sm text-black outline-none transition focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 dark:border-white/12 dark:bg-[#111111] dark:text-white dark:focus:border-[#6495ED] dark:focus:ring-[#6495ED]/25"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-black/68 dark:text-white/68">
      <span className="font-medium">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-[1rem] border border-black/8 bg-white px-4 text-sm text-black outline-none transition focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 dark:border-white/12 dark:bg-[#111111] dark:text-white dark:focus:border-[#6495ED] dark:focus:ring-[#6495ED]/25"
      />
    </label>
  );
}

function CountryField({
  value,
  onChange,
}: {
  value: CountryCode;
  onChange: (nextValue: CountryCode) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-black/68 dark:text-white/68">
      <span className="font-medium">Country</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CountryCode)}
        className="h-11 rounded-[1rem] border border-black/8 bg-white px-4 text-sm text-black outline-none transition focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 dark:border-white/12 dark:bg-[#111111] dark:text-white dark:focus:border-[#6495ED] dark:focus:ring-[#6495ED]/25"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function getDefaultRegionId(countryCode: CountryCode) {
  return getRegionsForCountry(countryCode)[0]?.id ?? "";
}

function RegionField({
  countryCode,
  value,
  onChange,
}: {
  countryCode: CountryCode;
  value: string;
  onChange: (nextValue: string) => void;
}) {
  const regions = getRegionsForCountry(countryCode);

  return (
    <label className="flex flex-col gap-2 text-sm text-black/68 dark:text-white/68">
      <span className="font-medium">Region/State</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-[1rem] border border-black/8 bg-white px-4 text-sm text-black outline-none transition focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 dark:border-white/12 dark:bg-[#111111] dark:text-white dark:focus:border-[#6495ED] dark:focus:ring-[#6495ED]/25"
      >
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function DaysBetweenCalculator() {
  const [startDate, setStartDate] = useState("2026-03-23");
  const [endDate, setEndDate] = useState("2026-12-31");
  const result = calculateDaysBetween(startDate, endDate);

  return (
    <>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58">
        Calculate the raw calendar-day difference between any two dates with a simple date-to-date
        comparison.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <DateField label="Start date" value={startDate} onChange={setStartDate} />
        <DateField label="End date" value={endDate} onChange={setEndDate} />
      </div>
      {result !== null ? (
        <ResultCard
          title="Days between dates"
          value={result}
          label="calendar days between the selected dates"
          liveTargetDateText={endDate}
          note="This uses the pure calendar-date difference between the start and end dates. Negative values mean the end date is before the start date."
        />
      ) : null}
    </>
  );
}

function BusinessDaysUntilCalculator() {
  const [targetDate, setTargetDate] = useState("2026-12-31");
  const [countryCode, setCountryCode] = useState<CountryCode>("au");
  const [regionId, setRegionId] = useState(getDefaultRegionId("au"));
  const result = calculateBusinessDaysUntilForCountry(targetDate, countryCode, regionId);

  function handleCountryChange(nextCountryCode: CountryCode) {
    setCountryCode(nextCountryCode);
    setRegionId(getDefaultRegionId(nextCountryCode));
  }

  return (
    <>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58">
        Calculate the business days remaining until a target date, excluding weekends and public
        holidays for the selected country or region where available.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <CountryField value={countryCode} onChange={handleCountryChange} />
        <RegionField countryCode={countryCode} value={regionId} onChange={setRegionId} />
        <DateField label="Target date" value={targetDate} onChange={setTargetDate} />
      </div>
      {result !== null ? (
        <ResultCard
          title="Business days until"
          value={result.businessDays}
          label="business days remaining until the target date"
          liveTargetDateText={targetDate}
          note="This excludes weekends and uses region or state public holidays where available, with a country-level fallback where regional data is not available."
        />
      ) : null}
    </>
  );
}

function BusinessDaysBetweenCalculator() {
  const [startDate, setStartDate] = useState("2026-03-23");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [countryCode, setCountryCode] = useState<CountryCode>("au");
  const [regionId, setRegionId] = useState(getDefaultRegionId("au"));
  const result = calculateBusinessDaysBetweenForCountry(startDate, endDate, countryCode, regionId);

  function handleCountryChange(nextCountryCode: CountryCode) {
    setCountryCode(nextCountryCode);
    setRegionId(getDefaultRegionId(nextCountryCode));
  }

  return (
    <>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58">
        Calculate the business days between two dates, excluding weekends and public holidays for
        the selected country or region where available.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-4">
        <CountryField value={countryCode} onChange={handleCountryChange} />
        <RegionField countryCode={countryCode} value={regionId} onChange={setRegionId} />
        <DateField label="Start date" value={startDate} onChange={setStartDate} />
        <DateField label="End date" value={endDate} onChange={setEndDate} />
      </div>
      {result !== null ? (
        <ResultCard
          title="Business days between"
          value={result.businessDays}
          label="business days between the selected dates"
          liveTargetDateText={endDate}
          note="This excludes weekends and uses region or state public holidays where available, with a country-level fallback where regional data is not available."
        />
      ) : null}
    </>
  );
}

function AddOrSubtractDateCalculator() {
  const [startDate, setStartDate] = useState("2026-03-24");
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState(30);
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const result = calculateAddOrSubtractDate(startDate, mode, amount, unit);

  return (
    <>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58">
        Add to or subtract from a date using a simple combination of start date, direction, amount,
        and unit.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <DateField label="Start date" value={startDate} onChange={setStartDate} />
        <SelectField
          label="Add/Subtract"
          value={mode}
          onChange={setMode}
          options={[
            { value: "add", label: "Add" },
            { value: "subtract", label: "Subtract" },
          ]}
        />
        <NumberField label="Amount" value={amount} onChange={setAmount} />
        <SelectField
          label="Unit"
          value={unit}
          onChange={setUnit}
          options={[
            { value: "days", label: "Days" },
            { value: "weeks", label: "Weeks" },
            { value: "months", label: "Months" },
            { value: "years", label: "Years" },
          ]}
        />
      </div>
      {result !== null ? (
        <ResultCard
          title="Add or subtract date"
          value={Math.abs(result.dayDifference)}
          mainDisplay={formatResultDate(result.resultDate)}
          outputLabel="Resulting date"
          outputValue={result.resultLabel}
          label={`${mode === "add" ? "added" : "subtracted"} ${amount} ${unit} from the selected date`}
          summaryLine={getAddSubtractSummaryLine(amount, unit)}
          liveTargetDateText={result.resultDate}
          note={`${amount} ${unit} ${mode === "add" ? "from" : "before"} the selected date lands on ${result.resultLabel}. This calculator treats the change as a calendar-date operation, not a business-day calculation.`}
        />
      ) : null}
    </>
  );
}

function RetirementCountdownCalculator() {
  const [dateOfBirth, setDateOfBirth] = useState("1990-04-01");
  const [retirementAge, setRetirementAge] = useState(67);
  const result = calculateRetirementCountdown(dateOfBirth, retirementAge);

  return (
    <>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58">
        Enter your date of birth and the retirement age you want to use. This calculator
        works out the retirement date based only on the age you enter and shows the time
        remaining in years, months, days, and a live countdown.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <DateField label="Date of birth" value={dateOfBirth} onChange={setDateOfBirth} />
        <NumberField label="Retirement age" value={retirementAge} onChange={setRetirementAge} />
      </div>
      {result !== null ? (
        <ResultCard
          title="Days until I retire"
          value={Math.max(result.daysRemaining, 0)}
          mainDisplay={formatResultDate(result.retirementDate)}
          outputLabel="Retirement date"
          outputValue={result.retirementLabel}
          label="days remaining until retirement"
          summaryLine={`${result.yearsRemaining} years, ${result.monthsRemaining} months, ${result.extraDaysRemaining} days`}
          liveTargetDateText={result.retirementDate}
          note={`Based on the retirement age you entered, your retirement date is ${result.retirementLabel}. This is a personal planning calculator and does not use any official retirement rules.`}
        />
      ) : null}
    </>
  );
}

export function CalculatorPreviewShell({ activeCalculator }: CalculatorPreviewShellProps) {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm tracking-[0.24em] text-black/50 transition hover:text-black dark:text-white/72 dark:hover:text-white"
          >
            <Brand variant="horizontal" height={55} className="h-[55px] w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <CalculatorNavButton />
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-[1.05rem] border border-black/6 bg-[#f3f2ee] px-4 text-sm font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:bg-[#eceae4] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#169c76]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-[#1d1f1e] dark:text-white/88 dark:shadow-[0_1px_2px_rgba(0,0,0,0.18)] dark:hover:bg-[#232625] dark:focus-visible:ring-[#4ab494]/28 dark:focus-visible:ring-offset-[#0d0d0d]"
            >
              Home
            </Link>
          </div>
        </div>
        <section className="mt-20 flex w-full flex-1 flex-col items-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42 dark:text-white/44">
            Calculators
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            Date calculators
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/58 sm:text-base">
            Date calculators for working out calendar-day differences, business-day counts, and
            date adjustments using the same clean format as the rest of the site.
          </p>
          <CalculatorLinkRow activeCalculator={activeCalculator} />
          <div className="mt-10 w-full max-w-3xl rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8">
            <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
              {activeCalculator === "days-between"
                ? "Days between dates"
                : activeCalculator === "business-days-between"
                  ? "Business days between dates"
                  : activeCalculator === "business-days-until"
                    ? "Business days until a date"
                    : activeCalculator === "add-or-subtract-date"
                      ? "Add or subtract date"
                      : "Days until I retire"}
            </h2>
            {activeCalculator === "days-between" ? <DaysBetweenCalculator /> : null}
            {activeCalculator === "business-days-between" ? <BusinessDaysBetweenCalculator /> : null}
            {activeCalculator === "business-days-until" ? <BusinessDaysUntilCalculator /> : null}
            {activeCalculator === "add-or-subtract-date" ? <AddOrSubtractDateCalculator /> : null}
            {activeCalculator === "days-until-i-retire" ? <RetirementCountdownCalculator /> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
