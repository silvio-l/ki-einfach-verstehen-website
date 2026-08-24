import { renderD2 } from "../d2-render.mjs";

const AMBER = `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 17
  style.font-color: "#62430E"
  style.fill: "#FFF3D8"
  style.stroke: "#986816"
`;

const NEUTRAL = `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 17
  style.font-color: "#1B1A17"
  style.fill: "#F7F5EF"
  style.stroke: "#817B6D"
`;

const PETROL = `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 17
  style.font-color: "#0A5148"
  style.fill: "#E8F3F1"
  style.stroke: "#0E7469"
`;

const VIOLET = `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 17
  style.font-color: "#49386F"
  style.fill: "#E8E5F4"
  style.stroke: "#5E4B8B"
`;

function source({ promptChange, thisConversation, retrain, newVersion }) {
  return `
wrap: "" {
  grid-rows: 2
  grid-columns: 2
  grid-gap: 32
  style.stroke: transparent
  style.fill: transparent

  a: "${promptChange}" {${AMBER}}
  b: "${thisConversation}" {${NEUTRAL}}
  c: "${retrain}" {${PETROL}}
  d: "${newVersion}" {${VIOLET}}

  a -> b: {
    style.stroke: "#0E7469"
    style.stroke-width: 3
  }
  c -> d: {
    style.stroke: "#0E7469"
    style.stroke-width: 3
  }
}
`;
}

export const conceptModelUpdateDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/prompt-vs-training.svg",
  build: () =>
    renderD2(
      source({
        promptChange: "Prompt ändern",
        thisConversation: "dieses Gespräch",
        retrain: "neu trainieren",
        newVersion: "neue Modellversion",
      }),
    ),
};

export const conceptModelUpdateEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/prompt-vs-training-en.svg",
  build: () =>
    renderD2(
      source({
        promptChange: "Change prompt",
        thisConversation: "this conversation",
        retrain: "retrain",
        newVersion: "new model version",
      }),
    ),
};
