import assert from "node:assert/strict";
import test from "node:test";
import { getYearPlanningData } from "./yearPlanning";

test("year planner includes today when it matches the requested day type", () => {
  const now = new Date("2026-12-25T12:00:00");

  assert.equal(getYearPlanningData("fridays", now).count, 1);
  assert.equal(getYearPlanningData("weekends", now).count, 1);
  assert.equal(getYearPlanningData("working-days", now).count, 5);
});

test("weekend count includes the current weekend when today is Sunday", () => {
  const data = getYearPlanningData(
    "weekends",
    new Date("2026-12-27T12:00:00"),
  );

  assert.equal(data.count, 1);
  assert.equal(data.monthRows[0]?.count, 1);
});

test("final weekday of the year counts as one remaining working day", () => {
  const data = getYearPlanningData(
    "working-days",
    new Date("2026-12-31T12:00:00"),
  );

  assert.equal(data.count, 1);
  assert.equal(data.monthRows[0]?.count, 1);
});
