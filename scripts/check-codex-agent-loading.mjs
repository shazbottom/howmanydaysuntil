import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const isolated = args.includes("--isolated");
if (isolated) args.splice(args.indexOf("--isolated"), 1);
if (args.length !== 2 || args[0] !== "--codex") {
  console.error("Usage: node scripts/check-codex-agent-loading.mjs --codex <Codex executable> [--isolated]");
  process.exit(2);
}
const executable = args[1];
if (/\.(cmd|bat|ps1)$/i.test(executable)) {
  console.error("Use the actual codex.exe on Windows, not a shell wrapper.");
  process.exit(2);
}
const localConfig = readFileSync(path.join(root, ".codex", "config.toml"), "utf8");
const expected = [...localConfig.matchAll(/^\[agents\.(du_[a-z_]+)\]$/gm)].map(match => match[1]);
if (expected.length !== 12) throw new Error("Run verify-agent-setup.py first; expected 12 roles.");

// Read configuration through Codex itself. Never print the full config or stderr:
// inherited MCP configuration may contain credentials unrelated to this check.
const environment = { ...process.env };
if (isolated) {
  // Generated test fixture only: no user config, credentials or trust entries change.
  const fixtureHome = mkdtempSync(path.join(os.tmpdir(), "daysuntil-codex-config-check-"));
  const fixturePaths = new Set([root, root.toLowerCase(), path.toNamespacedPath(root)]);
  writeFileSync(path.join(fixtureHome, "config.toml"),
    [...fixturePaths].map(value => `[projects.${JSON.stringify(value)}]\ntrust_level = "trusted"\n`).join("\n"), "utf8");
  environment.CODEX_HOME = fixtureHome;
}
const child = spawn(executable, ["app-server", "--listen", "stdio://"], {
  cwd: root, env: environment, stdio: ["pipe", "pipe", "pipe"], windowsHide: true,
});
let buffer = "";
let finished = false;
const timer = setTimeout(() => finish({ status: "NOT VERIFIED", reason: "Config read timed out." }, 1), 20000);

function finish(report, code) {
  if (finished) return;
  finished = true;
  clearTimeout(timer);
  process.exitCode = code;
  console.log(JSON.stringify(report, null, 2));
  child.stdin.end();
  child.kill();
}

function send(message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

function normalizedPath(value) {
  return path.resolve(value).replace(/^\\\\\?\\/, "").toLowerCase();
}

child.stderr.on("data", () => {});
child.on("error", () => finish({ status: "NOT VERIFIED", reason: "Could not launch the supplied executable." }, 1));
child.stdin.on("error", () => finish({ status: "NOT VERIFIED", reason: "App-server input closed before configuration was read." }, 1));
child.on("exit", () => {
  if (!finished) finish({ status: "NOT VERIFIED", reason: "App-server exited before configuration was read." }, 1);
});
child.stdout.on("data", chunk => {
  buffer += chunk.toString();
  let newline;
  while ((newline = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, newline);
    buffer = buffer.slice(newline + 1);
    let message;
    try { message = JSON.parse(line); } catch { continue; }
    if (message.id === 1) {
      if (message.error) return finish({ status: "NOT VERIFIED", reason: "Initialization rejected." }, 1);
      send({ method: "initialized" });
      send({ id: 2, method: "config/read", params: { cwd: root, includeLayers: true } });
    }
    if (message.id !== 2) continue;
    if (message.error) return finish({ status: "NOT VERIFIED", reason: "Config read rejected." }, 1);
    const result = message.result;
    const registrations = result?.config?.agents ?? {};
    const maxThreads = registrations.max_concurrent_threads_per_session ?? registrations.max_threads;
    const layer = result?.layers?.find(item => item.name?.type === "project"
      && normalizedPath(item.name.dotCodexFolder) === normalizedPath(path.join(root, ".codex")));
    const missing = expected.filter(name => !registrations[name]?.config_file);
    const mismatched = expected.filter(name => {
      const registered = registrations[name]?.config_file;
      return registered && normalizedPath(path.resolve(root, ".codex", registered))
        !== normalizedPath(path.join(root, ".codex", "agents", `${name}.toml`));
    });
    const loaded = Boolean(layer && !layer.disabledReason && !missing.length && !mismatched.length
      && maxThreads === 3);
    finish({
      status: loaded ? "VERIFIED" : "NOT VERIFIED",
      scope: "Codex config/read: project layer, role registrations and concurrency",
      context: isolated ? "Isolated test home with fixture trust; not the active user's configuration" : "Current account configuration",
      projectLayerEnabled: Boolean(layer && !layer.disabledReason),
      projectLayerDisabledReason: layer?.disabledReason ?? null,
      registeredRoles: expected.filter(name => !missing.includes(name)),
      missing, mismatched, maxThreads: maxThreads ?? null,
      nativeRoleSpawning: "Not tested by this configuration-only check",
    }, loaded ? 0 : 1);
  }
});
send({ id: 1, method: "initialize", params: {
  clientInfo: { name: "daysuntil-agent-loading-check", version: "1.0.0" },
  capabilities: { experimentalApi: true },
} });
