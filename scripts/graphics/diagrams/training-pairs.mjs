import { renderD2 } from "../d2-render.mjs";
import { block } from "../d2-blocks.mjs";
import { tone } from "../tokens.mjs";

// One ordinary sentence yields several training examples for a language
// model: every prefix is an input, the piece that really follows is its label.
function source({ headInput, headLabel, pairs }, profile) {
  const head = `{
  shape: text
  style.font-size: 15
  style.bold: true
  style.font-color: "${tone("neutral", profile).text}"
}`;
  const rows = pairs
    .map(([input, label], i) => `in${i}: "${input}" {${block("neutral", profile)}}\nlab${i}: "${label}" {${block("amber", profile)}}`)
    .join("\n");
  return `
grid-rows: ${pairs.length + 1}
grid-columns: 2
horizontal-gap: 40
vertical-gap: 16

hin: "${headInput}" ${head}
hlab: "${headLabel}" ${head}
${rows}
`;
}

export const trainingPairsDe = {
  outPath: "public/bausteine/input-und-output/uebungspaare.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          headInput: "Input: bisheriger Text",
          headLabel: "Label: was wirklich folgt",
          pairs: [
            ["Die Katze sitzt", "auf"],
            ["Die Katze sitzt auf", "dem"],
            ["Die Katze sitzt auf dem", "Sofa"],
          ],
        },
        profile,
      ),
    ),
};

export const trainingPairsEn = {
  outPath: "public/bausteine/input-und-output/training-pairs.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          headInput: "input: text so far",
          headLabel: "label: what really follows",
          pairs: [
            ["The cat sat", "on"],
            ["The cat sat on", "the"],
            ["The cat sat on the", "sofa"],
          ],
        },
        profile,
      ),
    ),
};
