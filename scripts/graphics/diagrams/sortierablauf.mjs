import { renderD2 } from "../d2-render.mjs";

const BOX = `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-color: "#1B1A17"
  style.font-size: 18
`;

function source({ compare, swap, repeat }) {
  return `
direction: right

vergleichen: "${compare}" {${BOX}
  style.fill: "#E8F3F1"
  style.stroke: "#0E7469"
}
tauschen: "${swap}" {${BOX}
  style.fill: "#FFF3D8"
  style.stroke: "#986816"
}
wiederholen: "${repeat}" {${BOX}
  style.fill: "#E8F3F1"
  style.stroke: "#0E7469"
}

vergleichen -> tauschen: {
  style.stroke: "#0E7469"
  style.stroke-width: 3
}
tauschen -> wiederholen: {
  style.stroke: "#0E7469"
  style.stroke-width: 3
}
wiederholen -> vergleichen: {
  style.stroke: "#0E7469"
  style.stroke-width: 3
  style.stroke-dash: 5
}
`;
}

export const sortierablaufDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/sortierablauf.svg",
  build: () => renderD2(source({ compare: "Vergleichen", swap: "bei Bedarf\\ntauschen", repeat: "Wiederholen" })),
};

export const sortFlowEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/sort-flow.svg",
  build: () => renderD2(source({ compare: "Compare", swap: "swap if\\nneeded", repeat: "Repeat" })),
};
