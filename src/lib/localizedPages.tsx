import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryHubPage } from "../components/CountryHubPage";
import { LocalizedDateCountdownPage } from "../components/LocalizedDateCountdownPage";
import { LocalizedCountdownPage } from "../components/LocalizedCountdownPage";
import { countries, getCountryByCode, type CountryCode } from "./countries";
import { getCanonicalUrl, getLocalizedEventsForCountry } from "./events";
import { getCountryReferenceData } from "./countryData";
import { getRegionsForCountry } from "./regions";
import {
  getCountryTodayLabel,
  getLocalizedCountdownPageData,
  getLocalizedDateCountdownPageData,
  getPopularLocalizedEventLinksForCountry,
} from "./localizedCountdowns";

export function getLocalizedCountryCodes(): CountryCode[] {
  return countries.map((country) => country.code);
}

export function renderCountryHub(countryCode: CountryCode) {
  const country = getCountryByCode(countryCode);

  if (!country) {
    notFound();
  }

  const currentYear = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: country.timezone,
      year: "numeric",
    }).format(new Date()),
  );

  return (
    <CountryHubPage
      country={country}
      todayLabel={getCountryTodayLabel(country)}
      popularLinks={getPopularLocalizedEventLinksForCountry(countryCode)}
      currentYear={currentYear}
      nationalHolidayRows={getCountryReferenceData(countryCode, currentYear)}
      regionLinks={getRegionsForCountry(countryCode)}
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

  const currentYear = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: country.timezone,
      year: "numeric",
    }).format(new Date()),
  );

  return {
    title: `Public holidays in ${country.name} ${currentYear} | DaysUntil`,
    description: `Check public holidays in ${country.name} for ${currentYear}, with regional pages for local holidays and school term dates.`,
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
  const dateData = getLocalizedDateCountdownPageData(countryCode, eventSlug);

  if (dateData) {
    return {
      title: `How many days until ${dateData.targetDateLabel} in ${dateData.country.name}? | DaysUntil`,
      description: `Find out how many days until ${dateData.targetDateLabel} in ${dateData.country.name} with a live countdown.`,
      alternates: {
        canonical: `/${dateData.country.code}/days-until/${dateData.dateSlug}`,
      },
    };
  }

  const data = getLocalizedCountdownPageData(countryCode, eventSlug);

  if (!data) {
    return {
      title: "Localized Countdown Not Found | DaysUntil",
      description: "The requested localized countdown page could not be found.",
    };
  }

  const currentUrl = `/${data.country.code}/days-until/${data.event.slug}`;
  const canonicalUrl = getCanonicalUrl(data.event, {
    countryCode: data.country.code,
    currentUrl,
  });
  const canIndexCurrentUrl = data.event.indexable && canonicalUrl === currentUrl;

  return {
    title: `How many days until ${data.event.displayName} in ${data.country.name}? | DaysUntil`,
    description: `Find out how many days until ${data.event.displayName} in ${data.country.name} with a live countdown.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: canIndexCurrentUrl,
      follow: true,
    },
  };
}

export function renderCountryEventPage(countryCode: CountryCode, eventSlug: string) {
  const dateData = getLocalizedDateCountdownPageData(countryCode, eventSlug);

  if (dateData) {
    return <LocalizedDateCountdownPage data={dateData} />;
  }

  const data = getLocalizedCountdownPageData(countryCode, eventSlug);

  if (!data) {
    notFound();
  }

  return <LocalizedCountdownPage data={data} />;
}
