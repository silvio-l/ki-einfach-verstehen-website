import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";
import { block, edge } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// Baustein "Transformerblöcke und Attention". The attention weights are a
// made-up example (one head, one layer, one word = one token, 3-number
// vectors), computed with python3 in the Baustein's research notes: the
// query of "Bank" against the keys of the earlier words, scaled by 1/sqrt(3),
// softmax, then the values mixed with those weights. Later positions are
// masked (causal mask) and get exactly 0.

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "18px", color: INK, ...style }, children: content } };
}

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function rect({ width, height, background, radius = 4 }) {
  return { type: "div", props: { style: { display: "flex", width: `${width}px`, height: `${height}px`, background, borderRadius: `${radius}px` }, children: "" } };
}

// ---------------------------------------------------------------------------
// 1. Spotlight weights for two sentences (Abschnitt "Der Scheinwerfer")

const W_W = 700;
const W_H = 470;
const LABEL_W = 92;
const BAR_X = 104;
const BAR_SCALE = 420; // px for weight 1.0

async function buildWeights(l, profile) {
  const muted = tone("neutral", profile).text;
  const children = [];
  let y = 0;
  l.sentences.forEach((s, si) => {
    children.push(at({ left: "0px", top: `${y}px`, width: `${W_W}px`, children: [text(s.title, { fontWeight: 700 })] }));
    y += 36;
    s.rows.forEach(([word, weight, hidden], i) => {
      const role = i === s.top ? "teal" : "neutral";
      children.push(at({ left: "0px", top: `${y}px`, width: `${LABEL_W}px`, justifyContent: "flex-end", children: [text(word, { fontWeight: i === s.top ? 700 : 400, color: hidden ? muted : INK })] }));
      if (hidden) {
        children.push(at({ left: `${BAR_X}px`, top: `${y + 1}px`, children: [text(l.hidden, { fontSize: "17px", color: muted })] }));
      } else {
        const w = Math.max(3, Math.round(weight * BAR_SCALE));
        children.push(at({ left: `${BAR_X}px`, top: `${y + 3}px`, children: [rect({ width: w, height: 18, background: tone(role, profile).accent, radius: 3 })] }));
        children.push(at({ left: `${BAR_X + w + 8}px`, top: `${y}px`, children: [text(l.num(weight), { fontWeight: i === s.top ? 700 : 400 })] }));
      }
      y += 25;
    });
    y += si === 0 ? 18 : 0;
  });
  children.push(at({ left: "0px", top: `${W_H - 26}px`, width: `${W_W}px`, children: [text(l.note, { fontSize: "17px", color: muted })] }));
  const tree = { type: "div", props: { style: { width: `${W_W}px`, height: `${W_H}px`, display: "flex", position: "relative", background: "#FFFFFF" }, children } };
  return renderSvg(tree, W_W, W_H);
}

const deNum = (n) => n.toFixed(2).replace(".", ",");
const enNum = (n) => n.toFixed(2);

export const attentionWeightsDe = {
  outPath: "public/bausteine/transformerbloecke-und-attention/scheinwerfer-gewichte.svg",
  build: (profile) =>
    buildWeights(
      {
        sentences: [
          {
            title: "„Ich sitze auf der Bank im Park“: Wohin leuchtet „Bank“?",
            top: 1,
            rows: [["Ich", 0.08], ["sitze", 0.52], ["auf", 0.12], ["der", 0.06], ["Bank", 0.22], ["im", 0, true], ["Park", 0, true]],
          },
          {
            title: "„Ich zahle Geld bei der Bank ein“: Wohin leuchtet „Bank“?",
            top: 2,
            rows: [["Ich", 0.07], ["zahle", 0.19], ["Geld", 0.44], ["bei", 0.07], ["der", 0.04], ["Bank", 0.19], ["ein", 0, true]],
          },
        ],
        hidden: "kommt erst danach, Gewicht 0",
        note: "Ausgedachte Zahlen, gerundet. Die Gewichte ergeben je Satz zusammen 1.",
        num: deNum,
      },
      profile,
    ),
};

