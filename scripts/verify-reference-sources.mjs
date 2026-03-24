import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import referenceAttributions from "../src/data/referenceAttributions.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const reportPath = path.join(repoRoot, "reports", "reference-source-check.md");
const REVIEW_INTERVAL_DAYS = 14;

function daysBetween(left, right) {
  const diffMs = right.getTime() - left.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function flattenChecks() {
  const checks = [];

  for (const [countryCode, attribution] of Object.entries(
    referenceAttributions.countryHolidayAttributions,
  )) {
    checks.push({
      scope: `country:${countryCode}:public-holidays`,
      sources: attribution.sources,
      lastChecked: attribution.lastChecked,
    });
  }

  for (const [regionId, attribution] of Object.entries(referenceAttributions.regionAttributions)) {
    checks.push({
      scope: `region:${regionId}:public-holidays`,
      sources: attribution.publicHolidays.sources,
      lastChecked: attribution.publicHolidays.lastChecked,
    });
    checks.push({
      scope: `region:${regionId}:school-terms`,
      sources: attribution.schoolTerms.sources,
      lastChecked: attribution.schoolTerms.lastChecked,
    });
  }

  return checks;
}

async function fetchSource(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "DaysUntilSourceVerifier/1.0 (+https://daysuntil.is)",
      },
    });

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      title: titleMatch?.[1]?.trim() ?? "",
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      finalUrl: url,
      title: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const today = new Date();
  const checks = flattenChecks();
  const results = [];

  for (const check of checks) {
    const checkedAt = new Date(`${check.lastChecked}T00:00:00Z`);
    const daysSinceChecked = daysBetween(checkedAt, today);
    const sourceResults = [];

    for (const source of check.sources) {
      if (!source.href) {
        sourceResults.push({
          label: source.label,
          ok: true,
          status: "n/a",
          finalUrl: "",
          title: "",
          note: "No URL configured",
        });
        continue;
      }

      const result = await fetchSource(source.href);
      sourceResults.push({
        label: source.label,
        ok: result.ok,
        status: result.status ?? "error",
        finalUrl: result.finalUrl,
        title: result.title,
        note: result.error ?? "",
      });
    }

    results.push({
      ...check,
      daysSinceChecked,
      reviewDue: daysSinceChecked >= REVIEW_INTERVAL_DAYS,
      sourceResults,
    });
  }

  const summary = {
    total: results.length,
    reviewDue: results.filter((result) => result.reviewDue).length,
    failed: results.filter((result) =>
      result.sourceResults.some((sourceResult) => sourceResult.ok === false),
    ).length,
  };

  const lines = [
    "# Reference Source Check",
    "",
    `Generated: ${today.toISOString()}`,
    `Review interval: ${REVIEW_INTERVAL_DAYS} days`,
    "",
    `- Total datasets: ${summary.total}`,
    `- Review due: ${summary.reviewDue}`,
    `- Datasets with failed source fetches: ${summary.failed}`,
    "",
  ];

  for (const result of results) {
    lines.push(`## ${result.scope}`);
    lines.push("");
    lines.push(`- Last checked: ${result.lastChecked}`);
    lines.push(`- Days since checked: ${result.daysSinceChecked}`);
    lines.push(`- Review due: ${result.reviewDue ? "yes" : "no"}`);
    lines.push("");
    lines.push("| Source | Status | Page title | Final URL | Notes |");
    lines.push("| --- | --- | --- | --- | --- |");

    for (const sourceResult of result.sourceResults) {
      lines.push(
        `| ${sourceResult.label} | ${sourceResult.status} | ${sourceResult.title || "-"} | ${sourceResult.finalUrl || "-"} | ${sourceResult.note || "-"} |`,
      );
    }

    lines.push("");
  }

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");

  console.log(`Wrote report to ${reportPath}`);
  console.log(
    `Summary: ${summary.total} datasets, ${summary.reviewDue} due for review, ${summary.failed} with failed source fetches.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
