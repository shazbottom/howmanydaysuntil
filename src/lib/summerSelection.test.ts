import assert from "node:assert/strict";
import test from "node:test";
import { getCountdownActions, formatActionDate } from "./countdownActions";
import { buildCountdownClusterMetadata, getCountdownClusterPageData } from "./countdownClusters";
import { getSelectedSummerTargets, getSummerCountdown, LEGACY_SUMMER, localizedSummerSelection, parseSummerSelection, summerSelectionQuery, summerTargetForYear, type SummerSelection } from "./summerSelection";

test("only a complete valid explicit selection changes legacy semantics", () => {
  for (const params of [{}, { hemisphere: "south" }, { method: "legacy", hemisphere: "south" }, { method: "invented", hemisphere: "south" }, { method: ["astronomical"], hemisphere: "north" }]) {
    assert.deepEqual(parseSummerSelection(params), LEGACY_SUMMER);
  }
  const selection = parseSummerSelection({ method: "astronomical", hemisphere: "south" });
  assert.deepEqual(selection, { method: "astronomical", hemisphere: "south" });
  assert.equal(summerSelectionQuery(selection), "?method=astronomical&hemisphere=south");
  assert.equal(summerSelectionQuery(LEGACY_SUMMER), "");
});

test("localized summer entry points preserve meteorological hemisphere", () => {
  for (const country of ["au", "nz", "us", "uk", "ca"]) {
    const selection = localizedSummerSelection(country);
    assert.equal(selection.method, "meteorological");
    assert.equal(selection.hemisphere, country === "au" || country === "nz" ? "south" : "north");
    assert.deepEqual(parseSummerSelection(Object.fromEntries(new URLSearchParams(summerSelectionQuery(selection)))), selection);
  }
});

test("meteorological conventions reverse hemispheres without changing the legacy URL", () => {
  assert.equal(summerTargetForYear({ method: "meteorological", hemisphere: "north" }, 2028)!.toISOString(), "2028-06-01T00:00:00.000Z");
  assert.equal(summerTargetForYear({ method: "meteorological", hemisphere: "south" }, 2028)!.toISOString(), "2028-12-01T00:00:00.000Z");
  const legacy = getCountdownClusterPageData("fridays-until-summer", new Date(2028, 0, 1))!;
  assert.equal(formatActionDate(legacy.targetDate), "2028-06-21");
  assert.equal(legacy.isExplicitSummer, false);
});

test("astronomical targets retain sourced leap-year dates and minute precision", () => {
  assert.equal(summerTargetForYear({ method: "astronomical", hemisphere: "north" }, 2028)!.toISOString(), "2028-06-20T20:02:00.000Z");
  assert.equal(summerTargetForYear({ method: "astronomical", hemisphere: "south" }, 2027)!.toISOString(), "2027-12-22T02:43:00.000Z");
  assert.equal(summerTargetForYear({ method: "astronomical", hemisphere: "south" }, 2036), null);
});

test("selected targets hold the UTC day and roll only on the next UTC date", () => {
  const selection: SummerSelection = { method: "astronomical", hemisphere: "south" };
  const now = new Date("2027-12-22T23:59:59Z");
  const today = getSelectedSummerTargets(selection, now)[0];
  assert.equal(today.toISOString(), "2027-12-22T02:43:00.000Z");
  assert.equal(getSummerCountdown(today, now).totalMillisecondsRemaining, 0);
  assert.equal(getSelectedSummerTargets(selection, new Date("2027-12-23T00:00:00Z"))[0].getUTCFullYear(), 2028);
  assert.equal(getSelectedSummerTargets(selection, new Date("2027-12-31T23:59:59Z"))[0].getUTCFullYear(), 2028);
});

test("UTC calendar arithmetic includes leap day without host timezone drift", () => {
  const result = getSummerCountdown(new Date("2028-06-01T00:00:00Z"), new Date("2028-02-28T23:59:59Z"));
  assert.equal(result.daysRemaining, 94);
  assert.equal(getSummerCountdown(new Date("2028-06-01T00:00:00Z"), new Date("2028-02-29T00:00:00Z")).daysRemaining, 93);
});

test("all explicit combinations keep rows, headline, sibling settings, lists and target actions consistent", () => {
  for (const method of ["astronomical", "meteorological"] as const) {
    for (const hemisphere of ["north", "south"] as const) {
      const selection = { method, hemisphere };
      for (const slug of ["fridays-until-summer", "weekends-until-summer"]) {
        const page = getCountdownClusterPageData(slug, new Date("2028-02-29T23:55:00Z"), selection)!;
        assert.equal(page.count, page.yearRows[0].count);
        assert.match(page.baselineLabel, /UTC/);
        assert.ok(page.selectedPath.endsWith(summerSelectionQuery(selection)));
        assert.ok(page.cardActionLinks.every((link) => link.href.endsWith(summerSelectionQuery(selection))));
        assert.ok(page.relatedLinks.every((link) => link.href.endsWith(summerSelectionQuery(selection))));
        assert.equal(formatActionDate(page.actionDate), page.targetDate.toISOString().slice(0, 10));
        assert.equal(new URL(getCountdownActions(page.actionDate, page.clusterLabel).business, "https://daysuntil.is").searchParams.get("target"), page.targetDate.toISOString().slice(0, 10));
        if (slug.startsWith("fridays")) assert.equal(page.remainingFridays.length, page.count);
      }
    }
  }
});

test("selected UTC Friday count agrees with independent UTC iteration near midnight", () => {
  const now = new Date("2028-06-02T23:30:00Z");
  const page = getCountdownClusterPageData("fridays-until-summer", now, { method: "astronomical", hemisphere: "north" })!;
  let expected = 0;
  for (const cursor = new Date("2028-06-02T00:00:00Z"); cursor <= page.targetDate; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    if (cursor.getUTCDay() === 5) expected++;
  }
  assert.equal(page.count, expected);
  assert.equal(page.remainingFridays.length, expected);
});

test("astronomical coverage truncates honestly and never substitutes legacy beyond its limit", () => {
  const selection: SummerSelection = { method: "astronomical", hemisphere: "north" };
  assert.equal(getSelectedSummerTargets(selection, new Date("2035-01-01T00:00:00Z")).length, 1);
  assert.equal(getSelectedSummerTargets(selection, new Date("2035-06-22T00:00:00Z")).length, 0);
  assert.equal(getCountdownClusterPageData("fridays-until-summer", new Date("2036-01-01T00:00:00Z"), selection), null);
});

test("Friday list never links beyond supported exact-date horizon", () => {
  const page = getCountdownClusterPageData("fridays-until-summer", new Date("2031-01-01T00:00:00Z"), { method: "astronomical", hemisphere: "north" })!;
  assert.ok(page.remainingFridays.length > 0);
  assert.ok(page.remainingFridays.every((row) => row.href === null));
});

test("all query variants are noindex with the original canonical", () => {
  const now = new Date("2028-01-01T00:00:00Z");
  for (const params of [{ method: "astronomical", hemisphere: "south" }, { method: "legacy" }, { method: "invalid" }, { tracking: "anything" }]) {
    const metadata = buildCountdownClusterMetadata("fridays-until-summer", now, params);
    assert.deepEqual(metadata.robots, { index: false, follow: true });
    assert.equal(metadata.alternates?.canonical, "/fridays-until-summer");
  }
  assert.equal(buildCountdownClusterMetadata("fridays-until-summer", now).robots, undefined);
});
