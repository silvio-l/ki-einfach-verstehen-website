import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Aus Text werden viele Übungsaufgaben" (Themenbereich 3, Nr. 1).
// 1. Two made-up texts joined with an end token and cut into sequences of 8
//    tokens (the small window is chosen for the overview; GPT-3 used 2048).
// 2. The filter stages from web archive to training text; only the amounts at
//    the start and the end are measured (GPT-3 paper), the widths are schematic.
// 3. The data mix as reported by Meta (Llama 3 herd paper) and the German share
//    of Kolibri (Aleph Alpha technical report).

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "16px", color: INK, ...style }, children: content } };
}

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function box(content, role, profile, { width, height = 40, bold = false, fillKey = "fill", dashed = false } = {}) {
  const t = tone(role, profile);
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${width}px`,
        height: `${height}px`,
        background: satoriBackground(role, profile, { fillKey }),
        border: dashed ? `2px dashed ${t.stroke}` : satoriBorder(role, profile, { width: 2 }),
        borderRadius: "6px",
      },
      children: [text(content, { fontWeight: bold ? 700 : 400, color: t.text })],
    },
  };
}

function swatch(role, profile, { solid = true } = {}) {
  const t = tone(role, profile);
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "16px",
        height: "16px",
        marginRight: "8px",
        borderRadius: "3px",
        background: solid ? t.accent : satoriBackground(role, profile),
        border: `2px solid ${t.stroke}`,
      },
      children: "",
    },
  };
}

// ---------------------------------------------------------------------------
// 1. The goods train cut into sequences (Abschnitt "Viele Texte, eine feste Länge")

const GT_W = 640;
const GT_H = 300;
const WAGON_W = 72;
const WAGON_GAP = 6;
const WINDOW = 8;

async function buildGueterzug(l, profile) {
  const muted = tone("neutral", profile).text;
  // Each token: [label, role]. Text 1 teal, text 2 purple, end token amber.
  const tokens = [
    ...l.text1.map((t) => [t, "teal"]),
    [l.end, "amber"],
    ...l.text2.map((t) => [t, "purple"]),
    [l.end, "amber"],
  ];
  const seq1 = tokens.slice(0, WINDOW);
  const seq2 = tokens.slice(WINDOW);
  const wagons = (list, top) =>
    list.map(([label, role], i) =>
      at({ left: `${i * (WAGON_W + WAGON_GAP)}px`, top: `${top}px`, children: [box(label, role, profile, { width: WAGON_W, bold: role === "amber" })] }),
    );
  const nextLeft = seq2.length * (WAGON_W + WAGON_GAP);
  const children = [
    at({ left: "0px", top: "0px", width: `${GT_W}px`, children: [text(l.seq1, { fontWeight: 700 })] }),
    ...wagons(seq1, 28),
    at({ left: "0px", top: "92px", width: `${GT_W}px`, children: [text(l.seq2, { fontWeight: 700 })] }),
    ...wagons(seq2, 120),
    at({ left: `${nextLeft}px`, top: "120px", children: [box(l.next, "neutral", profile, { width: 3 * WAGON_W, dashed: true })] }),
    at({ left: "0px", top: "184px", width: `${GT_W}px`, children: [text(l.task, { fontWeight: 700 })] }),
    at({
      left: "0px",
      top: "212px",
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center" },
            children: [
              text(l.question, { color: muted, marginRight: "8px" }),
              ...seq1.slice(0, 6).map(([label, role]) => ({ type: "div", props: { style: { display: "flex", marginRight: "4px" }, children: [box(label, role, profile, { width: 68, height: 32, bold: role === "amber" })] } })),
              text("→", { margin: "0 8px", fontWeight: 700 }),
              box(seq1[6][0], seq1[6][1], profile, { width: 68, height: 32, bold: true }),
            ],
          },
        },
      ],
    }),
    at({ left: "0px", top: "262px", width: `${GT_W}px`, children: [text(l.note, { color: muted })] }),
  ];
  const tree = { type: "div", props: { style: { width: `${GT_W}px`, height: `${GT_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, GT_W, GT_H);
}

