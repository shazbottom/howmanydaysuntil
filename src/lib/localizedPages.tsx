import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryHubPage } from "../components/CountryHubPage";
import { LocalizedCountdownPage } from "../components/LocalizedCountdownPage";
import { countries, getCountryByCode, type CountryCode } from "./countries";
import {
  getLocalizedEventCanonicalPath,
  getLocalizedEventsForCountry,
} from "./events";
import {
  getCountryTodayLabel,
  getLocalizedCountdownPageData,
  getLocalizedEventLinksForCountry,
} from "./localizedCountdowns";

export function getLocalizedCountryCodes(): CountryCode[] {
  return countries.map((country) => country.code);
}

export function renderCountryHub(countryCode: CountryCode) {
  const country = getCountryByCode(countryCode);

  if (!country) {
    notFound();
  }

  return (
    <CountryHubPage
      country={country}
      todayLabel={getCountryTodayLabel(country)}
      eventLinks={getLocalizedEventLinksForCountry(countryCode)}
    />
  );
}

export function getCountryHubMetadata(countryCode: CountryCode): Metadata {
  const country = getCountryByCode(countryCode);

  if (!country) {
    return {
      title: "Country Countdown Not Found | DaysUntil",
      description: "The requested country countdown page could not be found.",
    };
  }

  return {
    title: `${country.name} Countdown Hub | DaysUntil`,
    description: `Browse countdown pages for ${country.name}, including regional events and global holidays.`,
    alternates: {
      canonical: `/${country.code}`,
    },
  };
}

export function getCountryEventStaticParams(countryCode: CountryCode) {
  return getLocalizedEventsForCountry(countryCode).map((event) => ({
    event: event.slug,
  }));
}

export function getCountryEventMetadata(
  countryCode: CountryCode,
  eventSlug: string,
): Metadata {
  const data = getLocalizedCountdownPageData(countryCode, eventSlug);

  if (!data) {
    return {
      title: "Localized Countdown Not Found | DaysUntil",
      description: "The requested localized countdown page could not be found.",
    };
  }

  return {
    title: `How many days until ${data.event.displayName} in ${data.country.name}? | DaysUntil`,
    description: `Find out how many days until ${data.event.displayName} in ${data.country.name} with a live countdown.`,
    alternates: {
      canonical: getLocalizedEventCanonicalPath(data.country.code, data.event),
    },
  };
}

export function renderCountryEventPage(countryCode: CountryCode, eventSlug: string) {
  const data = getLocalizedCountdownPageData(countryCode, eventSlug);

  if (!data) {
    notFound();
  }

  return <LocalizedCountdownPage data={data} />;
}
