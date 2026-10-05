import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { BusinessDayExplanation } from "./BusinessDayExplanation";

test("business-day explanation renders deductions, endpoints and source attribution", () => {
  const html = renderToStaticMarkup(<BusinessDayExplanation start="2026-12-24" end="2026-12-28" countryCode="au" regionId="au-nsw" />);
  for (const text of ["2026-12-24 (excluded)", "included if a working day", "Christmas Day", "Boxing Day additional", "Using New South Wales, Australia holiday calendar.", "Monday to Friday", "personal leave", "Last checked:", "href="]) {
    assert.ok(html.includes(text), text);
  }
});

test("business-day explanation makes fallback and missing data visible", () => {
  const html = renderToStaticMarkup(<BusinessDayExplanation start="2027-12-24" end="2029-01-03" countryCode="ca" regionId="ca-on" />);
  assert.match(html, /country-level fallback used/);
  assert.match(html, /No maintained holiday dates available/);
  assert.match(html, /may overstate working days/);
});

test("business-day explanation distinguishes no deductions from missing coverage", () => {
  const html = renderToStaticMarkup(<BusinessDayExplanation start="2026-02-02" end="2026-02-03" countryCode="au" regionId="au-nsw" />);
  assert.match(html, /No dated weekday holidays/);
  assert.doesNotMatch(html, /No maintained holiday dates available/);
});
