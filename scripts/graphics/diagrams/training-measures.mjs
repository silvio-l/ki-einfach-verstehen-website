import { readFileSync } from "node:fs";
import { renderSvg, abs } from "../satori-render.mjs";
import { printLine, tone } from "../tokens.mjs";

// Baustein batch-epoch-step-tokenbudget (Themenbereich 3, Nr. 5): three
// diagrams. Sizes keep the smallest text at 17px or more on a 720px canvas,
// so it stays above 7.5px on a phone (legibility.mjs).

const FONT = "IBM Plex Sans";

function label(content, left, top, style = {}) {
  return {
    type: "div",
    props: {
      style: abs({ left: `${left}px`, top: `${top}px`, fontFamily: FONT, fontSize: "18px", ...style }),
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

// ---- 1. GPT-3 training mix ------------------------------------------------
// Brown et al. 2020, Table 2.2: source size in tokens, share of the training
// mix, epochs elapsed when training for 300 billion tokens.

export const GPT3_MIX = [
  { key: "cc", tokens: 410, share: 60, epochs: 0.44 },
  { key: "webtext2", tokens: 19, share: 22, epochs: 2.9 },
  { key: "books1", tokens: 12, share: 8, epochs: 1.9 },
  { key: "books2", tokens: 55, share: 8, epochs: 0.43 },
  { key: "wiki", tokens: 3, share: 3, epochs: 3.4 },
];

const MIX_W = 720;
const MIX_H = 400;
const MIX_ROW0 = 74;
const MIX_ROW_H = 58;
const BAR_X0 = 372;
const PX_PER_EPOCH = 88;

async function buildGpt3Mix(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const oneX = BAR_X0 + PX_PER_EPOCH;
  const svgChildren = [];
  const labels = [
    label(l.headSource, 16, 22, { fontWeight: 700, color: ink.text }),
    label(l.headShare, 236, 22, { fontWeight: 700, color: ink.text }),
    label(l.headEpochs, BAR_X0, 22, { fontWeight: 700, color: ink.text }),
  ];
  GPT3_MIX.forEach((row, i) => {
    const y = MIX_ROW0 + i * MIX_ROW_H;
    const w = row.epochs * PX_PER_EPOCH;
    const under = row.epochs < 1;
    const c = under ? amber : teal;
    svgChildren.push({ type: "rect", props: { x: BAR_X0, y: y + 8, width: w, height: 30, rx: 5, fill: c.accent } });
    labels.push(
      label(l.names[row.key], 16, y + 2, { fontWeight: 700, color: ink.text }),
      label(l.size(row.tokens), 16, y + 26, { fontSize: "17px", color: ink.text }),
      label(`${row.share} %`, 250, y + 12, { fontWeight: 700, color: ink.text }),
      // Short bars put their value past the one-epoch line, not on it.
      label(l.epochs(row.epochs), Math.max(BAR_X0 + w, under ? oneX : 0) + 8, y + 12, { fontWeight: 700, color: c.text }),
    );
  });
  const lineBottom = MIX_ROW0 + GPT3_MIX.length * MIX_ROW_H;
  svgChildren.push({ type: "line", props: { x1: oneX, y1: MIX_ROW0 - 6, x2: oneX, y2: lineBottom, stroke: ink.stroke, strokeWidth: 2, strokeDasharray: "6 5" } });
  svgChildren.push({ type: "line", props: { x1: BAR_X0, y1: MIX_ROW0 - 6, x2: BAR_X0, y2: lineBottom, stroke: ink.stroke, strokeWidth: printLine(1.5, profile) } });
  labels.push(label(l.once, oneX - 60, lineBottom + 6, { fontSize: "17px", color: ink.text }));
  return renderSvg(frame(MIX_W, MIX_H, svgChildren, labels), MIX_W, MIX_H);
}

export const gpt3MixDe = {
  outPath: "public/bausteine/batch-epoch-step-tokenbudget/gpt3-mischung.svg",
  build: (profile) =>
    buildGpt3Mix(
      {
        headSource: "Quelle (Größe)",
        headShare: "Anteil",
        headEpochs: "Epochen im Training",
        names: { cc: "Common Crawl, gefiltert", webtext2: "Ausgewählte Webseiten", books1: "Bücher 1", books2: "Bücher 2", wiki: "Wikipedia" },
        size: (n) => `${n} Mrd. Tokens`,
        epochs: (e) => String(e).replace(".", ","),
        once: "1 Epoche: einmal ganz durch",
      },
      profile,
    ),
};

export const gpt3MixEn = {
  outPath: "public/bausteine/batch-epoch-step-tokenbudget/gpt3-mix.svg",
  build: (profile) =>
    buildGpt3Mix(
      {
        headSource: "Source (size)",
        headShare: "Share",
        headEpochs: "Epochs in training",
        names: { cc: "Common Crawl, filtered", webtext2: "Selected web pages", books1: "Books 1", books2: "Books 2", wiki: "Wikipedia" },
        size: (n) => `${n} billion tokens`,
        epochs: (e) => String(e),
        once: "1 epoch: once all the way through",
      },
      profile,
    ),
};

// ---- 2. Learning curves of the tiny run -----------------------------------
// Real numbers from scripts/demos/precompute/lernkurven.py (the same JSON the
// LearningCurvesDemo reads): training and validation loss after every epoch.

const RUN = JSON.parse(readFileSync(new URL("../../../src/scripts/demos/data/lernkurven.json", import.meta.url), "utf8"));

const LC_W = 720;
const LC_H = 380;
const LC_PANEL = 360;
const LC_PLOT = { left: 58, right: LC_PANEL - 20, top: 58, bottom: 300 };
const LC_Y_MAX = 4.5;

function curvePath(values, x0) {
  const xOf = (e) => x0 + LC_PLOT.left + (e / (values.length - 1)) * (LC_PLOT.right - LC_PLOT.left);
  const yOf = (v) => LC_PLOT.bottom - (v / LC_Y_MAX) * (LC_PLOT.bottom - LC_PLOT.top);
  return { d: values.map((v, e) => `${e === 0 ? "M" : "L"}${xOf(e).toFixed(1)},${yOf(v).toFixed(1)}`).join(" "), xOf, yOf };
}

async function buildLearningCurves(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const svgChildren = [];
  const labels = [];
  const fmt = (v) => l.num(v);
  [
    { run: RUN.runs.klein, x0: 0, title: l.small },
    { run: RUN.runs.gross, x0: LC_PANEL, title: l.large },
  ].forEach(({ run, x0, title }) => {
    const train = curvePath(run.train, x0);
    const val = curvePath(run.val, x0);
    for (const v of [0, 2, 4]) {
      const y = train.yOf(v);
      svgChildren.push({ type: "line", props: { x1: x0 + LC_PLOT.left, y1: y, x2: x0 + LC_PLOT.right, y2: y, stroke: ink.fillStrong === "#F3F0E8" ? "#E4DFD3" : "#BDBDBD", strokeWidth: printLine(1, profile) } });
      labels.push(label(String(v), x0 + LC_PLOT.left - 18, y - 12, { fontSize: "17px", color: ink.text }));
    }
    for (const e of [0, 25, 50]) {
      labels.push(label(String(e), train.xOf(e) - (e === 0 ? 5 : 10), LC_PLOT.bottom + 6, { fontSize: "17px", color: ink.text }));
    }
    svgChildren.push(
      { type: "line", props: { x1: x0 + LC_PLOT.left, y1: LC_PLOT.bottom, x2: x0 + LC_PLOT.right, y2: LC_PLOT.bottom, stroke: ink.stroke, strokeWidth: printLine(1.5, profile) } },
      { type: "path", props: { d: train.d, fill: "none", stroke: teal.stroke, strokeWidth: 3 } },
      { type: "path", props: { d: val.d, fill: "none", stroke: amber.stroke, strokeWidth: 3, strokeDasharray: "8 5" } },
    );
    labels.push(
      label(title, x0 + 16, 8, { fontWeight: 700, color: ink.text }),
      label(l.axisX, x0 + LC_PLOT.left + 90, LC_PLOT.bottom + 32, { fontSize: "17px", color: ink.text }),
    );
    const last = run.train.length - 1;
    labels.push(
      run === RUN.runs.gross
        ? label(`${l.train} ${fmt(run.train[last])}`, x0 + LC_PLOT.right - 130, train.yOf(run.train[last]) + 8, { fontSize: "17px", fontWeight: 700, color: teal.text })
        : label(`${l.train} ${fmt(run.train[last])}`, x0 + LC_PLOT.right - 100, 228, { fontSize: "17px", fontWeight: 700, color: teal.text }),
      label(`${l.val} ${fmt(run.val[last])}`, x0 + LC_PLOT.right - 140, val.yOf(run.val[last]) - 32, { fontSize: "17px", fontWeight: 700, color: amber.text }),
    );
    if (run === RUN.runs.klein) {
      const best = run.val.indexOf(Math.min(...run.val));
      svgChildren.push({ type: "circle", props: { cx: val.xOf(best), cy: val.yOf(run.val[best]), r: 6, fill: amber.accent, stroke: "#FFFFFF", strokeWidth: 2 } });
      // The note sits in the gap between the two curves, joined to its dot.
      const [first, second] = l.best(best, fmt(run.val[best]));
      const noteX = x0 + 186;
      svgChildren.push({ type: "line", props: { x1: val.xOf(best) + 8, y1: val.yOf(run.val[best]) + 4, x2: noteX - 6, y2: 180, stroke: amber.stroke, strokeWidth: printLine(1.5, profile) } });
      labels.push(
        label(first, noteX, 168, { fontSize: "17px", color: amber.text }),
        label(second, noteX, 190, { fontSize: "17px", color: amber.text }),
      );
    }
  });
  labels.push(label(l.axisY, 6, 34, { fontSize: "17px", fontWeight: 700, color: ink.text }));
  labels.push(label(l.axisY, LC_PANEL + 6, 34, { fontSize: "17px", fontWeight: 700, color: ink.text }));
  return renderSvg(frame(LC_W, LC_H, svgChildren, labels), LC_W, LC_H);
}

export const learningCurvesDe = {
  outPath: "public/bausteine/batch-epoch-step-tokenbudget/lernkurven.svg",
  build: (profile) =>
    buildLearningCurves(
      {
        small: "Kleiner Text: 4.000 Zeichen",
        large: "Großer Text: 109.000 Zeichen",
        axisX: "Epochen",
        axisY: "Loss",
        train: "Training",
        val: "Prüftext",
        best: (e, v) => [`tiefster Punkt: ${v}`, `nach ${e} Epochen`],
        num: (v) => v.toFixed(1).replace(".", ","),
      },
      profile,
    ),
};

export const learningCurvesEn = {
  outPath: "public/bausteine/batch-epoch-step-tokenbudget/learning-curves.svg",
  build: (profile) =>
    buildLearningCurves(
      {
        small: "Small text: 4,000 characters",
        large: "Large text: 109,000 characters",
        axisX: "Epochs",
        axisY: "Loss",
        train: "Training",
        val: "Held-out",
        best: (e, v) => [`lowest point: ${v}`, `after ${e} epochs`],
        num: (v) => v.toFixed(1),
      },
      profile,
    ),
};

// ---- 3. Tokens per parameter ----------------------------------------------
// Chinchilla (Hoffmann et al. 2022): 70 billion parameters, 1.4 trillion
// tokens, 20 per parameter. Llama 3 8B (Meta blog): Chinchilla-optimal would
// be about 200 billion tokens (25 per parameter), trained on over 15 trillion
// (about 1,900 per parameter). Linear scale on purpose: the short bars are the
// point.

export const TOKENS_PER_PARAM = [
  { key: "chinchilla", params: 70, tokens: 1400, perParam: 20 },
  { key: "llamaOptimal", params: 8, tokens: 200, perParam: 25 },
  { key: "llama", params: 8, tokens: 15000, perParam: 1875 },
];

const TP_W = 720;
const TP_H = 360;
const TP_BAR_X0 = 300;
const TP_BAR_MAX = 300;

async function buildTokensPerParam(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const max = Math.max(...TOKENS_PER_PARAM.map((r) => r.perParam));
  const svgChildren = [{ type: "line", props: { x1: TP_BAR_X0, y1: 64, x2: TP_BAR_X0, y2: 330, stroke: ink.stroke, strokeWidth: printLine(1.5, profile) } }];
  const labels = [
    label(l.headModel, 16, 20, { fontWeight: 700, color: ink.text }),
    label(l.headPer, TP_BAR_X0, 20, { fontWeight: 700, color: ink.text }),
  ];
  TOKENS_PER_PARAM.forEach((row, i) => {
    const y = 76 + i * 86;
    const w = Math.max(4, (row.perParam / max) * TP_BAR_MAX);
    const c = row.key === "llama" ? amber : teal;
    svgChildren.push({ type: "rect", props: { x: TP_BAR_X0, y: y + 10, width: w, height: 34, rx: 5, fill: c.accent } });
    labels.push(
      label(l.names[row.key], 16, y, { fontWeight: 700, color: ink.text }),
      label(l.detail(row), 16, y + 26, { fontSize: "17px", color: ink.text }),
      label(l.per(row.perParam), TP_BAR_X0 + w + 10, y + 15, { fontWeight: 700, color: c.text }),
    );
  });
  return renderSvg(frame(TP_W, TP_H, svgChildren, labels), TP_W, TP_H);
}

const deNum = (n) => n.toLocaleString("de-DE");
const enNum = (n) => n.toLocaleString("en-US");
const deTokens = (t) => (t >= 1000 ? `${String(t / 1000).replace(".", ",")} Bio. Tokens` : `${t} Mrd. Tokens`);
const enTokens = (t) => (t >= 1000 ? `${t / 1000} trillion tokens` : `${t} billion tokens`);

export const tokensPerParamDe = {
  outPath: "public/bausteine/batch-epoch-step-tokenbudget/tokens-pro-parameter.svg",
  build: (profile) =>
    buildTokensPerParam(
      {
        headModel: "Modell",
        headPer: "Tokens pro Parameter",
        names: { chinchilla: "Chinchilla", llamaOptimal: "8 Mrd., nach Chinchilla", llama: "Llama 3 8B, tatsächlich" },
        detail: (r) => `${r.params} Mrd. Param., ${r.key === "llama" ? "über " : ""}${deTokens(r.tokens)}`,
        per: (n) => (n > 100 ? `rund ${deNum(1900)}` : `rund ${n}`),
      },
      profile,
    ),
};

export const tokensPerParamEn = {
  outPath: "public/bausteine/batch-epoch-step-tokenbudget/tokens-per-parameter.svg",
  build: (profile) =>
    buildTokensPerParam(
      {
        headModel: "Model",
        headPer: "Tokens per parameter",
        names: { chinchilla: "Chinchilla", llamaOptimal: "8B, Chinchilla-optimal", llama: "Llama 3 8B, actual" },
        detail: (r) => `${r.params}B params, ${r.key === "llama" ? "over " : ""}${enTokens(r.tokens)}`,
        per: (n) => (n > 100 ? `about ${enNum(1900)}` : `about ${n}`),
      },
      profile,
    ),
};
