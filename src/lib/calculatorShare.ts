import type { Metadata } from "next";
import { getCalculatorPage, type CalculatorKind } from "./calculatorPages";
import { getCountryByCode, type CountryCode } from "./countries";
import { getRegionsForCountry } from "./regions";

export type CalculatorQueryParams = Record<string, string | string[] | undefined>;

export interface CalculatorSearchPageProps {
  searchParams: Promise<CalculatorQueryParams>;
}

export interface CalculatorInitialValues {
  startDate: string;
  endDate: string;
  targetDate: string;
  countryCode: CountryCode;
  regionId: string;
  mode: "add" | "subtract";
  amount: number;
  unit: "days" | "weeks" | "months" | "years";
  dateOfBirth: string;
  retirementAge: number;
}

const calculatorQueryKeys = new Set([
  "start",
  "end",
  "target",
  "country",
  "region",
  "mode",
  "amount",
  "unit",
  "dob",
  "age",
]);

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateInput(date: Date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isValidDateInput(value: string | undefined) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    year >= 1900 &&
    year <= 2100 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function parseInteger(value: string | undefined, fallback: number, minimum: number, maximum: number) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

export function getDefaultCalculatorRegionId(countryCode: CountryCode) {
  return getRegionsForCountry(countryCode)[0]?.id ?? "";
}

export function getDefaultCalculatorValues(now: Date = new Date()): CalculatorInitialValues {
  const today = formatDateInput(now);

  return {
    startDate: today,
    endDate: `${now.getFullYear()}-12-31`,
    targetDate: `${now.getFullYear()}-12-31`,
    countryCode: "au",
    regionId: getDefaultCalculatorRegionId("au"),
    mode: "add",
    amount: 30,
    unit: "days",
    dateOfBirth: "1990-04-01",
    retirementAge: 67,
  };
}

export function parseCalculatorSearchParams(
  searchParams: CalculatorQueryParams,
  now: Date = new Date(),
): CalculatorInitialValues {
  const defaults = getDefaultCalculatorValues(now);
  const start = getSingleParam(searchParams.start);
  const end = getSingleParam(searchParams.end);
  const target = getSingleParam(searchParams.target);
  const dateOfBirth = getSingleParam(searchParams.dob);
  const requestedCountry = getSingleParam(searchParams.country);
  const country = getCountryByCode(requestedCountry ?? "")?.code ?? defaults.countryCode;
  const availableRegions = getRegionsForCountry(country);
  const requestedRegion = getSingleParam(searchParams.region);
  const region =
    availableRegions.find((candidate) => candidate.id === requestedRegion)?.id ??
    getDefaultCalculatorRegionId(country);
  const requestedMode = getSingleParam(searchParams.mode);
  const requestedUnit = getSingleParam(searchParams.unit);

  return {
    startDate: isValidDateInput(start) ? start! : defaults.startDate,
    endDate: isValidDateInput(end) ? end! : defaults.endDate,
    targetDate: isValidDateInput(target) ? target! : defaults.targetDate,
    countryCode: country,
    regionId: region,
    mode: requestedMode === "subtract" ? "subtract" : "add",
    amount: parseInteger(getSingleParam(searchParams.amount), defaults.amount, 0, 10_000),
    unit:
      requestedUnit === "weeks" || requestedUnit === "months" || requestedUnit === "years"
        ? requestedUnit
        : "days",
    dateOfBirth: isValidDateInput(dateOfBirth) ? dateOfBirth! : defaults.dateOfBirth,
    retirementAge: parseInteger(
      getSingleParam(searchParams.age),
      defaults.retirementAge,
      1,
      100,
    ),
  };
}

export function buildCalculatorSharePath(
  kind: CalculatorKind,
  values: CalculatorInitialValues,
) {
  const params = new URLSearchParams();

  if (kind === "days-between") {
    params.set("start", values.startDate);
    params.set("end", values.endDate);
  } else if (kind === "business-days-between") {
    params.set("start", values.startDate);
    params.set("end", values.endDate);
    params.set("country", values.countryCode);
    params.set("region", values.regionId);
  } else if (kind === "business-days-until") {
    params.set("target", values.targetDate);
    params.set("country", values.countryCode);
    params.set("region", values.regionId);
  } else if (kind === "add-or-subtract-date") {
    params.set("start", values.startDate);
    params.set("mode", values.mode);
    params.set("amount", String(values.amount));
    params.set("unit", values.unit);
  } else {
    params.set("dob", values.dateOfBirth);
    params.set("age", String(values.retirementAge));
  }

  return `${getCalculatorPage(kind).path}?${params.toString()}`;
}

export function hasCalculatorShareParams(searchParams: CalculatorQueryParams) {
  return Object.entries(searchParams).some(
    ([key, value]) => calculatorQueryKeys.has(key) && getSingleParam(value) !== undefined,
  );
}

export function applyCalculatorShareRobots(
  metadata: Metadata,
  searchParams: CalculatorQueryParams,
): Metadata {
  if (!hasCalculatorShareParams(searchParams)) {
    return metadata;
  }

  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
    },
  };
}
