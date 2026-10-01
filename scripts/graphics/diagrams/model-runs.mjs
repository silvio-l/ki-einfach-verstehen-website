import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein 6 (Parameter, Training und Inferenz, Hardware). Sizes follow the
// rule of thumb "billions of parameters x 2 bytes = gigabytes" (Hugging Face
// LLM optimization guide); parameter counts from the GPT-2/GPT-3 papers and
// the Llama 3.1 model card. Checked with python3, see the Baustein's Lernplan.

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "16px", color: INK, ...style }, children: content } };
}

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function card(role, profile, style, children) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "10px",
        padding: "12px 14px",
        gap: "6px",
        ...style,
      },
      children,
    },
  };
}

// ---------------------------------------------------------------------------
// 1. A downloaded model = small blueprint + huge block of numbers
//    (Abschnitt "Was in einer Modelldatei steckt")

const MF_W = 600;
const MF_H = 260;
// Fixed pseudo-random digits so every build renders the same block.
const NUMBERS = ["0,12", "−0,87", "0,03", "1,41", "−0,25", "0,66", "−1,02", "0,19", "0,74", "−0,08", "0,31", "−0,53"];

async function buildModelFile(l, profile) {
  const muted = tone("neutral", profile).text;
  const numberRows = [0, 1, 2, 3].map((r) => ({
    type: "div",
    props: {
      style: { display: "flex", gap: "12px" },
      children: [0, 1, 2].map((c) => text(l.num(NUMBERS[(r * 3 + c) % NUMBERS.length]), { fontSize: "15px", color: tone("amber", profile).text, width: "62px", justifyContent: "flex-end" })),
    },
  }));
  const tree = {
    type: "div",
    props: {
      style: { width: `${MF_W}px`, height: `${MF_H}px`, display: "flex", alignItems: "center", justifyContent: "center", gap: "26px" },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "8px", width: "196px" },
            children: [
              card("teal", profile, {}, [
                text(l.planTitle, { fontWeight: 700, color: tone("teal", profile).text }),
                ...l.planLines.map((line) => text(line, { fontSize: "15px" })),
              ]),
              text(l.planSize, { fontSize: "15px", color: muted }),
            ],
          },
        },
        text("+", { fontSize: "30px", color: muted }),
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "8px", width: "300px" },
            children: [
              card("amber", profile, { padding: "14px 18px", gap: "8px" }, [
                text(l.numbersTitle, { fontWeight: 700, color: tone("amber", profile).text }),
                ...numberRows,
                text("…", { fontSize: "18px", color: tone("amber", profile).text }),
              ]),
              text(l.numbersSize, { fontSize: "15px", color: muted }),
            ],
          },
        },
      ],
    },
  };
  return renderSvg(tree, MF_W, MF_H);
}

export const modelFileDe = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/modelldatei.svg",
  build: (profile) =>
    buildModelFile(
      {
        planTitle: "Bauplan",
        planLines: ["Vokabular: … Einträge", "Rechenstufen: …", "Zahlen pro Token: …"],
        planSize: "Architektur, unter 1 Kilobyte",
        numbersTitle: "Parameter",
        numbersSize: "rund 8 Milliarden Zahlen, rund 16 Gigabyte",
        num: (n) => n,
      },
      profile,
    ),
};

