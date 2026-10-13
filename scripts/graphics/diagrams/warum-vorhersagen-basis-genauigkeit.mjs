import { renderSvg, abs } from "../satori-render.mjs";
import { tone, printLine } from "../tokens.mjs";

// Baustein warum-vorhersagen-mehr-ist-als-nachplappern (Themenbereich 4, Nr. 3),
// diagram D3: accuracy of two-digit addition in five number bases. Published
// values only, not recalculated: Wu et al. 2023, Table 18 (GPT-4, gpt-4-0314,
// zero-shot with chain-of-thought). Base 9 is the highlighted row.

const FONT = "IBM Plex Sans";
const W = 720;
const H = 372;

const VALUES = [
  { base: 8, pct: 60.2 },
  { base: 9, pct: 38.6 },
  { base: 10, pct: 98.2 },
  { base: 11, pct: 56.5 },
  { base: 16, pct: 74.0 },
];

const X0 = 200; // zero line
const SCALE = 3.8; // px per percentage point: 100 % = 380 px
const ROW0 = 24;
const ROW_H = 56;
const AXIS_BOTTOM = 300;

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
  // No gridlines: they would run through the value labels. The zero axis and the ticks carry the scale.
  svgChildren.push({ type: "line", props: { x1: X0, y1: ROW0 - 8, x2: X0, y2: AXIS_BOTTOM, stroke: ink.stroke, strokeWidth: printLine(1.5, profile) } });
  VALUES.forEach((row, i) => {
    const y = ROW0 + i * ROW_H;
    const w = row.pct * SCALE;
    const c = row.base === 9 ? hot : ink;
    svgChildren.push({ type: "rect", props: { x: X0, y: y + 8, width: w, height: 36, rx: 5, fill: c.accent } });
    labels.push(
      text(l.base(row.base), 16, y + 15, 170, { fontWeight: 700, color: row.base === 9 ? hot.text : ink.text }),
      text(l.pct(row.pct), X0 + w + 10, y + 15, 120, { fontWeight: 700, color: row.base === 9 ? hot.text : ink.text }),
    );
  });
  labels.push(
    text(l.tick0, X0 - 16, AXIS_BOTTOM + 6, 32, { color: ink.text, justifyContent: "center" }),
    text(l.tick50, X0 + 50 * SCALE - 30, AXIS_BOTTOM + 6, 60, { color: ink.text, justifyContent: "center" }),
    text(l.tick100, X0 + 100 * SCALE - 32, AXIS_BOTTOM + 6, 64, { color: ink.text, justifyContent: "center" }),
    text(l.axis, 16, AXIS_BOTTOM + 40, 688, { color: ink.text, fontWeight: 700, justifyContent: "center" }),
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
  base: (b) => `Basis ${b}`,
  pct: (p) => `${p.toFixed(1).replace(".", ",")} %`,
  tick0: "0 %",
  tick50: "50 %",
  tick100: "100 %",
  axis: "Genauigkeit in Prozent (veröffentlichte Werte, nicht neu gerechnet)",
};

const EN = {
  base: (b) => `Base ${b}`,
  pct: (p) => `${p.toFixed(1)}%`,
  tick0: "0%",
  tick50: "50%",
  tick100: "100%",
  axis: "Accuracy in percent (published values, not recalculated)",
};

export const basisGenauigkeitDe = {
  outPath: "public/bausteine/warum-vorhersagen-mehr-ist-als-nachplappern/neu-a-basis-genauigkeit.svg",
  build: (profile) => build(DE, profile),
};

export const basisGenauigkeitEn = {
  outPath: "public/bausteine/warum-vorhersagen-mehr-ist-als-nachplappern/neu-a-base-accuracy.svg",
  build: (profile) => build(EN, profile),
};
