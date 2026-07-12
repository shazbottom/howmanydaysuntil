import assert from "node:assert/strict";
import test from "node:test";
import { createOrganizationJsonLd, createWebPageJsonLd } from "./structuredData";

test("countdown schema describes a webpage rather than an event", () => {
  const schema = createWebPageJsonLd({
    name: "How many days until Christmas?",
    description: "A live countdown to Christmas.",
    path: "/days-until-christmas",
    about: "Christmas",
  });

  assert.equal(schema["@type"], "WebPage");
  assert.equal(schema.url, "https://daysuntil.is/days-until-christmas");
  assert.deepEqual(schema.about, {
    "@type": "Thing",
    name: "Christmas",
  });
  assert.equal("organizer" in schema, false);
});

test("organisation schema references the published logo asset", () => {
  const schema = createOrganizationJsonLd();

  assert.equal(
    schema.logo,
    "https://daysuntil.is/logo/logo-large-no-text.svg",
  );
});
