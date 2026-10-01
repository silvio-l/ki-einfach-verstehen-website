import { block, edge, GRID_HEAD } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// One pass of the training loop for the word-weight spam filter: example in,
// filter answers, the training algorithm compares with the label, nudges the
// weights, next example. The same D2 source renders the static figure (book)
// and both layouts of the step-through animation (website).
function source(text, profile) {
  return `
${GRID_HEAD}

beispiel: "${text.example}" {${block("neutral", profile)}}
filter: "${text.filter}" {${block("teal", profile)}}
gewichte: "${text.weights}" {${block("amber", profile)}}
algo: "${text.algo}" {${block("purple", profile)}}

beispiel -> filter: ${edge(profile, text.mail)}
filter -> algo: ${edge(profile, text.answer)}
beispiel -> algo: ${edge(profile, text.label, { dashed: true })}
algo -> gewichte: ${edge(profile, text.nudge)}
gewichte -> beispiel: ${edge(profile, text.next)}
`;
}

const STEPS = (c) => [
  { nodes: ["beispiel"], caption: c[0] },
  { nodes: ["beispiel", "filter"], edges: ["beispiel -> filter"], caption: c[1] },
  { nodes: ["filter", "algo"], edges: ["filter -> algo", "beispiel -> algo"], caption: c[2] },
  { nodes: ["algo", "gewichte"], edges: ["algo -> gewichte"], caption: c[3] },
  { nodes: ["gewichte", "beispiel"], edges: ["gewichte -> beispiel"], caption: c[4] },
];

const DE = {
  example: "Trainingsbeispiel\\n„Gratis: Dein\\nGewinn wartet“\\nmarkiert als Spam",
  filter: "Filter rechnet\\n0 + 0 = 0 → kein Spam",
  algo: "Trainings-\\nalgorithmus\\nvergleicht mit\\nder Markierung",
  weights: "Gewichte\\ngratis 0 → 0,1\\nGewinn 0 → 0,1",
  mail: "Mail",
  answer: "Antwort: kein Spam",
  label: "markiert: Spam",
  nudge: "nachstellen",
  next: "nächstes Beispiel",
};

const DE_TEXT = {
  title: "Trainingsschleife eines Spamfilters",
  intro: "Eine Runde der Trainingsschleife. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Ein Trainingsbeispiel kommt herein: die Mail „Gratis: Dein Gewinn wartet“. Ein Mensch hat sie vorher als Spam markiert.",
    "Der Filter rechnet mit seinen aktuellen Gewichten. Noch stehen alle auf null: 0 + 0 = 0, also lässt er die Mail durch.",
    "Der Trainingsalgorithmus vergleicht die Antwort mit der Markierung. Der Filter sagt „kein Spam“, die Markierung sagt „Spam“: falsch.",
    "Deshalb schiebt der Trainingsalgorithmus die Gewichte der beteiligten Wörter ein kleines Stück nach oben: „gratis“ und „Gewinn“ stehen jetzt auf 0,1.",
    "Dann kommt das nächste Beispiel, und alles beginnt von vorn. Nach Tausenden Runden stehen die Gewichte dort, wo sie zu allen Beispielen zusammen passen.",
  ],
};

const EN = {
  example: "Training example\\n“Free: your prize\\nis waiting”\\nmarked as spam",
  filter: "Filter computes\\n0 + 0 = 0 → not spam",
  algo: "Training\\nalgorithm\\ncompares with\\nthe marking",
  weights: "Weights\\nfree 0 → 0.1\\nprize 0 → 0.1",
  mail: "mail",
  answer: "answer: not spam",
  label: "marked: spam",
  nudge: "adjust",
  next: "next example",
};

const EN_TEXT = {
  title: "Training loop of a spam filter",
  intro: "One round of the training loop. Use “Next” to go step by step, “Play” runs on its own.",
  captions: [
    "A training example comes in: the mail “Free: your prize is waiting”. A person marked it as spam beforehand.",
    "The filter computes with its current weights. They are all still zero: 0 + 0 = 0, so it lets the mail through.",
    "The training algorithm compares the answer with the marking. The filter says “not spam”, the marking says “spam”: wrong.",
    "So the training algorithm nudges the weights of the words involved up a little: “free” and “prize” are now at 0.1.",
    "Then the next example comes in and everything starts again. After thousands of rounds, the weights settle where they fit all the examples together.",
  ],
};

export const trainingLoopDe = stepperFigure({
  source,
  text: DE,
  copy: DE_TEXT,
  steps: STEPS,
  lang: "de",
  outPath: "public/bausteine/programm-algorithmus-modell/trainingsschleife.static.svg",
  htmlPath: "public/bausteine/programm-algorithmus-modell/trainingsschleife.html",
});

export const trainingLoopEn = stepperFigure({
  source,
  text: EN,
  copy: EN_TEXT,
  steps: STEPS,
  lang: "en",
  outPath: "public/bausteine/programm-algorithmus-modell/training-loop.static.svg",
  htmlPath: "public/bausteine/programm-algorithmus-modell/training-loop.html",
});
