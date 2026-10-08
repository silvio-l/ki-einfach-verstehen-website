import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";
import { block, edge } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";
import { FADERS, RANGE } from "../../../src/scripts/demos/hiddenstate.js";

// Themenbereich 2, Baustein 1 (Was ein KI-Modell eigentlich ist). Percentages
// come from the Baustein's own run of Qwen3-0.6B-Base (see its Lernplan);
// "all others" is 100 % minus the listed values, so nothing is invented.

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";
const BASE = "public/bausteine/was-ein-ki-modell-eigentlich-ist";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "18px", color: INK, ...style }, children: content } };
}

function box(style, children) {
  return { type: "div", props: { style: { display: "flex", ...style }, children } };
}

function card(role, profile, style, children) {
  return box(
    {
      flexDirection: "column",
      background: satoriBackground(role, profile),
      border: satoriBorder(role, profile, { width: 2 }),
      borderRadius: "10px",
      padding: "12px 14px",
      gap: "8px",
      ...style,
    },
    children,
  );
}

function arrow(profile, char = "→") {
  return text(char, { fontSize: "26px", color: tone("neutral", profile).stroke });
}

// A horizontal bar with its label in front and its value behind.
function bar(label, share, valueText, role, profile, maxWidth) {
  const w = Math.max(4, Math.round(share * maxWidth));
  return box({ alignItems: "center", gap: "8px" }, [
    text(label, { width: "104px", justifyContent: "flex-end", fontSize: "17px" }),
    box({ width: `${w}px`, height: "18px", background: tone(role, profile).accent, borderRadius: "3px" }, ""),
    text(valueText, { fontSize: "17px", fontWeight: 600 }),
  ]);
}

// ---------------------------------------------------------------------------
// 1. Database vs. model (Abschnitt "Wo steht, dass Paris die Hauptstadt ist?")

const DM_W = 680;
const DM_H = 300;

async function buildDatabaseModel(l, profile) {
  const muted = tone("neutral", profile).text;
  const rows = l.rows.map(([a, b], i) =>
    box(
      {
        gap: "0px",
        background: i === l.hit ? tone("amber", profile).fillStrong : "transparent",
        border: i === l.hit ? satoriBorder("amber", profile, { width: 2 }) : "2px solid transparent",
        borderRadius: "4px",
      },
      [text(a, { width: "112px", padding: "3px 6px", fontSize: "17px", fontWeight: i === 0 ? 700 : 400 }), text(b, { width: "92px", padding: "3px 6px", fontSize: "17px", fontWeight: i === 0 ? 700 : 400 })],
    ),
  );
  const teal = tone("teal", profile);
  const label = (t) => text(t, { fontSize: "17px", color: muted, justifyContent: "center", textAlign: "center" });
  // Fixed faders stand for the stored parameters: same knob heights for every question.
  const faders = box({ gap: "12px", height: "62px", alignItems: "stretch" }, [18, 40, 8, 30].map((top) =>
    box({ width: "8px", background: tone("neutral", profile).fill, border: satoriBorder("neutral", profile, { width: 1 }), borderRadius: "4px", position: "relative" }, [
      box({ position: "absolute", left: "-7px", top: `${top}px`, width: "20px", height: "10px", background: tone("neutral", profile).stroke, borderRadius: "2px" }, ""),
    ]),
  ));
  // Intermediate values are computed anew for this input; heights are schematic, not measured.
  const valueBars = box({ gap: "4px", alignItems: "flex-end", height: "48px" }, [30, 12, 40, 22, 8, 34, 18].map((h) =>
    box({ width: "10px", height: `${h}px`, background: teal.accent, borderRadius: "2px" }, ""),
  ));
  const col = (children, width) => box({ flexDirection: "column", alignItems: "center", gap: "6px", width }, children);
  const tree = box({ width: `${DM_W}px`, height: `${DM_H}px`, alignItems: "stretch", justifyContent: "space-between", padding: "8px 4px" }, [
    card("amber", profile, { width: "236px" }, [
      text(l.dbTitle, { fontWeight: 700, color: tone("amber", profile).text }),
      ...rows,
      text(l.dbNote, { fontSize: "17px", color: muted, marginTop: "6px" }),
    ]),
    card("teal", profile, { width: "416px" }, [
      text(l.modelTitle, { fontWeight: 700, color: teal.text }),
      text(l.prompt, { fontSize: "17px" }),
      box({ alignItems: "center", gap: "4px" }, [
        arrow(profile),
        col([faders, label(l.params)], "88px"),
        arrow(profile),
        col([box({ padding: "6px 8px", border: `2px dashed ${teal.stroke}`, borderRadius: "6px" }, [valueBars]), label(l.inter)], "128px"),
        arrow(profile),
        col([
          box({ flexDirection: "column", gap: "4px" }, [
            box({ alignItems: "center", gap: "6px" }, [text("Paris", { fontSize: "17px", width: "44px" }), box({ width: "34px", height: "14px", background: teal.accent, borderRadius: "3px" }, "")]),
            box({ alignItems: "center", gap: "6px" }, [text("…", { fontSize: "17px", width: "44px" }), box({ width: "18px", height: "14px", background: tone("neutral", profile).accent, borderRadius: "3px" }, "")]),
            box({ alignItems: "center", gap: "6px" }, [text("…", { fontSize: "17px", width: "44px" }), box({ width: "8px", height: "14px", background: tone("neutral", profile).accent, borderRadius: "3px" }, "")]),
          ]),
          label(l.scores),
        ], "80px"),
      ]),
      text(l.modelNote, { fontSize: "17px", color: muted, marginTop: "6px" }),
    ]),
  ]);
  return renderSvg(tree, DM_W, DM_H);
}

