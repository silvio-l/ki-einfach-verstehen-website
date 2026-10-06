// Social cards (1200x630) for the explorables, rendered with the same
// Satori setup as the lesson graphics (ADR-0013) and rasterised with
// rsvg-convert, because og:image must be a bitmap for most platforms.
// Run: node scripts/graphics/og-explorables.mjs  (needs rsvg-convert,
// e.g. `brew install librsvg`). Output is committed under public/explore/.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderSvg } from "./satori-render.mjs";
import { EXAMPLES } from "../../src/scripts/demos/real-tokens.js";

const W = 1200;
const H = 630;
const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const div = (style, children = []) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

const CHIP_FILLS = ["#D7ECE7", "#FBF2E0", "#E4E1F6"];

function chip(token, i) {
  return div(
    { flexDirection: "column", alignItems: "center", padding: "18px 30px 14px", borderRadius: "18px", background: CHIP_FILLS[i % 3], marginRight: "18px" },
    [
      div({ fontSize: "64px", fontWeight: 700, color: "#1B1A17", lineHeight: 1.1 }, token.text),
      div({ fontSize: "28px", fontWeight: 700, color: "#0A5148", marginTop: "6px" }, String(token.id)),
    ],
  );
}

export function card({ eyebrow, title, footer }) {
  return div(
    {
      width: `${W}px`,
      height: `${H}px`,
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px",
      backgroundImage: "radial-gradient(circle at 50% 27%, #0C5049 0%, #073B36 34%, #042723 62%, #021613 100%)",
      fontFamily: "IBM Plex Sans",
      color: "#FFFFFF",
    },
    [
      div({ flexDirection: "column" }, [
        div({ fontSize: "24px", fontWeight: 700, letterSpacing: "4px", color: "#D8F4EA", textTransform: "uppercase" }, eyebrow),
        div({ fontSize: "62px", fontWeight: 700, lineHeight: 1.12, marginTop: "18px", maxWidth: "1040px" }, title),
      ]),
      div({ alignItems: "flex-end" }, EXAMPLES.strawberry.tokens.map(chip)),
      div({ justifyContent: "space-between", fontSize: "26px", color: "rgba(215, 236, 231, 0.8)" }, [div({}, footer[0]), div({}, footer[1])]),
    ],
  );
}

const CARDS = [
  {
    out: "public/explore/og-strawberry-en.png",
    eyebrow: "Interactive explainer",
    title: "How many r’s are in “strawberry”? See what an LLM actually receives.",
    footer: ["KI einfach verstehen", "ki-einfach-verstehen.de"],
  },
  {
    out: "public/explore/og-strawberry-de.png",
    eyebrow: "Interaktive Erklärung",
    title: "Wie viele r stecken in „strawberry“? Sieh, was ein Sprachmodell wirklich erhält.",
    footer: ["KI einfach verstehen", "ki-einfach-verstehen.de"],
  },
];

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const c of CARDS) {
    const svg = await renderSvg(card(c), W, H);
    const png = path.join(websiteRoot, c.out);
    mkdirSync(path.dirname(png), { recursive: true });
    const tmp = `${png}.svg`;
    writeFileSync(tmp, svg);
    execFileSync("rsvg-convert", ["-w", String(W), "-h", String(H), "-o", png, tmp]);
    execFileSync("rm", [tmp]);
    console.log("wrote", c.out);
  }
}
