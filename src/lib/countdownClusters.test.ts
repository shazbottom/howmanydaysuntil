import assert from "node:assert/strict";
import test from "node:test";
import { buildCountdownClusterMetadata } from "./countdownClusters";

test("cluster metadata includes the live number of Fridays remaining", () => {
  const metadata = buildCountdownClusterMetadata(
    "fridays-until-summer",
    new Date("2026-08-15T12:00:00"),
  );

  assert.match(
    String(metadata.title),
    /^How Many Fridays Until Summer\? \d+ Fridays Left$/,
  );
  assert.match(String(metadata.description), /^There are \d+ fridays until Summer 2027\./);
});
