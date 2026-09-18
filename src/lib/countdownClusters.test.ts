import assert from "node:assert/strict";
import test from "node:test";
import { getCountdownClusterDefinitions, getCountdownClusterPageData } from "./countdownClusters";
import { getOccurrenceHeading } from "./seoHubPageContent";

test("cluster first occurrence uses the same baseline as the headline", () => {
  for (const now of [new Date(2026, 8, 18, 12), new Date(2026, 11, 25, 12), new Date(2026, 8, 20, 12)]) {
    for (const definition of getCountdownClusterDefinitions()) {
      const page = getCountdownClusterPageData(definition.slug, now)!;
      assert.equal(page.yearRows[0].count, page.count, definition.slug);
      assert.match(page.baselineLabel, /All counts start from today/);
      assert.ok(page.yearRows[1].count > page.yearRows[0].count);
      if (definition.kind === "fridays") assert.equal(page.remainingFridays.length, page.count);
    }
  }
});

test("single fixed-year rows are labelled as target dates", () => {
  assert.equal(getOccurrenceHeading(1), "Target date");
  assert.equal(getOccurrenceHeading(5), "Next 5 occurrences");
});

test("summer retains June 21 and explicitly describes its approximate convention", () => {
  const page = getCountdownClusterPageData("fridays-until-summer", new Date(2028, 0, 1))!;
  assert.equal(page.targetDate.getMonth(), 5);
  assert.equal(page.targetDate.getDate(), 21);
  assert.match(page.seasonNote!, /approximate Northern Hemisphere/);
  assert.match(page.seasonNote!, /not the exact astronomical/);
  assert.equal(getCountdownClusterPageData("fridays-until-christmas")!.seasonNote, null);
});

test("Friday counts use calendar days across daylight-saving transitions", () => {
  const now = new Date(2026, 0, 2);
  const page = getCountdownClusterPageData("fridays-until-summer", now)!;
  let expected = 0;
  for (const cursor = new Date(now); cursor <= page.targetDate; cursor.setDate(cursor.getDate() + 1)) {
    if (cursor.getDay() === 5) expected += 1;
  }
  assert.equal(page.count, expected);
});