export const modelFileEn = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/model-file.svg",
  build: (profile) =>
    buildModelFile(
      {
        planTitle: "Blueprint",
        planLines: ["Vocabulary: … entries", "Computing stages: …", "Numbers per token: …"],
        planSize: "architecture, under 1 kilobyte",
        numbersTitle: "Parameters",
        numbersSize: "about 8 billion numbers, about 16 gigabytes",
        num: (n) => n.replace(",", "."),
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. Memory with 2 bytes per parameter (Abschnitt "Milliarden Regler")

const MS_W = 600;
const MS_H = 300;
const LABEL_W = 160;
const BAR_X = 172;
const BAR_MAX = 320; // px for the largest value (810 GB)
const ROW0 = 34;
const ROW_STEP = 54;

async function buildModelSizes(l, profile) {
  const max = Math.max(...l.rows.map((r) => r[2]));
  const children = [];
  l.rows.forEach(([name, params, gb, role], i) => {
    const y = ROW0 + i * ROW_STEP;
    const w = Math.max(3, Math.round((gb / max) * BAR_MAX));
    children.push(
      at({
        left: "0px",
        top: `${y - 4}px`,
        width: `${LABEL_W}px`,
        flexDirection: "column",
        alignItems: "flex-end",
        children: [text(name, { fontWeight: 700, fontSize: "15px" }), text(params, { fontSize: "15px", color: tone("neutral", profile).text })],
      }),
    );
    children.push(at({ left: `${BAR_X}px`, top: `${y}px`, children: [{ type: "div", props: { style: { display: "flex", width: `${w}px`, height: "22px", background: tone(role, profile).accent, borderRadius: "3px" }, children: "" } }] }));
    children.push(at({ left: `${BAR_X + w + 8}px`, top: `${y}px`, children: [text(l.gb(gb), { fontWeight: 700 })] }));
  });
  const tree = { type: "div", props: { style: { width: `${MS_W}px`, height: `${MS_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, MS_W, MS_H);
}

const SIZE_ROWS = (b) => [
  ["GPT-2", `1,5 ${b}`, 3, "neutral"],
  ["Llama 3.1 8B", `8 ${b}`, 16, "teal"],
  ["Llama 3.1 70B", `70 ${b}`, 140, "teal"],
  ["GPT-3", `175 ${b}`, 350, "neutral"],
  ["Llama 3.1 405B", `405 ${b}`, 810, "teal"],
];

export const modelSizesDe = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/modellgroessen.svg",
  build: (profile) => buildModelSizes({ rows: SIZE_ROWS("Mrd. Parameter"), gb: (n) => `${n} GB` }, profile),
};

export const modelSizesEn = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/model-sizes.svg",
  build: (profile) =>
    buildModelSizes({ rows: SIZE_ROWS("bn parameters").map(([n, p, g, r]) => [n, p.replace(",", "."), g, r]), gb: (n) => `${n} GB` }, profile),
};

// ---------------------------------------------------------------------------
// 3. Training loop vs. inference (Abschnitt "Lernen kostet mehr als Benutzen")

const TI_W = 600;
const TI_H = 320;

function step(label, role, profile, width = 150) {
  return card(role, profile, { width: `${width}px`, alignItems: "center", padding: "10px 8px" }, [text(label, { fontSize: "15px", fontWeight: 600, textAlign: "center", justifyContent: "center" })]);
}

function arrow(char, profile) {
  return text(char, { fontSize: "24px", color: tone("neutral", profile).stroke });
}

async function buildTrainingInference(l, profile) {
  const muted = tone("neutral", profile).text;
  const tree = {
    type: "div",
    props: {
      style: { width: `${TI_W}px`, height: `${TI_H}px`, display: "flex", flexDirection: "column", gap: "14px", padding: "10px 4px" },
      children: [
        text(l.trainTitle, { fontWeight: 700, color: tone("amber", profile).text }),
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: "10px" },
            children: [step(l.compute, "neutral", profile), arrow("→", profile), step(l.compare, "amber", profile), arrow("→", profile), step(l.adjust, "amber", profile)],
          },
        },
        text(l.loop, { fontSize: "15px", color: muted }),
        { type: "div", props: { style: { display: "flex", height: "1px", background: "#D8D3C6", margin: "4px 0" }, children: "" } },
        text(l.inferTitle, { fontWeight: 700, color: tone("teal", profile).text }),
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: "10px" },
            children: [step(l.input, "neutral", profile), arrow("→", profile), step(l.computeFixed, "teal", profile), arrow("→", profile), step(l.output, "neutral", profile)],
          },
        },
        text(l.inferNote, { fontSize: "15px", color: muted }),
      ],
    },
  };
  return renderSvg(tree, TI_W, TI_H);
}

export const trainingInferenceDe = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/training-inferenz.svg",
  build: (profile) =>
    buildTrainingInference(
      {
        trainTitle: "Training",
        compute: "Rechnen",
        compare: "Vergleichen mit dem richtigen Textstück",
        adjust: "Alle Parameter nachstellen",
        loop: "… und wieder von vorn, Billionen Tokens lang",
        inferTitle: "Inferenz",
        input: "Input",
        computeFixed: "Rechnen mit festen Parametern",
        output: "Score-Liste",
        inferNote: "Kein Vergleich, kein Nachstellen",
      },
      profile,
    ),
};

export const trainingInferenceEn = {
  outPath: "public/bausteine/parameter-training-inferenz-hardware/training-inference.svg",
  build: (profile) =>
    buildTrainingInference(
      {
        trainTitle: "Training",
        compute: "Compute",
        compare: "Compare with the correct piece",
        adjust: "Adjust all parameters",
        loop: "… and again from the start, for trillions of tokens",
        inferTitle: "Inference",
        input: "Input",
        computeFixed: "Compute with fixed parameters",
        output: "Score list",
        inferNote: "No comparing, no adjusting",
      },
      profile,
    ),
};
