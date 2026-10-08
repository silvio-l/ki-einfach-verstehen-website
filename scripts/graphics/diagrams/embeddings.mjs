import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";
import { block, edge, GRID_HEAD } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// TB2 Baustein 3 (Embeddings). Neighbour values are cosine similarities
// between rows of GPT-2's input table (openai-community/gpt2, wte),
// recomputed for this lesson on 2026-10-06; the random-pair baseline is the
// mean over 20,000 random token pairs. See the Lernplan and research notes.

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "16px", color: INK, ...style }, children: content } };
}

function card(role, profile, style, children) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "10px",
        padding: "12px 14px",
        gap: "6px",
        ...style,
      },
      children,
    },
  };
}

// ---------------------------------------------------------------------------
// 1. Nearest neighbours of " apple" and " Apple" (Abschnitt "Ähnliche
// Verwendung, ähnlicher Steckbrief")

const NB_W = 640;
const NB_H = 290;
const BAR_MAX = 150; // px for a similarity of 1.0 is BAR_MAX / 0.8
const scale = (v) => Math.round((v / 0.8) * BAR_MAX);

function neighbourRow([label, value], role, profile, fmt) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", gap: "8px" },
      children: [
        text(label, { width: "92px", fontSize: "16px" }),
        {
          type: "div",
          props: {
            style: { display: "flex", position: "relative", width: `${BAR_MAX}px`, height: "16px" },
            children: [
              { type: "div", props: { style: { display: "flex", width: `${scale(value)}px`, height: "16px", background: tone(role, profile).accent, borderRadius: "3px" }, children: "" } },
              {
                type: "div",
                props: {
                  style: { display: "flex", position: "absolute", left: `${scale(0.27)}px`, top: "-3px", width: "2px", height: "22px", background: INK },
                  children: "",
                },
              },
            ],
          },
        },
        text(fmt(value), { fontSize: "16px", color: tone("neutral", profile).text }),
      ],
    },
  };
}

function neighbourCard(title, rows, role, profile, fmt) {
  return card(role, profile, { width: "308px", gap: "8px" }, [
    text(title, { fontWeight: 700, fontSize: "17px", color: tone(role, profile).text }),
    ...rows.map((r) => neighbourRow(r, role, profile, fmt)),
  ]);
}