export const databaseModelDe = {
  outPath: `${BASE}/datenbank-oder-modell.svg`,
  build: (profile) =>
    buildDatabaseModel(
      {
        dbTitle: "Datenbank",
        rows: [["Land", "Hauptstadt"], ["Deutschland", "Berlin"], ["Frankreich", "Paris"], ["Italien", "Rom"]],
        hit: 2,
        dbNote: "sucht die passende Zeile; fehlt sie: „kein Treffer“",
        modelTitle: "Modell",
        prompt: "„Die Hauptstadt von Frankreich ist“",
        params: "Parameter: fest",
        inter: "Zwischenwerte: neu (schematisch)",
        scores: "Scores",
        modelNote: "aus Eingabe und festen Parametern entstehen Zwischenwerte; eine Zeile „Frankreich – Paris“ gibt es nicht",
      },
      profile,
    ),
};

export const databaseModelEn = {
  outPath: `${BASE}/database-or-model.svg`,
  build: (profile) =>
    buildDatabaseModel(
      {
        dbTitle: "Database",
        rows: [["Country", "Capital"], ["Germany", "Berlin"], ["France", "Paris"], ["Italy", "Rome"]],
        hit: 2,
        dbNote: "looks up the matching row; if it is missing: “no match”",
        modelTitle: "Model",
        prompt: "“The capital of France is”",
        params: "parameters: fixed",
        inter: "intermediate values: new (schematic)",
        scores: "scores",
        modelNote: "input and fixed parameters produce intermediate values; there is no row “France – Paris”",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. One number, many triggers; one feature, many numbers
//    (Abschnitt "Kein Regler heißt Paris")

const NF_W = 680;
const NF_H = 280;

function dot(filled, profile) {
  const t = tone("teal", profile);
  return box({ width: "26px", height: "26px", borderRadius: "13px", border: `2px solid ${t.stroke}`, background: filled ? t.accent : t.fill }, "");
}

async function buildNumberFeature(l, profile) {
  const muted = tone("neutral", profile).text;
  const chips = l.triggers.map((t) => card("neutral", profile, { padding: "5px 10px" }, [text(t, { fontSize: "17px" })]));
  // Every value takes part; the feature is the whole combination of heights.
  const pattern = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const tree = box({ width: `${NF_W}px`, height: `${NF_H}px`, justifyContent: "space-between", alignItems: "stretch", padding: "6px 2px" }, [
    box({ flexDirection: "column", width: "320px", gap: "10px" }, [
      text(l.leftTitle, { fontWeight: 700, color: tone("amber", profile).text }),
      box({ alignItems: "center", gap: "12px" }, [
        box({ flexDirection: "column", gap: "6px", width: "190px" }, chips),
        arrow(profile),
        box({ width: "44px", height: "44px", borderRadius: "22px", border: `3px solid ${tone("amber", profile).stroke}`, background: tone("amber", profile).accent }, ""),
      ]),
      text(l.leftNote, { fontSize: "17px", color: muted }),
    ]),
    box({ width: "2px", background: "#D8D3C6" }, ""),
    box({ flexDirection: "column", width: "320px", gap: "12px" }, [
      text(l.rightTitle, { fontWeight: 700, color: tone("teal", profile).text }),
      // Schematic heights of many intermediate values; the bracket marks their combination.
      box({ flexDirection: "column", gap: "4px", alignSelf: "flex-start" }, [
        box({ gap: "5px", alignItems: "flex-end", height: "70px" }, pattern.map((p, i) =>
          box({ width: "24px", height: `${[52, 18, 64, 44, 26, 12, 58, 22, 40, 66][i]}px`, background: p === 1 ? tone("teal", profile).accent : tone("neutral", profile).fill, border: satoriBorder(p === 1 ? "teal" : "neutral", profile, { width: 1 }), borderRadius: "3px" }, ""),
        )),
        box({ height: "8px", width: "286px", borderLeft: `2px solid ${tone("teal", profile).stroke}`, borderRight: `2px solid ${tone("teal", profile).stroke}`, borderBottom: `2px solid ${tone("teal", profile).stroke}` }, ""),
        text(l.feature, { fontSize: "17px", fontWeight: 600, color: tone("teal", profile).text, alignSelf: "center" }),
      ]),
      text(l.rightNote, { fontSize: "17px", color: muted }),
    ]),
  ]);
  return renderSvg(tree, NF_W, NF_H);
}

export const numberFeatureDe = {
  outPath: `${BASE}/zahl-und-merkmal.svg`,
  build: (profile) =>
    buildNumberFeature(
      {
        leftTitle: "Ein Zwischenwert",
        triggers: ["wissenschaftliche Zitate", "englische Dialoge", "Webseiten-Anfragen", "koreanischer Text"],
        leftNote: "reagiert auf vier inhaltlich ganz verschiedene Dinge",
        rightTitle: "Ein Merkmal",
        feature: "diese Kombination = Merkmal (schematisch)",
        rightNote: "zeigt sich über viele Zwischenwerte zugleich; dieselben Werte wirken auch an anderen Merkmalen mit",
      },
      profile,
    ),
};

export const numberFeatureEn = {
  outPath: `${BASE}/number-and-feature.svg`,
  build: (profile) =>
    buildNumberFeature(
      {
        leftTitle: "One intermediate value",
        triggers: ["academic citations", "English dialogue", "web page requests", "Korean text"],
        leftNote: "responds to four very different kinds of text",
        rightTitle: "One feature",
        feature: "this combination = feature (schematic)",
        rightNote: "shows up across many intermediate values at once; the same values take part in other features",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. Two runs through the same parameters (Abschnitt "Wo steht, dass Paris
//    die Hauptstadt ist?"): the stored parameters are drawn once and shared by
//    both runs; only the intermediate values and the scores differ.

const TR_W = 680;
const TR_H = 250;
const BAR_MAX = 70;

async function buildTwoRuns(l, profile) {
  const muted = tone("neutral", profile).text;
  const teal = tone("teal", profile);
  const small = (t, style = {}) => text(t, { fontSize: "16px", ...style });
  const prompt = (t) => card("neutral", profile, { padding: "6px 10px", width: "166px" }, [small(t)]);
  const faders = box({ gap: "11px", height: "70px", alignItems: "stretch", alignSelf: "center" }, [18, 44, 8, 30, 52].map((top) =>
    box({ width: "8px", background: tone("neutral", profile).fill, border: satoriBorder("neutral", profile, { width: 1 }), borderRadius: "4px", position: "relative" }, [
      box({ position: "absolute", left: "-7px", top: `${top}px`, width: "20px", height: "10px", background: tone("neutral", profile).stroke, borderRadius: "2px" }, ""),
    ]),
  ));
  // Schematic heights only: the two runs differ, the values themselves are not measured.
  const values = (heights) =>
    box({ gap: "4px", alignItems: "flex-end", height: "40px", padding: "4px 6px", border: `2px dashed ${teal.stroke}`, borderRadius: "6px" }, heights.map((h) =>
      box({ width: "10px", height: `${h}px`, background: teal.accent, borderRadius: "2px" }, ""),
    ));
  const scores = (rows) =>
    box({ flexDirection: "column", gap: "6px", width: "214px" }, rows.map(([label, share, role]) =>
      box({ alignItems: "center", gap: "6px" }, [
        small(label, { width: "98px", justifyContent: "flex-end", flexShrink: 0 }),
        box({ width: `${Math.max(4, Math.round((share / 50) * BAR_MAX))}px`, height: "14px", background: tone(role, profile).accent, borderRadius: "3px" }, ""),
        small(l.pct(share), { fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }),
      ]),
    ));
  const run = (h, rows) =>
    box({ alignItems: "center", gap: "6px", height: "86px" }, [values(h), arrow(profile), scores(rows)]);
  const head = (t, width) => small(t, { width, color: muted, justifyContent: "center", textAlign: "center" });
  const tree = box({ width: `${TR_W}px`, height: `${TR_H}px`, flexDirection: "column", padding: "6px 2px", gap: "6px" }, [
    box({ gap: "6px" }, [head(l.hInput, "166px"), head("", "26px"), head(l.hParams, "112px"), head("", "26px"), head(l.hInter, "98px"), head("", "26px"), head(l.hScores, "214px")]),
    box({ alignItems: "stretch", gap: "6px" }, [
      box({ flexDirection: "column", justifyContent: "space-around", height: "190px" }, [prompt(l.forward), prompt(l.reverse)]),
      box({ flexDirection: "column", justifyContent: "space-around", height: "190px" }, [arrow(profile), arrow(profile)]),
      card("neutral", profile, { width: "112px", justifyContent: "center", alignItems: "center" }, [faders, small(l.same, { color: muted, textAlign: "center", justifyContent: "center" })]),
      box({ flexDirection: "column", justifyContent: "space-around", height: "190px" }, [arrow(profile), arrow(profile)]),
      box({ flexDirection: "column", justifyContent: "space-around", height: "190px" }, [
        run([30, 12, 26, 6, 18], [["Paris", l.paris, "teal"]]),
        run([8, 28, 14, 22, 32], [[l.germany, l.germanyShare, "amber"], [l.france, l.franceShare, "teal"]]),
      ]),
    ]),
  ]);
  return renderSvg(tree, TR_W, TR_H);
}

// Shares from the Baustein's own run (docs/content-plan/versuche/was-ein-ki-modell-naechstes-token.md).
const RUN = { paris: 47.5, germanyShare: 28.9, franceShare: 9.4 };

export const twoRunsDe = {
  outPath: `${BASE}/zwei-durchlaeufe.svg`,
  build: (profile) =>
    buildTwoRuns(
      {
        ...RUN,
        hInput: "Eingabe",
        hParams: "Parameter",
        hInter: "Zwischenwerte",
        hScores: "Score-Liste, in Prozent",
        forward: "„Die Hauptstadt von Frankreich ist\u00a0…“",
        reverse: "„Paris ist die Hauptstadt von\u00a0…“",
        same: "dieselben, fest",
        germany: "Deutschland",
        france: "Frank…",
        pct: (n) => `${String(n).replace(".", ",")} %`,
      },
      profile,
    ),
};

export const twoRunsEn = {
  outPath: `${BASE}/two-runs.svg`,
  build: (profile) =>
    buildTwoRuns(
      {
        ...RUN,
        hInput: "input",
        hParams: "parameters",
        hInter: "intermediate values",
        hScores: "score list, in percent",
        forward: "“Die Hauptstadt von Frankreich ist\u00a0…”",
        reverse: "“Paris ist die Hauptstadt von\u00a0…”",
        same: "the same, fixed",
        germany: "Deutschland",
        france: "Frank…",
        pct: (n) => `${n}%`,
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 4. Kinds of models (Abschnitt "Nicht jedes KI-Modell ist ein Sprachmodell"):
//    the Baustein's own examples described by properties, not as exclusive
//    classes. "Multimodal" is a property of the input (more than one kind).

const MK_W = 680;
const MK_H = 340;
const MK_COLS = [150, 112, 150, 200];

async function buildModelKinds(l, profile) {
  const muted = tone("neutral", profile).text;
  const amber = tone("amber", profile);
  const cell = (content, i, style = {}) => box({ width: `${MK_COLS[i]}px`, flexDirection: "column", gap: "2px" }, [text(content, { fontSize: "16px", ...style })]);
  const header = box({ gap: "4px", padding: "0 10px" }, l.head.map((h, i) => cell(h, i, { fontWeight: 700, color: muted })));
  const row = ([example, input, output, how, multi]) =>
    card("neutral", profile, { flexDirection: "row", gap: "4px", padding: "7px 10px", alignItems: "center" }, [
      cell(example, 0, { fontWeight: 700 }),
      box({ width: `${MK_COLS[1]}px`, flexDirection: "column", gap: "2px" }, [
        text(input, { fontSize: "16px" }),
        ...(multi ? [text(multi, { fontSize: "16px", fontWeight: 700, color: amber.text, background: satoriBackground("amber", profile), borderRadius: "4px", padding: "0 5px", alignSelf: "flex-start" })] : []),
      ]),
      cell(output, 2),
      cell(how, 3, { color: muted }),
    ]);
  const tree = box({ width: `${MK_W}px`, height: `${MK_H}px`, flexDirection: "column", gap: "6px", padding: "4px 2px" }, [header, ...l.rows.map(row)]);
  return renderSvg(tree, MK_W, MK_H);
}

export const modelKindsDe = {
  outPath: `${BASE}/modellarten.svg`,
  build: (profile) =>
    buildModelKinds(
      {
        head: ["Beispiel", "rein", "raus", "so entsteht die Ausgabe"],
        rows: [
          ["Spamfilter", "Mail", "Urteil: Spam oder nicht", "in einem Durchgang"],
          ["Bildklassifikator", "Foto", "Urteil, etwa „Katze“", "in einem Durchgang"],
          ["Bildgenerator (Diffusion)", "Text", "Bild", "aus Rauschen, in vielen Schritten klarer"],
          ["Sprachmodell", "Text", "nächstes Textstück", "Stück für Stück angehängt"],
          ["Chatbot, der Fotos versteht", "Text und Foto", "Text", "Stück für Stück angehängt", "multimodal"],
        ],
      },
      profile,
    ),
};

export const modelKindsEn = {
  outPath: `${BASE}/kinds-of-models.svg`,
  build: (profile) =>
    buildModelKinds(
      {
        head: ["Example", "in", "out", "how the output arises"],
        rows: [
          ["Spam filter", "email", "verdict: spam or not", "in one pass"],
          ["Image classifier", "photo", "verdict, e.g. “cat”", "in one pass"],
          ["Image generator (diffusion)", "text", "image", "from noise, clearer over many steps"],
          ["Language model", "text", "next text piece", "piece by piece appended"],
          ["Chatbot that reads photos", "text and photo", "text", "piece by piece appended", "multimodal"],
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 5. Two steps: Dallas -> Texas -> Austin, and the swap to California
//    (Abschnitt "Antworten, die so nirgends standen"). Anthropic 2025.

function twoStepSource(t, profile) {
  return `
grid-rows: 2
grid-columns: 3
horizontal-gap: 56
vertical-gap: 90

frage: "${t.question}" {${block("neutral", profile)}}
texas: "${t.texas}" {${block("teal", profile)}}
austin: "${t.austin}" {${block("amber", profile)}}
tausch: "${t.swap}" {${block("purple", profile)}}
kalifornien: "${t.california}" {${block("teal", profile)}}
sacramento: "${t.sacramento}" {${block("amber", profile)}}

frage -> texas: ${edge(profile, t.step1)}
texas -> austin: ${edge(profile, t.step2)}
texas -> tausch: ${edge(profile, t.intervene, { dashed: true })}
tausch -> kalifornien: ${edge(profile, t.step1b)}
kalifornien -> sacramento: ${edge(profile, t.step2b)}
`;
}

const TWO_STEPS = (c) => [
  { nodes: ["frage"], caption: c[0] },
  { nodes: ["frage", "texas"], edges: ["frage -> texas"], caption: c[1] },
  { nodes: ["texas", "austin"], edges: ["texas -> austin"], caption: c[2] },
  { nodes: ["texas", "tausch"], edges: ["texas -> tausch"], caption: c[3] },
  { nodes: ["tausch", "kalifornien", "sacramento"], edges: ["tausch -> kalifornien", "kalifornien -> sacramento"], caption: c[4] },
];

export const twoStepsDe = stepperFigure({
  source: twoStepSource,
  text: {
    question: "Frage\\nHauptstadt des\\nStaats von Dallas?",
    texas: "Merkmal\\n„Texas“",
    austin: "Antwort\\nAustin",
    swap: "Eingriff\\nTexas\\nersetzt",
    california: "Merkmal\\n„Kalifornien“",
    sacramento: "Antwort\\nSacramento",
    step1: "1",
    step2: "2",
    intervene: "Eingriff",
    step1b: "1",
    step2b: "2",
  },
  copy: {
    title: "Zwei gelernte Fakten, verknüpft",
    intro: "So kombiniert ein Modell zwei Fakten. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
    captions: [
      "Die Frage: Was ist die Hauptstadt des US-Bundesstaats, in dem Dallas liegt?",
      "Erster Schritt: Ausgelöst durch „Dallas“, springt im Modell ein Merkmal für Texas an.",
      "Zweiter Schritt: Zusammen mit der Frage nach einer Hauptstadt führt das Merkmal für Texas zur Antwort Austin.",
      "Eingriff: Forschende ersetzen während der Rechnung das Merkmal für Texas durch eines für Kalifornien.",
      "Jetzt knüpft der zweite Schritt an Kalifornien an, und das Modell antwortet Sacramento. Der zweite Schritt hing also vom ersten ab.",
    ],
  },
  steps: TWO_STEPS,
  lang: "de",
  outPath: `${BASE}/zwei-schritte.static.svg`,
  htmlPath: `${BASE}/zwei-schritte.html`,
});

export const twoStepsEn = stepperFigure({
  source: twoStepSource,
  text: {
    question: "Question\\ncapital of\\nDallas’ state?",
    texas: "Feature\\n“Texas”",
    austin: "Answer\\nAustin",
    swap: "Intervention\\nTexas\\nreplaced",
    california: "Feature\\n“California”",
    sacramento: "Answer\\nSacramento",
    step1: "1",
    step2: "2",
    intervene: "intervention",
    step1b: "1",
    step2b: "2",
  },
  copy: {
    title: "Two learned facts, linked",
    intro: "This is how a model combines two facts. Use “Next” to go step by step, “Play” runs on its own.",
    captions: [
      "The question: What is the capital of the US state that Dallas is in?",
      "First step: Triggered by “Dallas”, a feature for Texas fires inside the model.",
      "Second step: Together with the question about a capital, the Texas feature leads to the answer Austin.",
      "Intervention: During the computation, researchers replace the feature for Texas with one for California.",
      "Now the second step builds on California, and the model answers Sacramento. So the second step really depended on the first.",
    ],
  },
  steps: TWO_STEPS,
  lang: "en",
  outPath: `${BASE}/two-steps.static.svg`,
  htmlPath: `${BASE}/two-steps.html`,
});

// ---------------------------------------------------------------------------
// 6. The way through the model (Abschnitt "Nicht jedes KI-Modell ist ein
//    Sprachmodell"): the four stations of Themenbereich 2, one per Baustein.

const WM_W = 680;
const WM_H = 250;

async function buildWayMap(l, profile) {
  const muted = tone("neutral", profile).text;
  const station = ([nr, title, note], role) =>
    card(role, profile, { width: "138px", padding: "10px 10px", gap: "6px" }, [
      text(nr, { fontSize: "16px", color: tone(role, profile).text, fontWeight: 700 }),
      text(title, { fontSize: "18px", fontWeight: 700 }),
      text(note, { fontSize: "16px", color: muted }),
    ]);
  const roles = ["amber", "teal", "teal", "amber"];
  const items = [];
  l.stations.forEach((st, i) => {
    if (i > 0) items.push(arrow(profile));
    items.push(station(st, roles[i]));
  });
  const tree = box({ width: `${WM_W}px`, height: `${WM_H}px`, flexDirection: "column", gap: "10px", padding: "6px 2px" }, [
    box({ justifyContent: "space-between", alignItems: "center" }, [text(l.input, { fontSize: "16px", color: muted }), text(l.output, { fontSize: "16px", color: muted })]),
    box({ alignItems: "center", justifyContent: "space-between" }, items),
  ]);
  return renderSvg(tree, WM_W, WM_H);
}

export const wayMapDe = {
  outPath: `${BASE}/weg-durchs-modell.svg`,
  build: (profile) =>
    buildWayMap(
      {
        input: "Rein: deine Chatnachricht",
        output: "Raus: Score-Liste, daraus wird ein Token gewählt",
        stations: [
          ["Baustein 2", "Tokens", "Text wird zur Tokenfolge"],
          ["Baustein 3", "Embeddings", "jedes Token bekommt eine Liste aus Zahlen"],
          ["Baustein 4", "Blöcke", "viele Rechenstufen mischen den Zusammenhang ein"],
          ["Baustein 5", "Output Head", "der Ausgang: macht die Score-Liste"],
        ],
      },
      profile,
    ),
};

export const wayMapEn = {
  outPath: `${BASE}/way-through-the-model.svg`,
  build: (profile) =>
    buildWayMap(
      {
        input: "In: your chat message",
        output: "Out: score list, from it one token is chosen",
        stations: [
          ["Lesson 2", "Tokens", "text becomes a token sequence"],
          ["Lesson 3", "Embeddings", "each token gets a list of numbers"],
          ["Lesson 4", "Blocks", "many computation stages mix in the context"],
          ["Lesson 5", "Output head", "the exit: produces the score list"],
        ],
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 6. Toy model (Abschnitt "Kein Parameter heißt Paris"): the made-up numbers of
//    HiddenStateDemo (src/scripts/demos/hiddenstate.js). Two separate stages:
//    six fixed faders turn the input into two meters, four turn the meters
//    into two scores. Knob heights show the real fader values (-3 … 3); the
//    fader changed in the note (fader 9, stage 2) is highlighted.

const TM_W = 680;
const TM_H = 350;
const CHANGED = "r9";

async function buildToyModel(l, profile) {
  const muted = tone("neutral", profile).text;
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const small = (t, style = {}) => text(t, { fontSize: "16px", ...style });
  const TRACK = 56;
  const knobTop = (v) => Math.round(((RANGE.max - v) / (RANGE.max - RANGE.min)) * (TRACK - 8));
  const faders = (stage) =>
    box({ gap: "8px", height: `${TRACK}px`, alignSelf: "center" }, FADERS.filter((f) => f.stage === stage).map((f) =>
      box({ width: "6px", height: `${TRACK}px`, background: tone("neutral", profile).fill, border: satoriBorder("neutral", profile, { width: 1 }), borderRadius: "3px", position: "relative" }, [
        box({ position: "absolute", left: "-5px", top: `${knobTop(f.value)}px`, width: "14px", height: "8px", background: f.key === CHANGED ? amber.accent : tone("neutral", profile).stroke, borderRadius: "2px" }, ""),
      ]),
    ));
  const stageCard = (stage, label) =>
    card("neutral", profile, { width: "108px", justifyContent: "center", alignItems: "center", gap: "8px", padding: "8px 6px" }, [
      faders(stage),
      small(label, { color: muted, textAlign: "center", justifyContent: "center" }),
    ]);
  const inCard = ([name, sentence, input]) =>
    card("neutral", profile, { width: "160px", padding: "8px 10px", gap: "4px" }, [small(name, { fontWeight: 700 }), small(sentence, { color: muted }), small(input)]);
  const meterCard = (meters) => card("neutral", profile, { width: "84px", padding: "8px 8px", gap: "2px", alignItems: "center" }, [small(l.metersLabel, { color: muted }), small(meters, { fontWeight: 700 })]);
  const scoreCard = ([scores, winner]) =>
    card("teal", profile, { width: "128px", padding: "8px 8px", gap: "2px" }, scores.map(([label, value], i) =>
      small(`${label} ${value}`, { fontWeight: i === winner ? 700 : 400, color: i === winner ? teal.text : INK }),
    ));
  const col = (children) => box({ flexDirection: "column", justifyContent: "space-around", alignItems: "center", gap: "10px", minHeight: "236px" }, children);
  const arrows = () => col([arrow(profile), arrow(profile)]);
  const tree = box({ width: `${TM_W}px`, height: `${TM_H}px`, flexDirection: "column", padding: "6px 2px", gap: "10px" }, [
    box({ alignItems: "stretch", justifyContent: "space-between" }, [
      col([inCard(l.a), inCard(l.b)]),
      arrows(),
      stageCard(1, l.stage1),
      arrows(),
      col([meterCard(l.aMeters), meterCard(l.bMeters)]),
      arrows(),
      stageCard(2, l.stage2),
      arrows(),
      col([scoreCard(l.aScores), scoreCard(l.bScores)]),
    ]),
    card("amber", profile, { padding: "8px 12px", gap: "4px" }, [
      small(l.changeTitle, { fontWeight: 700, color: amber.text }),
      small(l.changeNote),
    ]),
  ]);
  return renderSvg(tree, TM_W, TM_H);
}

export const toyModelDe = {
  outPath: `${BASE}/spielzeugmodell.svg`,
  build: (profile) =>
    buildToyModel(
      {
        a: ["Satz A", "„Die Hauptstadt von Frankreich ist“", "Eingabe: 2, 1, 1"],
        b: ["Satz B", "„Paris ist die Hauptstadt von“", "Eingabe: 1, 2, 1"],
        stage1: "Stufe 1: 6 feste Regler",
        stage2: "Stufe 2: 4 feste Regler",
        metersLabel: "Anzeigen",
        aMeters: "4 und 1",
        bMeters: "1 und 4",
        aScores: [[["Paris", 9], ["Frankreich", 6]], 0],
        bScores: [[["Paris", 6], ["Frankreich", 9]], 1],
        changeTitle: "Alle Zahlen ausgedacht. Regler 9 (hervorgehoben) von 1 auf 3 gestellt:",
        changeNote: "Satz A: Frankreich 6 → 14, überholt Paris, die Antwort wechselt. Satz B: Frankreich 9 → 11, lag schon vorn, die Antwort bleibt.",
      },
      profile,
    ),
};

export const toyModelEn = {
  outPath: `${BASE}/toy-model.svg`,
  build: (profile) =>
    buildToyModel(
      {
        a: ["Sentence A", "“The capital of France is”", "input: 2, 1, 1"],
        b: ["Sentence B", "“Paris is the capital of”", "input: 1, 2, 1"],
        stage1: "stage 1: 6 fixed faders",
        stage2: "stage 2: 4 fixed faders",
        metersLabel: "meters",
        aMeters: "4 and 1",
        bMeters: "1 and 4",
        aScores: [[["Paris", 9], ["France", 6]], 0],
        bScores: [[["Paris", 6], ["France", 9]], 1],
        changeTitle: "All numbers made up. Fader 9 (highlighted) moved from 1 to 3:",
        changeNote: "Sentence A: France 6 → 14, overtakes Paris, the answer changes. Sentence B: France 9 → 11, already ahead, the answer stays.",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 7. Three quantities (end of "Kein Parameter heißt Paris"): parameters,
//    intermediate values and features, each with its picture.

const TQ_W = 680;

async function buildThreeQuantities(l, profile) {
  const muted = tone("neutral", profile).text;
  const roles = ["neutral", "teal", "purple"];
  const row = ([name, what, picture], i) =>
    card(roles[i], profile, { flexDirection: "row", alignItems: "center", padding: "8px 12px", gap: "12px" }, [
      text(name, { width: "150px", fontWeight: 700, color: tone(roles[i], profile).text }),
      text(what, { width: "300px", fontSize: "17px" }),
      text(picture, { width: "170px", fontSize: "17px", color: muted }),
    ]);
  const tree = box({ width: `${TQ_W}px`, height: `${l.height}px`, flexDirection: "column", padding: "6px 2px", gap: "10px" }, [
    ...l.rows.map(row),
    card("amber", profile, { padding: "8px 12px" }, [text(l.fact, { fontSize: "17px", fontWeight: 600 })]),
  ]);
  return renderSvg(tree, TQ_W, l.height);
}

export const threeQuantitiesDe = {
  outPath: `${BASE}/drei-groessen.svg`,
  build: (profile) =>
    buildThreeQuantities(
      {
        rows: [
          ["Parameter", "gespeichert, beim Antworten fest", "im Bild: die Regler"],
          ["Zwischenwerte", "für jeden Text neu berechnet", "im Bild: die Anzeigen"],
          ["Merkmale", "Kombinationen in den Zwischenwerten", "im Bild: ein Muster über viele Anzeigen"],
        ],
        fact: "Der Fakt ist keine davon: Er zeigt sich erst in der Antwort.",
        height: 246,
      },
      profile,
    ),
};

export const threeQuantitiesEn = {
  outPath: `${BASE}/three-quantities.svg`,
  build: (profile) =>
    buildThreeQuantities(
      {
        rows: [
          ["Parameters", "stored, fixed while answering", "like the faders"],
          ["Intermediate values", "computed anew for every text", "like the meters"],
          ["Features", "combinations within the intermediate values", "a pattern across many meters"],
        ],
        fact: "The fact is none of these: it only shows up in the answer.",
        height: 260,
      },
      profile,
    ),
};