export const attentionWeightsEn = {
  outPath: "public/bausteine/transformerbloecke-und-attention/spotlight-weights.svg",
  build: (profile) =>
    buildWeights(
      {
        sentences: [
          {
            title: "“I sit on the bank in the park”: where does “bank” shine?",
            top: 1,
            rows: [["I", 0.08], ["sit", 0.52], ["on", 0.12], ["the", 0.06], ["bank", 0.22], ["in", 0, true], ["park", 0, true]],
          },
          {
            title: "“I pay money into the bank”: where does “bank” shine?",
            top: 2,
            rows: [["I", 0.07], ["pay", 0.19], ["money", 0.44], ["into", 0.07], ["the", 0.04], ["bank", 0.19]],
          },
        ],
        hidden: "comes later, weight 0",
        note: "Made-up numbers, rounded. In each sentence the weights add up to 1.",
        num: enNum,
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. Causal mask as a 7x7 grid (Abschnitt "Nicht nach vorne schauen")

const M_CELL = 62;
const M_LEFT = 150;
const M_TOP = 92;

async function buildMask(l, profile) {
  const n = l.words.length;
  const W = M_LEFT + n * M_CELL + 10;
  const H = M_TOP + n * M_CELL + 46;
  const muted = tone("neutral", profile).text;
  const children = [
    at({ left: `${M_LEFT}px`, top: "0px", width: `${n * M_CELL}px`, children: [text(l.colTitle, { fontWeight: 700 })] }),
    at({ left: "0px", top: `${M_TOP - 30}px`, width: `${M_LEFT - 12}px`, justifyContent: "flex-end", children: [text(l.rowTitle, { fontWeight: 700 })] }),
  ];
  l.words.forEach((w, j) => {
    children.push(at({ left: `${M_LEFT + j * M_CELL}px`, top: "34px", width: `${M_CELL}px`, height: "52px", justifyContent: "center", alignItems: "flex-end", children: [text(w, { fontSize: "17px" })] }));
  });
  l.words.forEach((w, i) => {
    const hl = i === l.highlight;
    children.push(at({ left: "0px", top: `${M_TOP + i * M_CELL}px`, width: `${M_LEFT - 12}px`, height: `${M_CELL}px`, justifyContent: "flex-end", alignItems: "center", children: [text(w, { fontWeight: hl ? 700 : 400 })] }));
    l.words.forEach((_, j) => {
      const allowed = j <= i;
      const role = allowed ? (hl ? "amber" : "teal") : "neutral";
      children.push(
        at({
          left: `${M_LEFT + j * M_CELL + 3}px`,
          top: `${M_TOP + i * M_CELL + 3}px`,
          width: `${M_CELL - 6}px`,
          height: `${M_CELL - 6}px`,
          justifyContent: "center",
          alignItems: "center",
          background: allowed ? satoriBackground(role, profile, { fillKey: "fillStrong" }) : "#FFFFFF",
          border: allowed ? satoriBorder(role, profile, { width: 2 }) : `1px solid ${tone("neutral", profile).stroke}`,
          borderRadius: "6px",
          children: [text(allowed ? l.yes : "−∞", { fontSize: "18px", color: allowed ? tone(role, profile).text : muted, fontWeight: allowed ? 700 : 400 })],
        }),
      );
    });
  });
  children.push(at({ left: "0px", top: `${H - 32}px`, width: `${W}px`, children: [text(l.note, { fontSize: "17px", color: muted })] }));
  const tree = { type: "div", props: { style: { width: `${W}px`, height: `${H}px`, display: "flex", position: "relative", background: "#FFFFFF" }, children } };
  return renderSvg(tree, W, H);
}

export const causalMaskDe = {
  outPath: "public/bausteine/transformerbloecke-und-attention/causal-mask.svg",
  build: (profile) =>
    buildMask(
      {
        words: ["Ich", "sitze", "auf", "der", "Bank", "im", "Park"],
        highlight: 4,
        colTitle: "… darf auf diese Position schauen",
        rowTitle: "Position …",
        yes: "ja",
        note: "ja: erlaubt (28 von 49). −∞: gesperrt, Softmax macht daraus genau 0.",
      },
      profile,
    ),
};

export const causalMaskEn = {
  outPath: "public/bausteine/transformerbloecke-und-attention/causal-mask-en.svg",
  build: (profile) =>
    buildMask(
      {
        words: ["I", "sit", "on", "the", "bank", "in", "park"],
        highlight: 4,
        colTitle: "… may look at this position",
        rowTitle: "Position …",
        yes: "yes",
        note: "yes: allowed (28 of 49). −∞: blocked, softmax turns it into exactly 0.",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. One block, repeated (Abschnitt "Viele Scheinwerfer, viele Blöcke").
//    Qwen3-8B: 36 blocks (config.json, num_hidden_layers).

const B_W = 700;
const B_H = 500;

function box({ left, top, width, height, role, profile, title, sub, strong = false }) {
  return at({
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: satoriBackground(role, profile, { fillKey: strong ? "fillStrong" : "fill" }),
    border: satoriBorder(role, profile, { width: 2 }),
    borderRadius: "10px",
    children: [text(title, { fontWeight: 700, color: tone(role, profile).text }), ...(sub ? [text(sub, { fontSize: "17px", color: tone(role, profile).text })] : [])],
  });
}

function arrow(top, profile) {
  return at({ left: `${B_W / 2 - 10}px`, top: `${top}px`, children: [text("↓", { fontSize: "22px", color: tone("teal", profile).stroke, fontWeight: 700 })] });
}

async function buildBlocks(l, profile) {
  const muted = tone("neutral", profile).text;
  const children = [
    box({ left: 130, top: 0, width: 440, height: 54, role: "neutral", profile, title: l.input }),
    arrow(58, profile),
    // block 1 with its two parts
    at({
      left: "40px",
      top: "92px",
      width: "620px",
      height: "150px",
      flexDirection: "column",
      border: satoriBorder("teal", profile, { width: 2 }),
      borderRadius: "12px",
      background: "#FFFFFF",
      children: [text(l.block1, { fontWeight: 700, color: tone("teal", profile).text, marginLeft: "14px", marginTop: "8px" })],
    }),
    box({ left: 56, top: 132, width: 270, height: 92, role: "amber", profile, title: l.attn, sub: l.attnSub }),
    at({ left: "334px", top: "160px", children: [text("→", { fontSize: "22px", color: tone("teal", profile).stroke, fontWeight: 700 })] }),
    box({ left: 374, top: 132, width: 270, height: 92, role: "teal", profile, title: l.ffn, sub: l.ffnSub }),
    arrow(246, profile),
    box({ left: 130, top: 280, width: 440, height: 46, role: "teal", profile, title: l.block2, strong: true }),
    at({ left: `${B_W / 2 - 10}px`, top: "330px", children: [text("…", { fontSize: "24px", color: muted, fontWeight: 700 })] }),
    box({ left: 130, top: 366, width: 440, height: 46, role: "teal", profile, title: l.blockN, strong: true }),
    arrow(416, profile),
    box({ left: 130, top: 450, width: 440, height: 50, role: "neutral", profile, title: l.output }),
  ];
  const tree = { type: "div", props: { style: { width: `${B_W}px`, height: `${B_H}px`, display: "flex", position: "relative", background: "#FFFFFF" }, children } };
  return renderSvg(tree, B_W, B_H);
}

export const blockStackDe = {
  outPath: "public/bausteine/transformerbloecke-und-attention/blockstapel.svg",
  build: (profile) =>
    buildBlocks(
      {
        input: "Steckbriefe aller Tokens",
        block1: "Block 1",
        attn: "Attention",
        attnSub: "mischt zwischen Positionen",
        ffn: "Weiterverarbeitung",
        ffnSub: "jede Position für sich",
        block2: "Block 2 (gleich gebaut)",
        blockN: "Block 36 (bei Qwen3-8B)",
        output: "Zustände mit eingemischtem Kontext",
      },
      profile,
    ),
};

export const blockStackEn = {
  outPath: "public/bausteine/transformerbloecke-und-attention/block-stack.svg",
  build: (profile) =>
    buildBlocks(
      {
        input: "Profiles of all tokens",
        block1: "Block 1",
        attn: "Attention",
        attnSub: "mixes between positions",
        ffn: "Further processing",
        ffnSub: "each position on its own",
        block2: "Block 2 (built the same)",
        blockN: "Block 36 (in Qwen3-8B)",
        output: "States with context mixed in",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 4. Step-through: how "Bank" gets its weights and its new state
//    (Abschnitt "Query, Key und Value"). Same made-up numbers as above.

function qkvSource(t, profile) {
  return `
grid-rows: 2
grid-columns: 3
horizontal-gap: 86
vertical-gap: 90

query: "${t.query}" {${block("amber", profile)}}
keys: "${t.keys}" {${block("neutral", profile)}}
values: "${t.values}" {${block("neutral", profile)}}
scores: "${t.scores}" {${block("neutral", profile)}}
weights: "${t.weights}" {${block("teal", profile)}}
neu: "${t.neu}" {${block("amber", profile)}}

query -> scores: ${edge(profile, t.compare)}
keys -> scores: ${edge(profile, t.compare)}
scores -> weights: ${edge(profile, "Softmax")}
weights -> neu: ${edge(profile, t.mix)}
values -> neu: ${edge(profile, t.bring)}
`;
}

const QKV_STEPS = (c) => [
  { nodes: ["query", "keys"], caption: c[0] },
  { nodes: ["query", "keys", "scores"], edges: ["query -> scores", "keys -> scores"], caption: c[1] },
  { nodes: ["scores", "weights"], edges: ["scores -> weights"], caption: c[2] },
  { nodes: ["values", "weights", "neu"], edges: ["values -> neu", "weights -> neu"], caption: c[3] },
  { nodes: ["neu"], caption: c[4] },
];

const QKV_DE = {
  query: "Query\\nvon „Bank“",
  keys: "Keys\\nIch · sitze\\nauf · der · Bank",
  values: "Values\\nwas jedes\\nWort mitgibt",
  scores: "Scores\\nsitze 2,17\\nBank 1,30 …",
  weights: "Gewichte\\nsitze 0,52\\nBank 0,22 …",
  neu: "neuer\\nZustand\\nvon „Bank“",
  compare: "vergleichen",
  mix: "mischen",
  bring: "mitgeben",
};

const QKV_DE_TEXT = {
  title: "Wie „Bank“ Kontext einmischt",
  intro: "Ein Durchgang für das Wort „Bank“ im Satz „Ich sitze auf der Bank im Park“, mit ausgedachten Zahlen. Mit „Weiter“ gehst du Schritt für Schritt durch.",
  captions: [
    "„Bank“ ist gerade an der Reihe. Seine Query wird mit dem Key jeder Position verglichen, die es sehen darf: Ich, sitze, auf, der und Bank selbst.",
    "Jeder Vergleich ergibt einen Score, also eine Zahl dafür, wie gut Query und Key zusammenpassen. „sitze“ passt am besten (2,17), „der“ am schlechtesten (0,00).",
    "Softmax macht aus den Scores Gewichte zwischen 0 und 1, die zusammen 1 ergeben: sitze 0,52, Bank 0,22, auf 0,12, Ich 0,08, der 0,06.",
    "Jedes Wort gibt seinen Value mit, und zwar mit seinem Gewicht malgenommen. Die Summe ist die Mischung; sie besteht zu mehr als der Hälfte aus dem Value von „sitze“.",
    "Die Mischung wird zum bisherigen Zustand von „Bank“ addiert. Danach zeigt er stärker in Richtung Sitzmöbel als in Richtung Geld.",
  ],
};

const QKV_EN = {
  query: "Query\\nof “bank”",
  keys: "Keys\\nI · sit · on\\nthe · bank",
  values: "Values\\nwhat each\\nword passes on",
  scores: "Scores\\nsit 2.17\\nbank 1.30 …",
  weights: "Weights\\nsit 0.52\\nbank 0.22 …",
  neu: "new state\\nof “bank”",
  compare: "compare",
  mix: "mix",
  bring: "pass on",
};

const QKV_EN_TEXT = {
  title: "How “bank” mixes in context",
  intro: "One pass for the word “bank” in the sentence “I sit on the bank in the park”, with made-up numbers. Use “Next” to go step by step.",
  captions: [
    "“bank” is up. Its query is compared with the key of every position it may see: I, sit, on, the and bank itself.",
    "Each comparison gives a score, a number for how well query and key fit together. “sit” fits best (2.17), “the” worst (0.00).",
    "Softmax turns the scores into weights between 0 and 1 that add up to 1: sit 0.52, bank 0.22, on 0.12, I 0.08, the 0.06.",
    "Each word passes on its value, multiplied by its weight. The sum is the mix; more than half of it is the value of “sit”.",
    "The mix is added to the previous state of “bank”. Afterwards it points more towards seating than towards money.",
  ],
};

export const qkvStepperDe = stepperFigure({
  source: qkvSource,
  text: QKV_DE,
  copy: QKV_DE_TEXT,
  steps: QKV_STEPS,
  lang: "de",
  outPath: "public/bausteine/transformerbloecke-und-attention/query-key-value.static.svg",
  htmlPath: "public/bausteine/transformerbloecke-und-attention/query-key-value.html",
});

export const qkvStepperEn = stepperFigure({
  source: qkvSource,
  text: QKV_EN,
  copy: QKV_EN_TEXT,
  steps: QKV_STEPS,
  lang: "en",
  outPath: "public/bausteine/transformerbloecke-und-attention/query-key-value-en.static.svg",
  htmlPath: "public/bausteine/transformerbloecke-und-attention/query-key-value-en.html",
});
