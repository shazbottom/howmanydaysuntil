import assert from "node:assert/strict";
import test from "node:test";
import sitemap, { revalidate } from "../app/sitemap";
import { isExactDateIndexable } from "./exactDatePages";

test("sitemap publishes unique canonical public URLs, not tool variants or expired dates", () => {
  assert.equal(revalidate, 3600);
  const entries = sitemap();
  const urls = entries.map(entry => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const value of urls) {
    const url = new URL(value);
    assert.equal(url.origin, "https://daysuntil.is");
    assert.equal(url.search, "");
    assert.equal(url.hash, "");
    assert.doesNotMatch(url.pathname, /^\/(?:c|embed|calculator-preview)(?:\/|$)/);
    assert.doesNotMatch(url.pathname, /^\/days-until\/[^/]+$/);
    const match = url.pathname.match(/^\/days-until\/date\/(\d{4})\/(\d{2})\/(\d{2})$/);
    if (match) {
      assert.ok(isExactDateIndexable(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))), value);
    }
  }
});
