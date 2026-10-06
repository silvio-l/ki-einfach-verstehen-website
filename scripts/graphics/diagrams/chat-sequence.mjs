import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";
import { block, edge, GRID_HEAD } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// Baustein "Tokenisierung im Modell" (Weg durchs Modell, Nr. 2). All token
// counts were measured on 2026-10-06 with the models' official chat
// templates and tokenizers (see the Baustein's Lernplan, "Beispiele").

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";
const OUT = "public/bausteine/tokenisierung-im-modell";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "16px", color: INK, ...style }, children: content } };
}

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function bar(width, role, profile, height = 24) {
  return { type: "div", props: { style: { display: "flex", width: `${width}px`, height: `${height}px`, background: tone(role, profile).accent, borderRadius: "3px" }, children: "" } };
}

// ---------------------------------------------------------------------------
// 1. A chat becomes one token sequence (step-through animation,
//    Abschnitt "Dein Chat ist ein einziger langer Text")

function chatSource(t, profile) {
  return `
${GRID_HEAD}

chat: "${t.chat}" {${block("neutral", profile)}}
vorlage: "${t.template}" {${block("teal", profile)}}
modell: "${t.model}" {${block("amber", profile)}}
folge: "${t.sequence}" {${block("teal", profile)}}

chat -> vorlage: ${edge(profile, t.toTemplate)}
vorlage -> folge: ${edge(profile, t.toSequence)}
folge -> modell: ${edge(profile, t.toModel)}
`;
}

const CHAT_STEPS = (c) => [
  { nodes: ["chat"], caption: c[0] },
  { nodes: ["chat", "vorlage"], edges: ["chat -> vorlage"], caption: c[1] },
  { nodes: ["vorlage"], caption: c[2] },
  { nodes: ["vorlage", "folge"], edges: ["vorlage -> folge"], caption: c[3] },
  { nodes: ["folge", "modell"], edges: ["folge -> modell"], caption: c[4] },
];

const CHAT_DE = {
  chat: "Chatverlauf\\nSystem: „Antworte kurz.“\\nDu: „Wie heißt die\\nHauptstadt …?“",
  template: "Chat-Vorlage\\nsetzt Rollenmarken,\\nfügt Datum ein",
  sequence: "eine Tokenfolge\\n50 Tokens, davon\\n9 Spezial-Tokens",
  model: "Modell\\nschreibt hinter\\n„assistant“ weiter",
  toTemplate: "mit Rollen",
  toSequence: "zusammensetzen",
  toModel: "Input",
};

const CHAT_DE_TEXT = {
  title: "Wie aus einem Chat eine Tokenfolge wird",
  intro: "So wird aus zwei Nachrichten mit Rollen die Folge, die bei Llama 3.1 ins Modell geht. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Im Chatfenster stehen zwei getrennte Nachrichten: eine Systemanweisung und deine Frage. Jede hat eine Rolle.",
    "Das Programm übergibt beide Nachrichten samt Rollen an die Chat-Vorlage des Modells.",
    "Die Vorlage setzt jede Rolle zwischen zwei Spezial-Tokens, schließt jede Nachricht mit einem Ende-Token ab und fügt bei Llama 3.1 zwei Datumszeilen ein, die du nie geschrieben hast.",
    "Heraus kommt eine einzige Tokenfolge: 50 Tokens, nur 15 davon aus dem Chat, dazu 9 Spezial-Tokens. Sie endet mit der Marke für die Rolle „assistant“, hinter der noch nichts steht.",
    "Diese Folge ist der Input. Das Modell setzt sie fort, also mit der Antwort des Assistenten, Token für Token, bis es ein Ende-Token erzeugt.",
  ],
};

export const chatSequenceDe = stepperFigure({
  source: chatSource,
  text: CHAT_DE,
  copy: CHAT_DE_TEXT,
  steps: CHAT_STEPS,
  lang: "de",
  outPath: `${OUT}/chat-wird-folge.static.svg`,
  htmlPath: `${OUT}/chat-wird-folge.html`,
});

const CHAT_EN = {
  chat: "Chat history\\nSystem: “Answer briefly.”\\nYou: “What is the\\ncapital of France?”",
  template: "Chat template\\nadds role markers,\\ninserts dates",
  sequence: "one token sequence\\n45 tokens, of them\\n9 special tokens",
  model: "Model\\ncontinues after\\n“assistant”",
  toTemplate: "with roles",
  toSequence: "assemble",
  toModel: "input",
};

