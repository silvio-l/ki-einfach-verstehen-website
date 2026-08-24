import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const dir = path.dirname(fileURLToPath(import.meta.url));
const fontRegular = path.join(dir, "fonts/IBMPlexSans-Regular.ttf");
const fontBold = path.join(dir, "fonts/IBMPlexSans-Bold.ttf");

const BACKGROUND_RECT = /<rect x="-?\d+\.\d+" y="-?\d+\.\d+" width="\d+\.\d+" height="\d+\.\d+" rx="0\.000000" fill="#FFFFFF" class=" fill-N7" stroke-width="0" \/>/;

export function renderD2(source) {
  const work = mkdtempSync(path.join(tmpdir(), "d2-gen-"));
  const src = path.join(work, "diagram.d2");
  const out = path.join(work, "diagram.svg");
  writeFileSync(src, source);
  execFileSync("d2", [
    "--layout", "dagre",
    "--font-regular", fontRegular,
    "--font-bold", fontBold,
    "--pad", "24",
    src, out,
  ], { stdio: "pipe" });
  const svg = readFileSync(out, "utf8").replace(BACKGROUND_RECT, "");
  rmSync(work, { recursive: true, force: true });
  return svg;
}
