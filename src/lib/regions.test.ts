import test from "node:test";
import assert from "node:assert/strict";
import sitemap from "../app/sitemap";
import {
  getCanonicalUrl,
  getEventsForRegion,
  getLocalizedEventByCountryAndSlug,
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

test("country season events resolve with hemisphere-appropriate slugs", () => {
  const australiaSummer = getLocalizedEventByCountryAndSlug("au", "summer");
  const ukSummer = getLocalizedEventByCountryAndSlug("uk", "summer");
  const usFall = getLocalizedEventByCountryAndSlug("us", "fall");
  const usAutumnAlias = getLocalizedEventByCountryAndSlug("us", "autumn");

  assert.ok(australiaSummer);
  assert.ok(ukSummer);
  assert.ok(usFall);
  assert.ok(usAutumnAlias);
  assert.equal(australiaSummer.slug, "summer");
  assert.equal(ukSummer.slug, "summer");
  assert.equal(usFall.slug, "fall");
  assert.equal(usAutumnAlias.slug, "fall");
});

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
  const arizona = resolveRegionByCountryAndSlug("us", "arizona");
  const california = resolveRegionByCountryAndSlug("us", "california");
  const florida = resolveRegionByCountryAndSlug("us", "florida");
  const georgia = resolveRegionByCountryAndSlug("us", "georgia");
  const illinois = resolveRegionByCountryAndSlug("us", "illinois");
  const massachusetts = resolveRegionByCountryAndSlug("us", "massachusetts");
  const michigan = resolveRegionByCountryAndSlug("us", "michigan");
  const newJersey = resolveRegionByCountryAndSlug("us", "new-jersey");
  const northCarolina = resolveRegionByCountryAndSlug("us", "north-carolina");
  const newYork = resolveRegionByCountryAndSlug("us", "new-york");
  const ohio = resolveRegionByCountryAndSlug("us", "ohio");
  const pennsylvania = resolveRegionByCountryAndSlug("us", "pennsylvania");
  const texas = resolveRegionByCountryAndSlug("us", "texas");
  const virginia = resolveRegionByCountryAndSlug("us", "virginia");
  const washington = resolveRegionByCountryAndSlug("us", "washington");
  const tennessee = resolveRegionByCountryAndSlug("us", "tennessee");
  const indiana = resolveRegionByCountryAndSlug("us", "indiana");
  const missouri = resolveRegionByCountryAndSlug("us", "missouri");
  const maryland = resolveRegionByCountryAndSlug("us", "maryland");
  const wisconsin = resolveRegionByCountryAndSlug("us", "wisconsin");
  const colorado = resolveRegionByCountryAndSlug("us", "colorado");
  const minnesota = resolveRegionByCountryAndSlug("us", "minnesota");
  const alabama = resolveRegionByCountryAndSlug("us", "alabama");
  const southCarolina = resolveRegionByCountryAndSlug("us", "south-carolina");
  const louisiana = resolveRegionByCountryAndSlug("us", "louisiana");
  const oregon = resolveRegionByCountryAndSlug("us", "oregon");
  const nevada = resolveRegionByCountryAndSlug("us", "nevada");
  const kentucky = resolveRegionByCountryAndSlug("us", "kentucky");
  const oklahoma = resolveRegionByCountryAndSlug("us", "oklahoma");
  const arkansas = resolveRegionByCountryAndSlug("us", "arkansas");
  const utah = resolveRegionByCountryAndSlug("us", "utah");
  const iowa = resolveRegionByCountryAndSlug("us", "iowa");
  const kansas = resolveRegionByCountryAndSlug("us", "kansas");
  const mississippi = resolveRegionByCountryAndSlug("us", "mississippi");
  const nebraska = resolveRegionByCountryAndSlug("us", "nebraska");
  const newMexico = resolveRegionByCountryAndSlug("us", "new-mexico");
  const idaho = resolveRegionByCountryAndSlug("us", "idaho");
  const westVirginia = resolveRegionByCountryAndSlug("us", "west-virginia");
  const connecticut = resolveRegionByCountryAndSlug("us", "connecticut");
  const delaware = resolveRegionByCountryAndSlug("us", "delaware");

  assert.ok(arizona);
  assert.ok(california);
  assert.ok(florida);
  assert.ok(georgia);
  assert.ok(illinois);
  assert.ok(massachusetts);
  assert.ok(michigan);
  assert.ok(newJersey);
  assert.ok(northCarolina);
  assert.ok(newYork);
  assert.ok(ohio);
  assert.ok(pennsylvania);
  assert.ok(texas);
  assert.ok(virginia);
  assert.ok(washington);
  assert.ok(tennessee);
  assert.ok(indiana);
  assert.ok(missouri);
  assert.ok(maryland);
  assert.ok(wisconsin);
  assert.ok(colorado);
  assert.ok(minnesota);
  assert.ok(alabama);
  assert.ok(southCarolina);
  assert.ok(louisiana);
  assert.ok(oregon);
  assert.ok(nevada);
  assert.ok(kentucky);
  assert.ok(oklahoma);
  assert.ok(arkansas);
  assert.ok(utah);
  assert.ok(iowa);
  assert.ok(kansas);
  assert.ok(mississippi);
  assert.ok(nebraska);
  assert.ok(newMexico);
  assert.ok(idaho);
  assert.ok(westVirginia);
  assert.ok(connecticut);
  assert.ok(delaware);
  assert.equal(arizona.region.id, "us-az");
  assert.equal(california.region.id, "us-ca");
  assert.equal(florida.region.id, "us-fl");
  assert.equal(georgia.region.id, "us-ga");
  assert.equal(illinois.region.id, "us-il");
  assert.equal(massachusetts.region.id, "us-ma");
  assert.equal(michigan.region.id, "us-mi");
  assert.equal(newJersey.region.id, "us-nj");
  assert.equal(northCarolina.region.id, "us-nc");
  assert.equal(newYork.region.id, "us-ny");
  assert.equal(ohio.region.id, "us-oh");
  assert.equal(pennsylvania.region.id, "us-pa");
  assert.equal(texas.region.id, "us-tx");
  assert.equal(virginia.region.id, "us-va");
  assert.equal(washington.region.id, "us-wa");
  assert.equal(tennessee.region.id, "us-tn");
  assert.equal(indiana.region.id, "us-in");
  assert.equal(missouri.region.id, "us-mo");
  assert.equal(maryland.region.id, "us-md");
  assert.equal(wisconsin.region.id, "us-wi");
  assert.equal(colorado.region.id, "us-co");
  assert.equal(minnesota.region.id, "us-mn");
  assert.equal(alabama.region.id, "us-al");
  assert.equal(southCarolina.region.id, "us-sc");
  assert.equal(louisiana.region.id, "us-la");
  assert.equal(oregon.region.id, "us-or");
  assert.equal(nevada.region.id, "us-nv");
  assert.equal(kentucky.region.id, "us-ky");
  assert.equal(oklahoma.region.id, "us-ok");
  assert.equal(arkansas.region.id, "us-ar");
  assert.equal(utah.region.id, "us-ut");
  assert.equal(iowa.region.id, "us-ia");
  assert.equal(kansas.region.id, "us-ks");
  assert.equal(mississippi.region.id, "us-ms");
  assert.equal(nebraska.region.id, "us-ne");
  assert.equal(newMexico.region.id, "us-nm");
  assert.equal(idaho.region.id, "us-id");
  assert.equal(westVirginia.region.id, "us-wv");
  assert.equal(connecticut.region.id, "us-ct");
  assert.equal(delaware.region.id, "us-de");
});