const CHAT_EN_TEXT = {
  title: "How a chat becomes a token sequence",
  intro: "This is how two messages with roles become the sequence that goes into Llama 3.1. Use “Next” to go step by step, or “Play” to run it on its own.",
  captions: [
    "The chat window shows two separate messages: a system instruction and your question. Each has a role.",
    "The program hands both messages, with their roles, to the model’s chat template.",
    "The template puts each role between two special tokens, closes each message with an end token, and for Llama 3.1 inserts two date lines you never wrote.",
    "Out comes a single token sequence: 45 tokens, only 10 of them from the chat, plus 9 special tokens. It ends with the marker for the role “assistant”, with nothing after it yet.",
    "This sequence is the input. The model continues it with the assistant’s answer, token by token, until it produces an end token.",
  ],
};

export const chatSequenceEn = stepperFigure({
  source: chatSource,
  text: CHAT_EN,
  copy: CHAT_EN_TEXT,
  steps: CHAT_STEPS,
  lang: "en",
  outPath: `${OUT}/chat-becomes-sequence.static.svg`,
  htmlPath: `${OUT}/chat-becomes-sequence.html`,
});

// ---------------------------------------------------------------------------
// 2. The same chat in four chat templates
//    (Abschnitt "Text, den du nie geschrieben hast")

const FT_W = 600;
const FT_H = 305;
const FT_LABEL_W = 150;
const FT_BAR_X = 162;
const FT_BAR_MAX = 330;

// Stacked bars: the part that comes from the chat (teal) vs. the part the
// template adds (amber). The two accents differ in lightness in grayscale.
function legendItem(label, role, profile) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", gap: "8px" },
      children: [bar(18, role, profile, 18), text(label, { fontSize: "15px" })],
    },
  };
}

