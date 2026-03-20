import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { RegionHubPage } from "../components/RegionHubPage";
import { RegionalCountdownPage } from "../components/RegionalCountdownPage";
import { getCountryByCode, type CountryCode } from "./countries";
import {
  getCanonicalUrl,
  getEventsForRegion,
  hasIndexableRegionContent,
} from "./events";
import {
  getRegionTodayLabel,
  getRegionalCountdownPageData,
} from "./localizedCountdowns";
import { getRegionReferenceData } from "./regionData";
import {
  getRegionByCountryAndSlug,
  getRegionId,
  getRegionsForCountry,
  resolveRegionByCountryAndSlug,
  buildRegionUrl,
  buildRegionEventUrl,
} from "./regions";

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
  const resolvedRegion = resolveRegionByCountryAndSlug(countryCode, regionSlug);
  const region = resolvedRegion?.region ?? null;
  const currentYear = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: region?.timezone,
      year: "numeric",
    }).format(new Date()),
  );

  if (!country || !region) {
    notFound();
  }

  if (resolvedRegion?.isLegacyMatch) {
    permanentRedirect(buildRegionUrl(region));
  }

  return (
    <RegionHubPage
      country={country}
      region={region}
      todayLabel={getRegionTodayLabel(region, country.locale)}
      currentYear={currentYear}
      referenceData={getRegionReferenceData(getRegionId(region), currentYear)}
      siblingRegions={getRegionsForCountry(countryCode).filter(
        (candidateRegion) => candidateRegion.id !== region.id,
      )}
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

  const regionName = region.seoName ?? region.name;
  const isIndexable = hasIndexableRegionContent(getRegionId(region));
  const regionQualifier = region.shortName ? `${regionName} (${region.shortName})` : regionName;
  const currentYear = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: region.timezone,
      year: "numeric",
    }).format(new Date()),
  );

  return {
    title: `Public holidays and school holidays in ${regionQualifier} ${currentYear} | DaysUntil`,
    description: `Check public holidays, school term dates, and school holiday periods in ${regionQualifier}, ${country.name} for ${currentYear}.`,
    alternates: {
      canonical: `/${country.code}/${region.slug}`,
    },
    robots: {
      index: isIndexable,
      follow: true,
    },
  };
}

export function getRegionEventMetadata(
  countryCode: CountryCode,
  regionSlug: string,
  eventSlug: string,
): Metadata {
  const resolvedRegion = resolveRegionByCountryAndSlug(countryCode, regionSlug);
  const canonicalRegionSlug = resolvedRegion?.region.slug ?? regionSlug;
  const data = getRegionalCountdownPageData(countryCode, canonicalRegionSlug, eventSlug);

  if (!data) {
    return {
      title: "Regional Countdown Not Found | DaysUntil",
      description: "The requested regional countdown page could not be found.",
    };
  }

  const currentUrl = `/${data.country.code}/${data.region.slug}/days-until/${data.event.slug}`;
  const canonicalUrl = getCanonicalUrl(data.event, {
    countryCode: data.country.code,
    region: data.region,
    currentUrl,
  });
  const canIndexCurrentUrl = data.event.indexable && canonicalUrl === currentUrl;

  return {
    title: `How many days until ${data.event.displayName} in ${data.region.name}? | DaysUntil`,
    description: `Find out how many days until ${data.event.displayName} in ${data.region.name}, ${data.country.name} with a live countdown.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: canIndexCurrentUrl,
      follow: true,
    },
  };
}

export function renderRegionEventPage(
  countryCode: CountryCode,
  regionSlug: string,
  eventSlug: string,
) {
  const resolvedRegion = resolveRegionByCountryAndSlug(countryCode, regionSlug);
  const region = resolvedRegion?.region ?? null;

  if (resolvedRegion?.isLegacyMatch && region) {
    permanentRedirect(buildRegionEventUrl(region, eventSlug));
  }

  const data = region ? getRegionalCountdownPageData(countryCode, region.slug, eventSlug) : null;

  if (!data) {
    notFound();
  }

  return <RegionalCountdownPage data={data} />;
}
