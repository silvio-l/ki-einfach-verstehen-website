import { block, edge, GRID_HEAD } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// How a language model turns single next-piece scores into a whole answer:
// the text so far goes in, a score list comes out, one piece is picked and
// appended, and the longer text is the next input.
function source(text, profile) {
  return `
${GRID_HEAD}

text: "${text.input}" {${block("neutral", profile)}}
modell: "${text.model}" {${block("teal", profile)}}
neu: "${text.appended}" {${block("neutral", profile)}}
auswahl: "${text.pick}" {${block("amber", profile)}}

text -> modell: ${edge(profile, text.toModel)}
modell -> auswahl: ${edge(profile, text.scores)}
auswahl -> neu: ${edge(profile, text.append)}
neu -> text: ${edge(profile, text.again)}
`;
}

const STEPS = (c) => [
  { nodes: ["text"], caption: c[0] },
  { nodes: ["text", "modell"], edges: ["text -> modell"], caption: c[1] },
  { nodes: ["modell", "auswahl"], edges: ["modell -> auswahl"], caption: c[2] },
  { nodes: ["auswahl", "neu"], edges: ["auswahl -> neu"], caption: c[3] },
  { nodes: ["neu", "text"], edges: ["neu -> text"], caption: c[4] },
];

const DE = {
  input: "bisheriger Text\\n„Die Katze sitzt“",
  model: "Modell\\nein Score für jedes\\nmögliche Textstück",
  pick: "Auswahl\\nhöchster Score: „auf“",
  appended: "neuer Text\\n„Die Katze sitzt auf“",
  toModel: "Input",
  scores: "Output: Score-Liste",
  append: "anhängen",
  again: "wird zum neuen Input",
};

const DE_TEXT = {
  title: "Wie ein Sprachmodell Text erzeugt",
  intro: "So entsteht eine Antwort Stück für Stück. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Der Input ist der bisherige Text: „Die Katze sitzt“.",
    "Das Modell rechnet mit seinen festen Parametern. Heraus kommt für jedes Textstück, das es kennt, ein Score: „auf“ 8,1, „still“ 5,4, „Regen“ −4,9 und so weiter (ausgedachte Werte).",
    "Ein eigener Auswahlschritt macht daraus ein einziges Textstück. Hier nimmt er einfach das mit dem höchsten Score: „auf“.",
    "„auf“ wird an den Text angehängt. Jetzt steht da „Die Katze sitzt auf“.",
    "Dieser längere Text ist der Input für die nächste Runde. Das geht so weiter, bis ein Stopp-Zeichen gewählt wird oder eine Längengrenze erreicht ist.",
  ],
};

const EN = {
  input: "text so far\\n“The cat sat”",
  model: "Model\\na score for every\\npossible text piece",
  pick: "Selection\\nhighest score: “on”",
  appended: "new text\\n“The cat sat on”",
  toModel: "input",
  scores: "output: score list",
  append: "append",
  again: "becomes the new input",
};

const EN_TEXT = {
  title: "How a language model produces text",
  intro: "This is how an answer is built piece by piece. Use “Next” to go step by step, “Play” runs on its own.",
  captions: [
    "The input is the text so far: “The cat sat”.",
    "The model computes with its fixed parameters. Out comes a score for every text piece it knows: “on” 8.1, “still” 5.4, “rain” −4.9 and so on (made-up values).",
    "A separate selection step turns this into a single text piece. Here it simply takes the one with the highest score: “on”.",
    "“on” is appended to the text. Now it reads “The cat sat on”.",
    "This longer text is the input for the next round. It goes on until a stop marker is chosen or a length limit is reached.",
  ],
};

export const generationLoopDe = stepperFigure({
  source,
  text: DE,
  copy: DE_TEXT,
  steps: STEPS,
  lang: "de",
  outPath: "public/bausteine/input-und-output/textschleife.static.svg",
  htmlPath: "public/bausteine/input-und-output/textschleife.html",
});

export const generationLoopEn = stepperFigure({
  source,
  text: EN,
  copy: EN_TEXT,
  steps: STEPS,
  lang: "en",
  outPath: "public/bausteine/input-und-output/generation-loop.static.svg",
  htmlPath: "public/bausteine/input-und-output/generation-loop.html",
});