async function buildFourTemplates(l, profile) {
  const max = Math.max(...l.rows.map((r) => r[1] + r[2]));
  const muted = tone("neutral", profile).text;
  const children = [
    at({ left: `${FT_BAR_X}px`, top: "4px", gap: "22px", children: [legendItem(l.fromChat, "teal", profile), legendItem(l.fromTemplate, "amber", profile)] }),
  ];
  l.rows.forEach(([name, chat, added, note], i) => {
    const y = 46 + i * 68;
    const wc = Math.round((chat / max) * FT_BAR_MAX);
    const wa = Math.round((added / max) * FT_BAR_MAX);
    children.push(at({ left: "0px", top: `${y}px`, width: `${FT_LABEL_W}px`, justifyContent: "flex-end", children: [text(name, { fontWeight: 700, fontSize: "16px" })] }));
    children.push(at({ left: `${FT_BAR_X}px`, top: `${y}px`, children: [bar(wc, "teal", profile), bar(wa, "amber", profile)] }));
    children.push(at({ left: `${FT_BAR_X + wc + wa + 8}px`, top: `${y}px`, children: [text(l.tokens(chat, added), { fontWeight: 700 })] }));
    children.push(at({ left: `${FT_BAR_X}px`, top: `${y + 28}px`, width: `${FT_W - FT_BAR_X}px`, children: [text(note, { fontSize: "15px", color: muted })] }));
  });
  const tree = { type: "div", props: { style: { width: `${FT_W}px`, height: `${FT_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, FT_W, FT_H);
}

export const fourTemplatesDe = {
  outPath: `${OUT}/vier-vorlagen.svg`,
  build: (profile) =>
    buildFourTemplates(
      {
        fromChat: "aus dem Chat",
        fromTemplate: "von der Vorlage",
        tokens: (c, a) => `${c} + ${a} = ${c + a}`,
        rows: [
          ["Gemma 3 1B", 12, 10, "keine Systemrolle: Anweisung klebt an deiner Frage"],
          ["Qwen3-8B", 14, 13, "schlichte Rollenmarken, kein Zusatztext"],
          ["Llama 3.1 8B", 15, 35, "fügt zwei Datumszeilen ein"],
          ["gpt-oss-20b", 12, 74, "setzt eine eigene Systemnachricht davor"],
        ],
      },
      profile,
    ),
};

export const fourTemplatesEn = {
  outPath: `${OUT}/four-templates.svg`,
  build: (profile) =>
    buildFourTemplates(
      {
        fromChat: "from the chat",
        fromTemplate: "added by the template",
        tokens: (c, a) => `${c} + ${a} = ${c + a}`,
        rows: [
          ["Gemma 3 1B", 10, 10, "no system role: instruction glued to your question"],
          ["Qwen3-8B", 10, 13, "plain role markers, no extra text"],
          ["Llama 3.1 8B", 10, 35, "inserts two date lines"],
          ["gpt-oss-20b", 10, 74, "puts its own system message in front"],
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. Vocabulary size: shorter sequences vs. bigger tables
//    (Abschnitt "Wie groß soll das Vokabular sein?")

const VT_W = 600;
const VT_H = 320;
const VT_BAR_MAX = 150;

function vocabCard(m, l, profile, maxTable) {
  const t = tone(m.role, profile);
  const muted = tone("neutral", profile).text;
  const w = Math.max(4, Math.round((m.table / maxTable) * VT_BAR_MAX));
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "282px",
        gap: "8px",
        padding: "14px 16px",
        background: satoriBackground(m.role, profile),
        border: satoriBorder(m.role, profile, { width: 2 }),
        borderRadius: "10px",
      },
      children: [
        text(m.name, { fontWeight: 700, fontSize: "18px", color: t.text }),
        text(m.vocab, { fontSize: "16px" }),
        text(l.tokensTitle, { fontSize: "15px", color: muted, marginTop: "6px" }),
        text(m.en, { fontSize: "16px" }),
        text(m.de, { fontSize: "16px" }),
        text(l.tableTitle, { fontSize: "15px", color: muted, marginTop: "6px" }),
        { type: "div", props: { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [bar(w, m.role, profile, 20), text(m.tableLabel, { fontWeight: 700 })] } },
        text(m.split, { fontSize: "15px", color: muted }),
      ],
    },
  };
}

async function buildVocabTradeoff(l, profile) {
  const maxTable = Math.max(...l.models.map((m) => m.table));
  const tree = {
    type: "div",
    props: {
      style: { width: `${VT_W}px`, height: `${VT_H}px`, display: "flex", alignItems: "stretch", justifyContent: "center", gap: "20px", padding: "14px 0" },
      children: l.models.map((m) => vocabCard(m, l, profile, maxTable)),
    },
  };
  return renderSvg(tree, VT_W, VT_H);
}

export const vocabTradeoffDe = {
  outPath: `${OUT}/vokabular-abwaegung.svg`,
  build: (profile) =>
    buildVocabTradeoff(
      {
        tokensTitle: "Tokens für denselben Testabsatz",
        tableTitle: "Zahlen in Eingangs- und Ausgangstabelle",
        models: [
          { name: "Llama 2 7B", role: "teal", vocab: "32.000 Einträge", en: "englisch: 62", de: "deutsch: 87", table: 262, tableLabel: "262 Mio.", split: "zusammen, je Tabelle 131 Mio." },
          { name: "Llama 3.1 8B", role: "amber", vocab: "128.256 Einträge", en: "englisch: 55", de: "deutsch: 87", table: 1051, tableLabel: "1,05 Mrd.", split: "zusammen, je Tabelle 525 Mio." },
        ],
      },
      profile,
    ),
};

export const vocabTradeoffEn = {
  outPath: `${OUT}/vocabulary-tradeoff.svg`,
  build: (profile) =>
    buildVocabTradeoff(
      {
        tokensTitle: "Tokens for the same test paragraph",
        tableTitle: "Numbers in input and output tables",
        models: [
          { name: "Llama 2 7B", role: "teal", vocab: "32,000 entries", en: "English: 62", de: "German: 87", table: 262, tableLabel: "262 million", split: "together, 131 million per table" },
          { name: "Llama 3.1 8B", role: "amber", vocab: "128,256 entries", en: "English: 55", de: "German: 87", table: 1051, tableLabel: "1.05 billion", split: "together, 525 million per table" },
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3b. Made-up mini vocabulary: one extra entry makes the sentence one token
//     shorter but adds a row to both tables (toy example from the Tokenizer
//     Baustein; four made-up numbers per row; Abschnitt "Wie groß soll das
//     Vokabular sein?")

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
        {
          type: "div",
          props: {
            style: { display: "flex", gap: "18px", alignItems: "flex-start" },
            children: [
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [text(l.inTable, { fontSize: "15px", color: muted }), miniTable(rows, newIdx, profile)] } },
              { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [text(l.outTable, { fontSize: "15px", color: muted }), miniTable(rows, newIdx, profile)] } },
              text(l.numbers(rows * 4 * 2), { fontWeight: 700, fontSize: "15px", marginTop: "20px" }),
            ],
          },
        },
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

export const toyVocabularyDe = {
  outPath: `${OUT}/spielzeug-vokabular.svg`,
  build: (profile) =>
    buildToyVocabulary(
      {
        newEntry: "␣Katze",
        vocabTitle: "Vokabular",
        sentenceTitle: (n) => `„Die Katze sitzt.“ = ${n} Tokens`,
        tablesTitle: (n) => `je ${n} Zeilen à 4 Zahlen`,
        inTable: "Eingang",
        outTable: "Ausgang",
        numbers: (n) => `${n} Zahlen`,
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
        tablesTitle: (n) => `${n} rows of 4 numbers each`,
        inTable: "Input",
        outTable: "Output",
        numbers: (n) => `${n} numbers`,
        vocabs: [
          { title: "5 entries", entries: ["The", "␣cat", "s", "␣sit", "."], tokens: ["The", "␣cat", "s", "␣sit", "."] },
          { title: "6 entries", entries: ["The", "␣cat", "s", "␣sit", ".", "␣cats"], tokens: ["The", "␣cats", "␣sit", "."] },
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 4. The context window as a budget (made-up split of a 100,000 window,
//    Abschnitt "Das Kontextfenster ist ein Budget")

const CB_W = 600;
const CB_H = 180;
const CB_BAR_W = 560;

async function buildContextBudget(l, profile) {
  const total = l.parts.reduce((s, p) => s + p.value, 0);
  const segs = l.parts.map((p) => {
    const t = tone(p.role, profile);
    return {
      type: "div",
      props: {
        style: {
          display: "flex",
          width: `${Math.max(6, Math.round((p.value / total) * CB_BAR_W))}px`,
          height: "44px",
          background: p.free ? satoriBackground("neutral", profile) : t.accent,
          border: p.free ? `2px dashed ${tone("neutral", profile).stroke}` : "none",
        },
        children: "",
      },
    };
  });
  const legend = l.parts.map((p) => ({
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", gap: "8px", width: "270px" },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "18px",
              height: "18px",
              background: p.free ? satoriBackground("neutral", profile) : tone(p.role, profile).accent,
              border: p.free ? `2px dashed ${tone("neutral", profile).stroke}` : "none",
            },
            children: "",
          },
        },
        text(`${p.label}: ${p.display}`, { fontSize: "15px" }),
      ],
    },
  }));
  const tree = {
    type: "div",
    props: {
      style: { width: `${CB_W}px`, height: `${CB_H}px`, display: "flex", flexDirection: "column", padding: "16px 20px", gap: "12px" },
      children: [
        text(l.title, { fontWeight: 700, fontSize: "17px" }),
        { type: "div", props: { style: { display: "flex", width: `${CB_BAR_W}px`, borderRadius: "6px", overflow: "hidden" }, children: segs } },
        { type: "div", props: { style: { display: "flex", flexWrap: "wrap", rowGap: "8px", columnGap: "20px" }, children: legend } },
      ],
    },
  };
  return renderSvg(tree, CB_W, CB_H);
}

export const contextBudgetDe = {
  outPath: `${OUT}/kontextfenster-budget.svg`,
  build: (profile) =>
    buildContextBudget(
      {
        title: "Angenommen: ein Kontextfenster mit 100.000 Tokens",
        parts: [
          { label: "Systemtext und Werkzeuge", display: "3.000", value: 3000, role: "purple" },
          { label: "bisheriger Verlauf", display: "87.000", value: 87000, role: "teal" },
          { label: "deine neue Nachricht", display: "2.000", value: 2000, role: "amber" },
          { label: "frei für Denken und Antwort", display: "8.000", value: 8000, role: "neutral", free: true },
        ],
      },
      profile,
    ),
};

export const contextBudgetEn = {
  outPath: `${OUT}/context-budget.svg`,
  build: (profile) =>
    buildContextBudget(
      {
        title: "Suppose: a context window of 100,000 tokens",
        parts: [
          { label: "System text and tools", display: "3,000", value: 3000, role: "purple" },
          { label: "Earlier history", display: "87,000", value: 87000, role: "teal" },
          { label: "Your new message", display: "2,000", value: 2000, role: "amber" },
          { label: "Free for thinking and answer", display: "8,000", value: 8000, role: "neutral", free: true },
        ],
      },
      profile,
    ),
};
