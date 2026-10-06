import { renderSvg, abs } from "../satori-render.mjs";
import { tone } from "../tokens.mjs";
import { loss } from "../../../src/scripts/demos/descent.js";

// Baustein 6 (Parameter, Training und Inferenz, Hardware), section "Woher
// kennt das Training die Richtung?": the error curve of the made-up apple
// model (price = fader x kilos, three purchases). Same numbers as the text
// and the live demo (src/scripts/demos/descent.js): 56, 26, 8, 2, 8 at
// fader 0..4; the error falls by 30, 18, 6 per whole euro.

const W = 600;
const H = 320;
const PLOT = { left: 70, right: 580, top: 26, bottom: 262 };
const W_MIN = -0.3;
const W_MAX = 6.3;
const Y_MAX = 60;
const FONT = "IBM Plex Sans";

const xOf = (w) => PLOT.left + ((w - W_MIN) / (W_MAX - W_MIN)) * (PLOT.right - PLOT.left);
const yOf = (e) => PLOT.bottom - (e / Y_MAX) * (PLOT.bottom - PLOT.top);

function label(content, left, top, style = {}) {
  return {
    type: "div",
    props: {
      style: abs({ left: `${left}px`, top: `${top}px`, fontFamily: FONT, fontSize: "15px", ...style }),
      children: content,
    },
  };
}

async function buildErrorCurve(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const curve = [];
  for (let i = 0; i <= 120; i++) {
    const w = W_MIN + ((W_MAX - W_MIN) * i) / 120;
    curve.push(`${xOf(w).toFixed(1)},${Math.max(PLOT.top - 20, yOf(loss(w))).toFixed(1)}`);
  }
  const steps = [0, 1, 2];
  const svgChildren = [
    // axes
    { type: "line", props: { x1: PLOT.left, y1: PLOT.bottom, x2: PLOT.right, y2: PLOT.bottom, stroke: ink.stroke, strokeWidth: 1.5 } },
    { type: "line", props: { x1: PLOT.left, y1: PLOT.top - 10, x2: PLOT.left, y2: PLOT.bottom, stroke: ink.stroke, strokeWidth: 1.5 } },
    { type: "path", props: { d: `M${curve.join(" L")}`, fill: "none", stroke: ink.stroke, strokeWidth: 3 } },
    // the drops between whole euros, drawn as steps: across, then down
    ...steps.map((w) => ({
      type: "path",
      props: {
        d: `M${xOf(w).toFixed(1)},${yOf(loss(w)).toFixed(1)} L${xOf(w + 1).toFixed(1)},${yOf(loss(w)).toFixed(1)} L${xOf(w + 1).toFixed(1)},${yOf(loss(w + 1)).toFixed(1)}`,
        fill: "none",
        stroke: amber.stroke,
        strokeWidth: 2,
        strokeDasharray: "5 4",
      },
    })),
    ...[0, 1, 2, 3, 4].map((w) => ({
      type: "circle",
      props: { cx: xOf(w), cy: yOf(loss(w)), r: w === 3 ? 8 : 6.5, fill: w === 3 ? teal.accent : ink.fill, stroke: teal.stroke, strokeWidth: 2.5 },
    })),
  ];
  const children = [
    {
      type: "svg",
      props: {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `0 0 ${W} ${H}`,
        width: W,
        height: H,
        style: { position: "absolute", left: 0, top: 0 },
        children: svgChildren,
      },
    },
    // tick labels on the fader axis
    ...[0, 1, 2, 3, 4, 5, 6].map((w) => label(String(w), xOf(w) - 5, PLOT.bottom + 6, { color: ink.text })),
    label(l.axisX, PLOT.left + 150, PLOT.bottom + 30, { color: ink.text, fontWeight: 700 }),
    label(l.axisY, 8, 4, { color: ink.text, fontWeight: 700 }),
    // error values at the dots
    label("56", xOf(0) + 10, yOf(56) - 30, { fontWeight: 700 }),
    label("26", xOf(1) + 12, yOf(26) - 22, { fontWeight: 700 }),
    label("8", xOf(2) - 6, yOf(8) - 30, { fontWeight: 700 }),
    label(l.bottom, xOf(3) - 24, yOf(22), { fontWeight: 700, color: teal.text }),
    label("8", xOf(4) + 2, yOf(8) - 30, { fontWeight: 700 }),
    // the drops
    label(l.drop(30), xOf(1) + 6, (yOf(56) + yOf(26)) / 2 - 2, { color: amber.text, fontWeight: 700 }),
    label(l.drop(18), xOf(2) + 6, (yOf(26) + yOf(8)) / 2 - 8, { color: amber.text, fontWeight: 700 }),
    label(l.drop(6), xOf(3) + 8, yOf(6) - 12, { color: amber.text, fontWeight: 700 }),
  ];
  const tree = { type: "div", props: { style: { width: `${W}px`, height: `${H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, W, H);
}

export const errorCurveDe = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/fehlerkurve.svg",
  build: (profile) =>
    buildErrorCurve(
      {
        axisX: "Regler: Euro pro Kilo",
        axisY: "Fehler",
        bottom: "Tiefpunkt: 2",
        drop: (n) => `−${n}`,
      },
      profile,
    ),
};

export const errorCurveEn = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/error-curve.svg",
  build: (profile) =>
    buildErrorCurve(
      {
        axisX: "Fader: euros per kilo",
        axisY: "Error",
        bottom: "Bottom: 2",
        drop: (n) => `−${n}`,
      },
      profile,
    ),
};
