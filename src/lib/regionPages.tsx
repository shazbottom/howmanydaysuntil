import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegionHubPage } from "../components/RegionHubPage";
import { RegionalCountdownPage } from "../components/RegionalCountdownPage";
import { getCountryByCode, type CountryCode } from "./countries";
import { getEventsForRegion } from "./events";
import {
  getRegionTodayLabel,
  getRegionalCountdownPageData,
  getUpcomingLocalizedEventLinksForRegion,
} from "./localizedCountdowns";
import { getRegionByCountryAndSlug, getRegionsForCountry } from "./regions";

export function getRegionHubStaticParams(countryCode: CountryCode) {
  return getRegionsForCountry(countryCode).map((region) => ({
    region: region.slug,
  }));
}

export function getRegionEventStaticParams(countryCode: CountryCode, regionSlug: string) {
  const region = getRegionByCountryAndSlug(countryCode, regionSlug);

  if (!region) {
    return [];
  }

  return getEventsForRegion(region).map((event) => ({
    event: event.slug,
  }));
}

export function getAllRegionEventStaticParams(countryCode: CountryCode) {
  return getRegionsForCountry(countryCode).flatMap((region) =>
    getRegionEventStaticParams(countryCode, region.slug).map((params) => ({
      region: region.slug,
      event: params.event,
    })),
  );
}

export function renderRegionHub(countryCode: CountryCode, regionSlug: string) {
  const country = getCountryByCode(countryCode);
  const region = getRegionByCountryAndSlug(countryCode, regionSlug);

  if (!country || !region) {
    notFound();
  }

  return (
    <RegionHubPage
      country={country}
      region={region}
      todayLabel={getRegionTodayLabel(region, country.locale)}
      upcomingLinks={getUpcomingLocalizedEventLinksForRegion(countryCode, regionSlug)}
    />
  );
}

export function getRegionHubMetadata(
  countryCode: CountryCode,
  regionSlug: string,
): Metadata {
  const country = getCountryByCode(countryCode);
  const region = getRegionByCountryAndSlug(countryCode, regionSlug);

  if (!country || !region) {
    return {
      title: "Region Countdown Not Found | DaysUntil",
      description: "The requested regional countdown page could not be found.",
    };
  }

  const regionName = region.seoName ?? region.displayName;

  return {
    title: `Days Until Events in ${regionName}, ${country.name} | DaysUntil`,
    description: `Track how many days until upcoming events and holidays in ${regionName}, ${country.name} with live countdowns.`,
    alternates: {
      canonical: `/${country.code}/${region.slug}`,
    },
  };
}

export function getRegionEventMetadata(
  countryCode: CountryCode,
  regionSlug: string,
  eventSlug: string,
): Metadata {
  const data = getRegionalCountdownPageData(countryCode, regionSlug, eventSlug);

  if (!data) {
    return {
      title: "Regional Countdown Not Found | DaysUntil",
      description: "The requested regional countdown page could not be found.",
    };
  }

  return {
    title: `How many days until ${data.event.displayName} in ${data.region.displayName}? | DaysUntil`,
    description: `Find out how many days until ${data.event.displayName} in ${data.region.displayName}, ${data.country.name} with a live countdown.`,
    alternates: {
      canonical: `/${data.country.code}/${data.region.slug}/days-until/${data.event.slug}`,
    },
  };
}

export function renderRegionEventPage(
  countryCode: CountryCode,
  regionSlug: string,
  eventSlug: string,
) {
  const data = getRegionalCountdownPageData(countryCode, regionSlug, eventSlug);

  if (!data) {
    notFound();
  }

  return <RegionalCountdownPage data={data} />;
}
