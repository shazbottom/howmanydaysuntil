# Codex workflow for daysuntil.is

This is an existing production Next.js application. Preserve its architecture,
working routes and visual language. Read `docs/AI_WORKFLOW.md` for task routing
and `docs/AI_PROJECT_CONTEXT.md` for the relevant code map; read only the parts
needed for the current task.

## Scope and collaboration

- Start with `git status --short` and the current branch. Preserve user changes.
- Solve the requested problem and directly related defects. Record unrelated
  improvements separately. Avoid unrequested redesigns, dependencies, abstractions
  and large refactors. Never reset, clean, rebase or force-push user work.
- The main agent coordinates work using the `du_orchestrator` instructions.
  For substantial work, read `.codex/agents/du_orchestrator.toml` before routing.
  Delegation to the project specialists is authorized when useful. Select only
  the roles relevant to the task; trivial edits do not require spawning agents.
- For substantial work, assign bounded implementation, obtain an independent
  code review, collect evidence, then use an independent `du_reality_checker`.
  A reviewer or final verifier must not approve their own implementation.
- Default to at most three concurrent specialists and no nested delegation.
  Give each writer a separate file scope. Coordinate shared files in the parent.
- Use concise handoffs: task, acceptance criteria, files/write scope, constraints,
  decisions, changes, unresolved issues and verification evidence. Do not pass
  the whole conversation or ask each specialist to rescan the repository.
- If custom role selection is unavailable in the current tool, disclose that
  limitation and pass the corresponding TOML `developer_instructions` to a
  normal subagent. Do not claim native role loading was verified by this fallback.

## Project guardrails

- Maintain strict TypeScript, React server/client boundaries, async Next.js
  route parameters, responsive layouts, keyboard access and accessible controls.
- Browser-only APIs, changing time and timezone formatting must not introduce
  hydration mismatches. Test calendar boundaries, leap years and DST when relevant.
- Protect metadata, canonicals, structured data, OG image URLs, sitemap policy
  and existing redirects. Never increase page volume merely to inflate indexing.
- Preserve the current production origin and country-specific season semantics.
  Domain normalization has previously caused loops; test the complete chain.
- Keep Redis secrets server-side. Do not print credentials or personal countdown
  contents. Use isolated test records/storage for create/delete testing.
- Do not stage `.env*`, `.local-data/`, `data/custom-countdowns.json`, old export
  folders or generated `.next` artifacts. Noindex is not access control.
- Check the installed scripts; there is no `npm test` command. Use the commands
  in the workflow document and select checks according to the affected behavior.

## Verification and delivery

For substantial application changes, run TypeScript, applicable lint and tests,
and a production build. Add route/source/metadata checks when relevant. For UI
changes, use permitted browser tooling to inspect desktop/mobile, console errors,
keyboard behavior, important interactions and light/dark states. Inspect screenshots;
static React rendering alone does not verify browser behavior.

Respect denied browser permissions. Report the exact missing verification instead
of trying another browser or transport to circumvent the denial. A local build,
local browser check and production deployment are separate evidence scopes.

Report one status, with evidence and gaps:

- **VERIFIED**: all applicable acceptance criteria checked in the named environment.
- **TESTED BUT PARTIALLY VERIFIED**: checks passed, but applicable browser, service
  or deployment verification is missing. Explain the gap.
- **NOT VERIFIED**: no meaningful executable check was completed, or required checks
  failed. Explain what remains before completion.

Record actual commands, exit/results, routes/viewports and artifact paths. Distinguish
pre-existing failures from new failures; never invent measurements or approvals.
For configuration/docs-only tasks, validate those artifacts rather than claiming
website behavior changed. No commit, push or deployment unless the user explicitly
requests it. After changes, list affected files and provide an appropriately scoped
Git/deploy command; say when no website deployment is needed.
