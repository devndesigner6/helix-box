import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../src/ai/index.ts", import.meta.url), "utf8");
const runtime = await readFile(new URL("../src/index.ts", import.meta.url), "utf8");

assert.match(index, /claude/);
assert.match(index, /hermes/);
assert.match(runtime, /claude/);
assert.match(runtime, /hermes/);
console.log("AI backend registry includes Claude Code and Hermes");
