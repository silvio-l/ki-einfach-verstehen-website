import { renderSvg, abs } from "../satori-render.mjs";
import { tone, printLine } from "../tokens.mjs";

// Baustein warum-ki-ueberzeugend-falsch-liegt: share of invented references
// in literature lists written by two models from 2023. Published values only,
// not recalculated: Walters and Wilder (2023), 636 references from 84 papers.

const FONT = "IBM Plex Sans";
const W = 720;
const H = 312;

const X0 = 236; // zero line
const SCALE = 4.4; // px per percentage point: 100 % = 440 px
const BAR_H = 48;
const ROWS = [
  { y: 60, model: "GPT-3.5 (2023)", pct: 55 },
  { y: 140, model: "GPT-4 (2023)", pct: 18 },
];
const AXIS_TOP = 52;
const AXIS_BOTTOM = 200;
const TICKS_Y = 212;

function text(content, left, top, width, style = {}) {
  return {
    type: "div",
    props: { style: abs({ left: `${left}px`, top: `${top}px`, width: `${width}px`, fontFamily: FONT, fontSize: "18px", ...style }), children: content },
  };
}

function build(l, profile) {
  const ink = tone("neutral", profile);
  const hot = tone("amber", profile);
  const svgChildren = [];
  const labels = [];

  svgChildren.push({ type: "line", props: { x1: X0, y1: AXIS_TOP, x2: X0, y2: AXIS_BOTTOM, stroke: ink.stroke, strokeWidth: printLine(1.5, profile) } });
  ROWS.forEach((row) => {
    const w = row.pct * SCALE;
    svgChildren.push({ type: "rect", props: { x: X0, y: row.y, width: w, height: BAR_H, rx: 5, fill: hot.accent } });
    labels.push(
      text(row.model, 16, row.y + 13, 210, { fontWeight: 700, color: ink.text }),
      text(l.pct(row.pct), X0 + w + 10, row.y + 13, 100, { fontWeight: 700, color: ink.text }),
    );
  });
  labels.push(
    text(l.title, 16, 14, 688, { fontWeight: 700, fontSize: "20px", color: ink.text }),
    text(l.tick0, X0 - 30, TICKS_Y, 60, { color: ink.text, justifyContent: "center" }),
    text(l.tick50, X0 + 50 * SCALE - 30, TICKS_Y, 60, { color: ink.text, justifyContent: "center" }),
    text(l.tick100, X0 + 100 * SCALE - 30, TICKS_Y, 60, { color: ink.text, justifyContent: "center" }),
    text(l.caption, 16, 250, 688, { color: ink.text, lineHeight: "24px" }),
  );

  const tree = {
    type: "div",
    props: {
      style: { width: `${W}px`, height: `${H}px`, display: "flex", position: "relative" },
      children: [{ type: "svg", props: { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: { position: "absolute", left: 0, top: 0 }, children: svgChildren } }, ...labels],
    },
  };
  return renderSvg(tree, W, H);
}

const DE = {
  title: "Anteil erfundener Literaturangaben",
  pct: (p) => `${p} %`,
  tick0: "0 %",
  tick50: "50 %",
  tick100: "100 %",
  caption: "Walters und Wilder (2023): 636 Literaturangaben aus 84 Arbeiten, Modelle von 2023.",
};

const EN = {
  title: "Share of invented references",
  pct: (p) => `${p}%`,
  tick0: "0%",
  tick50: "50%",
  tick100: "100%",
  caption: "Walters and Wilder (2023): 636 references from 84 papers, models from 2023.",
};

export const fabricatedCitationsDe = {
  outPath: "public/bausteine/warum-ki-ueberzeugend-falsch-liegt/erfundene-zitate.svg",
  build: (profile) => build(DE, profile),
};

export const fabricatedCitationsEn = {
  outPath: "public/bausteine/warum-ki-ueberzeugend-falsch-liegt/fabricated-citations.svg",
  build: (profile) => build(EN, profile),
};
