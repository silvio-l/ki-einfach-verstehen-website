import { renderSvg, abs } from "../satori-render.mjs";
import { printLine, tone } from "../tokens.mjs";
import { CURVE, run } from "../../../src/scripts/demos/zickzack.js";

// Baustein 3.4 (Optimierung: Wer die Gewichte tatsächlich ändert).
// Three diagrams: the made-up ravine with the plain rule and momentum (same
// numbers as the live demo, src/scripts/demos/zickzack.js), the text's
// momentum example (notes +8/−8 across, 1 along, 90 % old momentum), and
// the learning-rate schedule of Llama 3 405B as reported by Meta
// (Grattafiori et al. 2024, §3.4.1 and §3.4.3: linear warm-up over 8,000
// steps to 8e-5, cosine down to 8e-7 over 1,200,000 steps, annealed to 0
// at the very end).

const FONT = "IBM Plex Sans";

function label(content, left, top, style = {}) {
  return {
    type: "div",
    props: {
      style: abs({ left: `${left}px`, top: `${top}px`, fontFamily: FONT, fontSize: "17px", ...style }),
      children: content,
    },
  };
}

function frame(W, H, svgChildren, labels) {
  const children = [
    { type: "svg", props: { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: { position: "absolute", left: 0, top: 0 }, children: svgChildren } },
    ...labels,
  ];
  return { type: "div", props: { style: { width: `${W}px`, height: `${H}px`, display: "flex", position: "relative" }, children } };
}

// --- The ravine, from above -------------------------------------------------

const RV_W = 720;
const RV_H = 340;
const RV = { left: 20, right: 700, top: 50, bottom: 290 };
const ALONG = { min: -0.6, max: 9.6 };
const ACROSS = { min: -1.7, max: 1.7 };

async function buildRavine(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const xOf = (a) => RV.left + ((a - ALONG.min) / (ALONG.max - ALONG.min)) * (RV.right - RV.left);
  const yOf = (q) => RV.top + ((ACROSS.max - q) / (ACROSS.max - ACROSS.min)) * (RV.bottom - RV.top);
  const sx = (RV.right - RV.left) / (ALONG.max - ALONG.min);
  const sy = (RV.bottom - RV.top) / (ACROSS.max - ACROSS.min);
  // A longer run than the demo, so both paths get close to the valley.
  const plain = run("plain", { n: 130 });
  const momentum = run("momentum", { n: 130 });
  const line = (pts) => pts.map((p) => `${xOf(p.along).toFixed(1)},${yOf(p.across).toFixed(1)}`).join(" ");
  const svgChildren = [
    { type: "defs", props: { children: [{ type: "clipPath", props: { id: "rv-clip", children: [{ type: "rect", props: { x: RV.left, y: RV.top, width: RV.right - RV.left, height: RV.bottom - RV.top } }] } }] } },
    { type: "rect", props: { x: RV.left, y: RV.top, width: RV.right - RV.left, height: RV.bottom - RV.top, fill: ink.fill, rx: 10 } },
    {
      type: "g",
      props: {
        clipPath: "url(#rv-clip)",
        children: [
          ...[4, 1.5, 0.3].map((lv) => ({
            type: "ellipse",
            props: { cx: xOf(0), cy: yOf(0), rx: Math.sqrt((2 * lv) / CURVE.along) * sx, ry: Math.sqrt((2 * lv) / CURVE.across) * sy, fill: "none", stroke: ink.stroke, strokeWidth: printLine(1, profile), strokeOpacity: 0.45 },
          })),
          { type: "polyline", props: { points: line(plain.points), fill: "none", stroke: amber.stroke, strokeWidth: 2, strokeDasharray: "6 3", strokeLinejoin: "round" } },
          { type: "polyline", props: { points: line(momentum.points), fill: "none", stroke: teal.stroke, strokeWidth: 3.5, strokeLinejoin: "round" } },
          { type: "circle", props: { cx: xOf(9), cy: yOf(0.8), r: 7, fill: ink.stroke } },
          { type: "circle", props: { cx: xOf(0), cy: yOf(0), r: 8, fill: teal.accent, stroke: teal.stroke, strokeWidth: 2.5 } },
        ],
      },
    },
    // legend swatches
    { type: "line", props: { x1: 24, y1: 22, x2: 64, y2: 22, stroke: amber.stroke, strokeWidth: 2.5, strokeDasharray: "6 3" } },
    { type: "line", props: { x1: 320, y1: 22, x2: 360, y2: 22, stroke: teal.stroke, strokeWidth: 3.5 } },
  ];
  const labels = [
    label(l.plain, 72, 10, { fontWeight: 700, color: amber.text }),
    label(l.momentum, 368, 10, { fontWeight: 700, color: teal.text }),
    label(l.start, xOf(9) - 20, yOf(0.8) - 32, { fontWeight: 700, color: ink.text }),
    label(l.valley, xOf(0) - 14, RV.bottom + 8, { fontWeight: 700, color: teal.text }),
    label(l.across, 150, RV.bottom + 8, { color: ink.text }),
    label(l.along, RV.right - 220, RV.bottom + 8, { color: ink.text }),
  ];
  return renderSvg(frame(RV_W, RV_H, svgChildren, labels), RV_W, RV_H);
}

