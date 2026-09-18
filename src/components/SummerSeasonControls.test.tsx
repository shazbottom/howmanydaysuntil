import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SummerSeasonControls } from "./SummerSeasonControls";

test("season settings are compact and closed initially with accessible explicit GET controls", () => {
  const html = renderToStaticMarkup(<SummerSeasonControls path="/fridays-until-summer" selection={{ method: "astronomical", hemisphere: "south" }} />);
  assert.match(html, /<details/);
  assert.doesNotMatch(html, /<details[^>]*\sopen/);
  assert.match(html, /Southern Hemisphere astronomical summer/);
  assert.match(html, /Change season settings/);
  assert.match(html, /method="get"/);
  assert.match(html, /name="hemisphere"/);
  assert.match(html, /value="south" selected/);
  assert.match(html, /Apply season settings/);
  assert.match(html, /Reset to original/);
});
