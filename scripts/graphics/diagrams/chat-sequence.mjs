import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground } from "../tokens.mjs";
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
    "Im Chatfenster stehen zwei getrennte Nachrichten: eine Systemnachricht und deine Frage. Jede hat eine Rolle.",
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
    "The chat window shows two separate messages: a system message and your question. Each has a role.",
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
// 4. The context window as a budget (made-up split of a 100,000 window,
//    Abschnitt "Das Kontextfenster ist ein Budget")

const CB_W = 600;
const CB_H = 205;
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
      style: { display: "flex", alignItems: "center", gap: "8px", width: p.wide ? `${CB_BAR_W}px` : "270px" },
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
          { label: "Systemnachricht, Vorlage und Werkzeuge", display: "3.000", value: 3000, role: "purple", wide: true },
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
          { label: "System message, template, and tools", display: "3,000", value: 3000, role: "purple", wide: true },
          { label: "Earlier history", display: "87,000", value: 87000, role: "teal" },
          { label: "Your new message", display: "2,000", value: 2000, role: "amber" },
          { label: "Free for thinking and answer", display: "8,000", value: 8000, role: "neutral", free: true },
        ],
      },
      profile,
    ),
};
