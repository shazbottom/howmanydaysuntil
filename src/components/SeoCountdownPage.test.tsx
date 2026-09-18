import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Children, isValidElement, type ReactNode } from "react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ExactDatePage from "../app/days-until/date/[year]/[month]/[day]/page";
import { getCountdown } from "../lib/countdown";
import { getExactDatePlanningData } from "../lib/datePlanning";
import { ExactDatePlanner } from "./ExactDatePlanner";
import { CountdownDisplay } from "./CountdownDisplay";
import { CalendarExportMenu } from "./CalendarExportMenu";
import type { AllDayCalendarEvent } from "../lib/calendarEvent";
import { SeoCountdownPage, type SeoCountdownPageProps } from "./SeoCountdownPage";

const targetDate = new Date(2027, 11, 25);
const now = new Date(2027, 10, 1);
const props: SeoCountdownPageProps = {
  eyebrow: "Exact date countdown",
  title: "How many days until 25 December 2027?",
  countdownLabel: "25 December 2027",
  countdown: getCountdown(targetDate, now),
  calendarPath: "/days-until/date/2027/12/25",
  cardActionLinks: [{ href: "/business-days-until?target=2027-12-25", label: "Business days" }],
  supportingCopy: [],
  relatedLinks: [],
};

function assertOrdered(html: string, texts: string[]) {
  let previous = -1;
  for (const text of texts) {
    const index = html.indexOf(text);
    assert.ok(index > previous, `Expected ${text} after the preceding content`);
    previous = index;
  }
}

test("planner layout is mobile-first and preserves card widths at the desktop breakpoint", () => {
  const html = renderToStaticMarkup(
    <SeoCountdownPage
      {...props}
      afterCardActions={<div>Edit date here</div>}
      countdownAside={<ExactDatePlanner data={getExactDatePlanningData(targetDate, now)} businessDaysHref="/business-days-until?target=2027-12-25" embedded />}
    />,
  );
  assert.match(html, /data-countdown-layout="with-planner"/);
  assert.match(html, /grid-cols-1 items-start justify-items-center/);
  assert.match(html, /xl:grid-cols-2 xl:gap-8/);
  assert.match(html, /max-w-4xl xl:max-w-\[70rem\]/);
  assert.match(html, /sm:max-w-\[34rem\]/);
  assert.doesNotMatch(html, /\bflex-1\b/);
  assertOrdered(html, ['aria-label="Countdown display"', "Save this countdown", "Add to calendar", ">Business days<", "Edit date here", "Date planner"]);
});

test("unrelated pages keep a single column and do not reserve empty sidebar space", () => {
  const html = renderToStaticMarkup(<SeoCountdownPage {...props} />);
  assert.match(html, /data-countdown-layout="single"/);
  assert.doesNotMatch(html, /xl:grid-cols-2|xl:max-w-\[70rem\]|\bflex-1\b/);
});

test("season controls can appear before the countdown without enabling a sidebar", () => {
  const html = renderToStaticMarkup(<SeoCountdownPage {...props} countdownControls={<div>Season controls</div>} />);
  assertOrdered(html, ["Season controls", 'aria-label="Countdown display"', "Save this countdown"]);
  assert.doesNotMatch(html, /xl:grid-cols-2/);
});

test("embedded planner removes its outer margin while standalone planner retains it", () => {
  const plannerProps = { data: getExactDatePlanningData(targetDate, now), businessDaysHref: "/business-days-until?target=2027-12-25" };
  const standalone = renderToStaticMarkup(<ExactDatePlanner {...plannerProps} />);
  const embedded = renderToStaticMarkup(<ExactDatePlanner {...plannerProps} embedded />);
  assert.match(standalone, /^<section class="mt-12 /);
  assert.match(embedded, /^<section class="w-full /);
  assert.ok(embedded.includes('href="/business-days-until?target=2027-12-25"'));
});

test("exact-date route renders one planner after actions and editor in mobile DOM order", async () => {
  const page = await ExactDatePage({ params: Promise.resolve({ year: "2027", month: "12", day: "25" }) });
  const router = { back() {}, forward() {}, refresh() {}, push() {}, replace() {}, prefetch() {} };
  const html = renderToStaticMarkup(<AppRouterContext.Provider value={router}>{page}</AppRouterContext.Provider>);
  assert.match(html, /data-countdown-layout="with-planner"/);
  assert.equal(html.split("Date planner").length - 1, 1);
  assert.equal(html.split("Choose another date").length - 1, 1);
  assertOrdered(html, ['aria-label="Countdown display"', "Save this countdown", "Add to calendar", "Choose another date", "Date planner", "Date details"]);
  assert.match(html, /value="2027-12-25"/);
  assert.ok(html.includes("/create?date=2027-12-25&amp;title="));
});

test("explicit timezones format both the target day and year without shifting the instant", () => {
  const instant = new Date("2028-01-01T00:30:00Z");
  const countdown = getCountdown(instant, new Date("2027-12-30T00:00:00Z"));
  const utc = renderToStaticMarkup(<CountdownDisplay label="Boundary" countdown={countdown} timeZone="UTC" />);
  const pacific = renderToStaticMarkup(<CountdownDisplay label="Boundary" countdown={countdown} timeZone="America/Los_Angeles" />);
  assert.match(utc, />Saturday 1 Jan</);
  assert.match(utc, />2028</);
  assert.match(pacific, />Friday 31 Dec</);
  assert.match(pacific, />2027</);
  assert.equal(countdown.targetDate.toISOString(), "2028-01-01T00:30:00.000Z");
});

function findCalendarEvent(node: ReactNode): AllDayCalendarEvent | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ children?: ReactNode; event?: AllDayCalendarEvent }>(child)) continue;
    if (child.type === CalendarExportMenu) return child.props.event;
    const event = findCalendarEvent(child.props.children);
    if (event) return event;
  }
}

test("season overrides preserve UTC display, save day and explicit calendar metadata independently", () => {
  const countdown = getCountdown(new Date("2028-01-01T00:30:00Z"), new Date("2027-12-30T00:00:00Z"));
  const event: AllDayCalendarEvent = {
    title: "Season begins (UTC)",
    date: "2028-01-01",
    description: "Astronomical instant: 00:30 UTC",
    url: "https://daysuntil.is/days-until-summer?hemisphere=south&definition=astronomical",
    fileName: "summer-utc",
  };
  const overrideProps = {
    ...props,
    countdown,
    countdownTimeZone: "UTC",
    actionDateOverride: new Date(2028, 0, 1),
    calendarEventOverride: event,
    calendarPath: undefined,
  };
  const html = renderToStaticMarkup(<SeoCountdownPage {...overrideProps} />);
  assert.match(html, />Saturday 1 Jan</);
  assert.match(html, />2028</);
  assert.ok(html.includes("/create?date=2028-01-01&amp;title="));
  assert.match(html, /Add to calendar/);
  assert.deepEqual(findCalendarEvent(SeoCountdownPage(overrideProps)), event);
});

test("calendar and save use the original local date when no overrides are supplied", () => {
  const event = findCalendarEvent(SeoCountdownPage(props));
  assert.equal(event?.date, "2027-12-25");
  assert.equal(event?.url, "https://daysuntil.is/days-until/date/2027/12/25");
  const html = renderToStaticMarkup(<SeoCountdownPage {...props} />);
  assert.ok(html.includes("/create?date=2027-12-25&amp;title="));
});
