import { block, edge } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// Baustein "Wie ein Modell nachdenkt", section "Warum Zwischenschritte schwere
// Aufgaben lösbar machen": the worked example from the text, 3 -> 6 -> 10 -> 20
// -> 21. Every line is written by the model and stays in the context, so each
// step builds on all lines before it. German (denkschritteKetteDe) and English
// (denkschritteKetteEn) variants.
function source(text, profile) {
  return `
direction: down
vertical-gap: 36

start: "${text.start}" {${block("neutral", profile)}}
s1: "${text.s1}" {${block("teal", profile)}}
s2: "${text.s2}" {${block("teal", profile)}}
s3: "${text.s3}" {${block("teal", profile)}}
ende: "${text.ende}" {${block("amber", profile)}}

start -> s1: ${edge(profile, text.e1)}
s1 -> s2: ${edge(profile, text.e2)}
s2 -> s3: ${edge(profile, text.e3)}
s3 -> ende: ${edge(profile, text.e4)}
`;
}

const STEPS = (c) => [
  { nodes: ["start"], caption: c[0] },
  { nodes: ["start", "s1"], edges: ["start -> s1"], caption: c[1] },
  { nodes: ["s1", "s2"], edges: ["s1 -> s2"], caption: c[2] },
  { nodes: ["s2", "s3", "ende"], edges: ["s2 -> s3", "s3 -> ende"], caption: c[3] },
  { nodes: ["start", "s1", "s2", "s3", "ende"], edges: ["start -> s1", "s1 -> s2", "s2 -> s3", "s3 -> ende"], caption: c[4] },
];

const DE = {
  start: "Start\\n3",
  s1: "Zeile 1\\n6",
  s2: "Zeile 2\\n10",
  s3: "Zeile 3\\n20",
  ende: "Zeile 4\\n21",
  e1: "verdoppeln",
  e2: "+ 4",
  e3: "verdoppeln",
  e4: "+ 1",
};

const DE_TEXT = {
  title: "Wie Zwischenschritte eine Kette bilden",
  intro: "Jede Zeile hängt an der vorigen. Mit „Weiter“ gehst du die Schritte durch, „Abspielen“ läuft von allein.",
  captions: [
    "Die Aufgabe beginnt mit der 3. Das Modell schreibt jede Zwischenzeile selbst als Text.",
    "Die erste Zeile ist 6. Sie entsteht aus der 3, und die 3 bleibt im Text stehen.",
    "Die 10 braucht die 6. Jede Zeile liest alle Zeilen davor.",
    "Die 20 und die 21 folgen. Jeder Schritt baut auf dem vorigen auf, mit einer anderen Rechnung.",
    "Erst danach beginnt die Antwort. Sie liest alle Zwischenzeilen, nicht nur die letzte.",
  ],
};

export const denkschritteKetteDe = stepperFigure({
  source,
  text: DE,
  copy: DE_TEXT,
  steps: STEPS,
  lang: "de",
  outPath: "public/bausteine/wie-ein-modell-nachdenkt/denkschritte-kette.static.svg",
  htmlPath: "public/bausteine/wie-ein-modell-nachdenkt/denkschritte-kette.html",
});

const EN = {
  start: "Start\\n3",
  s1: "Line 1\\n6",
  s2: "Line 2\\n10",
  s3: "Line 3\\n20",
  ende: "Line 4\\n21",
  e1: "double",
  e2: "+ 4",
  e3: "double",
  e4: "+ 1",
};

const EN_TEXT = {
  title: "How intermediate steps form a chain",
  intro: "Each line hangs on the one before. With “Next” you step through the steps; “Play” runs by itself.",
  captions: [
    "The task starts with 3. The model writes each intermediate line itself as text.",
    "The first line is 6. It comes from the 3, and the 3 stays in the text.",
    "The 10 needs the 6. Every line reads all the lines before it.",
    "The 20 and the 21 follow. Each step builds on the one before, with a different calculation.",
    "Only then does the answer begin. It reads all the intermediate lines, not just the last one.",
  ],
};

export const denkschritteKetteEn = stepperFigure({
  source,
  text: EN,
  copy: EN_TEXT,
  steps: STEPS,
  lang: "en",
  outPath: "public/bausteine/wie-ein-modell-nachdenkt/denkschritte-kette.en.static.svg",
  htmlPath: "public/bausteine/wie-ein-modell-nachdenkt/denkschritte-kette.en.html",
});
