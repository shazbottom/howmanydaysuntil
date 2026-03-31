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
import {
  getRegionAttributions,
  getRegionReferenceData,
  getRegionReferenceYears,
} from "./regionData";
import {
  getRegionByCountryAndSlug,
  getRegionId,
  getRegionsForCountry,
  resolveRegionByCountryAndSlug,
  buildRegionUrl,
  buildRegionEventUrl,
} from "./regions";

function getCurrentRegionYear(regionTimezone: string): number {
  return Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: regionTimezone,
      year: "numeric",
    }).format(new Date()),
  );
}

export function getRegionHubPath(
  region: Pick<typeof import("./regions").regions[number], "countryCode" | "slug">,
  year?: number,
): string {
  return year ? `/${region.countryCode}/${region.slug}/${year}` : `/${region.countryCode}/${region.slug}`;
}

function getRegionYearLinks(
  region: Pick<typeof import("./regions").regions[number], "countryCode" | "slug" | "timezone" | "id">,
  selectedYear: number,
) {
  const currentYear = getCurrentRegionYear(region.timezone);
  return getRegionReferenceYears(region.id).map((year) => ({
    label: String(year),
    href: year === currentYear ? getRegionHubPath(region) : getRegionHubPath(region, year),
    active: year === selectedYear,
  }));
}

export function getRegionHubStaticParams(countryCode: CountryCode) {
  return getRegionsForCountry(countryCode).map((region) => ({
    region: region.slug,
  }));
}

export function getRegionHubYearStaticParams(countryCode: CountryCode) {
  return getRegionsForCountry(countryCode).flatMap((region) => {
    const currentYear = getCurrentRegionYear(region.timezone);
    return getRegionReferenceYears(region.id)
      .filter((year) => year > currentYear)
      .map((year) => ({
        region: region.slug,
        year: String(year),
      }));
  });
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

export function renderRegionHub(countryCode: CountryCode, regionSlug: string, year?: number) {
  const country = getCountryByCode(countryCode);
  const resolvedRegion = resolveRegionByCountryAndSlug(countryCode, regionSlug);
  const region = resolvedRegion?.region ?? null;

  if (!country || !region) {
    notFound();
  }

  const currentYear = getCurrentRegionYear(region.timezone);
  const selectedYear = year ?? currentYear;
  const referenceData = getRegionReferenceData(getRegionId(region), selectedYear);

  if (resolvedRegion?.isLegacyMatch) {
    permanentRedirect(getRegionHubPath(region, year));
  }

  if (year && !referenceData) {
    notFound();
  }

  return (
    <RegionHubPage
      country={country}
      region={region}
      todayLabel={getRegionTodayLabel(region, country.locale)}
      currentYear={selectedYear}
      referenceData={referenceData}
      attributions={getRegionAttributions(getRegionId(region))}
      siblingRegions={getRegionsForCountry(countryCode).filter(
        (candidateRegion) => candidateRegion.id !== region.id,
      )}
      yearLinks={getRegionYearLinks(region, selectedYear)}
      currentPath={getRegionHubPath(region, year)}
    />
  );
}

export function getRegionHubMetadata(
  countryCode: CountryCode,
  regionSlug: string,
  year?: number,
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
  const currentYear = getCurrentRegionYear(region.timezone);
  const selectedYear = year ?? currentYear;
  const title = `Public holidays and school holidays in ${regionQualifier} ${selectedYear} | DaysUntil`;
  const description = `Check public holidays, school term dates, and school holiday periods in ${regionQualifier}, ${country.name} for ${selectedYear}.`;
  const canonicalPath = getRegionHubPath(region, year);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: `https://daysuntil.is${canonicalPath}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
