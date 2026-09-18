"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "../Brand";
import { CalendarExportMenu } from "../CalendarExportMenu";
import { CalculatorNavButton } from "../CalculatorNavButton";
import { CopyResultLinkButton } from "../CopyResultLinkButton";
import { BusinessDayExplanation } from "./BusinessDayExplanation";
import { CountdownLinkList, type CountdownLinkItem } from "../CountdownLinkList";
import { ThemeToggle } from "../ThemeToggle";
import { countries, type CountryCode } from "../../lib/countries";
import {
  calculatorPages,
  getCalculatorPage,
  type CalculatorKind,
  type CalculatorPageContent,
} from "../../lib/calculatorPages";
import { getRegionsForCountry } from "../../lib/regions";
import {
  calculateAddOrSubtractDate,
  calculateBusinessDaysBetweenForCountry,
  calculateBusinessDaysUntilForCountry,
  calculateDaysBetween,
  calculateRetirementCountdown,
} from "../../lib/dateCalculators";
import {
  buildCalculatorSharePath,
  getDefaultCalculatorRegionId,
  type CalculatorInitialValues,
} from "../../lib/calculatorShare";
import type { AllDayCalendarEvent } from "../../lib/calendarEvent";

interface CalculatorPreviewShellProps {
  activeCalculator: CalculatorKind;
  initialValues: CalculatorInitialValues;
}

const SITE_URL = "https://daysuntil.is";

function createResultCalendarEvent(
  title: string,
  date: string,
  description: string,
  sharePath: string,
  fileName: string,
): AllDayCalendarEvent {
  return {
    title,
    date,
    description,
    url: `${SITE_URL}${sharePath}`,
    fileName,
  };
}

const calculatorNextSteps: Record<
  CalculatorKind,
  { description: string; links: CountdownLinkItem[] }
> = {
  "days-between": {
    description:
      "Use the calendar-day result in a working-day comparison, an annual plan, or a live event countdown.",
    links: [
      { href: "/calendar-days-vs-business-days", label: "Calendar days vs business days" },
      { href: "/business-days-between-dates", label: "Compare the same dates in business days" },
      { href: "/year-planner", label: "Plan the rest of the year" },
      { href: "/days-until-christmas", label: "See the live Christmas countdown" },
    ],
  },
  "business-days-between": {
    description:
      "Compare the working-day result with calendar days or use the remaining year as a planning baseline.",
    links: [
      { href: "/calendar-days-vs-business-days", label: "Understand calendar and business days" },
      { href: "/days-between-dates", label: "Compare the same dates in calendar days" },
      { href: "/working-days-left-this-year", label: "Working days left this year" },
      { href: "/year-planner", label: "Open the year planner" },
    ],
  },
  "business-days-until": {
    description:
      "Put the result into a broader year plan or compare it with the larger calendar-day countdown.",
    links: [
      { href: "/working-days-left-this-year", label: "Working days left this year" },
      { href: "/calendar-days-vs-business-days", label: "Why the two day counts differ" },
      { href: "/days-between-dates", label: "Calculate the calendar-day difference" },
      { href: "/fridays-left-this-year", label: "Fridays left this year" },
    ],
  },
  "add-or-subtract-date": {
    description:
      "Check the resulting date against another milestone, or learn how month ends and leap years affect date movement.",
    links: [
      { href: "/days-between-dates", label: "Compare the resulting date" },
      { href: "/how-leap-years-affect-date-calculations", label: "How leap years affect date calculations" },
      { href: "/countdown-widget", label: "Build a countdown for the resulting date" },
      { href: "/year-planner", label: "Open the year planner" },
    ],
  },
  "days-until-i-retire": {
    description:
      "Use the estimated retirement date in another calculator or turn it into a countdown you can revisit.",
    links: [
      { href: "/days-between-dates", label: "Compare your retirement date" },
      { href: "/countdown-widget", label: "Build a retirement countdown widget" },
      { href: "/year-planner", label: "Open the year planner" },
      { href: "/add-or-subtract-date", label: "Test a different milestone date" },
    ],
  },
};

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

function CalculatorContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 w-full max-w-3xl rounded-[2rem] bg-[#fdfcf9] px-6 py-7 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8">
      <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-6 text-black/62 dark:text-white/64 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function CalculatorEditorialSections({ page }: { page: CalculatorPageContent }) {
  return (
    <>
      <CalculatorContentSection title="What this calculator does">
        <p>{page.summary}</p>
      </CalculatorContentSection>
      <CalculatorContentSection title="How it works">
        <ul className="space-y-3">
          {page.howItWorks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CalculatorContentSection>
      <CalculatorContentSection title="When to use it">
        <ul className="space-y-3">
          {page.useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CalculatorContentSection>
      <CalculatorContentSection title={page.example.title}>
        <p>{page.example.body}</p>
      </CalculatorContentSection>
      <CalculatorContentSection title="Things to watch for">
        <ul className="space-y-3">
          {page.watchFor.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CalculatorContentSection>
    </>
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
  sharePath,
  calendarEvent,
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
  sharePath: string;
  calendarEvent?: AllDayCalendarEvent;
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
  const [liveDetailState, setLiveDetailState] = useState<{
    targetDateText: string;
    blocks: Array<{ label: string; value: string }> | null;
  } | null>(null);

  useEffect(() => {
    if (!liveTargetDateText) {
      return;
    }

    const resolvedTargetDateText = liveTargetDateText;

    const match = resolvedTargetDateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
      return;
    }

    const [, yearText, monthText, dayText] = match;
    const targetDate = new Date(Number(yearText), Number(monthText) - 1, Number(dayText) + 1);

    function updateLiveBlocks() {
      const diffMs = targetDate.getTime() - Date.now();

      if (diffMs <= 0) {
        setLiveDetailState({ targetDateText: resolvedTargetDateText, blocks: null });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(diffMs / (60 * 1000));
      const totalHours = Math.floor(diffMs / (60 * 60 * 1000));

      setLiveDetailState({
        targetDateText: resolvedTargetDateText,
        blocks: [
          { label: "hrs", value: totalHours.toLocaleString("en-GB") },
          { label: "min", value: totalMinutes.toLocaleString("en-GB") },
          { label: "sec", value: totalSeconds.toLocaleString("en-GB") },
        ],
      });
    }

    const intervalId = window.setInterval(updateLiveBlocks, 1000);

    return () => window.clearInterval(intervalId);
  }, [liveTargetDateText]);

  const liveDetailBlocks =
    liveDetailState && liveDetailState.targetDateText === liveTargetDateText
      ? liveDetailState.blocks
      : null;
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
        <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-black/7 pt-6 dark:border-white/9">
          <CopyResultLinkButton path={sharePath} />
          {calendarEvent ? <CalendarExportMenu event={calendarEvent} /> : null}
        </div>
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

function DaysBetweenCalculator({ initialValues }: { initialValues: CalculatorInitialValues }) {
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.endDate);
  const result = calculateDaysBetween(startDate, endDate);
  const sharePath = buildCalculatorSharePath("days-between", {
    ...initialValues,
    startDate,
    endDate,
  });

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
          sharePath={sharePath}
          calendarEvent={createResultCalendarEvent(
            "Selected end date",
            endDate,
            `End date from a ${Math.abs(result)}-day calendar comparison.`,
            sharePath,
            `date-comparison-${endDate}`,
          )}
          note="This uses the pure calendar-date difference between the start and end dates. Negative values mean the end date is before the start date."
        />
      ) : null}
    </>
  );
}

function BusinessDaysUntilCalculator({
  initialValues,
}: {
  initialValues: CalculatorInitialValues;
}) {
  const [targetDate, setTargetDate] = useState(initialValues.targetDate);
  const [countryCode, setCountryCode] = useState<CountryCode>(initialValues.countryCode);
  const [regionId, setRegionId] = useState(initialValues.regionId);
  const result = calculateBusinessDaysUntilForCountry(targetDate, countryCode, regionId);
  const sharePath = buildCalculatorSharePath("business-days-until", {
    ...initialValues,
    targetDate,
    countryCode,
    regionId,
  });

  function handleCountryChange(nextCountryCode: CountryCode) {
    setCountryCode(nextCountryCode);
    setRegionId(getDefaultCalculatorRegionId(nextCountryCode));
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
          sharePath={sharePath}
          calendarEvent={createResultCalendarEvent(
            "Business-day target date",
            targetDate,
            `${Math.abs(result.businessDays)} business days from the selected starting point.`,
            sharePath,
            `business-day-target-${targetDate}`,
          )}
          note="This excludes weekends and uses region or state public holidays where available, with a country-level fallback where regional data is not available."
        />
      ) : null}
      {result ? <BusinessDayExplanation end={targetDate} countryCode={countryCode} regionId={regionId} /> : null}
    </>
  );
}

