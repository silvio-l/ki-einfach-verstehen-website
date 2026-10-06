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
    "Heraus kommt eine einzige Tokenfolge: 50 Tokens, davon 9 Spezial-Tokens. Sie endet mit der Marke für die Rolle „assistant“, hinter der noch nichts steht.",
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

// ---------------------------------------------------------------------------
// 2. The same chat in four chat templates
//    (Abschnitt "Text, den du nie geschrieben hast")

const FT_W = 600;
const FT_H = 290;
const FT_LABEL_W = 150;
const FT_BAR_X = 162;
const FT_BAR_MAX = 300;

async function buildFourTemplates(l, profile) {
  const max = Math.max(...l.rows.map((r) => r[1]));
  const muted = tone("neutral", profile).text;
  const children = [];
  l.rows.forEach(([name, tokens, note, role], i) => {
    const y = 20 + i * 66;
    const w = Math.round((tokens / max) * FT_BAR_MAX);
    children.push(at({ left: "0px", top: `${y}px`, width: `${FT_LABEL_W}px`, justifyContent: "flex-end", children: [text(name, { fontWeight: 700, fontSize: "16px" })] }));
    children.push(at({ left: `${FT_BAR_X}px`, top: `${y}px`, children: [bar(w, role, profile)] }));
    children.push(at({ left: `${FT_BAR_X + w + 8}px`, top: `${y}px`, children: [text(l.tokens(tokens), { fontWeight: 700 })] }));
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
        tokens: (n) => `${n} Tokens`,
        rows: [
          ["Gemma 3 1B", 22, "keine Systemrolle: Anweisung klebt an deiner Frage", "teal"],
          ["Qwen3-8B", 27, "schlichte Rollenmarken, kein Zusatztext", "teal"],
          ["Llama 3.1 8B", 50, "fügt zwei Datumszeilen ein", "amber"],
          ["gpt-oss-20b", 86, "setzt eine eigene Systemnachricht davor", "amber"],
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. Vocabulary size: shorter sequences vs. bigger tables
//    (Abschnitt "Wie groß soll das Vokabular sein?")

const VT_W = 600;
const VT_H = 290;
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
        tableTitle: "Zahlen in Ein- und Ausgabetabelle",
        models: [
          { name: "Llama 2 7B", role: "teal", vocab: "32.000 Einträge", en: "englisch: 62", de: "deutsch: 87", table: 262, tableLabel: "262 Mio." },
          { name: "Llama 3.1 8B", role: "amber", vocab: "128.256 Einträge", en: "englisch: 55", de: "deutsch: 87", table: 1051, tableLabel: "1,05 Mrd." },
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 4. The context window as a budget (made-up split of a 128,000 window,
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
        title: "Angenommen: ein Kontextfenster mit 128.000 Tokens",
        parts: [
          { label: "Systemtext und Werkzeuge", display: "3.000", value: 3000, role: "purple" },
          { label: "bisheriger Verlauf", display: "115.000", value: 115000, role: "teal" },
          { label: "deine neue Nachricht", display: "2.000", value: 2000, role: "amber" },
          { label: "frei für Denken und Antwort", display: "8.000", value: 8000, role: "neutral", free: true },
        ],
      },
      profile,
    ),
};
