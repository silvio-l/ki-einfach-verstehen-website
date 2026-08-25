import { renderD2 } from "../d2-render.mjs";
import { tone } from "../tokens.mjs";

const BOX = `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-color: "#1B1A17"
  style.font-size: 18
`;

function shapeStyle(role, profile) {
  const t = tone(role, profile);
  const lines = [`  style.fill: "${t.fill}"`, `  style.stroke: "${t.stroke}"`];
  if (t.d2Pattern) lines.push(`  style.fill-pattern: "${t.d2Pattern}"`);
  if (t.strokeDash) lines.push(`  style.stroke-dash: ${t.strokeDash}`);
  return lines.join("\n");
}

// The loop-back edge is dashed in both profiles -- it already encodes
// "this edge closes the cycle" via line style, independent of color.
function edgeStyle(role, profile, { dash } = {}) {
  const t = tone(role, profile);
  const lines = [`  style.stroke: "${t.stroke}"`, `  style.stroke-width: 3`];
  const effectiveDash = t.strokeDash || dash;
  if (effectiveDash) lines.push(`  style.stroke-dash: ${effectiveDash}`);
  return lines.join("\n");
}

function source({ compare, swap, repeat }, profile) {
  return `
direction: right

vergleichen: "${compare}" {${BOX}
${shapeStyle("teal", profile)}
}
tauschen: "${swap}" {${BOX}
${shapeStyle("amber", profile)}
}
wiederholen: "${repeat}" {${BOX}
${shapeStyle("teal", profile)}
}

vergleichen -> tauschen: {
${edgeStyle("teal", profile)}
}
tauschen -> wiederholen: {
${edgeStyle("teal", profile)}
}
wiederholen -> vergleichen: {
${edgeStyle("teal", profile, { dash: 5 })}
}
`;
}

export const sortierablaufDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/sortierablauf.svg",
  build: (profile) => renderD2(source({ compare: "Vergleichen", swap: "bei Bedarf\\ntauschen", repeat: "Wiederholen" }, profile)),
};

export const sortFlowEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/sort-flow.svg",
  build: (profile) => renderD2(source({ compare: "Compare", swap: "swap if\\nneeded", repeat: "Repeat" }, profile)),
};
