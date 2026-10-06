import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";
import { block, edge } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// Baustein "Output Head" (Themenbereich 2, Nr. 5). Real values come from one
// run of Qwen3-0.6B-Base on 2026-10-06 (transformers 5.18.0, CPU, float32):
// after "Die Hauptstadt von Frankreich ist" the five highest scores and their
// softmax shares. The small head with a three-number state and four rows is
// made up so that the dot products give 4.0 / 2.5 / 1.5 / -1.0.

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "16px", color: INK, ...style }, children: content } };
}

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function bar(width, height, role, profile) {
  return { type: "div", props: { style: { display: "flex", width: `${width}px`, height: `${height}px`, background: tone(role, profile).accent, borderRadius: "3px" }, children: "" } };
}

function cell(content, role, profile, { width = 64, height = 34, bold = false } = {}) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${width}px`,
        height: `${height}px`,
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "6px",
        marginRight: "6px",
      },
      children: [text(content, { fontWeight: bold ? 700 : 400 })],
    },
  };
}

function row(children, style = {}) {
  return { type: "div", props: { style: { display: "flex", alignItems: "center", ...style }, children } };
}

// ---------------------------------------------------------------------------
// 1. The top of the real score board (Abschnitt "Heraus kommt eine Tafel")

const PB_W = 620;
const PB_H = 300;
const PB_ROW_Y = [78, 116, 154, 192, 230];
const PB_SHARE_X = 300;
const PB_SHARE_SCALE = 5.2; // px per percent

async function buildParisBoard(l, profile) {
  const muted = tone("neutral", profile).text;
  const children = [
    at({ left: "0px", top: "6px", width: `${PB_W}px`, children: [text(l.title, { fontWeight: 700 })] }),
    at({ left: "0px", top: "42px", width: "60px", children: [text(l.rank, { fontSize: "16px", color: muted })] }),
    at({ left: "60px", top: "42px", width: "120px", children: [text(l.token, { fontSize: "16px", color: muted })] }),
    at({ left: "190px", top: "42px", width: "100px", children: [text(l.score, { fontSize: "16px", color: muted })] }),
    at({ left: `${PB_SHARE_X}px`, top: "42px", width: "300px", children: [text(l.share, { fontSize: "16px", color: muted })] }),
    at({ left: "0px", top: "268px", width: `${PB_W}px`, children: [text(l.rest, { fontSize: "16px", color: muted })] }),
  ];
  l.rows.forEach(([token, score, share, shareText], i) => {
    const y = PB_ROW_Y[i];
    const role = i === 0 ? "teal" : i === 4 ? "amber" : "neutral";
    children.push(at({ left: "0px", top: `${y}px`, width: "60px", children: [text(String(i + 1))] }));
    children.push(at({ left: "60px", top: `${y}px`, width: "120px", children: [text(token, { fontWeight: i === 0 ? 700 : 400 })] }));
    children.push(at({ left: "190px", top: `${y}px`, width: "100px", children: [text(score)] }));
    const w = Math.max(4, Math.round(share * PB_SHARE_SCALE));
    children.push(at({ left: `${PB_SHARE_X}px`, top: `${y + 2}px`, children: [bar(w, 18, role, profile)] }));
    children.push(at({ left: `${PB_SHARE_X + w + 8}px`, top: `${y}px`, children: [text(l.percent(shareText), { fontWeight: 700 })] }));
  });
  const tree = { type: "div", props: { style: { width: `${PB_W}px`, height: `${PB_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, PB_W, PB_H);
}

const PARIS_ROWS = [
  ["Paris", "20,6", 48.8, "48,8"],
  ["____", "19,2", 11.3, "11,3"],
  ["_____", "17,9", 3.1, "3,1"],
  ["______", "17,8", 3.0, "3,0"],
  ["Bern", "17,2", 1.5, "1,5"],
];

export const parisBoardDe = {
  outPath: "public/bausteine/output-head/paris-tafel.svg",
  build: (profile) =>
    buildParisBoard(
      {
        title: "Nach „Die Hauptstadt von Frankreich ist“ (Qwen3-0.6B-Base)",
        rank: "Platz",
        token: "Token",
        score: "Score",
        share: "nach Softmax",
        rest: "… und 151.931 weitere Zeilen, jede mit eigenem Score",
        rows: PARIS_ROWS,
        percent: (s) => `${s} %`,
      },
      profile,
    ),
};

