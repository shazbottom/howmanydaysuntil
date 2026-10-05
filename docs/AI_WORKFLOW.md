# Working with the DaysUntil agent team

## Start a task

Open this repository in a **new Codex task** after setup. Root `AGENTS.md` supplies
the workflow; native custom agents live in `.codex/agents/`. Project configuration
loads only when the repository is trusted by that Codex installation. No global
agent files, models, credentials or permission settings are installed here.

Normal requests are enough:

> Fix this countdown bug. Use the DaysUntil workflow and verify the affected case.

> Add this UI feature. Have du_ux_architect clarify the interaction, then use
> du_frontend_developer, du_code_reviewer and du_reality_checker as appropriate.

> Review these Search Console exports with du_seo_specialist. Make only changes
> supported by the evidence and verify metadata/indexing behavior.

The parent acts as orchestrator. It reads the `du_orchestrator` instructions rather
than spawning another coordinator. Trivial edits can stay in the parent; substantial
work gets bounded implementation and independent review/final verification.
If the current tool cannot select named roles, the parent passes the selected
file's `developer_instructions` to a normal subagent and reports that fallback.
This fallback is not evidence of native custom-agent discovery.

## Available roles

| Agent | Use it for |
| --- | --- |
| `du_orchestrator` | Acceptance criteria, specialist selection, scope, handoffs and completion gate |
| `du_software_architect` | Architecture/data-flow decisions; prefers simple, reversible designs |
| `du_senior_developer` | Difficult debugging, integration and minimal cross-cutting implementation |
| `du_frontend_developer` | React UI, interactions, hydration, responsive behavior and accessibility |
| `du_backend_architect` | APIs, Redis, caching, validation and backend reliability |
| `du_code_reviewer` | Independent critical review of bugs, regressions and missing coverage |
| `du_ux_architect` | Journey, hierarchy, input/error states and usability requirements |
| `du_ui_designer` | Focused visual specifications consistent with the existing site |
| `du_seo_specialist` | Search intent, content quality, indexing, metadata and measurement |
| `du_performance_specialist` | Repeatable CWV/rendering/bundle/cache measurements and focused fixes |
| `du_evidence_collector` | Executable checks, browser interactions and reproducible artifacts |
| `du_reality_checker` | Independent acceptance check; challenges unsupported completion claims |

Sources and adaptations: `docs/AI_AGENT_SOURCES.md`. Implementation roles inherit
session permissions. Design, architecture, SEO and code-review roles declare a
read-only default; live session permission overrides may still take precedence.
Instructions also constrain their behavior. These files do not grant new tools.

## Select the smallest useful workflow

| Task | Typical sequence |
| --- | --- |
| Small bug | Developer -> focused review -> relevant verification; tiny edits need no spawned team |
| UI feature | UX/UI as needed -> Frontend -> Reviewer -> browser evidence -> Reality Checker |
| Architecture | Architect -> relevant Developer -> Reviewer -> tests/build -> Reality Checker |
| SEO | SEO -> Architect only if needed -> Developer -> Reviewer -> route/source/browser evidence -> Reality Checker |
| Performance | Performance baseline -> Developer -> Reviewer -> comparable measurements -> Reality Checker |
| Docs/config | Relevant specialist -> Reviewer -> parser/runtime validation -> Reality Checker |

At most three concurrent specialists; no nested delegation. Implementation writers
have separate file scopes; the parent integrates shared files. The final checker
must be independent of implementation. Roles may be combined for a small task
where independence is preserved. Do not run the entire roster on every change.

Hand off only:

```text
Task and acceptance criteria:
Relevant files and permitted write scope:
Constraints and decisions already made:
Work performed / diff:
Unresolved issues:
Evidence: command, environment, result, artifact:
Required output and next owner:
```

## Verification commands

Run from the repository root. Use `npm.cmd` on Windows if PowerShell blocks `npm.ps1`.
For a substantial application change, run the applicable checks below and build.
For configuration/docs-only work, use the configuration check and relevant script
checks; a website build or visual test is not proof of agent configuration loading.

```powershell
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js src
node scripts/run-unit-tests.mjs
python -B -m unittest discover -s scripts -p "test_*.py"
npm.cmd run build
```

The unit-test runner compiles TS/TSX tests into a fresh ignored `.next/` folder and
uses Node's test runner. Python audit tests need Python 3.11+ for the new config
validator; use an available Python executable. Record pre-existing lint failures
separately; avoid unrelated fixes simply to make a report green.

Start the development server when browser verification is needed:

```powershell
npm.cmd run dev -- --port 3020
```

Use the port actually available. For changed UI, inspect at least one narrow mobile
and one desktop viewport, keyboard interaction, console, affected light/dark states
and the key user journey. For backend writes, use isolated storage and synthetic
records. For SEO/routing changes inspect responses, redirect destinations, canonical,
robots, title/description, OG tags, JSON-LD and sitemap eligibility as relevant.
Measure performance on comparable production builds; do not call source guesses CWV
results. Respect browser permissions and report any blocked check.

Evidence should identify the final diff, command/exit, timezone/build mode, route,
viewport and artifact path. Screenshots establish appearance; saved-data assertions
establish persistence. Record every failed or untested applicable criterion.

Completion status:

- **VERIFIED**: all applicable acceptance criteria checked in the named environment.
- **TESTED BUT PARTIALLY VERIFIED**: checks passed, but applicable browser/service/
  deployment checks are missing; explain which ones.
- **NOT VERIFIED**: meaningful executable verification is missing or required checks
  failed; explain what remains.

No invented scores or mandatory failure/revision quotas. A local result does not
verify a live deployment. Report changed files and relevant follow-ups. Commit/push/
deploy only when explicitly requested; avoid `git add .` because runtime/private
data and old exports may be present. Provide scoped commands after changes.

## Validate or update the team

```powershell
python -B scripts/verify-agent-setup.py
node scripts/check-codex-agent-loading.mjs --codex "C:/path/to/codex.exe"
node scripts/check-codex-agent-loading.mjs --codex "C:/path/to/codex.exe" --isolated
```

The first checks TOML, roster, paths and project-only settings. The runtime check
starts a separate stdio app-server and requests `config/read`; it makes no model
request or change to your trust/credentials and prints only this team's registrations
and project-layer status. Use the desktop binary when your PATH CLI is older.
`--isolated` generates a temporary Codex home with a fixture trust entry to test
compatibility without changing the real account. Success in that mode is evidence
of runtime compatibility, not evidence that your active session loads the files.
A disabled project layer is a real loading gap. Start a new trusted task and rerun.
Runtime registrations do not establish that every specialist was natively spawned.

Do not run upstream install/convert scripts over this setup. For an intentional
update, review selected upstream files at a pinned commit, adapt the useful behavior,
update source attribution and validate. Preserve the MIT notice. See
[official Codex subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents).
