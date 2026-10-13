import { block, edge } from "../d2-blocks.mjs";
import { stepperFigure } from "../stepper.mjs";

// Baustein "Vom Textfortsetzer zum Assistenten", section "Drei Schritte, die aus
// Fortsetzern Helfer machen": the three steps of post-training as a step-through
// animation on one D2 diagram. The reward model is labelled as a model, not a
// person. Two columns keep the drawing narrow enough for phones and the book
// (legibility.mjs); labels stay short for the same reason.
function source(text, profile) {
  return `
grid-rows: 3
horizontal-gap: 140
vertical-gap: 70

frage: "${text.frage}" {${block("neutral", profile)}}
modell_nach: "${text.modellNach}" {${block("amber", profile)}}
rangliste: "${text.rangliste}" {${block("neutral", profile)}}
belohnung: "${text.belohnung}" {${block("purple", profile)}}
antwort: "${text.antwort}" {${block("amber", profile)}}
gewichte: "${text.gewichte}" {${block("teal", profile)}}

frage -> modell_nach: ${edge(profile, text.toModel)}
rangliste -> belohnung: ${edge(profile, text.toReward)}
antwort -> belohnung: ${edge(profile, text.toScore)}
belohnung -> gewichte: ${edge(profile, text.toWeights)}
`;
}

const STEPS = (c) => [
  { nodes: ["frage", "modell_nach"], edges: ["frage -> modell_nach"], caption: c[0] },
  { nodes: ["rangliste", "belohnung"], edges: ["rangliste -> belohnung"], caption: c[1] },
  { nodes: ["antwort", "belohnung", "gewichte"], edges: ["antwort -> belohnung", "belohnung -> gewichte"], caption: c[2] },
];

const DE = {
  frage: "Musterantwort:\\nFrage mit guter\\nAntwort",
  modellNach: "Modell wird\\nnachtrainiert",
  rangliste: "Rangfolgen:\\nMenschen ordnen\\nmehrere Antworten",
  belohnung: "Belohnungsmodell\\nein Modell, keine\\nPerson",
  antwort: "Modell antwortet\\nauf neue Frage",
  gewichte: "Gewichte: gut\\nbewertete Antworten\\nwerden wahrscheinlicher",
  toModel: "trainiert",
  toReward: "lernt",
  toScore: "bewertet",
  toWeights: "steuert Anpassung",
};

const DE_TEXT = {
  title: "Die drei Schritte des Nachtrainings",
  intro: "Die drei Schritte nacheinander. Mit „Weiter“ gehst du Schritt für Schritt durch, „Abspielen“ läuft von allein.",
  captions: [
    "Musterantworten: Eine Beispielfrage mit einer guten Antwort trainiert das Modell weiter. Solche Antworten schreiben Menschen.",
    "Rangfolgen: Zu einer Frage gibt es mehrere Antworten, und Menschen ordnen sie. Daraus lernt das Belohnungsmodell, welche Antwort bevorzugt wird.",
    "Optimierung: Das Modell antwortet auf eine neue Frage. Das Belohnungsmodell bewertet die Antwort mit einer Zahl, und die Gewichte werden so angepasst, dass hoch bewertete Antworten wahrscheinlicher werden.",
  ],
};

const EN = {
  frage: "Sample answer:\\nquestion with a\\ngood answer",
  modellNach: "Model is\\npost-trained",
  rangliste: "Rankings:\\npeople order\\nseveral answers",
  belohnung: "Reward model\\na model, not a\\nperson",
  antwort: "Model answers\\na new question",
  gewichte: "Weights: well-rated\\nanswers become\\nmore likely",
  toModel: "trains",
  toReward: "learns",
  toScore: "rates",
  toWeights: "drives adjustment",
};

const EN_TEXT = {
  title: "The three steps of post-training",
  intro: "The three steps one after another. Use “Next” to go step by step, “Play” runs on its own.",
  captions: [
    "Sample answers: an example question with a good answer trains the model further. People write such answers.",
    "Rankings: several answers to one question exist, and people order them. The reward model learns from this which answer is preferred.",
    "Optimisation: the model answers a new question. The reward model rates the answer with a number, and the weights are adjusted so that well-rated answers become more likely.",
  ],
};

export const nachtrainingDreiSchritteDe = stepperFigure({
  source,
  text: DE,
  copy: DE_TEXT,
  steps: STEPS,
  lang: "de",
  outPath: "public/bausteine/vom-textfortsetzer-zum-assistenten/nachtraining-drei-schritte.static.svg",
  htmlPath: "public/bausteine/vom-textfortsetzer-zum-assistenten/nachtraining-drei-schritte.html",
});

export const postTrainingThreeStepsEn = stepperFigure({
  source,
  text: EN,
  copy: EN_TEXT,
  steps: STEPS,
  lang: "en",
  outPath: "public/bausteine/vom-textfortsetzer-zum-assistenten/post-training-three-steps.static.svg",
  htmlPath: "public/bausteine/vom-textfortsetzer-zum-assistenten/post-training-three-steps.html",
});
