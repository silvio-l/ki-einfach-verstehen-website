import satori from "satori";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const fontRegular = readFileSync(path.join(dir, "fonts/IBMPlexSans-Regular.ttf"));
const fontBold = readFileSync(path.join(dir, "fonts/IBMPlexSans-Bold.ttf"));
const fontMono = readFileSync(path.join(dir, "fonts/IBMPlexMono-Regular.ttf"));

export async function renderSvg(tree, width, height) {
  return satori(tree, {
    width,
    height,
    fonts: [
      { name: "IBM Plex Sans", data: fontRegular, weight: 400, style: "normal" },
      { name: "IBM Plex Sans", data: fontBold, weight: 700, style: "normal" },
      { name: "IBM Plex Mono", data: fontMono, weight: 400, style: "normal" },
    ],
  });
}

export function abs(style) {
  return { position: "absolute", display: "flex", ...style };
}
