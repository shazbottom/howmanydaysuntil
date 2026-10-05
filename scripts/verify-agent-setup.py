"""Validate only the project-local DaysUntil agent setup. Requires Python 3.11+."""
import json
from pathlib import Path
import tomllib

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    "du_orchestrator", "du_software_architect", "du_senior_developer",
    "du_frontend_developer", "du_backend_architect", "du_code_reviewer",
    "du_ux_architect", "du_ui_designer", "du_seo_specialist",
    "du_performance_specialist", "du_evidence_collector", "du_reality_checker",
}


def validate(root=ROOT):
    config = tomllib.loads((root / ".codex/config.toml").read_text(encoding="utf-8"))
    if set(config) != {"agents"}:
        raise ValueError("Project config may only configure this agent team.")
    agents = config["agents"]
    if agents.get("max_threads") != 3 or set(agents) != EXPECTED | {"max_threads"}:
        raise ValueError("Expected 12 registered roles and max_threads = 3.")
    files = list((root / ".codex/agents").glob("*.toml"))
    if {file.stem for file in files} != EXPECTED:
        raise ValueError("Agent directory does not match the selected roster.")
    for name in sorted(EXPECTED):
        entry = agents[name]
        if set(entry) != {"description", "config_file"}:
            raise ValueError(f"Unexpected registration fields for {name}.")
        relative = f"agents/{name}.toml"
        if entry["config_file"] != relative:
            raise ValueError(f"Registration path does not match {name}.")
        definition = tomllib.loads((root / ".codex" / relative).read_text(encoding="utf-8"))
        if not {"name", "description", "developer_instructions"} <= set(definition):
            raise ValueError(f"Missing standalone fields for {name}.")
        if set(definition) - {"name", "description", "developer_instructions", "sandbox_mode"}:
            raise ValueError(f"Unexpected settings in {name}; preserve session defaults.")
        if definition["name"] != name or definition["description"] != entry["description"]:
            raise ValueError(f"Identity mismatch for {name}.")
        instructions = definition["developer_instructions"]
        if not isinstance(instructions, str) or "AGENTS.md" not in instructions or len(instructions) < 300:
            raise ValueError(f"Missing project instructions for {name}.")
        if "sandbox_mode" in definition and definition["sandbox_mode"] != "read-only":
            raise ValueError(f"Unexpected permission override in {name}.")
    for relative in ["AGENTS.md", "docs/AI_WORKFLOW.md", "docs/AI_PROJECT_CONTEXT.md",
                     "docs/AI_AGENT_SOURCES.md", "docs/licenses/agency-agents-MIT.txt"]:
        if not (root / relative).is_file():
            raise ValueError(f"Missing workflow artifact: {relative}")
    return {"status": "VERIFIED", "scope": "Local TOML and workflow artifact validation only",
            "agents": sorted(EXPECTED), "count": len(EXPECTED),
            "runtimeLoading": "Not checked by this script"}


if __name__ == "__main__":
    try:
        print(json.dumps(validate(), indent=2))
    except (OSError, ValueError, tomllib.TOMLDecodeError) as error:
        raise SystemExit(f"Agent setup validation failed: {error}")
