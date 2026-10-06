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
// 1b. Toy profiles with two named places, drawn as points (Abschnitt "Was
// einer Nummer fehlt"). Made-up numbers, the same as in the text and in the
// cosine box: apple (0.9; 0.1), pear (0.8; 0.2), laptop (0.1; 0.9).

const MAP_W = 640;
const MAP_H = 330;
const PLOT = { x: 170, y: 18, size: 230 }; // square plot, value 0..1 on both axes

const TOY = [
  { key: "apple", x: 0.9, y: 0.1, role: "teal" },
  { key: "pear", x: 0.8, y: 0.2, role: "teal" },
  { key: "laptop", x: 0.1, y: 0.9, role: "amber" },
];

function marker(role, profile) {
  const t = tone(role, profile);
  // Shape differs by role (circle vs. square) so it reads in grayscale too.
  return {
    type: "div",
    props: {
      style: { display: "flex", width: "16px", height: "16px", background: t.accent, border: `2px solid ${t.stroke}`, borderRadius: role === "teal" ? "8px" : "2px" },
      children: "",
    },
  };
}

async function buildProfileMap(l, profile) {
  const muted = tone("neutral", profile).text;
  const axis = tone("neutral", profile).stroke;
  const px = (v) => PLOT.x + v * PLOT.size;
  const py = (v) => PLOT.y + (1 - v) * PLOT.size;
  const points = TOY.map((p) => ({
    type: "div",
    props: {
      style: { position: "absolute", display: "flex", alignItems: "center", gap: "6px", left: `${px(p.x) - 8}px`, top: `${py(p.y) - 8}px` },
      children: [marker(p.role, profile), text(`${l.words[p.key]} (${l.fmt(p.x)} | ${l.fmt(p.y)})`, { fontSize: "16px", fontWeight: 600 })],
    },
  }));
  const tree = {
    type: "div",
    props: {
      style: { width: `${MAP_W}px`, height: `${MAP_H}px`, display: "flex", position: "relative" },
      children: [
        // axes
        { type: "div", props: { style: { position: "absolute", display: "flex", left: `${PLOT.x}px`, top: `${PLOT.y}px`, width: "2px", height: `${PLOT.size}px`, background: axis }, children: "" } },
        { type: "div", props: { style: { position: "absolute", display: "flex", left: `${PLOT.x}px`, top: `${PLOT.y + PLOT.size}px`, width: `${PLOT.size + 40}px`, height: "2px", background: axis }, children: "" } },
        text(l.yAxis, { position: "absolute", left: "0px", top: `${PLOT.y}px`, width: `${PLOT.x - 10}px`, fontSize: "16px", color: muted, textAlign: "right", justifyContent: "flex-end" }),
        text(l.xAxis, { position: "absolute", left: `${PLOT.x}px`, top: `${PLOT.y + PLOT.size + 8}px`, fontSize: "16px", color: muted }),
        ...points,
        // a hint left of the pair: apple and pear lie close together
        text(l.close, { position: "absolute", left: `${px(0.12)}px`, top: `${py(0.15) - 11}px`, fontSize: "16px", color: tone("teal", profile).text, fontWeight: 600 }),
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
        words: { apple: "Apfel", pear: "Birne", laptop: "Laptop" },
        fmt: (v) => v.toFixed(1).replace(".", ","),
        xAxis: "Stelle 1: „wächst am Baum“ →",
        yAxis: "↑ Stelle 2: „hat einen Akku“",
        close: "nah beieinander →",
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
        words: { apple: "apple", pear: "pear", laptop: "laptop" },
        fmt: (v) => v.toFixed(1),
        xAxis: "place 1: “grows on trees” →",
        yAxis: "↑ place 2: “has a battery”",
        close: "close together →",
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
// 3. How training pushes two embeddings together (Abschnitt "Wie aus
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
  random: "Zufallsstart:\\n„Apfel“, „Birne“\\nunähnlich",
  apple: "„Der Apfel ist reif.“\\n„Apfel schälen …“",
  pear: "„Die Birne ist reif.“\\n„Birne schälen …“",
  result: "Viele Sätze später:\\nähnlich",
  train: "Training",
  adjust: "nachstellen",
};

const TRAIN_DE_TEXT = {
  title: "Wie Training zwei Steckbriefe zusammenschiebt",
  intro: "Ein ausgedachtes Beispiel mit einem Modell, das für „Apfel“ und „Birne“ je eine Zeile hat. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Vor dem Training stehen in beiden Zeilen Zufallszahlen. Die Steckbriefe von „Apfel“ und „Birne“ haben nichts gemeinsam.",
    "Ein Trainingssatz enthält „Apfel“. Das Modell soll vorhersagen, wie es weitergeht, zum Beispiel „ist reif“.",
    "Die Zeile „Apfel“ wird ein kleines Stück so verstellt, dass diese Vorhersage beim nächsten Mal etwas besser passt.",
    "Ein anderer Satz enthält „Birne“, und danach folgt dasselbe: „ist reif“, „schälen“.",
    "Weil dieselbe Fortsetzung besser passen soll, wird auch die Zeile „Birne“ ähnlich verstellt wie „Apfel“.",
    "Nach sehr vielen solchen Sätzen sind die beiden Steckbriefe ähnlich geworden. „Laptop“ steht in ganz anderen Sätzen und landet woanders.",
  ],
};

const TRAIN_EN = {
  random: "random start:\\n“apple”, “pear”\\nunrelated",
  apple: "“The apple is ripe.”\\n“Peel the apple …”",
  pear: "“The pear is ripe.”\\n“Peel the pear …”",
  result: "many sentences later:\\nsimilar",
  train: "training",
  adjust: "adjust",
};

const TRAIN_EN_TEXT = {
  title: "How training pushes two profiles together",
  intro: "A made-up example with a model that has one row each for “apple” and “pear”. Use “Next” to go step by step, “Play” runs on its own.",
  captions: [
    "Before training, both rows hold random numbers. The profiles of “apple” and “pear” have nothing in common.",
    "A training sentence contains “apple”. The model has to predict how it continues, for example “is ripe”.",
    "The row “apple” is nudged a little so that this prediction fits slightly better next time.",
    "Another sentence contains “pear”, followed by the same thing: “is ripe”, “peel”.",
    "Because the same continuation should fit better, the row “pear” is nudged much like “apple”.",
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
