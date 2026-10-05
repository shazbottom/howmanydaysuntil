# Agent sources and adaptations

Source: [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents),
inspected at commit `83294689da3832c0a9f223221148c411fd3eacc0` on 2026-10-05.
License: MIT; notice preserved in `docs/licenses/agency-agents-MIT.txt`.
These are concise project adaptations of selected definitions, not verbatim copies
or an installation of the upstream catalog.

| Local agent | Upstream file | Why selected / adaptation |
| --- | --- | --- |
| du_orchestrator | specialized/agents-orchestrator.md | Scope, specialist handoffs and QA feedback; remove full-agency startup pipeline and fixed retry quotas |
| du_software_architect | engineering/engineering-software-architect.md | Tradeoffs and reversible designs; preserve the existing Next.js application |
| du_senior_developer | engineering/engineering-minimal-change-engineer.md | Minimal diffs fit production maintenance; permit related-code inspection and necessary integration/refactoring |
| du_frontend_developer | engineering/engineering-frontend-developer.md | React, responsive UI and accessibility; narrow to Next.js rather than multi-framework/editor tooling |
| du_backend_architect | engineering/engineering-backend-architect.md | Data/API reliability and security; target existing Redis adapters rather than hypothetical infrastructure |
| du_code_reviewer | engineering/engineering-code-reviewer.md | Actionable correctness/security/performance findings; add Next.js/SEO/hydration risks and independence |
| du_ux_architect | design/design-ux-architect.md | Developer-ready hierarchy/interaction specs; remove ownership of repo topology and mandatory new design systems |
| du_ui_designer | design/design-ui-designer.md | Consistency and accessible visual design; preserve current fonts, cards, seasonal themes and colors |
| du_seo_specialist | marketing/marketing-seo-specialist.md | Intent, crawlability, content and measurement; disclose absent query data instead of impossible prerequisite rules |
| du_performance_specialist | testing/testing-performance-benchmarker.md | Baselines and before/after measurements; use INP, distinguish field/lab evidence, avoid unrequested load tests |
| du_evidence_collector | testing/testing-evidence-collector.md | Reproducible screenshots plus behavioral proof; use actual tools/scripts instead of imaginary Laravel capture commands |
| du_reality_checker | testing/testing-reality-checker.md | Independent challenge of completion claims; remove automatic failure, grade quotas and required revision counts |

The upstream `engineering-senior-developer.md` assumes Laravel/Livewire/FluxUI,
Three.js and premium redesigns. It was inspected and deliberately not installed.
All adapted roles remove fictional persistent memory and personality directives.
Common production-project guardrails live in root `AGENTS.md` rather than repeating
the entire code map in every role. No model is pinned; account availability and
parent session choices remain authoritative.

## Installer inspection

`scripts/convert.sh` converts whole source bodies into standalone TOML and normally
scans all agent directories. `scripts/install.sh` supports selections (`--agent`,
`--agents-file`) and a `CODEX_AGENTS_DIR` destination override, but its Codex default
copies generated files into `~/.codex/agents/`. Conversion also cleans generated
integration output before regeneration. Both scripts were read; neither was executed.
Direct creation of 12 adapted local files avoids global pollution and catalog bulk.

Upstream also informed compact handoffs via `strategy/coordination/handoff-templates.md`.
Our handoffs omit unnecessary organizational/sprint metadata.

## Codex format

[Official subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents)
defines project-scoped `.codex/agents/*.toml` files with `name`, `description` and
`developer_instructions`. The installed desktop runtime reports 0.160.0; PATH CLI
reports 0.116.0. Explicit `agents.<name>.config_file` registrations in the project
config provide the legacy loading path, alongside standalone fields for newer
discovery. The filenames, names and registrations deliberately match.

Read-only role defaults are defense in depth, not a guarantee against live parent
permission overrides. No global settings, trust levels, credentials, tool servers
or model providers are modified by the setup. Check loading with the provided
runtime script, and record native spawning separately from config registration.
