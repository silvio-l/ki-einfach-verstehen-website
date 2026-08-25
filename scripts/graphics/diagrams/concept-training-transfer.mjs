import { renderD2 } from "../d2-render.mjs";
import { tone, d2Style, d2EdgeStyle } from "../tokens.mjs";

function source({ examples, training, model, caption }, profile) {
  return `
direction: right

beispiele: "${examples}" {
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 18
${d2Style("amber", profile)}
}
training: "${training}" {
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 44
  style.font-size: 18
${d2Style("teal", profile)}
}
modell: "${model}" {
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 18
${d2Style("purple", profile)}
}
hinweis: "${caption}" {
  shape: text
  style.font-color: "${tone("neutral", profile).text}"
  style.font-size: 14
  style.italic: true
}
hinweis.near: bottom-center

beispiele -> training: {
${d2EdgeStyle("teal", profile)}
  style.stroke-width: 3
}
training -> modell: {
${d2EdgeStyle("teal", profile)}
  style.stroke-width: 3
}
`;
}

export const conceptTrainingTransferDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/beispiele-training-modell.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          examples: "Beispiele",
          training: "Training",
          model: "Modell",
          caption: "gelernt statt aufgeschrieben",
        },
        profile,
      ),
    ),
};

export const conceptTrainingTransferEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/examples-training-model.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          examples: "Examples",
          training: "Training",
          model: "Model",
          caption: "learned instead of written",
        },
        profile,
      ),
    ),
};
