import { block, edge } from "../d2-blocks.mjs";
import { renderD2 } from "../d2-render.mjs";
import { stepperFigure } from "../stepper.mjs";
import { tone } from "../tokens.mjs";

// Baustein "Backpropagation und Gradienten". All numbers belong to the
// invented Treppenlicht network of "Neuronale Netze" with one weight set by
// hand to a wrong value (C's weight for B is -1 instead of -2), case "beide"
// (both switches pressed), error = deviation times itself. They match the
// text and the live demos (src/scripts/demos/backprop.mjs); nothing here is a
// measurement. Neurons are teal (they hold stored faders), notes ("Zettel")
// and the error are amber (computed for this run only).

// ---------------------------------------------------------------------------
// 1. Step animation of the backward pass (Abschnitt "Rückwärts durch das
//    Treppenlicht"). The arrows point backwards, from the error to the inputs.

function rueckwegSource(t, profile) {
  return `
direction: down
fehler: "${t.error}" {${block("amber", profile)}}
c: "${t.c}" {${block("teal", profile)}}
b: "${t.b}" {${block("teal", profile)}}
a: "${t.a}" {${block("teal", profile)}}

fehler -> c: ${edge(profile, "2")}
c -> b: ${edge(profile, t.influenceB)}
c -> a: ${edge(profile, t.influenceA)}
`;
}

const RUECKWEG_STEPS = (c) => [
  { nodes: ["a", "b", "c", "fehler"], caption: c[0] },
  { nodes: ["fehler", "c"], edges: ["fehler -> c"], caption: c[1] },
  { nodes: ["c"], caption: c[2] },
  { nodes: ["c", "b"], edges: ["c -> b"], caption: c[3] },
  { nodes: ["b"], caption: c[4] },
  { nodes: ["c", "a"], edges: ["c -> a"], caption: c[5] },
  { nodes: ["c", "fehler"], caption: c[6] },
];

const RUECKWEG_DE = {
  error: "Fehler im Fall „beide“: 1\\nSteigung an der Ausgabe von C: 2",
  c: "C: 2 · 1 + 1 · (−1) = 1\\nZettel: für A 4, für B 2,\\nGrundregler 2 (alle tiefer)",
  b: "B: Summe 1 + 1 − 1 = 1\\nUntergrenze lässt durch\\nZettel: je −2 (höher)",
  a: "A: Summe 1 + 1 + 0 = 2\\nUntergrenze lässt durch\\nZettel: je 2 (tiefer)",
  influenceB: "Einfluss von B: 2 · (−1) = −2",
  influenceA: "Einfluss von A: 2 · 1 = 2",
  title: "Der Rückweg durch das Treppenlicht",
  intro: "Ausgedachtes Netz, ein Gewicht von Hand verstellt: C nimmt B mal −1 statt mal −2. Fall „beide“, Schritt für Schritt rückwärts, mit Weiter oder Abspielen.",
  captions: [
    "Vorwärtsdurchlauf im Fall „beide“: A rechnet 2, B rechnet 1, C rechnet 2 − 1 = 1. Richtig wäre 0, der Fehler ist 1 · 1 = 1.",
    "Rückt die Ausgabe von C um 0,01 auf 1,01, wird der Fehler 1,0201: rund 0,02 mehr, geteilt durch 0,01 ergibt das die Steigung 2. C ist kein Regler, aber von hier gehen alle Zettel aus.",
    "Zettel an C: Grundregler 2, Gewicht für B 2 · 1 = 2, Gewicht für A 2 · 2 = 4. Positiv heißt tiefer.",
    "Einfluss von B: Das Gewicht von C für B ist −1, also 2 · (−1) = −2. Die Summe von B ist 1, die Untergrenze lässt durch.",
    "Zettel an B: beide Gewichte und der Grundregler je −2 · 1 = −2. Negativ heißt höher.",
    "Einfluss von A: 2 · 1 = 2, die Untergrenze lässt durch. Zettel an A: je 2, also tiefer. Der größte Zettel, die 4, hängt an C für A, einem Gewicht, das richtig steht.",
    "Gegenprobe: Gewicht von C für B auf −1,01 gedreht, C rechnet 0,99, der Fehler sinkt auf 0,9801. Steigung rund 2, wie der Zettel sagt. Gedreht wurde auf dem Rückweg nichts.",
  ],
};

