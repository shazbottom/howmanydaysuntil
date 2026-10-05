import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CalculatorPreviewShell } from "./CalculatorPreviewShell";
import { getDefaultCalculatorValues } from "../../lib/calculatorShare";

const initialValues = getDefaultCalculatorValues(new Date("2026-12-24T01:00:00Z"));

test("generic business calculator requires a holiday calendar confirmation before a result", () => {
  const html = renderToStaticMarkup(<CalculatorPreviewShell activeCalculator="business-days-until" initialValues={initialValues} />);
  assert.match(html, /Business days until a date<\/h1>/);
  assert.match(html, /Example calendar:/);
  assert.match(html, /Australian Capital Territory/);
  assert.match(html, /Use this holiday calendar/);
  assert.doesNotMatch(html, /aria-label="Calculator result"/);
  assert.doesNotMatch(html, /Copy link to return/);
});

test("shared business result shows only business units and keeps broader navigation after controls", () => {
  const html = renderToStaticMarkup(<CalculatorPreviewShell activeCalculator="business-days-between" initialValues={{ ...initialValues, hasExplicitHolidayCalendar: true, startDate: "2026-12-24", endDate: "2026-12-28", regionId: "au-nsw" }} />);
  assert.match(html, /aria-label="Calculator result"/);
  assert.match(html, /Using New South Wales, Australia holiday calendar/);
  assert.match(html, /Monday to Friday/);
  assert.match(html, /personal leave/);
  assert.doesNotMatch(html, />hrs<|>min<|>sec<|1 week/);
  assert.ok(html.indexOf('aria-label="Calculator result"') < html.indexOf('aria-label="Other date calculators"'));
  assert.match(html, /Copy link to return to this result/);
});

test("calendar-day calculators retain their calendar units", () => {
  const html = renderToStaticMarkup(<CalculatorPreviewShell activeCalculator="days-between" initialValues={{ ...initialValues, startDate: "2026-12-01", endDate: "2026-12-08" }} />);
  assert.match(html, /1 week/);
  assert.match(html, />hrs</);
});
