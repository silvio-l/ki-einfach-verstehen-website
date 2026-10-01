import satori from "satori";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const fontRegular = readFileSync(path.join(dir, "fonts/IBMPlexSans-Regular.ttf"));
const fontBold = readFileSync(path.join(dir, "fonts/IBMPlexSans-Bold.ttf"));
const fontMono = readFileSync(path.join(dir, "fonts/IBMPlexMono-Regular.ttf"));

// Smallest font size any text in the tree is set in (Satori's default is
// 16px). Satori outlines glyphs as paths, so the size is recorded on the
// root as data-min-font for the legibility check (legibility.mjs).
export function minFontSize(node, inherited = 16) {
  if (node == null || node === false) return Infinity;
  if (typeof node === "string" || typeof node === "number") return String(node).trim() ? inherited : Infinity;
  if (Array.isArray(node)) return Math.min(Infinity, ...node.map((n) => minFontSize(n, inherited)));
  const raw = node.props?.style?.fontSize;
  const size = raw == null ? inherited : parseFloat(raw);
  return minFontSize(node.props?.children, size);
}

export async function renderSvg(tree, width, height) {
  const min = minFontSize(tree);
  const svg = await satori(tree, {
    width,
    height,
    fonts: [
      { name: "IBM Plex Sans", data: fontRegular, weight: 400, style: "normal" },
      { name: "IBM Plex Sans", data: fontBold, weight: 700, style: "normal" },
      { name: "IBM Plex Mono", data: fontMono, weight: 400, style: "normal" },
    ],
  });
  return Number.isFinite(min) ? svg.replace("<svg ", `<svg data-min-font="${min}" `) : svg;
}

export function abs(style) {
  return { position: "absolute", display: "flex", ...style };
}
