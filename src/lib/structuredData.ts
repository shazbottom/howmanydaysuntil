export interface StructuredDataBreadcrumbItem {
  name: string;
  path: string;
}

const SITE_URL = "https://daysuntil.is";

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSiteUrl() {
  return SITE_URL;
}

export function createBreadcrumbJsonLd(items: StructuredDataBreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DaysUntil",
    url: SITE_URL,
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DaysUntil",
    url: SITE_URL,
    logo: toAbsoluteUrl("/icon-512.png"),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "daysuntil.is@gmail.com",
      },
    ],
  };
}

interface EventSchemaOptions {
  name: string;
  description: string;
  startDate: Date | string;
  path: string;
}

interface CollectionPageSchemaOptions {
  name: string;
  description: string;
  path: string;
  about?: string[];
}

export function createEventJsonLd({
  name,
  description,
  startDate,
  path,
}: EventSchemaOptions) {
  const formattedStartDate =
    typeof startDate === "string" ? startDate : startDate.toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate: formattedStartDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: toAbsoluteUrl(path),
    },
    url: toAbsoluteUrl(path),
    organizer: {
      "@type": "Organization",
      name: "DaysUntil",
      url: SITE_URL,
    },
  };
}

export function createCollectionPageJsonLd({
  name,
  description,
  path,
  about = [],
}: CollectionPageSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: toAbsoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: "DaysUntil",
      url: SITE_URL,
    },
    about: about.map((topic) => ({
      "@type": "Thing",
      name: topic,
    })),
  };
}
