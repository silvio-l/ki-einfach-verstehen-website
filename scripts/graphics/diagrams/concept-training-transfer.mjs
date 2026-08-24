import { renderD2 } from "../d2-render.mjs";

function source({ examples, training, model, caption }) {
  return `
direction: right

beispiele: "${examples}" {
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-color: "#62430E"
  style.font-size: 18
  style.fill: "#FFF3D8"
  style.stroke: "#986816"
}
training: "${training}" {
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 44
  style.font-color: "#0A5148"
  style.font-size: 18
  style.fill: "#E8F3F1"
  style.stroke: "#0E7469"
}
modell: "${model}" {
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-color: "#49386F"
  style.font-size: 18
  style.fill: "#E8E5F4"
  style.stroke: "#5E4B8B"
}
hinweis: "${caption}" {
  shape: text
  style.font-color: "#5F594D"
  style.font-size: 14
  style.italic: true
}
hinweis.near: bottom-center

beispiele -> training: {
  style.stroke: "#0E7469"
  style.stroke-width: 3
}
training -> modell: {
  style.stroke: "#0E7469"
  style.stroke-width: 3
}
`;
}

export const conceptTrainingTransferDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/beispiele-training-modell.svg",
  build: () =>
    renderD2(
      source({
        examples: "Beispiele",
        training: "Training",
        model: "Modell",
        caption: "gelernt statt aufgeschrieben",
      }),
    ),
};

export const conceptTrainingTransferEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/examples-training-model.svg",
  build: () =>
    renderD2(
      source({
        examples: "Examples",
        training: "Training",
        model: "Model",
        caption: "learned instead of written",
      }),
    ),
};