export const ravineDe = {
  outPath: "public/bausteine/optimierung-der-gewichte/rinne-zickzack.svg",
  build: (profile) => buildRavine({ plain: "einfache Regel", momentum: "mit Schwung", start: "Start", valley: "Tal", across: "↕ quer zur Rinne", along: "längs der Rinne →" }, profile),
};

export const ravineEn = {
  outPath: "public/bausteine/optimierung-der-gewichte/ravine-zigzag.svg",
  build: (profile) => buildRavine({ plain: "plain rule", momentum: "with momentum", start: "start", valley: "valley", across: "↕ across the ravine", along: "along the ravine →" }, profile),
};

// --- The momentum example -----------------------------------------------------

/** The text's example: 20 notes, 90 % old momentum, 10 % new note. */
export function momentumExample(n = 20, keep = 0.9) {
  const across = [];
  const along = [];
  let ma = 0;
  let ml = 0;
  for (let i = 0; i < n; i++) {
    const na = i % 2 === 0 ? 8 : -8;
    ma = keep * ma + (1 - keep) * na;
    ml = keep * ml + (1 - keep) * 1;
    across.push({ note: na, momentum: ma });
    along.push({ note: 1, momentum: ml });
  }
  return { across, along };
}

const MO_W = 720;
const MO_H = 350;
const MO_PANEL = 350;
const MO = { left: 46, right: MO_PANEL - 12, top: 44, bottom: 262 };

async function buildMomentum(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const ex = momentumExample();
  const panels = [
    { x0: 0, data: ex.across, min: -9, max: 9, ticks: [-8, 0, 8], title: l.across, end: l.acrossEnd },
    { x0: 370, data: ex.along, min: 0, max: 1.2, ticks: [0, 1], title: l.along, end: l.alongEnd },
  ];
  const svgChildren = [];
  const labels = [];
  for (const p of panels) {
    const xOf = (i) => p.x0 + MO.left + (i / 19) * (MO.right - MO.left);
    const yOf = (v) => MO.bottom - ((v - p.min) / (p.max - p.min)) * (MO.bottom - MO.top);
    for (const t of p.ticks) {
      svgChildren.push({ type: "line", props: { x1: p.x0 + MO.left, x2: p.x0 + MO.right, y1: yOf(t), y2: yOf(t), stroke: ink.stroke, strokeWidth: printLine(t === 0 ? 1.5 : 1, profile), strokeOpacity: t === 0 ? 0.9 : 0.35 } });
      labels.push(label(l.num(t), p.x0 + MO.left - 40, yOf(t) - 11, { color: ink.text, width: "36px", textAlign: "right", fontSize: "17px" }));
    }
    svgChildren.push({ type: "polyline", props: { points: p.data.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.note).toFixed(1)}`).join(" "), fill: "none", stroke: amber.stroke, strokeWidth: printLine(1.2, profile), strokeDasharray: "3 3" } });
    p.data.forEach((d, i) => svgChildren.push({ type: "circle", props: { cx: xOf(i), cy: yOf(d.note), r: 4.5, fill: amber.accent, stroke: amber.stroke, strokeWidth: printLine(1.5, profile) } }));
    svgChildren.push({ type: "polyline", props: { points: p.data.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d.momentum).toFixed(1)}`).join(" "), fill: "none", stroke: teal.stroke, strokeWidth: 3.5, strokeLinejoin: "round" } });
    labels.push(label(p.title, p.x0 + 10, 4, { fontWeight: 700, fontSize: "18px", color: ink.text }));
    labels.push(label(l.axis, p.x0 + MO.left + 70, MO.bottom + 22, { color: ink.text, fontSize: "17px" }));
    labels.push(label(p.end, p.x0 + MO.left + (p.min < 0 ? 110 : 140), p.min < 0 ? yOf(p.data[19].momentum) + 30 : yOf(0.42), { color: teal.text, fontWeight: 700, fontSize: "17px" }));
  }
  // legend
  svgChildren.push({ type: "circle", props: { cx: 250, cy: MO_H - 14, r: 4.5, fill: amber.accent, stroke: amber.stroke, strokeWidth: printLine(1.5, profile) } });
  svgChildren.push({ type: "line", props: { x1: 380, y1: MO_H - 14, x2: 410, y2: MO_H - 14, stroke: teal.stroke, strokeWidth: 3.5 } });
  labels.push(label(l.notes, 260, MO_H - 25, { color: amber.text, fontWeight: 700, fontSize: "17px" }));
  labels.push(label(l.momentum, 416, MO_H - 25, { color: teal.text, fontWeight: 700, fontSize: "17px" }));
  return renderSvg(frame(MO_W, MO_H, svgChildren, labels), MO_W, MO_H);
}