export const gueterzugFolgenDe = {
  outPath: "public/bausteine/aus-text-werden-uebungsaufgaben/gueterzug-folgen.svg",
  build: (profile) =>
    buildGueterzug(
      {
        text1: ["Heute", "bleibt", "es", "trocken", "."],
        text2: ["Der", "Kuchen", "ist", "im", "Ofen", "."],
        end: "Ende",
        seq1: "Folge 1: 8 Tokens, also 7 Aufgaben",
        seq2: "Folge 2 beginnt mitten im zweiten Text",
        next: "nächster Text …",
        task: "Die Aufgabe direkt nach dem Ende-Token:",
        question: "Frage",
        note: "„Ende“ steht für das Ende-Token. Fensterlänge 8 nur zur Übersicht.",
      },
      profile,
    ),
};

export const gueterzugFolgenEn = {
  outPath: "public/bausteine/aus-text-werden-uebungsaufgaben/goods-train-sequences.svg",
  build: (profile) =>
    buildGueterzug(
      {
        text1: ["It", "stays", "dry", "today", "."],
        text2: ["The", "cake", "is", "baking", "now", "."],
        end: "End",
        seq1: "Sequence 1: 8 tokens, so 7 problems",
        seq2: "Sequence 2 starts in the middle of the second text",
        next: "next text …",
        task: "The problem right after the end token:",
        question: "Question",
        note: "“End” stands for the end token. Window length 8 only for the overview.",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. The filter stages (Abschnitt "Vom Web zum Trainingstext")

const SS_W = 640;
const SS_H = 420;
const STAGE_H = 40;
const STAGE_GAP = 10;
const STAGE_TOP = 52;
// Schematic widths: the funnel only says "less and less", not how much less.
const STAGE_WIDTHS = [600, 560, 520, 440, 380, 380];

async function buildSiebStufen(l, profile) {
  const muted = tone("neutral", profile).text;
  const children = [
    at({ left: "0px", top: "8px", width: `${SS_W}px`, justifyContent: "center", children: [text(l.top, { fontWeight: 700 })] }),
  ];
  l.stages.forEach((label, i) => {
    const w = STAGE_WIDTHS[i];
    const role = i === 3 || i === 4 ? "amber" : "teal";
    children.push(
      at({
        left: `${(SS_W - w) / 2}px`,
        top: `${STAGE_TOP + i * (STAGE_H + STAGE_GAP)}px`,
        children: [box(`${i + 1}  ${label}`, role, profile, { width: w, height: STAGE_H })],
      }),
    );
  });
  const bottomTop = STAGE_TOP + l.stages.length * (STAGE_H + STAGE_GAP) + 6;
  children.push(at({ left: "0px", top: `${bottomTop}px`, width: `${SS_W}px`, justifyContent: "center", children: [text(l.bottom, { fontWeight: 700 })] }));
  children.push(at({ left: "0px", top: `${bottomTop + 34}px`, width: `${SS_W}px`, justifyContent: "center", children: [text(l.note, { color: muted })] }));
  const tree = { type: "div", props: { style: { width: `${SS_W}px`, height: `${SS_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, SS_W, SS_H);
}

export const siebStufenDe = {
  outPath: "public/bausteine/aus-text-werden-uebungsaufgaben/sieb-stufen.svg",
  build: (profile) =>
    buildSiebStufen(
      {
        top: "GPT-3: 45 Terabyte gepackter Rohtext aus 41 Monaten Common Crawl",
        stages: ["Webseiten sammeln", "Text aus dem Quelltext holen", "Sprache erkennen", "Qualitätsregeln anwenden", "Doppeltes entfernen", "Quellen mischen"],
        bottom: "GPT-3: 570 Gigabyte gesiebter Text",
        note: "Breiten schematisch, gemessen sind nur Anfang und Ende.",
      },
      profile,
    ),
};

export const siebStufenEn = {
  outPath: "public/bausteine/aus-text-werden-uebungsaufgaben/filter-stages.svg",
  build: (profile) =>
    buildSiebStufen(
      {
        top: "GPT-3: 45 terabytes of compressed raw text from 41 months of Common Crawl",
        stages: ["Collect web pages", "Extract the text from the page source", "Identify the language", "Apply quality rules", "Remove duplicates", "Mix the sources"],
        bottom: "GPT-3: 570 gigabytes of filtered text",
        note: "Widths are schematic; only the start and the end are measured.",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. The data mix (Abschnitt "Das Modell lernt, was im Text steht")

const DM_W = 640;
const DM_H = 270;
const BAR_W = 620;
const BAR_H = 36;

function segment(widthPct, role, profile, { solid = true } = {}) {
  const t = tone(role, profile);
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: `${Math.round((BAR_W * widthPct) / 100)}px`,
        height: `${BAR_H}px`,
        background: solid ? t.accent : satoriBackground(role, profile),
        borderRight: "2px solid #FFFFFF",
      },
      children: "",
    },
  };
}

function legendItem(label, role, profile, opts) {
  return { type: "div", props: { style: { display: "flex", alignItems: "center", marginRight: "22px" }, children: [swatch(role, profile, opts), text(label)] } };
}

async function buildDatenmischung(l, profile) {
  const bar = (segs, top) =>
    at({ left: "0px", top: `${top}px`, children: [{ type: "div", props: { style: { display: "flex", border: `2px solid ${tone("neutral", profile).stroke}`, borderRadius: "4px" }, children: segs } }] });
  const children = [
    at({ left: "0px", top: "0px", width: `${DM_W}px`, children: [text(l.llama, { fontWeight: 700 })] }),
    bar(
      [segment(50, "teal", profile), segment(25, "purple", profile), segment(17, "neutral", profile), segment(8, "amber", profile)],
      28,
    ),
    at({ left: "0px", top: "76px", width: `${DM_W}px`, children: [legendItem(l.general, "teal", profile), legendItem(l.math, "purple", profile)] }),
    at({ left: "0px", top: "104px", width: `${DM_W}px`, children: [legendItem(l.code, "neutral", profile), legendItem(l.languages, "amber", profile)] }),
    at({ left: "0px", top: "152px", width: `${DM_W}px`, children: [text(l.kolibri, { fontWeight: 700 })] }),
    bar([segment(20, "amber", profile), segment(80, "neutral", profile, { solid: false })], 180),
    at({ left: "0px", top: "228px", width: `${DM_W}px`, children: [legendItem(l.german, "amber", profile), legendItem(l.rest, "neutral", profile, { solid: false })] }),
  ];
  const tree = { type: "div", props: { style: { width: `${DM_W}px`, height: `${DM_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, DM_W, DM_H);
}

export const datenmischungDe = {
  outPath: "public/bausteine/aus-text-werden-uebungsaufgaben/datenmischung.svg",
  build: (profile) =>
    buildDatenmischung(
      {
        llama: "Llama 3.1, nach Art des Textes (laut Meta)",
        general: "Allgemeinwissen 50 %",
        math: "Mathematik und Schlussfolgern 25 %",
        code: "Code 17 %",
        languages: "andere Sprachen als Englisch 8 %",
        kolibri: "Kolibri, nur der Anteil Deutsch (laut Aleph Alpha)",
        german: "Deutsch: über 20 %",
        rest: "übriger Text, im Bericht anders aufgeteilt",
      },
      profile,
    ),
};

export const datenmischungEn = {
  outPath: "public/bausteine/aus-text-werden-uebungsaufgaben/data-mix.svg",
  build: (profile) =>
    buildDatenmischung(
      {
        llama: "Llama 3.1, by kind of text (according to Meta)",
        general: "general knowledge 50%",
        math: "mathematics and reasoning 25%",
        code: "code 17%",
        languages: "languages other than English 8%",
        kolibri: "Kolibri, only the German share (according to Aleph Alpha)",
        german: "German: more than 20%",
        rest: "other text, divided differently in the report",
      },
      profile,
    ),
};
