# Workflow setup evidence - 2026-10-05

Overall: **TESTED BUT PARTIALLY VERIFIED**. Project artifacts and compatibility are
verified. The normal account currently skips the project config because it has no
trusted-project entry. Native spawning of all 12 custom types is not verified.

## Checks completed

| Check | Observed result |
| --- | --- |
| Repository inspection | `main`; only two pre-existing temporary export directories untracked before setup |
| Upstream inspection | Agency commit `83294689da3832c0a9f223221148c411fd3eacc0`; selected definitions, installer, converter and license read; neither installer executed |
| TOML/artifact validator | Exit 0; 12 matching standalone definitions/registrations; max_threads = 3; no model/provider/credential overrides |
| Desktop 0.160.0 config/read | Exit 0 in isolated trusted fixture; project layer enabled, all 12 registrations resolved, limit = 3 |
| Terminal CLI 0.116.0 config/read | Exit 0 in isolated trusted fixture; project layer enabled, all 12 registrations resolved, limit = 3 |
| Normal account config/read | Exit 1 as intended: project layer disabled due to absent trust; no trust/config mutation performed |
| New JavaScript scripts | Node syntax checks and scoped ESLint passed |
| New unit-test runner | Compiled 22 TS/TSX files; all 100 existing tests passed |
| Existing Python tests | All 28 passed |
| TypeScript inspection | `tsc --noEmit --incremental false` passed during independent repository inspection |
| Existing scoped lint baseline | 12 errors and six warnings; application fixes outside this task |

Commands used:

```powershell
python -B scripts/verify-agent-setup.py
node --check scripts/run-unit-tests.mjs
node --check scripts/check-codex-agent-loading.mjs
node node_modules/eslint/bin/eslint.js scripts/run-unit-tests.mjs scripts/check-codex-agent-loading.mjs
node scripts/run-unit-tests.mjs
python -B -m unittest discover -s scripts -p "test_*.py"
node scripts/check-codex-agent-loading.mjs --codex "C:/Users/paulr/AppData/Local/OpenAI/Codex/bin/8aaf1547b825b104/codex.exe" --isolated
node scripts/check-codex-agent-loading.mjs --codex "C:/Users/paulr/AppData/Roaming/npm/node_modules/@openai/codex/node_modules/@openai/codex-win32-x64/vendor/x86_64-pc-windows-msvc/codex/codex.exe" --isolated
```

Python runs used the available bundled Python executable. Each isolated runtime
check generated a temporary home with trust for this repository only. No account
credentials were copied and no model request was made. Registrations and file
syntax are verified separately; this is not a claim that native role spawning or
your current desktop session's reloading behavior was exercised.

The unit runner writes fresh compiled artifacts under ignored `.next/`. Runtime
checks can generate normal app-server state/log artifacts. No application source,
package file, dependency, deployment setting or environment variable was changed.
No production build/browser check was required for this configuration-only task;
website behavior and live deployment were not reverified.

Independent code review found no actionable static defects. Review and final check
use explicit role-instruction fallback because this session's exposed spawn tool
does not offer a named custom-agent selector. Fallback delegation is not native
role-loading evidence.

The independent Reality Checker also returned **TESTED BUT PARTIALLY VERIFIED**
with no actionable defects. It reran TOML validation, both JavaScript syntax checks,
scoped script lint and desktop 0.160.0 isolated config/read successfully, inspected
all setup files, and confirmed the tracked/staged diff contained no application
changes. It did not independently rerun the application/Python suites or certify
normal-account trust, active-session reloading or native spawning.

## Start using it

Start a new task in this repository and accept Codex's repository trust prompt if
offered. If the runtime still reports the project as untrusted, use Codex's normal
project trust configuration before expecting `.codex/config.toml` to load. Rerun the
runtime check without `--isolated` to verify your normal account. Do not copy the
temporary fixture into your global config; it is only a compatibility test.

Then ask: "Use the DaysUntil workflow to implement [change] and verify it."
If named spawning is unavailable, `AGENTS.md` supplies the explicit instruction
fallback and requires disclosure. The website does not need deployment for this setup.

## Exact file inventory

All 22 files are new; no existing tracked files were modified:

```text
AGENTS.md
.codex/config.toml
.codex/agents/du_orchestrator.toml
.codex/agents/du_software_architect.toml
.codex/agents/du_senior_developer.toml
.codex/agents/du_frontend_developer.toml
.codex/agents/du_backend_architect.toml
.codex/agents/du_code_reviewer.toml
.codex/agents/du_ux_architect.toml
.codex/agents/du_ui_designer.toml
.codex/agents/du_seo_specialist.toml
.codex/agents/du_performance_specialist.toml
.codex/agents/du_evidence_collector.toml
.codex/agents/du_reality_checker.toml
docs/AI_WORKFLOW.md
docs/AI_PROJECT_CONTEXT.md
docs/AI_AGENT_SOURCES.md
docs/AI_SETUP_VERIFICATION.md
docs/licenses/agency-agents-MIT.txt
scripts/run-unit-tests.mjs
scripts/verify-agent-setup.py
scripts/check-codex-agent-loading.mjs
```

No commit or push performed. To version this setup when desired:

```powershell
git add AGENTS.md .codex/config.toml .codex/agents docs/AI_WORKFLOW.md docs/AI_PROJECT_CONTEXT.md docs/AI_AGENT_SOURCES.md docs/AI_SETUP_VERIFICATION.md docs/licenses/agency-agents-MIT.txt scripts/run-unit-tests.mjs scripts/verify-agent-setup.py scripts/check-codex-agent-loading.mjs
git commit -m "Add project-specific Codex specialist workflow"
git push origin main
```