async function buildNeighbours(l, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${NB_W}px`, height: `${NB_H}px`, display: "flex", flexDirection: "column", gap: "12px", padding: "6px 4px" },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", gap: "16px" },
            children: [
              neighbourCard(l.appleTitle, l.apple, "teal", profile, l.fmt),
              neighbourCard(l.AppleTitle, l.Apple, "amber", profile, l.fmt),
            ],
          },
        },
        text(l.baseline, { fontSize: "16px", color: tone("neutral", profile).text }),
        text(l.note, { fontSize: "16px", color: tone("neutral", profile).text }),
      ],
    },
  };
  return renderSvg(tree, NB_W, NB_H);
}

const APPLE = [["apples", 0.7], ["Apple", 0.62], ["cider", 0.55], ["peach", 0.53], ["lemon", 0.52], ["fruit", 0.51]];
const APPLE_CAP = [["iPhone", 0.64], ["apple", 0.62], ["iOS", 0.59], ["Microsoft", 0.55], ["iPad", 0.54], ["Macintosh", 0.54]];

export const neighboursDe = {
  outPath: "public/bausteine/embeddings/nachbarn.svg",
  build: (profile) =>
    buildNeighbours(
      {
        appleTitle: "Nachbarn von „apple“",
        AppleTitle: "Nachbarn von „Apple“",
        apple: APPLE,
        Apple: APPLE_CAP,
        fmt: (v) => v.toFixed(2).replace(".", ","),
        baseline: "Senkrechter Strich: zwei zufällige Tokens kommen im Mittel auf 0,27.",
        note: "GPT-2, Eingangs-Steckbriefe, Kosinus-Ähnlichkeit (1 = gleiche Richtung)",
      },
      profile,
    ),
};

export const neighboursEn = {
  outPath: "public/bausteine/embeddings/neighbours.svg",
  build: (profile) =>
    buildNeighbours(
      {
        appleTitle: "Neighbors of “apple”",
        AppleTitle: "Neighbors of “Apple”",
        apple: APPLE,
        Apple: APPLE_CAP,
        fmt: (v) => v.toFixed(2),
        baseline: "Vertical line: two random tokens score 0.27 on average.",
        note: "GPT-2, input profiles, cosine similarity (1 = same direction)",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 1b. Toy profiles with two named places, drawn as arrows from the origin
// (Abschnitt "Was einer Nummer fehlt"). Made-up numbers, the same as in the
// text and in the cosine box: apple (0.9; 0.1), peach (0.8; 0.2), laptop
// (0.1; 0.9). Similar profiles point in a similar direction.

const MAP_W = 640;
const MAP_H = 330;
const PLOT = { x: 170, y: 18, size: 230 }; // square plot, value 0..1 on both axes

const TOY = [
  { key: "apple", x: 0.9, y: 0.1, role: "teal", dy: -22 },
  { key: "peach", x: 0.8, y: 0.2, role: "teal", dy: -30 },
  { key: "laptop", x: 0.1, y: 0.9, role: "amber", dy: -10 },
];

function arrow(x1, y1, x2, y2, color) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const len = 13;
  const w = 6;
  const bx = x2 - len * Math.cos(a);
  const by = y2 - len * Math.sin(a);
  const nx = -Math.sin(a) * w;
  const ny = Math.cos(a) * w;
  return [
    { type: "line", props: { x1, y1, x2: bx, y2: by, stroke: color, strokeWidth: 3, strokeLinecap: "round" } },
    { type: "polygon", props: { points: `${x2},${y2} ${bx + nx},${by + ny} ${bx - nx},${by - ny}`, fill: color } },
  ];
}

async function buildProfileMap(l, profile) {
  const muted = tone("neutral", profile).text;
  const axis = tone("neutral", profile).stroke;
  const px = (v) => PLOT.x + v * PLOT.size;
  const py = (v) => PLOT.y + (1 - v) * PLOT.size;
  const arrows = TOY.flatMap((p) => arrow(px(0), py(0), px(p.x), py(p.y), tone(p.role, profile).stroke));
  // Shape of the arrow tips is the same, so the label carries the word; the
  // two fruit arrows are teal, the laptop arrow amber, and their labels say
  // which is which in grayscale too.
  const labels = TOY.map((p) =>
    text(`${l.words[p.key]} (${l.fmt(p.x)} | ${l.fmt(p.y)})`, {
      position: "absolute",
      left: `${px(p.x) + (p.key === "laptop" ? 10 : -20)}px`,
      top: `${py(p.y) + p.dy}px`,
      fontSize: "16px",
      fontWeight: 600,
      color: tone(p.role, profile).text,
    }),
  );
  const tree = {
    type: "div",
    props: {
      style: { width: `${MAP_W}px`, height: `${MAP_H}px`, display: "flex", position: "relative" },
      children: [
        // axes
        { type: "div", props: { style: { position: "absolute", display: "flex", left: `${PLOT.x}px`, top: `${PLOT.y}px`, width: "2px", height: `${PLOT.size}px`, background: axis }, children: "" } },
        { type: "div", props: { style: { position: "absolute", display: "flex", left: `${PLOT.x}px`, top: `${PLOT.y + PLOT.size}px`, width: `${PLOT.size + 40}px`, height: "2px", background: axis }, children: "" } },
        {
          type: "svg",
          props: {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: `0 0 ${MAP_W} ${MAP_H}`,
            width: MAP_W,
            height: MAP_H,
            style: { position: "absolute", left: 0, top: 0 },
            children: arrows,
          },
        },
        text(l.yAxis, { position: "absolute", left: "0px", top: `${PLOT.y}px`, width: `${PLOT.x - 10}px`, fontSize: "16px", color: muted, textAlign: "right", justifyContent: "flex-end" }),
        text(l.xAxis, { position: "absolute", left: `${PLOT.x}px`, top: `${PLOT.y + PLOT.size + 8}px`, fontSize: "16px", color: muted }),
        text(l.origin, { position: "absolute", left: "0px", top: `${PLOT.y + PLOT.size - 10}px`, width: `${PLOT.x - 8}px`, fontSize: "16px", color: muted, justifyContent: "flex-end" }),
        ...labels,
        text(l.same, { position: "absolute", left: `${px(0.42)}px`, top: `${py(0.62)}px`, width: "200px", fontSize: "16px", color: tone("teal", profile).text, fontWeight: 600 }),
        text(l.note, { position: "absolute", left: "0px", top: `${PLOT.y + PLOT.size + 40}px`, width: `${MAP_W}px`, fontSize: "16px", color: muted }),
      ],
    },
  };
  return renderSvg(tree, MAP_W, MAP_H);
}

export const profileMapDe = {
  outPath: "public/bausteine/embeddings/steckbrief-skizze.svg",
  build: (profile) =>
    buildProfileMap(
      {
        words: { apple: "Apfel", peach: "Pfirsich", laptop: "Laptop" },
        fmt: (v) => v.toFixed(1).replace(".", ","),
        xAxis: "Stelle 1: „wächst am Baum“ →",
        yAxis: "↑ Stelle 2: „hat einen Akku“",
        origin: "Nullpunkt",
        same: "Apfel und Pfirsich zeigen fast in dieselbe Richtung, der Laptop nicht.",
        note: "Ausgedachte Steckbriefe mit 2 Stellen. Echte haben 768 Stellen, und keine hat einen Namen.",
      },
      profile,
    ),
};

export const profileMapEn = {
  outPath: "public/bausteine/embeddings/profile-sketch.svg",
  build: (profile) =>
    buildProfileMap(
      {
        words: { apple: "apple", peach: "peach", laptop: "laptop" },
        fmt: (v) => v.toFixed(1),
        xAxis: "place 1: “grows on trees” →",
        yAxis: "↑ place 2: “has a battery”",
        origin: "origin",
        same: "Apple and peach point almost the same way, the laptop does not.",
        note: "Made-up profiles with 2 places. Real ones have 768 places, and none has a name.",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. Token embedding + position embedding = input (Abschnitt "Der Sitzplatz
// im Satz"). Toy numbers, four of 768 values each.

const POS_W = 660;
const POS_H = 350;

const TOKENS = [
  { tok: [0.2, -0.5, 0.1, 0.4], pos: [0.1, 0.0, -0.2, 0.3] },
  { tok: [-0.3, 0.6, 0.2, -0.1], pos: [0.0, 0.2, 0.1, -0.1] },
  { tok: [0.5, 0.1, -0.4, 0.2], pos: [-0.1, 0.1, 0.3, 0.0] },
];

function numbers(values, fmt) {
  return values.map(fmt).join(" · ") + " · …";
}

function posColumn(word, seat, entry, l, profile) {
  const sum = entry.tok.map((v, i) => Math.round((v + entry.pos[i]) * 10) / 10);
  const small = { fontSize: "16px" };
  return {
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "6px", width: "204px" },
      children: [
        text(word, { fontWeight: 700, fontSize: "18px", justifyContent: "center" }),
        card("teal", profile, { padding: "8px 8px", gap: "2px" }, [text(l.tokenLabel, { ...small, color: tone("teal", profile).text, fontWeight: 600 }), text(numbers(entry.tok, l.fmt), small)]),
        text("+", { fontSize: "20px", justifyContent: "center", color: tone("neutral", profile).stroke }),
        card("amber", profile, { padding: "8px 8px", gap: "2px" }, [text(`${l.seatLabel} ${seat}`, { ...small, color: tone("amber", profile).text, fontWeight: 600 }), text(numbers(entry.pos, l.fmt), small)]),
        text("=", { fontSize: "20px", justifyContent: "center", color: tone("neutral", profile).stroke }),
        card("neutral", profile, { padding: "8px 8px", gap: "2px" }, [text(l.inputLabel, { ...small, fontWeight: 600 }), text(numbers(sum, l.fmt), small)]),
      ],
    },
  };
}

async function buildPosition(l, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${POS_W}px`, height: `${POS_H}px`, display: "flex", flexDirection: "column", gap: "14px", padding: "6px 4px" },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", gap: "16px" },
            children: l.words.map((w, i) => posColumn(w, i + 1, TOKENS[i], l, profile)),
          },
        },
        text(l.note, { fontSize: "16px", color: tone("neutral", profile).text }),
      ],
    },
  };
  return renderSvg(tree, POS_W, POS_H);
}