export const momentumDe = {
  outPath: "public/bausteine/optimierung-der-gewichte/schwung-zettel.svg",
  build: (profile) =>
    buildMomentum(
      {
        across: "Quer: +8 und −8 im Wechsel",
        along: "Längs: immer 1",
        acrossEnd: "pendelt um null",
        alongEnd: "wächst auf fast 0,9",
        axis: "Zettel 1 bis 20",
        notes: "Zettel",
        momentum: "Schwung",
        num: (t) => (t > 0 && t !== 1 ? `+${t}` : t < 0 ? `−${-t}` : String(t)),
      },
      profile,
    ),
};

export const momentumEn = {
  outPath: "public/bausteine/optimierung-der-gewichte/momentum-notes.svg",
  build: (profile) =>
    buildMomentum(
      {
        across: "Across: +8 and −8 in turn",
        along: "Along: always 1",
        acrossEnd: "swings around zero",
        alongEnd: "grows to almost 0.9",
        axis: "notes 1 to 20",
        notes: "notes",
        momentum: "momentum",
        num: (t) => (t > 0 && t !== 1 ? `+${t}` : t < 0 ? `−${-t}` : String(t)),
      },
      profile,
    ),
};

// --- The Llama 3 schedule ---------------------------------------------------

export const LLAMA3 = { peak: 8e-5, warmup: 8000, steps: 1_200_000, end: 8e-7 };

/** Learning rate of the reported schedule at step s (before the final anneal to 0). */
export function llamaRate(s) {
  const { peak, warmup, steps, end } = LLAMA3;
  if (s <= warmup) return (peak * s) / warmup;
  const p = Math.min(1, (s - warmup) / (steps - warmup));
  return end + (peak - end) * 0.5 * (1 + Math.cos(Math.PI * p));
}

const LL_W = 720;
const LL_H = 370;
const LL = { top: 54, bottom: 280 };
const LL_PANELS = [
  { x0: 0, left: 92, right: 330, max: 20_000, ticks: [0, 8000, 20_000] },
  { x0: 360, left: 92, right: 350, max: 1_200_000, ticks: [0, 600_000, 1_200_000] },
];

