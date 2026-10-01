import { block, edge, GRID_HEAD } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// How token IDs become a sentence matrix: each ID is a row number in the
// model's table, the row is read out, and the rows are stacked in order.
function source(text, profile) {
  return `
${GRID_HEAD}

ids: "${text.ids}" {${block("neutral", profile)}}
tabelle: "${text.table}" {${block("teal", profile)}}
satz: "${text.sentence}" {${block("amber", profile)}}
zeile: "${text.row}" {${block("teal", profile)}}

ids -> tabelle: ${edge(profile, text.toTable)}
tabelle -> zeile: ${edge(profile, text.read)}
zeile -> satz: ${edge(profile, text.stack)}
`;
}

const STEPS = (c) => [
  { nodes: ["ids"], caption: c[0] },
  { nodes: ["ids", "tabelle"], edges: ["ids -> tabelle"], caption: c[1] },
  { nodes: ["tabelle", "zeile"], edges: ["tabelle -> zeile"], caption: c[2] },
  { nodes: ["zeile", "satz"], edges: ["zeile -> satz"], caption: c[3] },
  { nodes: ["ids", "tabelle", "zeile", "satz"], edges: ["ids -> tabelle", "tabelle -> zeile", "zeile -> satz"], caption: c[4] },
];

const DE = {
  ids: "Token-IDs\\n417 · 82 · 903 · 771 · 13",
  table: "Tabelle im Modell\\n50.257 × 768",
  row: "Zeile 417\\n768 gelernte Zahlen",
  sentence: "Satz-Matrix 5 × 768\\nZeilen 417 · 82 · 903 · 771 · 13",
  toTable: "Zeilennummer",
  read: "Zeile lesen",
  stack: "einreihen",
};

const DE_TEXT = {
  title: "Wie aus Token-IDs ein Zahlenblock wird",
  intro: "So holt sich ein Modell für jedes Token seine Zahlen. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Im Spielzeugbeispiel aus dem vorigen Baustein wird „Die Katze sitzt.“ zu fünf Token-IDs: 417, 82, 903, 771 und 13.",
    "Das Modell hat eine große Tabelle mit einer Zeile pro Vokabular-Eintrag. Die erste ID, 417, ist einfach eine Zeilennummer darin.",
    "Das Modell liest Zeile 417: einen Vektor mit 768 Zahlen, die beim Training gelernt wurden. Berechnet wird dabei nichts.",
    "Die Zeile wird als erste Zeile in die Matrix für den Satz geschrieben.",
    "Dasselbe passiert für 82, 903, 771 und 13, in dieser Reihenfolge. Am Ende steht eine Matrix der Form 5 × 768: eine Zeile pro Token.",
  ],
};

const EN = {
  ids: "token IDs\\n417 · 82 · 903 · 771 · 13",
  table: "table in the model\\n50,257 × 768",
  row: "row 417\\n768 learned numbers",
  sentence: "sentence matrix 5 × 768\\nrows 417 · 82 · 903 · 771 · 13",
  toTable: "row number",
  read: "read row",
  stack: "stack",
};

const EN_TEXT = {
  title: "How token IDs become a block of numbers",
  intro: "This is how a model fetches the numbers for each token. Use “Next” to go step by step, “Play” runs on its own.",
  captions: [
    "In the toy example from the previous lesson, “The cats sit.” becomes five token IDs: 417, 82, 903, 771 and 13.",
    "The model has a large table with one row per vocabulary entry. The first ID, 417, is simply a row number in it.",
    "The model reads row 417: a vector of 768 numbers that were learned during training. Nothing is computed here.",
    "The row is written as the first row of the matrix for the sentence.",
    "The same happens for 82, 903, 771 and 13, in that order. The result is a matrix of shape 5 × 768: one row per token.",
  ],
};

export const rowLookupDe = stepperFigure({
  source,
  text: DE,
  copy: DE_TEXT,
  steps: STEPS,
  lang: "de",
  outPath: "public/bausteine/skalar-vektor-matrix-tensor/zeilen-nachschlagen.static.svg",
  htmlPath: "public/bausteine/skalar-vektor-matrix-tensor/zeilen-nachschlagen.html",
});

export const rowLookupEn = stepperFigure({
  source,
  text: EN,
  copy: EN_TEXT,
  steps: STEPS,
  lang: "en",
  outPath: "public/bausteine/skalar-vektor-matrix-tensor/row-lookup.static.svg",
  htmlPath: "public/bausteine/skalar-vektor-matrix-tensor/row-lookup.html",
});
