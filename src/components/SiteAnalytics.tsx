"use client";

import { Analytics } from "@vercel/analytics/react";

export function SiteAnalytics() {
  return <Analytics beforeSend={(event) => {
    try {
      const url = new URL(event.url);
      url.search = "";
      url.hash = "";
      // Personal countdown slugs can contain names; don't send them to analytics.
      if (url.pathname.startsWith("/c/")) url.pathname = "/c/private-countdown";
      return { ...event, url: url.toString() };
    } catch {
      return null;
    }
  }} />;
}
