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
import { getRegionReferenceData } from "./regionData";

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

test("uk canonical region slugs resolve directly", () => {
  const england = resolveRegionByCountryAndSlug("uk", "england");
  const scotland = resolveRegionByCountryAndSlug("uk", "scotland");
  const wales = resolveRegionByCountryAndSlug("uk", "wales");
  const northernIreland = resolveRegionByCountryAndSlug("uk", "northern-ireland");

  assert.ok(england);
  assert.ok(scotland);
  assert.ok(wales);
  assert.ok(northernIreland);
  assert.equal(england.region.id, "uk-england");
  assert.equal(scotland.region.id, "uk-scotland");
  assert.equal(wales.region.id, "uk-wales");
  assert.equal(northernIreland.region.id, "uk-northern-ireland");
});

test("uk region reference data is available for 2026", () => {
  const england = getRegionReferenceData("uk-england", 2026);
  const scotland = getRegionReferenceData("uk-scotland", 2026);
  const wales = getRegionReferenceData("uk-wales", 2026);
  const northernIreland = getRegionReferenceData("uk-northern-ireland", 2026);

  assert.ok(england);
  assert.ok(scotland);
  assert.ok(wales);
  assert.ok(northernIreland);
  assert.equal(england.publicHolidays.length > 0, true);
  assert.equal(scotland.schoolTerms.length > 0, true);
  assert.equal(wales.schoolTerms.length > 0, true);
  assert.equal(northernIreland.publicHolidays.length > 0, true);
});

test("new zealand region reference data is available for 2026", () => {
  const auckland = getRegionReferenceData("nz-auckland", 2026);
  const canterbury = getRegionReferenceData("nz-canterbury", 2026);
  const wellington = getRegionReferenceData("nz-wellington", 2026);

  assert.ok(auckland);
  assert.ok(canterbury);
  assert.ok(wellington);
  assert.equal(auckland.publicHolidays.some((row) => row.name === "Auckland Anniversary Day"), true);
  assert.equal(canterbury.publicHolidays.some((row) => row.name === "Canterbury Anniversary Day"), true);
  assert.equal(wellington.publicHolidays.some((row) => row.name === "Wellington Anniversary Day"), true);
  assert.equal(auckland.schoolTerms.length > 0, true);
});

test("canadian region reference data is available for 2026", () => {
  const alberta = getRegionReferenceData("ca-ab", 2026);
  const britishColumbia = getRegionReferenceData("ca-bc", 2026);
  const ontario = getRegionReferenceData("ca-on", 2026);
  const quebec = getRegionReferenceData("ca-qc", 2026);

  assert.ok(alberta);
  assert.ok(britishColumbia);
  assert.ok(ontario);
  assert.ok(quebec);
  assert.equal(alberta.publicHolidays.some((row) => row.name === "Alberta Family Day"), true);
  assert.equal(britishColumbia.publicHolidays.some((row) => row.name === "B.C. Day"), true);
  assert.equal(ontario.publicHolidays.some((row) => row.name === "Family Day"), true);
  assert.equal(quebec.publicHolidays.some((row) => row.name === "National Patriots' Day"), true);
});

test("us canonical region slugs resolve directly", () => {
  const california = resolveRegionByCountryAndSlug("us", "california");
  const florida = resolveRegionByCountryAndSlug("us", "florida");
  const illinois = resolveRegionByCountryAndSlug("us", "illinois");
  const newYork = resolveRegionByCountryAndSlug("us", "new-york");
  const texas = resolveRegionByCountryAndSlug("us", "texas");

  assert.ok(california);
  assert.ok(florida);
  assert.ok(illinois);
  assert.ok(newYork);
  assert.ok(texas);
  assert.equal(california.region.id, "us-ca");
  assert.equal(florida.region.id, "us-fl");
  assert.equal(illinois.region.id, "us-il");
  assert.equal(newYork.region.id, "us-ny");
  assert.equal(texas.region.id, "us-tx");
});

test("us region reference data is available for 2026", () => {
  const california = getRegionReferenceData("us-ca", 2026);
  const florida = getRegionReferenceData("us-fl", 2026);
  const illinois = getRegionReferenceData("us-il", 2026);
  const newYork = getRegionReferenceData("us-ny", 2026);
  const texas = getRegionReferenceData("us-tx", 2026);

  assert.ok(california);
  assert.ok(florida);
  assert.ok(illinois);
  assert.ok(newYork);
  assert.ok(texas);
  assert.equal(california.publicHolidays.some((row) => row.name === "Cesar Chavez Day"), true);
  assert.equal(florida.publicHolidays.some((row) => row.name === "Good Friday"), true);
  assert.equal(illinois.publicHolidays.some((row) => row.name === "Lincoln's Birthday"), true);
  assert.equal(newYork.publicHolidays.some((row) => row.name === "Election Day"), true);
  assert.equal(texas.publicHolidays.some((row) => row.name === "Texas Independence Day"), true);
  assert.equal(california.schoolTerms.length > 0, true);
  assert.equal(texas.schoolTerms.length > 0, true);
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
  assert.equal(urls.includes("https://daysuntil.is/uk/england"), true);
  assert.equal(urls.includes("https://daysuntil.is/uk/scotland"), true);
  assert.equal(urls.includes("https://daysuntil.is/uk/wales"), true);
  assert.equal(urls.includes("https://daysuntil.is/uk/northern-ireland"), true);
  assert.equal(urls.includes("https://daysuntil.is/nz/auckland"), true);
  assert.equal(urls.includes("https://daysuntil.is/nz/canterbury"), true);
  assert.equal(urls.includes("https://daysuntil.is/nz/wellington"), true);
  assert.equal(urls.includes("https://daysuntil.is/ca/alberta"), true);
  assert.equal(urls.includes("https://daysuntil.is/ca/british-columbia"), true);
  assert.equal(urls.includes("https://daysuntil.is/ca/ontario"), true);
  assert.equal(urls.includes("https://daysuntil.is/ca/quebec"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/california"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/florida"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/illinois"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/new-york"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/texas"), true);
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
