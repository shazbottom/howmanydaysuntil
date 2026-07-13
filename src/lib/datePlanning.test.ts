import assert from "node:assert/strict";
import test from "node:test";
import { getExactDatePlanningData } from "./datePlanning";

test("date planner splits weekdays and weekend days without counting today", () => {
  const data = getExactDatePlanningData(
    new Date("2026-07-19T00:00:00"),
    new Date("2026-07-13T12:00:00"),
  );

  assert.equal(data.calendarDaysRemaining, 6);
  assert.equal(data.weekdaysRemaining, 4);
  assert.equal(data.weekendDaysRemaining, 2);
  assert.equal(data.dayOfYear, 200);
  assert.equal(data.daysInYear, 365);
  assert.equal(data.calendarWeeks.flat().find((cell) => cell.isTarget)?.day, 19);
  assert.equal(data.calendarWeeks.flat().find((cell) => cell.isToday)?.day, 13);
});

test("date planner handles leap day as a valid weekday", () => {
  const data = getExactDatePlanningData(
    new Date("2028-02-29T00:00:00"),
    new Date("2028-02-28T12:00:00"),
  );

  assert.equal(data.calendarDaysRemaining, 1);
  assert.equal(data.weekdaysRemaining, 1);
  assert.equal(data.weekendDaysRemaining, 0);
  assert.equal(data.daysInYear, 366);
});
