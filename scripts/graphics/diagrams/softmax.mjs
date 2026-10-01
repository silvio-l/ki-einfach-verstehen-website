import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";
import { block, edge } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// Baustein 5 (Wahrscheinlichkeit und Softmax). All numbers come from one
// made-up example: after "Die Katze" a model only knows three continuations
// with the scores 3.0 / 2.0 / -1.0. Softmax turns them into 72 / 27 / 1 %;
// dividing the scores by a temperature of 0.5 or 2 first gives 88 / 12 / 0.03 %
// and 57 / 35 / 8 % (computed with python3, see the Baustein's Lernplan).

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";
// One colour per candidate, the same in every graphic of this Baustein and
// matching the wheel illustration: teal = most likely, amber = second,
// neutral = the thin sliver.
const ROLES = ["teal", "amber", "neutral"];

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "16px", color: INK, ...style }, children: content } };
}

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function bar(width, height, role, profile) {
  return { type: "div", props: { style: { display: "flex", width: `${width}px`, height: `${height}px`, background: tone(role, profile).accent, borderRadius: "3px" }, children: "" } };
}

// ---------------------------------------------------------------------------
// 1. Scores -> softmax -> shares (Abschnitt "Aus Punkten werden Anteile")

const PTP_W = 600;
const PTP_H = 250;
const ROW_Y = [62, 112, 162];
const ZERO_X = 116;
const SCORE_SCALE = 30; // px per score point
const SHARE_X = 372;
const SHARE_SCALE = 1.6; // px per percent