const RUECKWEG_EN = {
  error: "Error in case “both”: 1\\nslope at the output of C: 2",
  c: "C: 2 · 1 + 1 · (−1) = 1\\nnotes: for A 4, for B 2,\\nbias 2 (all lower)",
  b: "B: sum 1 + 1 − 1 = 1\\nlower limit passes it\\nnotes: −2 each (higher)",
  a: "A: sum 1 + 1 + 0 = 2\\nlower limit passes it\\nnotes: 2 each (lower)",
  influenceB: "influence of B: 2 · (−1) = −2",
  influenceA: "influence of A: 2 · 1 = 2",
  title: "The backward pass through the stair light",
  intro: "Invented network with one weight set wrong by hand: C takes B times −1 instead of −2. Case “both”, step by step backwards, with Next or Play.",
  captions: [
    "Forward pass for “both”: A computes 2, B computes 1, C computes 2 − 1 = 1. Correct would be 0, so the error is 1 · 1 = 1.",
    "If C's output moves up by 0.01 to 1.01, the error becomes 1.0201: about 0.02 more, and divided by 0.01 that gives the slope 2. C is not a fader, but all notes start from here.",
    "Notes at C: bias 2, weight for B 2 · 1 = 2, weight for A 2 · 2 = 4. Positive means lower.",
    "Influence of B: C's weight for B is −1, so 2 · (−1) = −2. B's sum is 1, the lower limit lets it through.",
    "Notes at B: both weights and the bias −2 · 1 = −2 each. Negative means higher.",
    "Influence of A: 2 · 1 = 2, the lower limit lets it through. Notes at A: 2 each, so lower. The largest note, the 4, hangs on C's weight for A, which is set correctly.",
    "Check: C's weight for B turned to −1.01, C computes 0.99, the error drops to 0.9801. Slope about 2, as the note says. Nothing was turned during the backward pass.",
  ],
};

export const rueckwegDe = stepperFigure({
  source: rueckwegSource,
  text: RUECKWEG_DE,
  copy: RUECKWEG_DE,
  steps: RUECKWEG_STEPS,
  lang: "de",
  outPath: "public/bausteine/backpropagation-und-gradienten/treppenlicht-rueckweg.static.svg",
  htmlPath: "public/bausteine/backpropagation-und-gradienten/treppenlicht-rueckweg.html",
});

export const rueckwegEn = stepperFigure({
  source: rueckwegSource,
  text: RUECKWEG_EN,
  copy: RUECKWEG_EN,
  steps: RUECKWEG_STEPS,
  lang: "en",
  outPath: "public/bausteine/backpropagation-und-gradienten/treppenlicht-rueckweg-en.static.svg",
  htmlPath: "public/bausteine/backpropagation-und-gradienten/treppenlicht-rueckweg-en.html",
});

// ---------------------------------------------------------------------------
// 2. Probing versus the backward pass (Abschnitt "Ein Rückweg statt
//    Milliarden Proben"): nine extra forward runs, one per fader, each turning
//    its fader up by 0.01, against one backward pass with the exact notes.

function probeSource(t, profile) {
  const n = tone("neutral", profile);
  const frame = `style.font-size: 20
  style.font-color: "${n.text}"
  style.fill: transparent
  style.stroke: "${n.stroke}"
  style.stroke-width: 2`;
  const probes = t.probes.map((label, i) => `  p${i}: "${label}" {${block("neutral", profile)}\n  width: 190}`).join("\n");
  return `
direction: down
probe: "${t.probeTitle}" {
  grid-columns: 3
  horizontal-gap: 10
  vertical-gap: 10
  ${frame}
${probes}
}
rueck: "${t.backTitle}" {
  ${frame}
  r: "${t.backNotes}" {${block("amber", profile)}
  width: 590}
}
probe -> rueck: ${edge(profile, t.link)}
`;
}

