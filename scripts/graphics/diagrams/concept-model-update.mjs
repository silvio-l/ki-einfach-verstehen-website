import { renderD2 } from "../d2-render.mjs";
import { tone, d2Style, d2EdgeStyle } from "../tokens.mjs";

// The neutral box keeps the near-black body-text color (matching every
// other neutral D2 box in this generator, e.g. sortierablauf.mjs's BOX)
// instead of tone("neutral", profile).text -- an intentional, pre-existing
// asymmetry this migration preserves rather than "fixes".
const NEUTRAL_FONT_COLOR = "#1B1A17";

function block(role, profile, { fontColor } = {}) {
  const t = tone(role, profile);
  return `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 17
  style.font-color: "${fontColor ?? t.text}"
  style.fill: "${t.fill}"
  style.stroke: "${t.stroke}"${t.d2Pattern ? `\n  style.fill-pattern: "${t.d2Pattern}"` : ""}${t.strokeDash ? `\n  style.stroke-dash: ${t.strokeDash}` : ""}`;
}

function source({ promptChange, thisConversation, retrain, newVersion }, profile) {
  const amber = block("amber", profile);
  const neutral = block("neutral", profile, { fontColor: NEUTRAL_FONT_COLOR });
  const petrol = block("teal", profile);
  const violet = block("purple", profile);
  return `
wrap: "" {
  grid-rows: 2
  grid-columns: 2
  grid-gap: 32
  style.stroke: transparent
  style.fill: transparent

  a: "${promptChange}" {${amber}}
  b: "${thisConversation}" {${neutral}}
  c: "${retrain}" {${petrol}}
  d: "${newVersion}" {${violet}}

  a -> b: {
${d2EdgeStyle("teal", profile)}
    style.stroke-width: 3
  }
  c -> d: {
${d2EdgeStyle("teal", profile)}
    style.stroke-width: 3
  }
}
`;
}

export const conceptModelUpdateDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/prompt-vs-training.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          promptChange: "Prompt ändern",
          thisConversation: "dieses Gespräch",
          retrain: "neu trainieren",
          newVersion: "neue Modellversion",
        },
        profile,
      ),
    ),
};

export const conceptModelUpdateEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/prompt-vs-training-en.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          promptChange: "Change prompt",
          thisConversation: "this conversation",
          retrain: "retrain",
          newVersion: "new model version",
        },
        profile,
      ),
    ),
};