async function buildLlama(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const yOf = (r) => LL.bottom - (r / LLAMA3.peak) * (LL.bottom - LL.top);
  const svgChildren = [];
  const labels = [];
  LL_PANELS.forEach((p, i) => {
    const xOf = (s) => p.x0 + p.left + (s / p.max) * (p.right - p.left);
    const pts = [];
    for (let k = 0; k <= 200; k++) {
      const s = (p.max * k) / 200;
      pts.push(`${xOf(s).toFixed(1)},${yOf(llamaRate(s)).toFixed(1)}`);
    }
    if (i === 1) pts.push(`${xOf(p.max).toFixed(1)},${yOf(0).toFixed(1)}`);
    svgChildren.push(
      { type: "line", props: { x1: p.x0 + p.left, x2: p.x0 + p.right, y1: LL.bottom, y2: LL.bottom, stroke: ink.stroke, strokeWidth: printLine(1.5, profile) } },
      { type: "line", props: { x1: p.x0 + p.left, x2: p.x0 + p.left, y1: LL.top - 8, y2: LL.bottom, stroke: ink.stroke, strokeWidth: printLine(1.5, profile) } },
      { type: "line", props: { x1: p.x0 + p.left, x2: p.x0 + p.right, y1: yOf(LLAMA3.peak), y2: yOf(LLAMA3.peak), stroke: ink.stroke, strokeWidth: printLine(1, profile), strokeDasharray: "3 4", strokeOpacity: 0.5 } },
      { type: "polyline", props: { points: pts.join(" "), fill: "none", stroke: teal.stroke, strokeWidth: 3.5, strokeLinejoin: "round" } },
    );
    labels.push(label(l.peak, p.x0 + 4, yOf(LLAMA3.peak) - 11, { color: ink.text, fontSize: "17px", width: `${p.left - 10}px`, textAlign: "right" }));
    labels.push(label(l.rate, p.x0 + 4, yOf(LLAMA3.peak * 0.55), { color: ink.text, fontSize: "17px", width: `${p.left - 10}px`, textAlign: "right" }));
    labels.push(label("0", p.x0 + 4, LL.bottom - 11, { color: ink.text, fontSize: "17px", width: `${p.left - 10}px`, textAlign: "right" }));
    p.ticks.forEach((t, k) => labels.push(label(l.steps(t), xOf(t) - (k === 0 ? 4 : k === p.ticks.length - 1 ? 62 : 30), LL.bottom + 8, { color: ink.text, fontSize: "17px" })));
    labels.push(label(i === 0 ? l.zoom : l.whole, p.x0 + 10, 6, { fontWeight: 700, fontSize: "18px", color: ink.text }));
    labels.push(label(l.axis, p.x0 + p.left + 40, LL.bottom + 36, { color: ink.text, fontSize: "17px" }));
    if (i === 0) {
      svgChildren.push({ type: "line", props: { x1: xOf(8000), x2: xOf(8000), y1: yOf(LLAMA3.peak), y2: LL.bottom, stroke: amber.stroke, strokeWidth: printLine(1.5, profile), strokeDasharray: "4 3" } });
      labels.push(label(l.warm, xOf(9000), yOf(LLAMA3.peak * 0.45), { color: amber.text, fontWeight: 700, fontSize: "17px", width: "160px" }));
    } else {
      labels.push(label(l.cos, xOf(560_000), yOf(LLAMA3.peak * 0.78), { color: teal.text, fontWeight: 700, fontSize: "17px", width: "150px" }));
      labels.push(label(l.end, p.x0 + p.left - 40, LL.bottom + 60, { color: teal.text, fontWeight: 700, fontSize: "17px" }));
    }
  });
  return renderSvg(frame(LL_W, LL_H, svgChildren, labels), LL_W, LL_H);
}

const deSteps = (t) => (t >= 1_000_000 ? `${String(t / 1_000_000).replace(".", ",")} Mio.` : t.toLocaleString("de-DE"));
const enSteps = (t) => (t >= 1_000_000 ? `${t / 1_000_000} m` : t.toLocaleString("en-US"));

export const llamaScheduleDe = {
  outPath: "public/bausteine/optimierung-der-gewichte/lernraten-plan-llama3.svg",
  build: (profile) =>
    buildLlama(
      {
        zoom: "Die ersten 20.000 Schritte",
        whole: "Der ganze Lauf",
        peak: "0,00008",
        steps: deSteps,
        axis: "Trainingsschritte",
        rate: "Lernrate",
        warm: "Aufwärmen: 8.000 Schritte",
        cos: "langer Bogen hinunter",
        end: "Kurvenende 0,0000008, dann 0",
      },
      profile,
    ),
};

export const llamaScheduleEn = {
  outPath: "public/bausteine/optimierung-der-gewichte/learning-rate-schedule-llama3.svg",
  build: (profile) =>
    buildLlama(
      {
        zoom: "The first 20,000 steps",
        whole: "The whole run",
        peak: "0.00008",
        steps: enSteps,
        axis: "training steps",
        rate: "learning rate",
        warm: "warm-up: 8,000 steps",
        cos: "long curve down",
        end: "curve ends at 0.0000008, then 0",
      },
      profile,
    ),
};
