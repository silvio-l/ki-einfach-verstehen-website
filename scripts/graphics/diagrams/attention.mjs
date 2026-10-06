import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";
import { block, edge } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";
import { attend } from "../../../src/scripts/demos/qkv.js";

// Shares (0..1, whole percent as shown in the demo) of the visible words.
function shares(sentence, kind) {
  return attend(sentence, kind).rows.map((r) => r.pct / 100);
}
const PARK_SEAT = shares("park", "seat");
const MONEY_MONEY = shares("money", "money");

// Baustein "Transformerblöcke und Attention". The attention shares are the
// made-up toy numbers of the QkvDemo (src/scripts/demos/qkv.js): vectors with
// two named places (seat | money), query of "Bank" (1 | 0) looking for seat
// clues in the park sentence and (0 | 1) looking for money clues in the money
// sentence, score = dot product (no division by sqrt(d_k)), softmax, values
// mixed with the shares and added to the old state (1 | 1). Later positions
// are masked (causal mask) and get exactly 0. The shares are imported from
// qkv.js, so text, graphic and demo cannot drift apart.

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

const deNum = (n) => `${Math.round(n * 100)} %`;
const enNum = (n) => `${Math.round(n * 100)}%`;

export const attentionWeightsDe = {
  outPath: "public/bausteine/transformerbloecke-und-attention/scheinwerfer-gewichte.svg",
  build: (profile) =>
    buildWeights(
      {
        sentences: [
          {
            title: "„Ich sitze auf der Bank im Park“, Scheinwerfer sucht Sitzmöbel",
            top: 1,
            rows: [["Ich", PARK_SEAT[0]], ["sitze", PARK_SEAT[1]], ["auf", PARK_SEAT[2]], ["der", PARK_SEAT[3]], ["Bank", PARK_SEAT[4]], ["im", 0, true], ["Park", 0, true]],
          },
          {
            title: "„Ich zahle Geld bei der Bank ein“, Scheinwerfer sucht Geld",
            top: 2,
            rows: [["Ich", MONEY_MONEY[0]], ["zahle", MONEY_MONEY[1]], ["Geld", MONEY_MONEY[2]], ["bei", MONEY_MONEY[3]], ["der", MONEY_MONEY[4]], ["Bank", MONEY_MONEY[5]], ["ein", 0, true]],
          },
        ],
        hidden: "kommt erst danach, Anteil 0",
        note: "Ausgedachte Zahlen. Die Anteile ergeben je Satz zusammen 100 %.",
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
            title: "“I sit on the bank in the park”, spotlight looks for a place to sit",
            top: 1,
            rows: [["I", PARK_SEAT[0]], ["sit", PARK_SEAT[1]], ["on", PARK_SEAT[2]], ["the", PARK_SEAT[3]], ["bank", PARK_SEAT[4]], ["in", 0, true], ["the", 0, true], ["park", 0, true]],
          },
          {
            title: "“I pay money into the bank”, spotlight looks for money",
            top: 2,
            rows: [["I", MONEY_MONEY[0]], ["pay", MONEY_MONEY[1]], ["money", MONEY_MONEY[2]], ["into", MONEY_MONEY[3]], ["the", MONEY_MONEY[4]], ["bank", MONEY_MONEY[5]]],
          },
        ],
        hidden: "comes later, share 0",
        note: "Made-up numbers. In each sentence the shares add up to 100%.",
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
        words: ["I", "sit", "on", "the", "bank", "in", "the", "park"],
        highlight: 4,
        colTitle: "… may look at this position",
        rowTitle: "Position …",
        yes: "yes",
        note: "yes: allowed (36 of 64). −∞: blocked, softmax turns it into exactly 0.",
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
        block2: "Block 2 (gleich gebaut, eigene Zahlen)",
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
        block2: "Block 2 (same design, own numbers)",
        blockN: "Block 36 (in Qwen3-8B)",
        output: "States with context mixed in",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 4. Step-through: how "Bank" gets its shares and its new state
//    (Abschnitt "Query, Key und Value"). Same made-up numbers as the
//    QkvDemo start state (park sentence, query looks for seat clues).

function qkvSource(t, profile) {
  return `
grid-rows: 3
grid-columns: 3
horizontal-gap: 95
vertical-gap: 70

query: "${t.query}" {${block("amber", profile)}}
keys: "${t.keys}" {${block("neutral", profile)}}
values: "${t.values}" {${block("neutral", profile)}}
scores: "${t.scores}" {${block("neutral", profile)}}
anteile: "${t.shares}" {${block("teal", profile)}}
mischung: "${t.mix}" {${block("teal", profile)}}
alt: "${t.alt}" {${block("neutral", profile)}}
platz: "" {style.opacity: 0}
neu: "${t.neu}" {${block("amber", profile)}}

query -> scores: ${edge(profile, t.compare)}
keys -> scores: ${edge(profile, t.compare)}
scores -> anteile: ${edge(profile, "Softmax")}
anteile -> mischung: ${edge(profile, t.weigh)}
values -> mischung: ${edge(profile, t.bring)}
mischung -> neu: ${edge(profile, "+")}
alt -> neu: ${edge(profile, "+")}
`;
}

const QKV_STEPS = (c) => [
  { nodes: ["query", "keys"], caption: c[0] },
  { nodes: ["query", "keys", "scores"], edges: ["query -> scores", "keys -> scores"], caption: c[1] },
  { nodes: ["scores", "anteile"], edges: ["scores -> anteile"], caption: c[2] },
  { nodes: ["values", "anteile", "mischung"], edges: ["values -> mischung", "anteile -> mischung"], caption: c[3] },
  { nodes: ["alt", "mischung", "neu"], edges: ["alt -> neu", "mischung -> neu"], caption: c[4] },
];

const QKV_DE = {
  query: "Query\\nvon „Bank“\\n(1 | 0)",
  keys: "Keys\\nsitze (2 | 0)\\nauf (1 | 0) …",
  values: "Values\\nsitze (2 | 0)\\nBank (1 | 1) …",
  alt: "alter Zustand\\nvon „Bank“\\n(1 | 1)",
  scores: "Scores\\nsitze 2\\nauf 1 …",
  shares: "Anteile\\nsitze 50 %\\nauf 18 % …",
  mix: "Mischung\\n(1,2 | 0,2)",
  neu: "neuer Zustand\\nvon „Bank“\\n(2,2 | 1,2)",
  compare: "vergleichen",
  weigh: "mal Anteil",
  bring: "mitgeben",
};

const QKV_DE_TEXT = {
  title: "Wie „Bank“ Kontext einmischt",
  intro: "Ein Durchgang für das Wort „Bank“ im Satz „Ich sitze auf der Bank im Park“, mit ausgedachten Zahlen. Jeder Vektor hat zwei Stellen: (Sitzmöbel | Geld). Mit „Weiter“ gehst du Schritt für Schritt durch.",
  captions: [
    "„Bank“ ist an der Reihe. Seine Query (1 | 0) sucht Sitzmöbel-Hinweise. Sie wird mit dem Key jeder Position verglichen, die „Bank“ sehen darf: Ich, sitze, auf, der und Bank selbst.",
    "Vergleichen heißt: Stelle für Stelle malnehmen und addieren. Mit dem Key von „sitze“, (2 | 0), ergibt das 1 · 2 + 0 · 0 = 2. „auf“ und „Bank“ kommen auf 1, „Ich“ und „der“ auf 0.",
    "Softmax macht aus den Scores Anteile, die zusammen 100 % ergeben: sitze 50 %, auf und Bank je 18 %, Ich und der je 7 %.",
    "Jeder Value wird mit seinem Anteil malgenommen, dann wird addiert: 0,5 · (2 | 0) + 0,18 · (1 | 1) ergibt rund (1,2 | 0,2). „auf“ hat zwar 18 %, sein Value ist aber (0 | 0).",
    "Die Mischung wird zum alten Zustand addiert: (1 | 1) + (1,2 | 0,2) = (2,2 | 1,2). Jetzt zeigt „Bank“ deutlich Richtung Sitzmöbel.",
  ],
};

const QKV_EN = {
  query: "Query\\nof “bank”\\n(1 | 0)",
  keys: "Keys\\nsit (2 | 0)\\non (1 | 0) …",
  values: "Values\\nsit (2 | 0)\\nbank (1 | 1) …",
  alt: "old state\\nof “bank”\\n(1 | 1)",
  scores: "Scores\\nsit 2\\non 1 …",
  shares: "Shares\\nsit 50%\\non 18% …",
  mix: "Mix\\n(1.2 | 0.2)",
  neu: "new state\\nof “bank”\\n(2.2 | 1.2)",
  compare: "compare",
  weigh: "times share",
  bring: "pass on",
};

const QKV_EN_TEXT = {
  title: "How “bank” mixes in context",
  intro: "One pass for the word “bank” in the sentence “I sit on the bank in the park”, with made-up numbers. Each vector has two places: (place to sit | money). Use “Next” to go step by step.",
  captions: [
    "“bank” is up. Its query (1 | 0) looks for clues about a place to sit. It is compared with the key of every position “bank” may see: I, sit, on, the and bank itself.",
    "Comparing means: multiply place by place and add up. With the key of “sit”, (2 | 0), that gives 1 · 2 + 0 · 0 = 2. “on” and “bank” get 1, “I” and “the” get 0.",
    "Softmax turns the scores into shares that add up to 100%: sit 50%, on and bank 18% each, I and the 7% each.",
    "Each value is multiplied by its share, then everything is added up: 0.5 · (2 | 0) + 0.18 · (1 | 1) gives about (1.2 | 0.2). “on” has 18%, but its value is (0 | 0).",
    "The mix is added to the old state: (1 | 1) + (1.2 | 0.2) = (2.2 | 1.2). Now “bank” points clearly towards a place to sit.",
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