const PROBE_DE = {
  probeTitle: "Probedrehen: 9 Vorwärtsdurchläufe, ungefähr",
  probes: ["A oben\\n≈ 2,01", "A unten\\n≈ 2,01", "A Grund\\n≈ 2,01", "B oben\\n≈ −1,99", "B unten\\n≈ −1,99", "B Grund\\n≈ −1,99", "C für A\\n≈ 4,04", "C für B\\n≈ 2,01", "C Grund\\n≈ 2,01"],
  backTitle: "Rückweg: 1 Durchgang, genau",
  link: "dieselben Zettel, genau statt ungefähr",
  backNotes: "alle 9 Zettel genau:\\nA: je 2, B: je −2\\nC für A: 4, C für B: 2, C Grund: 2",
};

const PROBE_EN = {
  probeTitle: "Probing: 9 forward passes, approximate",
  probes: ["A top\\n≈ 2.01", "A bottom\\n≈ 2.01", "A bias\\n≈ 2.01", "B top\\n≈ −1.99", "B bottom\\n≈ −1.99", "B bias\\n≈ −1.99", "C for A\\n≈ 4.04", "C for B\\n≈ 2.01", "C bias\\n≈ 2.01"],
  backTitle: "Backward pass: 1 run, exact",
  link: "the same notes, exact instead of approximate",
  backNotes: "all 9 notes exactly:\\nA: 2 each, B: −2 each\\nC for A: 4, C for B: 2, C bias: 2",
};

export const probedrehenDe = {
  outPath: "public/bausteine/backpropagation-und-gradienten/probedrehen-rueckweg.svg",
  build: (profile) => renderD2(probeSource(PROBE_DE, profile)),
};

export const probedrehenEn = {
  outPath: "public/bausteine/backpropagation-und-gradienten/probedrehen-rueckweg-en.svg",
  build: (profile) => renderD2(probeSource(PROBE_EN, profile)),
};

// ---------------------------------------------------------------------------
// 3. Four cases, four notes for C's weight for A after it moved to 0.9
//    (Abschnitt "Ein Zettel gilt nur hier und jetzt"); the batch note is
//    their average, because the batch loss is the average over its examples.

function faelleSource(t, profile) {
  return `
direction: right
k: "${t.cases[0]}" {${block("neutral", profile)}}
o: "${t.cases[1]}" {${block("teal", profile)}}
u: "${t.cases[2]}" {${block("teal", profile)}}
bd: "${t.cases[3]}" {${block("amber", profile)}}
avg: "${t.avg}" {${block("amber", profile)}}
k -> avg: ${edge(profile, "0")}
o -> avg: ${edge(profile, "−0,2".replace(",", t.sep))}
u -> avg: ${edge(profile, "−0,2".replace(",", t.sep))}
bd -> avg: ${edge(profile, "3,2".replace(",", t.sep))}
`;
}

const FAELLE_DE = {
  sep: ",",
  cases: ["keiner\\nC zeigt 0, soll 0\\nZettel 0", "nur oben\\nC zeigt 0,9, soll 1\\nZettel −0,2: höher", "nur unten\\nC zeigt 0,9, soll 1\\nZettel −0,2: höher", "beide\\nC zeigt 0,8, soll 0\\nZettel 3,2: tiefer"],
  avg: "Zettel für den Batch,\\nder Durchschnitt:\\n(0 − 0,2 − 0,2 + 3,2) : 4\\n= 0,7, tiefer",
};

const FAELLE_EN = {
  sep: ".",
  cases: ["neither\\nC shows 0, should be 0\\nnote 0", "only top\\nC shows 0.9, should be 1\\nnote −0.2: higher", "only bottom\\nC shows 0.9, should be 1\\nnote −0.2: higher", "both\\nC shows 0.8, should be 0\\nnote 3.2: lower"],
  avg: "note for the batch,\\nthe average:\\n(0 − 0.2 − 0.2 + 3.2) / 4\\n= 0.7, lower",
};

export const vierFaelleDe = {
  outPath: "public/bausteine/backpropagation-und-gradienten/vier-faelle-zettel.svg",
  build: (profile) => renderD2(faelleSource(FAELLE_DE, profile)),
};

export const vierFaelleEn = {
  outPath: "public/bausteine/backpropagation-und-gradienten/vier-faelle-zettel-en.svg",
  build: (profile) => renderD2(faelleSource(FAELLE_EN, profile)),
};
