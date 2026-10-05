import { readdirSync, mkdirSync, mkdtempSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function filesBelow(directory, matches) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(file, matches) : matches(entry.name) ? [file] : [];
  });
}

function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const tests = filesBelow(path.join(root, "src"), name => /\.test\.tsx?$/.test(name));
if (!tests.length) throw new Error("No TypeScript unit tests found.");
mkdirSync(path.join(root, ".next"), { recursive: true });
// A fresh ignored output directory prevents removed tests from running as stale JS.
const output = mkdtempSync(path.join(root, ".next", "ai-workflow-tests-"));
console.log(`Compiling ${tests.length} test files into ${path.relative(root, output)}`);
run([
  path.join(root, "node_modules", "typescript", "bin", "tsc"), ...tests,
  "--outDir", output, "--rootDir", root, "--module", "commonjs",
  "--moduleResolution", "node", "--target", "es2022", "--jsx", "react-jsx",
  "--esModuleInterop", "--resolveJsonModule", "--skipLibCheck",
  "--isolatedModules", "false", "--noEmit", "false",
]);
const compiled = filesBelow(path.join(output, "src"), name => name.endsWith(".test.js"));
if (compiled.length !== tests.length) throw new Error("Compiled test count differs from source count.");
run(["--test", ...compiled]);
