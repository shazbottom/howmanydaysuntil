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
    logo: toAbsoluteUrl("/logo/logo-large-no-text.svg"),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "daysuntil.is@gmail.com",
      },
    ],
  };
}

interface WebPageSchemaOptions {
  name: string;
  description: string;
  path: string;
  about?: string;
}

interface CollectionPageSchemaOptions {
  name: string;
  description: string;
  path: string;
  about?: string[];
}

export function createWebPageJsonLd({
  name,
  description,
  path,
  about,
}: WebPageSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: toAbsoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: "DaysUntil",
      url: SITE_URL,
    },
    ...(about
      ? {
          about: {
            "@type": "Thing",
            name: about,
          },
        }
      : {}),
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
