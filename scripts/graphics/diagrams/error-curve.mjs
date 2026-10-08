import { renderSvg, abs } from "../satori-render.mjs";
import { tone } from "../tokens.mjs";
import { loss, path, RATES } from "../../../src/scripts/demos/descent.js";

// Baustein 6 (Parameter, Training und Inferenz), section "Woher
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

// Same Baustein, section "Wie weit ein Schritt geht": the same curve twice,
// once with the small learning rate of the text and demo (1/24: every step
// halves the rest, 0 -> 1.5 -> 2.25 -> 2.625) and once with a rate four
// times as big (1/6: 0 -> 6 -> 0, both at error 56). Steps come from
// descent.js, so text, demo and figure share one source.

const LR_W = 640;
const LR_H = 300;
const PANEL_W = 300;
const LR_PLOT = { left: 34, right: PANEL_W - 10, top: 46, bottom: 236 };
const LR_W_MIN = -0.4;
const LR_W_MAX = 6.4;

async function buildLearningRate(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const panels = [
    { x0: 10, ws: path(0, RATES.small, 3), color: teal, title: l.small, labels: l.smallLabels },
    { x0: 330, ws: path(0, RATES.big, 2), color: amber, title: l.big, labels: l.bigLabels },
  ];
  const xOf = (x0, w) => x0 + LR_PLOT.left + ((w - LR_W_MIN) / (LR_W_MAX - LR_W_MIN)) * (LR_PLOT.right - LR_PLOT.left);
  const yOf = (e) => LR_PLOT.bottom - (e / Y_MAX) * (LR_PLOT.bottom - LR_PLOT.top);
  const svgChildren = [
    { type: "defs", props: { children: panels.map((p, i) => ({
      type: "marker",
      props: { id: `lr-head-${i}`, viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse",
        children: [{ type: "path", props: { d: "M0 0 L10 5 L0 10 Z", fill: p.color.stroke } }] },
    })) } },
  ];
  const labels = [];
  panels.forEach((p, i) => {
    const curve = [];
    // Only the part of the valley below the top of the chart (error ≤ 60).
    for (let k = 0; k <= 100; k++) {
      const w = -0.1 + (6.2 * k) / 100;
      curve.push(`${xOf(p.x0, w).toFixed(1)},${yOf(loss(w)).toFixed(1)}`);
    }
    svgChildren.push(
      { type: "line", props: { x1: p.x0 + LR_PLOT.left, y1: LR_PLOT.bottom, x2: p.x0 + LR_PLOT.right, y2: LR_PLOT.bottom, stroke: ink.stroke, strokeWidth: 1.5 } },
      { type: "path", props: { d: `M${curve.join(" L")}`, fill: "none", stroke: ink.stroke, strokeWidth: 2.5 } },
    );
    // the jumps: arcs above the curve from one fader setting to the next
    for (let k = 1; k < p.ws.length; k++) {
      const a = p.ws[k - 1];
      const b = p.ws[k];
      const x1 = xOf(p.x0, a);
      const y1 = yOf(loss(a));
      const x2 = xOf(p.x0, b);
      const y2 = yOf(loss(b));
      const lift = i === 1 ? (k === 1 ? 40 : -14) : 26;
      const cy = Math.min(y1, y2) - lift;
      svgChildren.push({
        type: "path",
        props: { d: `M${x1.toFixed(1)},${y1.toFixed(1)} Q${((x1 + x2) / 2).toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`, fill: "none", stroke: p.color.stroke, strokeWidth: 2.5, strokeDasharray: i === 1 && k === 2 ? "6 4" : undefined, markerEnd: `url(#lr-head-${i})` },
      });
    }
    p.ws.forEach((w, k) => {
      svgChildren.push({ type: "circle", props: { cx: xOf(p.x0, w), cy: yOf(loss(w)), r: 6, fill: k === 0 ? ink.fill : p.color.accent, stroke: p.color.stroke, strokeWidth: 2.5 } });
    });
    labels.push(label(p.title, p.x0 + 8, 6, { fontWeight: 700, color: p.color.text, fontSize: "17px" }));
    [0, 3, 6].forEach((w) => labels.push(label(String(w), xOf(p.x0, w) - 5, LR_PLOT.bottom + 6, { color: ink.text, fontSize: "16px" })));
    labels.push(label(l.axisX, p.x0 + LR_PLOT.left + 40, LR_PLOT.bottom + 30, { color: ink.text, fontSize: "16px" }));
    p.labels.forEach(([text, w, dx, dy]) => labels.push(label(text, xOf(p.x0, w) + dx, yOf(loss(w)) + dy, { fontWeight: 700, fontSize: "16px", color: p.color.text })));
  });
  const children = [
    { type: "svg", props: { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${LR_W} ${LR_H}`, width: LR_W, height: LR_H, style: { position: "absolute", left: 0, top: 0 }, children: svgChildren } },
    ...labels,
  ];
  const tree = { type: "div", props: { style: { width: `${LR_W}px`, height: `${LR_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, LR_W, LR_H);
}

export const learningRateDe = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/lernrate.svg",
  build: (profile) =>
    buildLearningRate(
      {
        small: "Lernrate ein Vierundzwanzigstel",
        big: "Lernrate ein Sechstel",
        axisX: "Regler: Euro pro Kilo",
        smallLabels: [["0", 0, -24, 4], ["1,5", 1.5, -36, -6], ["2,25", 2.25, -46, -2]],
        bigLabels: [["0", 0, 12, 10], ["6", 6, -24, 10]],
      },
      profile,
    ),
};

export const learningRateEn = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/learning-rate.svg",
  build: (profile) =>
    buildLearningRate(
      {
        small: "Learning rate one twenty-fourth",
        big: "Learning rate one sixth",
        axisX: "Fader: euros per kilo",
        smallLabels: [["0", 0, -24, 4], ["1.5", 1.5, -36, -6], ["2.25", 2.25, -46, -2]],
        bigLabels: [["0", 0, 12, 10], ["6", 6, -24, 10]],
      },
      profile,
    ),
};