test("us region reference data is available for 2026", () => {
  const arizona = getRegionReferenceData("us-az", 2026);
  const california = getRegionReferenceData("us-ca", 2026);
  const florida = getRegionReferenceData("us-fl", 2026);
  const georgia = getRegionReferenceData("us-ga", 2026);
  const illinois = getRegionReferenceData("us-il", 2026);
  const massachusetts = getRegionReferenceData("us-ma", 2026);
  const michigan = getRegionReferenceData("us-mi", 2026);
  const newJersey = getRegionReferenceData("us-nj", 2026);
  const northCarolina = getRegionReferenceData("us-nc", 2026);
  const newYork = getRegionReferenceData("us-ny", 2026);
  const ohio = getRegionReferenceData("us-oh", 2026);
  const pennsylvania = getRegionReferenceData("us-pa", 2026);
  const texas = getRegionReferenceData("us-tx", 2026);
  const virginia = getRegionReferenceData("us-va", 2026);
  const washington = getRegionReferenceData("us-wa", 2026);
  const tennessee = getRegionReferenceData("us-tn", 2026);
  const indiana = getRegionReferenceData("us-in", 2026);
  const missouri = getRegionReferenceData("us-mo", 2026);
  const maryland = getRegionReferenceData("us-md", 2026);
  const wisconsin = getRegionReferenceData("us-wi", 2026);
  const colorado = getRegionReferenceData("us-co", 2026);
  const minnesota = getRegionReferenceData("us-mn", 2026);
  const alabama = getRegionReferenceData("us-al", 2026);
  const southCarolina = getRegionReferenceData("us-sc", 2026);
  const louisiana = getRegionReferenceData("us-la", 2026);
  const oregon = getRegionReferenceData("us-or", 2026);
  const nevada = getRegionReferenceData("us-nv", 2026);
  const kentucky = getRegionReferenceData("us-ky", 2026);
  const oklahoma = getRegionReferenceData("us-ok", 2026);
  const arkansas = getRegionReferenceData("us-ar", 2026);
  const utah = getRegionReferenceData("us-ut", 2026);
  const iowa = getRegionReferenceData("us-ia", 2026);
  const kansas = getRegionReferenceData("us-ks", 2026);
  const mississippi = getRegionReferenceData("us-ms", 2026);
  const nebraska = getRegionReferenceData("us-ne", 2026);
  const newMexico = getRegionReferenceData("us-nm", 2026);
  const idaho = getRegionReferenceData("us-id", 2026);
  const westVirginia = getRegionReferenceData("us-wv", 2026);
  const connecticut = getRegionReferenceData("us-ct", 2026);
  const delaware = getRegionReferenceData("us-de", 2026);

  assert.ok(arizona);
  assert.ok(california);
  assert.ok(florida);
  assert.ok(georgia);
  assert.ok(illinois);
  assert.ok(massachusetts);
  assert.ok(michigan);
  assert.ok(newJersey);
  assert.ok(northCarolina);
  assert.ok(newYork);
  assert.ok(ohio);
  assert.ok(pennsylvania);
  assert.ok(texas);
  assert.ok(virginia);
  assert.ok(washington);
  assert.ok(tennessee);
  assert.ok(indiana);
  assert.ok(missouri);
  assert.ok(maryland);
  assert.ok(wisconsin);
  assert.ok(colorado);
  assert.ok(minnesota);
  assert.ok(alabama);
  assert.ok(southCarolina);
  assert.ok(louisiana);
  assert.ok(oregon);
  assert.ok(nevada);
  assert.ok(kentucky);
  assert.ok(oklahoma);
  assert.ok(arkansas);
  assert.ok(utah);
  assert.ok(iowa);
  assert.ok(kansas);
  assert.ok(mississippi);
  assert.ok(nebraska);
  assert.ok(newMexico);
  assert.ok(idaho);
  assert.ok(westVirginia);
  assert.ok(connecticut);
  assert.ok(delaware);
  assert.equal(arizona.publicHolidays.some((row) => row.name === "Martin Luther King Jr. / Civil Rights Day"), true);
  assert.equal(california.publicHolidays.some((row) => row.name === "Cesar Chavez Day"), true);
  assert.equal(florida.publicHolidays.some((row) => row.name === "Good Friday"), true);
  assert.equal(georgia.publicHolidays.some((row) => row.name === "State Holiday (Good Friday)"), true);
  assert.equal(illinois.publicHolidays.some((row) => row.name === "Lincoln's Birthday"), true);
  assert.equal(massachusetts.publicHolidays.some((row) => row.name === "Patriots' Day"), true);
  assert.equal(michigan.publicHolidays.some((row) => row.name === "General Election Day"), true);
  assert.equal(newJersey.publicHolidays.some((row) => row.name === "Election Day"), true);
  assert.equal(northCarolina.publicHolidays.some((row) => row.name === "Christmas Day additional holiday"), true);
  assert.equal(newYork.publicHolidays.some((row) => row.name === "Election Day"), true);
  assert.equal(ohio.publicHolidays.some((row) => row.name === "Day after Thanksgiving"), true);
  assert.equal(pennsylvania.publicHolidays.some((row) => row.name === "Indigenous Peoples' Day"), true);
  assert.equal(texas.publicHolidays.some((row) => row.name === "Texas Independence Day"), true);
  assert.equal(virginia.publicHolidays.some((row) => row.name === "Columbus Day & Yorktown Victory Day"), true);
  assert.equal(washington.publicHolidays.some((row) => row.name === "Native American Heritage Day"), true);
  assert.equal(tennessee.publicHolidays.some((row) => row.name === "Good Friday"), true);
  assert.equal(indiana.publicHolidays.some((row) => row.name === "Primary Election Day"), true);
  assert.equal(missouri.publicHolidays.some((row) => row.name === "Truman Day"), true);
  assert.equal(maryland.publicHolidays.some((row) => row.name === "General Election Day"), true);
  assert.equal(wisconsin.publicHolidays.some((row) => row.name === "Christmas Eve Day"), true);
  assert.equal(colorado.publicHolidays.some((row) => row.name === "Frances Xavier Cabrini Day"), true);
  assert.equal(minnesota.publicHolidays.some((row) => row.name === "Thanksgiving Friday"), true);
  assert.equal(alabama.publicHolidays.some((row) => row.name === "Confederate Memorial Day"), true);
  assert.equal(southCarolina.publicHolidays.some((row) => row.name === "Confederate Memorial Day"), true);
  assert.equal(louisiana.publicHolidays.some((row) => row.name === "Mardi Gras"), true);
  assert.equal(oregon.publicHolidays.some((row) => row.name === "Day after Thanksgiving"), true);
  assert.equal(nevada.publicHolidays.some((row) => row.name === "Nevada Day"), true);
  assert.equal(kentucky.publicHolidays.some((row) => row.name === "Good Friday"), true);
  assert.equal(oklahoma.publicHolidays.some((row) => row.name === "Christmas Eve"), true);
  assert.equal(arkansas.publicHolidays.some((row) => row.name === "George Washington's Birthday and Daisy Gatson Bates Day"), true);
  assert.equal(utah.publicHolidays.some((row) => row.name === "Pioneer Day"), true);
  assert.equal(iowa.publicHolidays.some((row) => row.name === "Day after Thanksgiving"), true);
  assert.equal(kansas.publicHolidays.some((row) => row.name === "Juneteenth"), true);
  assert.equal(mississippi.publicHolidays.some((row) => row.name === "Confederate Memorial Day"), true);
  assert.equal(nebraska.publicHolidays.some((row) => row.name === "Arbor Day"), true);
  assert.equal(newMexico.publicHolidays.some((row) => row.name === "Indigenous Peoples' Day"), true);
  assert.equal(idaho.publicHolidays.some((row) => row.name === "Martin Luther King Jr. Day / Idaho Human Rights Day"), true);
  assert.equal(westVirginia.publicHolidays.some((row) => row.name === "West Virginia Day"), true);
  assert.equal(connecticut.publicHolidays.some((row) => row.name === "Good Friday"), true);
  assert.equal(delaware.publicHolidays.some((row) => row.name === "Return Day"), true);
  assert.equal(arizona.schoolTerms.length > 0, true);
  assert.equal(california.schoolTerms.length > 0, true);
  assert.equal(georgia.schoolTerms.length > 0, true);
  assert.equal(ohio.schoolTerms.length > 0, true);
  assert.equal(washington.schoolTerms.length > 0, true);
  assert.equal(tennessee.schoolTerms.length > 0, true);
  assert.equal(indiana.schoolTerms.length > 0, true);
  assert.equal(missouri.schoolTerms.length > 0, true);
  assert.equal(maryland.schoolTerms.length > 0, true);
  assert.equal(wisconsin.schoolTerms.length > 0, true);
  assert.equal(colorado.schoolTerms.length > 0, true);
  assert.equal(minnesota.schoolTerms.length > 0, true);
  assert.equal(alabama.schoolTerms.length > 0, true);
  assert.equal(southCarolina.schoolTerms.length > 0, true);
  assert.equal(louisiana.schoolTerms.length > 0, true);
  assert.equal(oregon.schoolTerms.length > 0, true);
  assert.equal(nevada.schoolTerms.length > 0, true);
  assert.equal(kentucky.schoolTerms.length > 0, true);
  assert.equal(oklahoma.schoolTerms.length > 0, true);
  assert.equal(arkansas.schoolTerms.length > 0, true);
  assert.equal(utah.schoolTerms.length > 0, true);
  assert.equal(iowa.schoolTerms.length > 0, true);
  assert.equal(kansas.schoolTerms.length > 0, true);
  assert.equal(mississippi.schoolTerms.length > 0, true);
  assert.equal(nebraska.schoolTerms.length > 0, true);
  assert.equal(newMexico.schoolTerms.length > 0, true);
  assert.equal(idaho.schoolTerms.length > 0, true);
  assert.equal(westVirginia.schoolTerms.length > 0, true);
  assert.equal(connecticut.schoolTerms.length > 0, true);
  assert.equal(delaware.schoolTerms.length > 0, true);
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
  assert.equal(urls.includes("https://daysuntil.is/us/arizona"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/california"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/florida"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/georgia"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/illinois"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/massachusetts"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/michigan"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/new-jersey"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/north-carolina"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/new-york"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/ohio"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/pennsylvania"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/texas"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/virginia"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/washington"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/tennessee"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/indiana"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/missouri"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/maryland"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/wisconsin"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/colorado"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/minnesota"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/alabama"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/south-carolina"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/louisiana"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/oregon"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/nevada"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/kentucky"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/oklahoma"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/arkansas"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/utah"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/iowa"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/kansas"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/mississippi"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/nebraska"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/new-mexico"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/idaho"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/west-virginia"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/connecticut"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/delaware"), true);
  assert.equal(urls.includes("https://daysuntil.is/au/days-until/summer"), true);
  assert.equal(urls.includes("https://daysuntil.is/uk/days-until/autumn"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/days-until/fall"), true);
  assert.equal(urls.includes("https://daysuntil.is/us/days-until/autumn"), false);
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
