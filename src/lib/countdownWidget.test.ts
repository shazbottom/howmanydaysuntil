import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCountdownWidgetEmbedCode,
  getDefaultCountdownWidgetConfig,
  parseCountdownWidgetConfig,
} from "./countdownWidget";

test("default widget rolls Christmas into the next year after December 25", () => {
  assert.equal(
    getDefaultCountdownWidgetConfig(new Date("2026-12-24T12:00:00")).targetDate,
    "2026-12-25",
  );
  assert.equal(
    getDefaultCountdownWidgetConfig(new Date("2026-12-26T12:00:00")).targetDate,
    "2027-12-25",
  );
});

test("widget search parameters are constrained to supported values", () => {
  const config = parseCountdownWidgetConfig(
    {
      title: "  A    useful countdown  ",
      date: "not-a-date",
      theme: "neon",
      accent: "red",
    },
    new Date("2026-07-13T12:00:00"),
  );

  assert.deepEqual(config, {
    title: "A useful countdown",
    targetDate: "2026-12-25",
    theme: "light",
    accent: "#e40a2d",
  });
});

test("generated embed code escapes attributes and applies the selected size", () => {
  const code = buildCountdownWidgetEmbedCode(
    {
      title: 'Paul & "friends"',
      targetDate: "2026-12-25",
      theme: "dark",
      accent: "#123456",
    },
    "compact",
  );

  assert.match(code, /width="320" height="220"/);
  assert.match(code, /Paul &amp; &quot;friends&quot; countdown/);
  assert.match(code, /theme=dark/);
  assert.match(code, /accent=%23123456/);
  assert.match(code, /Countdown by DaysUntil/);
  assert.match(code, /rel="nofollow noopener"/);
  assert.equal(code.includes("<script"), false);
});