function BusinessDaysBetweenCalculator({
  initialValues,
}: {
  initialValues: CalculatorInitialValues;
}) {
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.endDate);
  const [countryCode, setCountryCode] = useState<CountryCode>(initialValues.countryCode);
  const [regionId, setRegionId] = useState(initialValues.regionId);
  const result = calculateBusinessDaysBetweenForCountry(startDate, endDate, countryCode, regionId);
  const sharePath = buildCalculatorSharePath("business-days-between", {
    ...initialValues,
    startDate,
    endDate,
    countryCode,
    regionId,
  });

  function handleCountryChange(nextCountryCode: CountryCode) {
    setCountryCode(nextCountryCode);
    setRegionId(getDefaultCalculatorRegionId(nextCountryCode));
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
          sharePath={sharePath}
          calendarEvent={createResultCalendarEvent(
            "Selected business-day end date",
            endDate,
            `${Math.abs(result.businessDays)} business days from the selected start date.`,
            sharePath,
            `business-day-comparison-${endDate}`,
          )}
          note="This excludes weekends and uses region or state public holidays where available, with a country-level fallback where regional data is not available."
        />
      ) : null}
      {result ? <BusinessDayExplanation start={startDate} end={endDate} countryCode={countryCode} regionId={regionId} /> : null}
    </>
  );
}

function AddOrSubtractDateCalculator({
  initialValues,
}: {
  initialValues: CalculatorInitialValues;
}) {
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [mode, setMode] = useState<"add" | "subtract">(initialValues.mode);
  const [amount, setAmount] = useState(initialValues.amount);
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">(
    initialValues.unit,
  );
  const result = calculateAddOrSubtractDate(startDate, mode, amount, unit);
  const sharePath = buildCalculatorSharePath("add-or-subtract-date", {
    ...initialValues,
    startDate,
    mode,
    amount,
    unit,
  });

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
          sharePath={sharePath}
          calendarEvent={createResultCalendarEvent(
            "Calculated date",
            result.resultDate,
            `${amount} ${unit} ${mode === "add" ? "after" : "before"} ${startDate}.`,
            sharePath,
            `calculated-date-${result.resultDate}`,
          )}
          note={`${amount} ${unit} ${mode === "add" ? "from" : "before"} the selected date lands on ${result.resultLabel}. This calculator treats the change as a calendar-date operation, not a business-day calculation.`}
        />
      ) : null}
    </>
  );
}

function RetirementCountdownCalculator({
  initialValues,
}: {
  initialValues: CalculatorInitialValues;
}) {
  const [dateOfBirth, setDateOfBirth] = useState(initialValues.dateOfBirth);
  const [retirementAge, setRetirementAge] = useState(initialValues.retirementAge);
  const result = calculateRetirementCountdown(dateOfBirth, retirementAge);
  const sharePath = buildCalculatorSharePath("days-until-i-retire", {
    ...initialValues,
    dateOfBirth,
    retirementAge,
  });

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
          sharePath={sharePath}
          calendarEvent={createResultCalendarEvent(
            "Retirement target date",
            result.retirementDate,
            `Personal retirement target based on age ${retirementAge}.`,
            sharePath,
            `retirement-target-${result.retirementDate}`,
          )}
          note={`Based on the retirement age you entered, your retirement date is ${result.retirementLabel}. This is a personal planning calculator and does not use any official retirement rules.`}
        />
      ) : null}
    </>
  );
}

export function CalculatorPreviewShell({
  activeCalculator,
  initialValues,
}: CalculatorPreviewShellProps) {
  const activeCalculatorPage = getCalculatorPage(activeCalculator);

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
            {activeCalculator === "days-between" ? (
              <DaysBetweenCalculator initialValues={initialValues} />
            ) : null}
            {activeCalculator === "business-days-between" ? (
              <BusinessDaysBetweenCalculator initialValues={initialValues} />
            ) : null}
            {activeCalculator === "business-days-until" ? (
              <BusinessDaysUntilCalculator initialValues={initialValues} />
            ) : null}
            {activeCalculator === "add-or-subtract-date" ? (
              <AddOrSubtractDateCalculator initialValues={initialValues} />
            ) : null}
            {activeCalculator === "days-until-i-retire" ? (
              <RetirementCountdownCalculator initialValues={initialValues} />
            ) : null}
          </div>
          <CalculatorEditorialSections page={activeCalculatorPage} />
          <CountdownLinkList
            title="Continue planning"
            description={calculatorNextSteps[activeCalculator].description}
            links={calculatorNextSteps[activeCalculator].links}
            centered
          />
        </section>
      </div>
    </main>
  );
}
