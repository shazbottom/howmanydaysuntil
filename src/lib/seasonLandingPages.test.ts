import assert from "node:assert/strict";
import test from "node:test";
import { getSeasonChoices, getSeasonLandingMetadata, seasonSlugs } from "./seasonLandingPages";
import { getCanonicalUrl, getLocalizedEventsForCountry } from "./events";
import { countries } from "./countries";
import sitemap from "../app/sitemap";
import config from "../../next.config";

test("all season destinations exist and are canonical country events", () => {
  for (const season of seasonSlugs) {
    const choices = getSeasonChoices(season);
    assert.equal(choices.length, 5);
    for (const choice of choices) {
      const country = countries.find(country => country.name === choice.country)!;
      const slug = choice.href.split("/").at(-1);
      const event = getLocalizedEventsForCountry(country.code).find(event => event.slug === slug)!;
      assert.ok(event);
      assert.equal(getCanonicalUrl(event, { countryCode: country.code, currentUrl: choice.href }), choice.href);
    }
    const path = `/days-until-${season}`;
    assert.equal(getSeasonLandingMetadata(season).alternates?.canonical, path);
    assert.equal(sitemap().filter(entry => entry.url === `https://daysuntil.is${path}`).length, 1);
  }
});

test("summer dates differ by hemisphere and US autumn uses fall", () => {
  const summer = getSeasonChoices("summer");
  assert.equal(summer.find(choice => choice.country === "Australia")?.start, "1 December");
  assert.equal(summer.find(choice => choice.country === "United States")?.start, "1 June");
  assert.equal(getSeasonChoices("autumn").find(choice => choice.country === "United States")?.href, "/us/days-until/fall");
});

test("fall aliases redirect permanently before the generic legacy rule", async () => {
  const redirects = await config.redirects!();
  for (const source of ["/days-until/fall", "/days-until-fall"]) {
    const index = redirects.findIndex(rule => rule.source === source);
    assert.ok(index >= 0 && index < redirects.findIndex(rule => rule.source === "/days-until/:slug"));
    assert.equal(redirects[index].destination, "/days-until-autumn");
    assert.equal(redirects[index].permanent, true);
  }
});