export const positionDe = {
  outPath: "public/bausteine/embeddings/sitzplatz.svg",
  build: (profile) =>
    buildPosition(
      {
        words: ["Hund", "beißt", "Mann"],
        tokenLabel: "Token-Steckbrief",
        seatLabel: "Sitzplatz",
        inputLabel: "Eingang",
        fmt: (v) => v.toFixed(1).replace(".", ",").replace("-", "−"),
        note: "Ausgedachte Zahlen, je 4 von 768. Bei „Mann beißt Hund“ tauschen nur die Sitzplätze.",
      },
      profile,
    ),
};

export const positionEn = {
  outPath: "public/bausteine/embeddings/seat.svg",
  build: (profile) =>
    buildPosition(
      {
        words: ["dog", "bites", "man"],
        tokenLabel: "token profile",
        seatLabel: "seat",
        inputLabel: "input",
        fmt: (v) => v.toFixed(1).replace("-", "−"),
        note: "Made-up numbers, 4 of 768 each. In “man bites dog” only the seats swap.",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. How training pushes two embeddings together (apple and peach) (Abschnitt "Wie aus
// Zufallszahlen Steckbriefe werden"). Invented sentences, as in the text.

function trainingSource(t, profile) {
  return `
${GRID_HEAD}

zufall: "${t.random}" {${block("neutral", profile)}}
apfel: "${t.apple}" {${block("teal", profile)}}
birne: "${t.pear}" {${block("teal", profile)}}
ergebnis: "${t.result}" {${block("amber", profile)}}

zufall -> apfel: ${edge(profile, t.train)}
zufall -> birne: ${edge(profile, t.train)}
apfel -> ergebnis: ${edge(profile, t.adjust)}
birne -> ergebnis: ${edge(profile, t.adjust)}
`;
}

const TRAIN_STEPS = (c) => [
  { nodes: ["zufall"], caption: c[0] },
  { nodes: ["zufall", "apfel"], edges: ["zufall -> apfel"], caption: c[1] },
  { nodes: ["apfel", "ergebnis"], edges: ["apfel -> ergebnis"], caption: c[2] },
  { nodes: ["zufall", "birne"], edges: ["zufall -> birne"], caption: c[3] },
  { nodes: ["birne", "ergebnis"], edges: ["birne -> ergebnis"], caption: c[4] },
  {
    nodes: ["zufall", "apfel", "birne", "ergebnis"],
    edges: ["zufall -> apfel", "zufall -> birne", "apfel -> ergebnis", "birne -> ergebnis"],
    caption: c[5],
  },
];

const TRAIN_DE = {
  random: "Zufallsstart:\\n„Apfel“, „Pfirsich“\\nunähnlich",
  apple: "„Der Apfel ist reif.“\\n„Apfel schälen …“",
  pear: "„Der Pfirsich ist reif.“\\n„Pfirsich schälen …“",
  result: "Viele Sätze später:\\nähnlich",
  train: "Training",
  adjust: "nachstellen",
};

const TRAIN_DE_TEXT = {
  title: "Wie Training zwei Steckbriefe zusammenschiebt",
  intro: "Ein ausgedachtes Beispiel mit einem Modell, das für „Apfel“ und „Pfirsich“ je eine Zeile hat. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Vor dem Training stehen in beiden Zeilen Zufallszahlen. Die Steckbriefe von „Apfel“ und „Pfirsich“ haben nichts gemeinsam.",
    "Ein Trainingssatz enthält „Apfel“. Das Modell soll vorhersagen, wie es weitergeht, zum Beispiel „ist reif“.",
    "Die Zeile „Apfel“ wird ein kleines Stück so verstellt, dass diese Vorhersage beim nächsten Mal etwas besser passt.",
    "Ein anderer Satz enthält „Pfirsich“, und danach folgt dasselbe: „ist reif“, „schälen“.",
    "Weil dieselbe Fortsetzung besser passen soll, wird auch die Zeile „Pfirsich“ ähnlich verstellt wie „Apfel“.",
    "Nach sehr vielen solchen Sätzen sind die beiden Steckbriefe ähnlich geworden. „Laptop“ steht in ganz anderen Sätzen und landet woanders.",
  ],
};

const TRAIN_EN = {
  random: "random start:\\n“apple”, “peach”\\nunrelated",
  apple: "“The apple is ripe.”\\n“The apple tastes …”",
  pear: "“The peach is ripe.”\\n“The peach tastes …”",
  result: "many sentences later:\\nsimilar",
  train: "training",
  adjust: "adjust",
};

const TRAIN_EN_TEXT = {
  title: "How training pushes two profiles together",
  intro: "A made-up example with a model that has one row each for “apple” and “peach”. Use “Next” to go step by step, “Play” runs on its own.",
  captions: [
    "Before training, both rows hold random numbers. The profiles of “apple” and “peach” have nothing in common.",
    "A training sentence contains “apple”. The model has to predict how it continues, for example “is ripe”.",
    "The row “apple” is nudged a little so that this prediction fits slightly better next time.",
    "Another sentence contains “peach”, followed by the same thing: “is ripe”, “tastes”.",
    "Because the same continuation should fit better, the row “peach” is nudged much like “apple”.",
    "After a great many such sentences, the two profiles have become similar. “Laptop” appears in very different sentences and ends up elsewhere.",
  ],
};

export const trainingPushDe = stepperFigure({
  source: trainingSource,
  text: TRAIN_DE,
  copy: TRAIN_DE_TEXT,
  steps: TRAIN_STEPS,
  lang: "de",
  outPath: "public/bausteine/embeddings/training-schiebt.static.svg",
  htmlPath: "public/bausteine/embeddings/training-schiebt.html",
});

export const trainingPushEn = stepperFigure({
  source: trainingSource,
  text: TRAIN_EN,
  copy: TRAIN_EN_TEXT,
  steps: TRAIN_STEPS,
  lang: "en",
  outPath: "public/bausteine/embeddings/training-push.static.svg",
  htmlPath: "public/bausteine/embeddings/training-push.html",
});

// ---------------------------------------------------------------------------
// 4. Made-up mini vocabulary: one extra entry makes the sentence one token
//    shorter but adds a row to the embedding matrix (toy example from the
//    Tokenizer Baustein; four made-up numbers per row; Abschnitt "Wie groß
//    soll das Vokabular sein?")

const TV_W = 600;
const TV_H = 340;

// A visible-space mark (the "␣" open-box shape), drawn as a bordered box
// because the brand fonts have no glyph for U+2423 (same helper as in
// concept-vocabulary-cards.mjs).
function withSpaceMark(label, color, size) {
  if (!label.startsWith("␣")) return label;
  const mark = {
    type: "div",
    props: {
      style: { display: "flex", width: `${Math.round(size * 0.5)}px`, height: `${Math.round(size * 0.3)}px`, marginRight: "3px", marginTop: `${Math.round(size * 0.35)}px`, borderLeft: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` },
      children: [],
    },
  };
  return { type: "div", props: { style: { display: "flex", alignItems: "center" }, children: [mark, { type: "div", props: { style: { display: "flex" }, children: label.slice(1) } }] } };
}

function chip(label, role, profile, highlight) {
  const t = tone(highlight ? "amber" : role, profile);
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        padding: "2px 7px",
        background: satoriBackground(highlight ? "amber" : role, profile),
        border: satoriBorder(highlight ? "amber" : role, profile, { width: highlight ? 2 : 1 }),
        borderRadius: "4px",
        fontFamily: FONT,
        fontSize: "15px",
        color: t.text,
        fontWeight: highlight ? 700 : 400,
      },
      children: withSpaceMark(label, t.text, 15),
    },
  };
}

function miniTable(rows, newRow, profile) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    const isNew = r === newRow;
    const row = [];
    for (let c = 0; c < 4; c++) {
      row.push({
        type: "div",
        props: {
          style: {
            display: "flex",
            width: "13px",
            height: "9px",
            background: isNew ? tone("amber", profile).accent : tone("teal", profile).fillStrong,
            border: `1px solid ${tone(isNew ? "amber" : "teal", profile).stroke}`,
          },
          children: "",
        },
      });
    }
    cells.push({ type: "div", props: { style: { display: "flex", gap: "2px" }, children: row } });
  }
  return { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: "2px" }, children: cells } };
}

function toyCard(v, l, profile) {
  const muted = tone("neutral", profile).text;
  const newIdx = v.entries.findIndex((e) => e === l.newEntry);
  const rows = v.entries.length;
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "282px",
        gap: "7px",
        padding: "12px 14px",
        background: satoriBackground("neutral", profile),
        border: satoriBorder("neutral", profile, { width: 2 }),
        borderRadius: "10px",
      },
      children: [
        text(v.title, { fontWeight: 700, fontSize: "17px" }),
        text(l.vocabTitle, { fontSize: "15px", color: muted }),
        { type: "div", props: { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: v.entries.map((e) => chip(e, "teal", profile, e === l.newEntry)) } },
        text(l.sentenceTitle(v.tokens.length), { fontSize: "15px", color: muted, marginTop: "4px" }),
        { type: "div", props: { style: { display: "flex", flexWrap: "wrap", gap: "4px" }, children: v.tokens.map((e) => chip(e, "teal", profile, e === l.newEntry)) } },
        text(l.tablesTitle(rows), { fontSize: "15px", color: muted, marginTop: "4px" }),
        miniTable(rows, newIdx, profile),
      ],
    },
  };
}

async function buildToyVocabulary(l, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${TV_W}px`, height: `${TV_H}px`, display: "flex", alignItems: "stretch", justifyContent: "center", gap: "20px", padding: "10px 0" },
      children: l.vocabs.map((v) => toyCard(v, l, profile)),
    },
  };
  return renderSvg(tree, TV_W, TV_H);
}

const TOY_BASE = ["Die", "␣Kat", "ze", "␣sitzt", "."];
const OUT = "public/bausteine/embeddings";

export const toyVocabularyDe = {
  outPath: `${OUT}/spielzeug-vokabular.svg`,
  build: (profile) =>
    buildToyVocabulary(
      {
        newEntry: "␣Katze",
        vocabTitle: "Vokabular",
        sentenceTitle: (n) => `„Die Katze sitzt.“ = ${n} Tokens`,
        tablesTitle: (n) => `Embedding-Matrix: ${n} Zeilen`,
        vocabs: [
          { title: "5 Einträge", entries: TOY_BASE, tokens: ["Die", "␣Kat", "ze", "␣sitzt", "."] },
          { title: "6 Einträge", entries: [...TOY_BASE, "␣Katze"], tokens: ["Die", "␣Katze", "␣sitzt", "."] },
        ],
      },
      profile,
    ),
};

export const toyVocabularyEn = {
  outPath: `${OUT}/toy-vocabulary.svg`,
  build: (profile) =>
    buildToyVocabulary(
      {
        newEntry: "␣cats",
        vocabTitle: "Vocabulary",
        sentenceTitle: (n) => `“The cats sit.” = ${n} tokens`,
        tablesTitle: (n) => `Embedding matrix: ${n} rows`,
        vocabs: [
          { title: "5 entries", entries: ["The", "␣cat", "s", "␣sit", "."], tokens: ["The", "␣cat", "s", "␣sit", "."] },
          { title: "6 entries", entries: ["The", "␣cat", "s", "␣sit", ".", "␣cats"], tokens: ["The", "␣cats", "␣sit", "."] },
        ],
      },
      profile,
    ),
};

