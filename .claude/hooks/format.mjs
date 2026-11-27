// PostToolUse hook (Write|Edit): run the project's Prettier on the file Claude
// just changed, so edits match `npm run format` without a separate step.
// Reads the hook payload from stdin. Never blocks: any problem exits 0.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const FORMATTABLE = /\.(tsx?|jsx?|mjs|cjs|json|css|md)$/i;

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const payload = JSON.parse(input || "{}");
    const file =
      payload.tool_response?.filePath ?? payload.tool_input?.file_path ?? "";
    const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const prettier = path.join(root, "node_modules/prettier/bin/prettier.cjs");

    const inside = path.resolve(file).startsWith(path.resolve(root));
    if (
      !file ||
      !inside ||
      !FORMATTABLE.test(file) ||
      file.includes("node_modules") ||
      !existsSync(prettier)
    ) {
      process.exit(0);
    }

    // Run from the repo root so .prettierrc.json and .prettierignore apply
    spawnSync(
      process.execPath,
      [prettier, "--write", "--log-level", "warn", file],
      {
        cwd: root,
        stdio: "ignore",
      },
    );
  } catch {
    // Formatting is a convenience; never fail the tool call over it
  }
  process.exit(0);
});