async function buildPointsToPercent(l, profile) {
  const muted = tone("neutral", profile).text;
  const children = [
    at({ left: "0px", top: "14px", width: "260px", children: [text(l.scoresTitle, { fontWeight: 700 })] }),
    at({ left: `${SHARE_X}px`, top: "14px", width: "228px", children: [text(l.sharesTitle, { fontWeight: 700 })] }),
    // zero line of the score chart
    { type: "div", props: { style: abs({ left: `${ZERO_X}px`, top: "50px", width: "1px", height: "140px", background: "#B9B3A5" }), children: "" } },
    at({ left: "268px", top: "96px", width: "92px", flexDirection: "column", alignItems: "center", children: [text("→", { fontSize: "30px", color: tone("teal", profile).stroke }), text("Softmax", { fontWeight: 700, color: tone("teal", profile).text })] }),
    at({ left: "0px", top: "208px", width: "260px", children: [text(l.scoresNote, { fontSize: "15px", color: muted })] }),
    at({ left: `${SHARE_X}px`, top: "208px", width: "228px", children: [text(l.sharesNote, { fontSize: "15px", color: muted, fontWeight: 700 })] }),
  ];
  l.rows.forEach(([label, score, share], i) => {
    const y = ROW_Y[i];
    const w = Math.round(Math.abs(score) * SCORE_SCALE);
    const role = ROLES[i];
    children.push(at({ left: "0px", top: `${y - 3}px`, width: "62px", justifyContent: "flex-end", children: [text(label)] }));
    if (score >= 0) {
      children.push(at({ left: `${ZERO_X}px`, top: `${y}px`, children: [bar(w, 18, role, profile)] }));
      children.push(at({ left: `${ZERO_X + w + 6}px`, top: `${y - 3}px`, children: [text(l.score(score))] }));
    } else {
      children.push(at({ left: `${ZERO_X - w}px`, top: `${y}px`, children: [bar(w, 18, role, profile)] }));
      children.push(at({ left: `${ZERO_X + 6}px`, top: `${y - 3}px`, children: [text(l.score(score))] }));
    }
    const sw = Math.max(3, Math.round(share * SHARE_SCALE));
    children.push(at({ left: `${SHARE_X}px`, top: `${y}px`, children: [bar(sw, 18, role, profile)] }));
    children.push(at({ left: `${SHARE_X + sw + 6}px`, top: `${y - 3}px`, children: [text(l.percent(share), { fontWeight: 700 })] }));
  });
  const tree = { type: "div", props: { style: { width: `${PTP_W}px`, height: `${PTP_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, PTP_W, PTP_H);
}

const deScore = (s) => (s < 0 ? `−${Math.abs(s).toFixed(1)}` : s.toFixed(1)).replace(".", ",");
const enScore = (s) => (s < 0 ? `−${Math.abs(s).toFixed(1)}` : s.toFixed(1));

export const pointsToPercentDe = {
  outPath: "public/bausteine/wahrscheinlichkeit-und-softmax/punkte-zu-prozent.svg",
  build: (profile) =>
    buildPointsToPercent(
      {
        scoresTitle: "Scores",
        sharesTitle: "Wahrscheinlichkeiten",
        scoresNote: "beliebige Zahlen, auch negativ",
        sharesNote: "zusammen 100 %",
        rows: [["sitzt", 3, 72], ["schläft", 2, 27], ["fliegt", -1, 1]],
        score: deScore,
        percent: (n) => `${n} %`,
      },
      profile,
    ),
};

export const pointsToPercentEn = {
  outPath: "public/bausteine/wahrscheinlichkeit-und-softmax/points-to-percent.svg",
  build: (profile) =>
    buildPointsToPercent(
      {
        scoresTitle: "Scores",
        sharesTitle: "Probabilities",
        scoresNote: "any numbers, even negative",
        sharesNote: "100% in total",
        rows: [["sat", 3, 72], ["slept", 2, 27], ["flew", -1, 1]],
        score: enScore,
        percent: (n) => `${n}%`,
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. Always the favourite vs. spinning the wheel (Abschnitt "Den Favoriten
//    nehmen oder das Rad drehen"). The sampled draws are made up.

const GS_W = 620;
const GS_H = 250;

function chip(top, word, role, profile) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "128px",
        height: "70px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "10px",
      },
      children: [text(top, { fontSize: "15px", color: tone("neutral", profile).text }), text(word, { fontSize: "18px", fontWeight: 700 })],
    },
  };
}

async function buildGreedySampling(l, profile) {
  const row = (title, sub, words) => ({
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", gap: "10px" },
      children: [
        { type: "div", props: { style: { display: "flex", flexDirection: "column", width: "196px" }, children: [text(title, { fontWeight: 700 }), text(sub, { fontSize: "15px", color: tone("neutral", profile).text })] } },
        ...words.map((w, i) => chip(l.attempt(i + 1), w, w === l.rows[0].words[0] ? "teal" : "amber", profile)),
      ],
    },
  });
  const tree = {
    type: "div",
    props: {
      style: { width: `${GS_W}px`, height: `${GS_H}px`, display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px" },
      children: [
        text(l.input, { fontSize: "15px", color: tone("neutral", profile).text }),
        ...l.rows.map((r) => row(r.title, r.sub, r.words)),
      ],
    },
  };
  return renderSvg(tree, GS_W, GS_H);
}

export const greedySamplingDe = {
  outPath: "public/bausteine/wahrscheinlichkeit-und-softmax/greedy-und-sampling.svg",
  build: (profile) =>
    buildGreedySampling(
      {
        input: "Dreimal dieselbe Eingabe: „Die Katze …“ (72 % · 27 % · 1 %)",
        attempt: (n) => `Versuch ${n}`,
        rows: [
          { title: "Immer das Größte", sub: "ohne Drehen", words: ["sitzt", "sitzt", "sitzt"] },
          { title: "Rad drehen", sub: "Sampling, ausgedachte Ziehung", words: ["sitzt", "sitzt", "schläft"] },
        ],
      },
      profile,
    ),
};

export const greedySamplingEn = {
  outPath: "public/bausteine/wahrscheinlichkeit-und-softmax/greedy-and-sampling.svg",
  build: (profile) =>
    buildGreedySampling(
      {
        input: "The same input three times: “The cat …” (72% · 27% · 1%)",
        attempt: (n) => `Attempt ${n}`,
        rows: [
          { title: "Always the largest", sub: "no spin", words: ["sat", "sat", "sat"] },
          { title: "Spin the wheel", sub: "sampling, made-up draws", words: ["sat", "sat", "slept"] },
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. The same scores at three temperatures (Abschnitt "Mehr oder weniger Mut").

const T_W = 600;
const T_H = 280;
const T_BAR_W = 44;
const T_BAR_MAX = 120; // px for 100 %

function temperaturePanel(panel, labels, profile) {
  const columns = panel.shares.map((share, i) => ({
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", width: `${T_BAR_W + 14}px`, height: `${T_BAR_MAX + 48}px` },
      children: [
        text(share, { fontWeight: 700, marginBottom: "4px" }),
        bar(T_BAR_W, Math.max(2, Math.round((panel.values[i] / 100) * T_BAR_MAX)), ROLES[i], profile),
        text(labels[i], { marginTop: "4px" }),
      ],
    },
  }));
  return {
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", alignItems: "center", width: "190px", padding: "10px 4px", borderRadius: "14px", background: panel.highlight ? satoriBackground("teal", profile) : "#FFFFFF", border: satoriBorder(panel.highlight ? "teal" : "neutral", profile, { width: 1.5 }) },
      children: [
        text(panel.title, { fontWeight: 700 }),
        text(panel.sub, { fontSize: "15px", color: tone("neutral", profile).text, marginBottom: "4px" }),
        { type: "div", props: { style: { display: "flex", alignItems: "flex-end" }, children: columns } },
      ],
    },
  };
}

async function buildTemperature(l, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${T_W}px`, height: `${T_H}px`, display: "flex", alignItems: "center", justifyContent: "space-between" },
      children: l.panels.map((p) => temperaturePanel(p, l.labels, profile)),
    },
  };
  return renderSvg(tree, T_W, T_H);
}