export const parisBoardEn = {
  outPath: "public/bausteine/output-head/paris-board.svg",
  build: (profile) =>
    buildParisBoard(
      {
        title: "After “Die Hauptstadt von Frankreich ist” (Qwen3-0.6B-Base)",
        rank: "Rank",
        token: "Token",
        score: "Score",
        share: "after softmax",
        rest: "… and 151,931 more rows, each with its own score",
        rows: PARIS_ROWS.map(([t, s, p, ps]) => [t, s.replace(",", "."), p, ps.replace(",", ".")]),
        percent: (s) => `${s}%`,
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. A made-up head: the state meets every row (Abschnitt "Woher die Punkte kommen")

const SM_W = 640;
const SM_H = 300;
const STATE = ["1,0", "0,5", "−1,0"];
const HEAD_ROWS = [
  { cells: ["2,0", "1,0", "−1,5"], calc: "2,0 + 0,5 + 1,5", score: "4,0" },
  { cells: ["1,0", "1,0", "−1,0"], calc: "1,0 + 0,5 + 1,0", score: "2,5" },
  { cells: ["0,5", "0", "−1,0"], calc: "0,5 + 0 + 1,0", score: "1,5" },
  { cells: ["−1,0", "0", "0"], calc: "−1,0 + 0 + 0", score: "−1,0" },
];

async function buildStateMeetsRows(l, profile) {
  const muted = tone("neutral", profile).text;
  const dot = (s) => (l.decimal === "." ? s.replace(/,/g, ".") : s);
  const rows = HEAD_ROWS.map((r, i) =>
    row(
      [
        text(l.words[i], { width: "88px", fontWeight: 700 }),
        ...r.cells.map((c) => cell(dot(c), "neutral", profile)),
        text(dot(r.calc), { width: "190px", marginLeft: "10px", fontSize: "16px", color: muted }),
        text("=", { width: "22px" }),
        cell(dot(r.score), i === 0 ? "teal" : "neutral", profile, { width: 66, bold: true }),
      ],
      { marginBottom: "10px" },
    ),
  );
  const tree = {
    type: "div",
    props: {
      style: { width: `${SM_W}px`, height: `${SM_H}px`, display: "flex", flexDirection: "column", paddingTop: "6px" },
      children: [
        row([text(l.state, { width: "88px", fontWeight: 700 }), ...STATE.map((c) => cell(dot(c), "teal", profile, { bold: true })), text(l.stateNote, { marginLeft: "10px", color: muted })], { marginBottom: "12px" }),
        row([text("", { width: "88px" }), text(l.howTo, { color: muted, fontSize: "16px" })], { marginBottom: "12px" }),
        row([text(l.rowsTitle, { width: "88px", fontSize: "16px", color: muted }), text(l.calcTitle, { marginLeft: "216px", fontSize: "16px", color: muted }), text(l.scoreTitle, { marginLeft: "108px", fontSize: "16px", color: muted })], { marginBottom: "8px" }),
        ...rows,
      ],
    },
  };
  return renderSvg(tree, SM_W, SM_H);
}

export const stateMeetsRowsDe = {
  outPath: "public/bausteine/output-head/zustand-trifft-zeilen.svg",
  build: (profile) =>
    buildStateMeetsRows(
      {
        decimal: ",",
        state: "Zustand",
        stateNote: "letzte Position nach „Der Hund jagt die“",
        howTo: "Stelle für Stelle malnehmen, dann zusammenzählen",
        rowsTitle: "Zeilen",
        calcTitle: "Rechnung",
        scoreTitle: "Score",
        words: ["Katze", "Taube", "Ente", "Wolke"],
      },
      profile,
    ),
};

export const stateMeetsRowsEn = {
  outPath: "public/bausteine/output-head/state-meets-rows.svg",
  build: (profile) =>
    buildStateMeetsRows(
      {
        decimal: ".",
        state: "State",
        stateNote: "last position after “The dog chases the”",
        howTo: "multiply position by position, then add up",
        rowsTitle: "Rows",
        calcTitle: "Calculation",
        scoreTitle: "Score",
        words: ["cat", "pigeon", "duck", "cloud"],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. Which positions predict: generating vs. training (Abschnitt "Welche Position zählt")

const PO_W = 640;
const PO_H = 360;
const CHIP_W = 100;
const CHIP_GAP = 20;
const CHIP_X = (i) => 140 + i * (CHIP_W + CHIP_GAP);

function chip(word, role, profile, { dim = false } = {}) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${CHIP_W}px`,
        height: "38px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "8px",
        opacity: dim ? 0.45 : 1,
      },
      children: [text(word, { fontWeight: 700 })],
    },
  };
}

async function buildPositions(l, profile) {
  const muted = tone("neutral", profile).text;
  const arrow = tone("teal", profile).stroke;
  const children = [
    at({ left: "0px", top: "8px", width: "130px", flexDirection: "column", children: [text(l.generating, { fontWeight: 700 }), text(l.generatingNote, { fontSize: "16px", color: muted })] }),
    at({ left: "0px", top: "196px", width: "130px", flexDirection: "column", children: [text(l.training, { fontWeight: 700 }), text(l.trainingNote, { fontSize: "16px", color: muted })] }),
    { type: "div", props: { style: abs({ left: "0px", top: "172px", width: `${PO_W}px`, height: "1px", background: "#DAD6CB" }), children: "" } },
  ];
  l.words.forEach((w, i) => {
    const last = i === l.words.length - 1;
    children.push(at({ left: `${CHIP_X(i)}px`, top: "10px", children: [chip(w, last ? "teal" : "neutral", profile, { dim: !last })] }));
    children.push(at({ left: `${CHIP_X(i)}px`, top: "196px", children: [chip(w, "teal", profile)] }));
    children.push(at({ left: `${CHIP_X(i)}px`, top: "240px", width: `${CHIP_W}px`, justifyContent: "center", children: [text("↓", { fontSize: "24px", color: arrow })] }));
    children.push(at({ left: `${CHIP_X(i)}px`, top: "282px", children: [chip(l.targets[i], "amber", profile)] }));
  });
  const lastX = CHIP_X(l.words.length - 1);
  children.push(at({ left: `${lastX}px`, top: "54px", width: `${CHIP_W}px`, justifyContent: "center", children: [text("↓", { fontSize: "24px", color: arrow })] }));
  children.push(at({ left: `${lastX - 40}px`, top: "96px", width: `${CHIP_W + 80}px`, justifyContent: "center", children: [text(l.head, { fontSize: "16px", color: muted })] }));
  children.push(at({ left: `${lastX}px`, top: "122px", children: [chip("?", "amber", profile)] }));
  children.push(at({ left: "140px", top: "70px", width: "330px", children: [text(l.unused, { fontSize: "16px", color: muted })] }));
  children.push(at({ left: "0px", top: "330px", width: `${PO_W}px`, children: [text(l.trainingFoot, { fontSize: "16px", color: muted })] }));
  const tree = { type: "div", props: { style: { width: `${PO_W}px`, height: `${PO_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, PO_W, PO_H);
}

export const positionsDe = {
  outPath: "public/bausteine/output-head/positionen.svg",
  build: (profile) =>
    buildPositions(
      {
        generating: "Beim Erzeugen",
        generatingNote: "nur die letzte Position",
        training: "Im Training",
        trainingNote: "jede Position",
        words: ["Der", "Hund", "jagt", "die"],
        targets: ["Hund", "jagt", "die", "Katze"],
        head: "Output Head → Tafel",
        unused: "Zustände werden berechnet, gehen aber nicht in den Output Head",
        trainingFoot: "Ziel ist jeweils das echte nächste Token aus dem Trainingstext.",
      },
      profile,
    ),
};

export const positionsEn = {
  outPath: "public/bausteine/output-head/positions.svg",
  build: (profile) =>
    buildPositions(
      {
        generating: "Generating",
        generatingNote: "only the last position",
        training: "Training",
        trainingNote: "every position",
        words: ["The", "dog", "chases", "the"],
        targets: ["dog", "chases", "the", "cat"],
        head: "output head → board",
        unused: "states are computed but do not go into the output head",
        trainingFoot: "Each target is the real next token from the training text.",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 4. One full round through the model (Abschnitt "Eine ganze Runde")

function roundSource(t, profile) {
  const gap = `"" {style.opacity: 0; width: 10; height: 10}`;
  return `
grid-rows: 3
grid-columns: 3
horizontal-gap: 28
vertical-gap: 60

text: "${t.text}" {${block("neutral", profile)}}
tokens: "${t.tokens}" {${block("neutral", profile)}}
steckbriefe: "${t.embeddings}" {${block("teal", profile)}}
neu: "${t.appended}" {${block("neutral", profile)}}
g1: ${gap}
bloecke: "${t.blocks}" {${block("teal", profile)}}
auswahl: "${t.pick}" {${block("amber", profile)}}
kopf: "${t.head}" {${block("teal", profile)}}
zustand: "${t.state}" {${block("teal", profile)}}

text -> tokens: ${edge(profile, "1")}
tokens -> steckbriefe: ${edge(profile, "2")}
steckbriefe -> bloecke: ${edge(profile, "3")}
bloecke -> zustand: ${edge(profile, "4")}
zustand -> kopf: ${edge(profile, "5")}
kopf -> auswahl: ${edge(profile, "6")}
auswahl -> neu: ${edge(profile, "7")}
neu -> text: ${edge(profile, "8")}
`;
}

const ROUND_STEPS = (c) => [
  { nodes: ["text", "tokens"], edges: ["text -> tokens"], caption: c[0] },
  { nodes: ["tokens", "steckbriefe"], edges: ["tokens -> steckbriefe"], caption: c[1] },
  { nodes: ["steckbriefe", "bloecke"], edges: ["steckbriefe -> bloecke"], caption: c[2] },
  { nodes: ["bloecke", "zustand"], edges: ["bloecke -> zustand"], caption: c[3] },
  { nodes: ["zustand", "kopf"], edges: ["zustand -> kopf"], caption: c[4] },
  { nodes: ["kopf", "auswahl"], edges: ["kopf -> auswahl"], caption: c[5] },
  { nodes: ["auswahl", "neu"], edges: ["auswahl -> neu"], caption: c[6] },
  { nodes: ["neu", "text"], edges: ["neu -> text"], caption: c[7] },
];

const ROUND_DE = {
  text: "Text „Die\\nHauptstadt von\\nFrankreich ist“",
  tokens: "7 Tokens\\nmit ihren IDs",
  embeddings: "7 Steckbriefe,\\nje 1.024 Zahlen",
  blocks: "Blöcke mischen\\nKontext ein",
  state: "letzter Zustand\\nan der Stelle „ist“",
  head: "Output Head\\n151.936 Scores",
  pick: "Softmax + Auswahl\\n„Paris“ 48,8 %",
  appended: "Text + „Paris“\\nnächste Runde",
};

const ROUND_DE_TEXT = {
  title: "Eine Runde durchs Modell",
  intro: "Der ganze Weg vom Text bis zum nächsten Token. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Der Tokenizer zerlegt „Die Hauptstadt von Frankreich ist“ in 7 Tokens, jedes mit seiner Nummer im Vokabular.",
    "Jede ID holt ihren Steckbrief aus der großen Tabelle: 7 Listen mit je 1.024 Zahlen.",
    "Die Blöcke mischen Schicht für Schicht Kontext aus den anderen Positionen in jeden Zustand ein.",
    "Nach dem letzten Block zählt beim Erzeugen nur der Zustand der letzten Position, hier von „ist“.",
    "Der Output Head vergleicht diesen Zustand mit 151.936 Zeilen. Heraus kommt die Tafel: „Paris“ 20,6, der Lückenstrich 19,2, „Bern“ 17,2 und so weiter.",
    "Softmax macht aus den Scores Prozente, „Paris“ bekommt 48,8 %. Ein Auswahlschritt nimmt das Wahrscheinlichste oder dreht das Glücksrad.",
    "Das gewählte Token wird an den Text angehängt. Zurückgenommen wird nichts.",
    "Der verlängerte Text ist der Input der nächsten Runde, bis ein Stopp-Token gewählt oder die Längengrenze erreicht ist.",
  ],
};

const ROUND_EN = {
  text: "text\\n“Die Hauptstadt\\nvon Frankreich ist”",
  tokens: "7 tokens\\nwith their IDs",
  embeddings: "7 profiles\\n1,024 numbers each",
  blocks: "blocks mix\\nin context",
  state: "last state\\nat the position “ist”",
  head: "output head\\n151,936 scores",
  pick: "softmax + selection\\n“Paris” 48.8%",
  appended: "text + “Paris”\\nnext round",
};

const ROUND_EN_TEXT = {
  title: "One round through the model",
  intro: "The whole way from text to the next token. Use “Next” to go step by step, “Play” runs on its own.",
  captions: [
    "The tokenizer splits “Die Hauptstadt von Frankreich ist” into 7 tokens, each with its number in the vocabulary.",
    "Each ID fetches its profile from the big table: 7 lists of 1,024 numbers each.",
    "Layer by layer, the blocks mix context from the other positions into every state.",
    "After the last block, only the state of the last position counts when generating, here the one for “ist”.",
    "The output head compares this state with 151,936 rows. Out comes the board: “Paris” 20.6, the blank line 19.2, “Bern” 17.2 and so on.",
    "Softmax turns the scores into percentages; “Paris” gets 48.8%. A selection step takes the most likely one or spins the wheel.",
    "The chosen token is appended to the text. Nothing is taken back.",
    "The longer text is the input for the next round, until a stop token is chosen or the length limit is reached.",
  ],
};

export const oneRoundDe = stepperFigure({
  source: roundSource,
  text: ROUND_DE,
  copy: ROUND_DE_TEXT,
  steps: ROUND_STEPS,
  lang: "de",
  outPath: "public/bausteine/output-head/eine-runde.static.svg",
  htmlPath: "public/bausteine/output-head/eine-runde.html",
});

export const oneRoundEn = stepperFigure({
  source: roundSource,
  text: ROUND_EN,
  copy: ROUND_EN_TEXT,
  steps: ROUND_STEPS,
  lang: "en",
  outPath: "public/bausteine/output-head/one-round.static.svg",
  htmlPath: "public/bausteine/output-head/one-round.html",
});
