import test from "node:test";
import assert from "node:assert/strict";
import sitemap from "../app/sitemap";
import {
  getCanonicalUrl,
  getEventsForRegion,
  getRegionEventBySlug,
  type LocalizedEventDefinition,
} from "./events";
import {
  buildRegionEventUrl,
  buildRegionUrl,
  getRegionById,
  resolveRegionByCountryAndSlug,
} from "./regions";

test("canonical region slug resolves directly", () => {
  const resolved = resolveRegionByCountryAndSlug("au", "victoria");

  assert.ok(resolved);
  assert.equal(resolved.region.id, "au-vic");
  assert.equal(resolved.isLegacyMatch, false);
});

test("legacy region slug resolves and is flagged as legacy", () => {
  const resolved = resolveRegionByCountryAndSlug("au", "vic");

  assert.ok(resolved);
  assert.equal(resolved.region.slug, "victoria");
  assert.equal(resolved.isLegacyMatch, true);
});

test("region URL builders always use canonical full slug", () => {
  const region = getRegionById("au-vic");

  assert.ok(region);
  assert.equal(buildRegionUrl(region), "/au/victoria");
  assert.equal(
    buildRegionEventUrl(region, "melbourne-cup"),
    "/au/victoria/days-until/melbourne-cup",
  );
});

test("region canonical URL uses full slug", () => {
  const region = getRegionById("au-vic");
  const event: LocalizedEventDefinition = {
    internalKey: "au-vic-melbourne-cup",
    slug: "melbourne-cup",
    displayName: "Melbourne Cup",
    scope: "region",
    appliesToRegions: ["au-vic"],
    rule: { type: "fixed-date", month: 11, day: 3 },
    canonicalStrategy: "region",
    indexable: true,
  };

  assert.ok(region);
  assert.equal(
    getCanonicalUrl(event, {
      region,
      currentUrl: "/au/victoria/days-until/melbourne-cup",
    }),
    "/au/victoria/days-until/melbourne-cup",
  );
});

test("melbourne cup resolves for victoria region", () => {
  const event = getRegionEventBySlug("au-vic", "melbourne-cup");

  assert.ok(event);
  assert.equal(event.internalKey, "au-vic-melbourne-cup");
  assert.equal(event.scope, "region");
});

test("melbourne cup does not resolve for new south wales", () => {
  const event = getRegionEventBySlug("au-nsw", "melbourne-cup");

  assert.equal(event, null);
});

test("victoria region events include melbourne cup", () => {
  const region = getRegionById("au-vic");

  assert.ok(region);
  assert.equal(
    getEventsForRegion(region).some((event) => event.slug === "melbourne-cup"),
    true,
  );
});

test("australian region events resolve only for their owning region", () => {
  const validCases = [
    ["au-vic", "labour-day"],
    ["au-vic", "melbourne-cup"],
    ["au-nsw", "labour-day"],
    ["au-qld", "labour-day"],
    ["au-sa", "adelaide-cup-day"],
    ["au-sa", "labour-day"],
    ["au-wa", "labour-day"],
    ["au-wa", "western-australia-day"],
    ["au-tas", "eight-hours-day"],
    ["au-act", "canberra-day"],
    ["au-act", "reconciliation-day"],
    ["au-act", "labour-day"],
    ["au-nt", "may-day"],
    ["au-nt", "picnic-day"],
  ] as const;

  for (const [regionId, slug] of validCases) {
    const event = getRegionEventBySlug(regionId, slug);
    assert.ok(event, `${slug} should resolve for ${regionId}`);
  }
});

test("australian region events do not resolve for invalid regions", () => {
  const invalidCases = [
    ["au-vic", "canberra-day"],
    ["au-qld", "picnic-day"],
    ["au-nsw", "melbourne-cup"],
    ["au-wa", "adelaide-cup-day"],
  ] as const;

  for (const [regionId, slug] of invalidCases) {
    const event = getRegionEventBySlug(regionId, slug);
    assert.equal(event, null, `${slug} should not resolve for ${regionId}`);
  }
});

test("canonical URLs for australian region events use canonical full slugs", () => {
  const victoria = getRegionById("au-vic");
  const act = getRegionById("au-act");

  assert.ok(victoria);
  assert.ok(act);

  const melbourneCup = getRegionEventBySlug("au-vic", "melbourne-cup");
  const canberraDay = getRegionEventBySlug("au-act", "canberra-day");

  assert.ok(melbourneCup);
  assert.ok(canberraDay);

  assert.equal(
    getCanonicalUrl(melbourneCup, {
      region: victoria,
      currentUrl: "/au/victoria/days-until/melbourne-cup",
    }),
    "/au/victoria/days-until/melbourne-cup",
  );

  assert.equal(
    getCanonicalUrl(canberraDay, {
      region: act,
      currentUrl: "/au/australian-capital-territory/days-until/canberra-day",
    }),
    "/au/australian-capital-territory/days-until/canberra-day",
  );
});

test("sitemap does not include legacy region slugs", () => {
  const urls = sitemap().map((entry) => entry.url);

  assert.equal(urls.includes("https://daysuntil.is/au/vic"), false);
  assert.equal(urls.includes("https://daysuntil.is/ca/on"), false);
  assert.equal(
    urls.includes("https://daysuntil.is/au/victoria/days-until/melbourne-cup"),
    true,
  );
  assert.equal(
    urls.includes("https://daysuntil.is/au/vic/days-until/melbourne-cup"),
    false,
  );
  assert.equal(
    urls.includes("https://daysuntil.is/au/victoria/days-until/labour-day"),
    true,
  );
  assert.equal(
    urls.includes("https://daysuntil.is/au/australian-capital-territory/days-until/canberra-day"),
    true,
  );
  assert.equal(
    urls.includes("https://daysuntil.is/au/northern-territory/days-until/picnic-day"),
    true,
  );
  assert.equal(
    urls.includes("https://daysuntil.is/au/act/days-until/canberra-day"),
    false,
  );
});
