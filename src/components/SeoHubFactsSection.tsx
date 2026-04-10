"use client";

import { useEffect, useState } from "react";
import type { SeoHubFactSet } from "../lib/seoHubFacts";

interface FactSelection {
  sectionTitle: string;
  sectionIntro: string;
  fact: string;
}

function formatFactHeading(slug: string) {
  if (slug === "new-year") {
    return "New Years Day Facts";
  }

  return `${slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")} Facts`;
}

function buildSelections(factSet: SeoHubFactSet): FactSelection[] {
  return factSet.sections.map((section) => {
    const randomIndex = Math.floor(Math.random() * section.facts.length);

    return {
      sectionTitle: section.title,
      sectionIntro: section.intro,
      fact: section.facts[randomIndex] ?? section.facts[0],
    };
  });
}

function buildFallbackSelections(factSet: SeoHubFactSet): FactSelection[] {
  return factSet.sections.map((section) => ({
    sectionTitle: section.title,
    sectionIntro: section.intro,
    fact: section.facts[0],
  }));
}

export function SeoHubFactsSection({ factSet }: { factSet: SeoHubFactSet }) {
  const [selections, setSelections] = useState<FactSelection[]>(() =>
    buildFallbackSelections(factSet),
  );

  useEffect(() => {
    setSelections(buildSelections(factSet));
  }, [factSet]);

  return (
    <section className="mt-10 w-full max-w-3xl rounded-[2rem] bg-[#fdfcf9] px-6 py-8 text-left ring-1 ring-black/6 dark:bg-[#171717] dark:ring-white/10 sm:px-8">
      <h2 className="text-sm uppercase tracking-[0.24em] text-black/45 dark:text-white/46">
        {formatFactHeading(factSet.slug)}
      </h2>
      <div className="mt-6 space-y-6">
        {selections.map((selection) => (
          <div key={selection.sectionTitle}>
            <h3 className="text-base font-semibold tracking-tight text-black dark:text-white/90">
              {selection.sectionTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-black/62 dark:text-white/64 sm:text-base">
              {selection.sectionIntro}
            </p>
            <p className="mt-2 text-sm leading-6 text-black/72 dark:text-white/74 sm:text-base">
              {selection.fact}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
