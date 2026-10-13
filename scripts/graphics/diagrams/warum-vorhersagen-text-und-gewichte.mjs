import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder, printLine } from "../tokens.mjs";

// Baustein warum-vorhersagen-mehr-ist-als-nachplappern (Themenbereich 4, Nr. 1),
// diagram D1: size comparison of the weights and the training text. Sources:
// Qwen3 Technical Report (about 36 trillion tokens for the whole Qwen3 family)
// and the model card of Qwen3-0.6B (0.6 billion parameters including the
// embedding, 2 bytes each in BF16); the published
// model.safetensors file holds about 751 million BF16 numbers, about 1.5 GB. The ratio is an order of
// magnitude, not a measurement for the smallest model.

const FONT = "IBM Plex Sans";
const W = 720;
const H = 296;

const WEIGHT_BOX = { left: 16, top: 56, width: 330, height: 124 };
const TEXT_BOX = { left: 374, top: 56, width: 330, height: 124 };

// One text line; `size`/`weight` override the default 18px regular.
function line(content, { size = 18, weight = 400, mt = 0, color, justify = "flex-start" } = {}) {
  return {
    type: "div",
    props: {
      style: { display: "flex", justifyContent: justify, fontFamily: FONT, fontSize: `${size}px`, fontWeight: weight, marginTop: `${mt}px`, color },
      children: content,
    },
  };
}

// A bordered, filled box with the tone of `role`; `lines` are line() elements.
function box(profile, role, geo, lines) {
  const t = tone(role, profile);
  return {
    type: "div",
    props: {
      style: abs({
        left: `${geo.left}px`,
        top: `${geo.top}px`,
        width: `${geo.width}px`,
        height: `${geo.height}px`,
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "14px",
        paddingRight: "14px",
        borderRadius: "12px",
        background: satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border: satoriBorder(role, profile),
        color: t.text,
      }),
      children: lines,
    },
  };
}

// Free text placed on the canvas, one line element per entry.
function place(lines, left, top, width, { justify = "flex-start", color } = {}) {
  return {
    type: "div",
    props: {
      style: abs({ left: `${left}px`, top: `${top}px`, width: `${width}px`, flexDirection: "column" }),
      children: lines.map((content) => line(content, { justify, color })),
    },
  };
}

function build(l, profile) {
  const ink = tone("neutral", profile);
  const tree = {
    type: "div",
    props: {
      style: { width: `${W}px`, height: `${H}px`, display: "flex", position: "relative" },
      children: [
        box(profile, "amber", WEIGHT_BOX, [
          line(l.weightTitle, { size: 22, weight: 700 }),
          line(l.weightSize, { size: 19, mt: 4 }),
          line(l.weightBytes, { size: 19 }),
        ]),
        box(profile, "teal", TEXT_BOX, [
          line(l.textTitle, { size: 22, weight: 700 }),
          line(l.tokens, { size: 19, mt: 4 }),
          line(l.textBytes, { size: 19 }),
        ]),
        place([l.ratio], 16, 200, 688, { justify: "center" }),
        place([l.footer1, l.footer2], 16, 226, 688),
        place([l.source], 16, 270, 688, { color: ink.text }),
      ],
    },
  };
  return renderSvg(tree, W, H);
}

const DE = {
  weightTitle: "Gewichte",
  weightSize: "0,6 Milliarden Parameter",
  weightBytes: "Datei: 750 Mio. Zahlen, 1,5 GB",
  textTitle: "Trainingsdaten (Text)",
  tokens: "36 Billionen Tokens",
  textBytes: "mindestens 36.000 Gigabyte",
  ratio: "mindestens rund 24.000-mal so groß wie die Datei",
  footer1: "Der Text wird in der Regel nicht als Kopie in die Gewichte geschrieben.",
  footer2: "Größenordnung; nicht für das kleinste Modell gemessen.",
  source: "Quelle: Qwen3-Technical-Report (Familie); Hugging Face, Qwen3-0.6B",
};

const EN = {
  weightTitle: "Weights",
  weightSize: "0.6 billion parameters",
  weightBytes: "File: 750 million numbers, 1.5 GB",
  textTitle: "Training data (text)",
  tokens: "36 trillion tokens",
  textBytes: "at least 36,000 gigabytes",
  ratio: "at least roughly 24,000 times the size of the file",
  footer1: "The text is usually not written into the weights as a copy.",
  footer2: "An order of magnitude; not measured for the smallest model.",
  source: "Source: Qwen3 Technical Report (family); Hugging Face, Qwen3-0.6B",
};

export const textUndGewichteDe = {
  outPath: "public/bausteine/warum-vorhersagen-mehr-ist-als-nachplappern/neu-a-text-und-gewichte.svg",
  build: (profile) => build(DE, profile),
};

export const textUndGewichteEn = {
  outPath: "public/bausteine/warum-vorhersagen-mehr-ist-als-nachplappern/neu-a-text-and-weights.svg",
  build: (profile) => build(EN, profile),
};