export const temperatureDe = {
  outPath: "public/bausteine/wahrscheinlichkeit-und-softmax/temperatur.svg",
  build: (profile) =>
    buildTemperature(
      {
        labels: ["sitzt", "schläft", "fliegt"],
        panels: [
          { title: "Temperatur 0,5", sub: "spitzt zu", shares: ["88 %", "12 %", "0,03 %"], values: [88.05, 11.92, 0.03] },
          { title: "Temperatur 1", sub: "unverändert", shares: ["72 %", "27 %", "1 %"], values: [72.14, 26.54, 1.32], highlight: true },
          { title: "Temperatur 2", sub: "gleicht an", shares: ["57 %", "35 %", "8 %"], values: [57.41, 34.82, 7.77] },
        ],
      },
      profile,
    ),
};

export const temperatureEn = {
  outPath: "public/bausteine/wahrscheinlichkeit-und-softmax/temperature.svg",
  build: (profile) =>
    buildTemperature(
      {
        labels: ["sat", "slept", "flew"],
        panels: [
          { title: "Temperature 0.5", sub: "sharper", shares: ["88%", "12%", "0.03%"], values: [88.05, 11.92, 0.03] },
          { title: "Temperature 1", sub: "unchanged", shares: ["72%", "27%", "1%"], values: [72.14, 26.54, 1.32], highlight: true },
          { title: "Temperature 2", sub: "flatter", shares: ["57%", "35%", "8%"], values: [57.41, 34.82, 7.77] },
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 4. Softmax in three steps, as a step-through animation (stepper.mjs).
//    Clockwise 2x2 grid: scores -> weights -> sum -> shares.

// Wider than GRID_HEAD so the step labels fit beside their arrows.
const SOFTMAX_GRID = "grid-rows: 2\ngrid-columns: 2\nhorizontal-gap: 260\nvertical-gap: 80";

function softmaxSource(t, profile) {
  return `
${SOFTMAX_GRID}

scores: "${t.scores}" {${block("neutral", profile)}}
gewichte: "${t.weights}" {${block("teal", profile)}}
anteile: "${t.shares}" {${block("amber", profile)}}
summe: "${t.sum}" {${block("teal", profile)}}

scores -> gewichte: ${edge(profile, t.positive)}
gewichte -> summe: ${edge(profile, t.add)}
summe -> anteile: ${edge(profile, t.divide)}
`;
}

const SOFTMAX_STEPS = (c) => [
  { nodes: ["scores"], caption: c[0] },
  { nodes: ["scores", "gewichte"], edges: ["scores -> gewichte"], caption: c[1] },
  { nodes: ["gewichte", "summe"], edges: ["gewichte -> summe"], caption: c[2] },
  { nodes: ["summe", "anteile"], edges: ["summe -> anteile"], caption: c[3] },
  { nodes: ["scores", "gewichte", "summe", "anteile"], edges: ["scores -> gewichte", "gewichte -> summe", "summe -> anteile"], caption: c[4] },
];

const SOFTMAX_DE = {
  scores: "Scores\\n3,0 · 2,0 · −1,0",
  weights: "Gewichte\\n20,1 · 7,4 · 0,37",
  sum: "Summe\\n27,8",
  shares: "Anteile\\n72 % · 27 % · 1 %",
  positive: "1. positiv machen",
  add: "2. zusammenzählen",
  divide: "3. Gewichte ÷ Summe",
};

const SOFTMAX_DE_TEXT = {
  title: "Softmax in drei Schritten",
  intro: "So macht Softmax aus Scores Wahrscheinlichkeiten. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Angenommen, das Modell kennt nach „Die Katze“ nur drei Fortsetzungen, mit den ausgedachten Scores 3,0, 2,0 und −1,0.",
    "Schritt 1: Jeder Score wird zu einer positiven Zahl, dem Gewicht. Jeder Punkt mehr macht das Gewicht etwa 2,7-mal so groß: 20,1, 7,4 und 0,37.",
    "Schritt 2: Alle Gewichte werden zusammengezählt: 20,1 + 7,4 + 0,37 ergibt rund 27,8.",
    "Schritt 3: Jedes Gewicht wird durch die Summe geteilt. 20,1 ÷ 27,8 sind rund 72 %, 7,4 ÷ 27,8 rund 27 %, 0,37 ÷ 27,8 rund 1 %.",
    "Zusammen ergibt das 100 %. Die Reihenfolge ist dieselbe wie bei den Scores, und auch „fliegt“ behält einen kleinen Anteil.",
  ],
};

const SOFTMAX_EN = {
  scores: "scores\\n3.0 · 2.0 · −1.0",
  weights: "weights\\n20.1 · 7.4 · 0.37",
  sum: "sum\\n27.8",
  shares: "shares\\n72% · 27% · 1%",
  positive: "1. make positive",
  add: "2. add up",
  divide: "3. weights ÷ sum",
};

const SOFTMAX_EN_TEXT = {
  title: "Softmax in three steps",
  intro: "This is how softmax turns scores into probabilities. Use “Next” to go step by step, “Play” runs on its own.",
  captions: [
    "Suppose that after “The cat” the model knows only three continuations, with the made-up scores 3.0, 2.0 and −1.0.",
    "Step 1: Each score becomes a positive number, its weight. Every extra point makes the weight about 2.7 times as large: 20.1, 7.4 and 0.37.",
    "Step 2: All weights are added up: 20.1 + 7.4 + 0.37 comes to about 27.8.",
    "Step 3: Each weight is divided by the sum. 20.1 ÷ 27.8 is about 72%, 7.4 ÷ 27.8 about 27%, 0.37 ÷ 27.8 about 1%.",
    "Together that makes 100%. The order is the same as for the scores, and even “flew” keeps a small share.",
  ],
};

export const softmaxStepsDe = stepperFigure({
  source: softmaxSource,
  text: SOFTMAX_DE,
  copy: SOFTMAX_DE_TEXT,
  steps: SOFTMAX_STEPS,
  lang: "de",
  outPath: "public/bausteine/wahrscheinlichkeit-und-softmax/softmax-schritte.static.svg",
  htmlPath: "public/bausteine/wahrscheinlichkeit-und-softmax/softmax-schritte.html",
});

export const softmaxStepsEn = stepperFigure({
  source: softmaxSource,
  text: SOFTMAX_EN,
  copy: SOFTMAX_EN_TEXT,
  steps: SOFTMAX_STEPS,
  lang: "en",
  outPath: "public/bausteine/wahrscheinlichkeit-und-softmax/softmax-steps.static.svg",
  htmlPath: "public/bausteine/wahrscheinlichkeit-und-softmax/softmax-steps.html",
});
