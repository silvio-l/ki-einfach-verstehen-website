import { renderSvg, abs } from "../satori-render.mjs";
import { tone } from "../tokens.mjs";

// Grundlagen-Baustein 7 (modellgroesse-und-hardware).
//
// 1. Quantisation: the same made-up number 0.8137 kept with 16, 8 and 4 bits.
//    Simplified on purpose (marked in the caption): the allowed values are
//    spread evenly between 0 and 1. 16 bits give 65,536 values (rounds to
//    0.8137), 8 bits 256 (207/255 ≈ 0.812), 4 bits 16 (12/15 = 0.8).
// 2. Training memory per parameter after ZeRO (arXiv 1910.02054): 2 bytes
//    weight + 2 bytes gradient + 4 bytes 32-bit copy + 2 × 4 bytes Adam
//    values = 16 bytes, against 2 bytes when only using the model.

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "17px", color: INK, ...style }, children: content } };
}

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function box(style) {
  return { type: "div", props: { style: { display: "flex", ...abs(style) }, children: "" } };
}

// ---------------------------------------------------------------------------
// 1. Quantisation

const Q_W = 640;
const Q_H = 300;
const LINE_X = 160;
const LINE_W = 360;
const ROWS_Y = [44, 128, 212];
const SAMPLE = 0.8137;

const nearest = (bits) => {
  const steps = 2 ** bits - 1;
  return Math.round(SAMPLE * steps) / steps;
};

async function buildQuantisation(l, profile) {
  const ink = tone("neutral", profile);
  const children = [];
  const rows = [
    { bits: 16, role: "teal" },
    { bits: 8, role: "teal" },
    { bits: 4, role: "amber" },
  ];
  rows.forEach(({ bits, role }, i) => {
    const y = ROWS_Y[i];
    const t = tone(role, profile);
    children.push(at({ left: "0px", top: `${y - 8}px`, width: `${LINE_X - 16}px`, flexDirection: "column", alignItems: "flex-end", children: [text(l.bits(bits), { fontWeight: 700 }), text(l.values(bits), { color: ink.text })] }));
    // the number line with one tick per allowed value (16 bits: too dense to draw, a solid band)
    children.push(box({ left: `${LINE_X}px`, top: `${y + 12}px`, width: `${LINE_W}px`, height: "2px", background: ink.stroke }));
    if (bits === 16) {
      children.push(box({ left: `${LINE_X}px`, top: `${y + 4}px`, width: `${LINE_W}px`, height: "18px", background: t.fillStrong, border: `1px solid ${t.stroke}` }));
    } else {
      // drawn as vector lines: satori rounds div positions, which makes a dense comb uneven
      const n = 2 ** bits;
      const lines = [];
      for (let k = 0; k < n; k++) {
        const x = (k / (n - 1)) * LINE_W + 1;
        lines.push({ type: "line", props: { x1: x, y1: 0, x2: x, y2: 18, stroke: t.stroke, strokeWidth: bits === 8 ? 0.7 : 2 } });
      }
      children.push({ type: "svg", props: { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${LINE_W + 2} 18`, width: LINE_W + 2, height: 18, style: { position: "absolute", left: LINE_X - 1, top: y + 4 }, children: lines } });
    }
    // where 0.8137 lands
    const kept = nearest(bits);
    const x = LINE_X + kept * LINE_W;
    children.push(box({ left: `${x - 7}px`, top: `${y + 6}px`, width: "14px", height: "14px", borderRadius: "7px", background: t.accent, border: `2px solid ${INK}` }));
    children.push(at({ left: `${x - 40}px`, top: `${y - 22}px`, width: "80px", justifyContent: "center", children: [text(l.kept(kept, bits), { fontWeight: 700, color: t.text })] }));
    children.push(at({ left: `${LINE_X + LINE_W + 22}px`, top: `${y + 2}px`, children: [text(l.bytes(bits), { fontWeight: 700 })] }));
  });
  const lastY = ROWS_Y[ROWS_Y.length - 1];
  children.push(at({ left: `${LINE_X - 4}px`, top: `${lastY + 28}px`, children: [text("0", { color: ink.text })] }));
  children.push(at({ left: `${LINE_X + LINE_W - 4}px`, top: `${lastY + 28}px`, children: [text("1", { color: ink.text })] }));
  children.push(at({ left: `${LINE_X + LINE_W + 22}px`, top: "4px", children: [text(l.perNumber, { color: ink.text })] }));
  const tree = { type: "div", props: { style: { width: `${Q_W}px`, height: `${Q_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, Q_W, Q_H);
}

const deNum = (n) => n.toLocaleString("de-DE");
const enNum = (n) => n.toLocaleString("en-US");

export const quantisationDe = {
  outPath: "public/bausteine/modellgroesse-und-hardware/quantisierung.svg",
  build: (profile) =>
    buildQuantisation(
      {
        bits: (b) => `${b} Bit`,
        values: (b) => `${deNum(2 ** b)} Werte`,
        kept: (v, b) => (b === 16 ? "0,8137" : b === 8 ? "0,812" : String(v).replace(".", ",")),
        bytes: (b) => (b === 4 ? "½ Byte" : `${b / 8} Byte`),
        perNumber: "pro Zahl",
      },
      profile,
    ),
};

export const quantisationEn = {
  outPath: "public/bausteine/modellgroesse-und-hardware/quantization.svg",
  build: (profile) =>
    buildQuantisation(
      {
        bits: (b) => `${b} bits`,
        values: (b) => `${enNum(2 ** b)} values`,
        kept: (v, b) => (b === 16 ? "0.8137" : b === 8 ? "0.812" : String(v)),
        bytes: (b) => (b === 4 ? "½ byte" : b === 8 ? "1 byte" : `${b / 8} bytes`),
        perNumber: "per number",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. Training memory per parameter

const T_W = 640;
const T_H = 280;
const CELL = 27;
const BAR_X = 116;
const ROW_USE = 40;
const ROW_TRAIN = 140;

async function buildTrainingMemory(l, profile) {
  const ink = tone("neutral", profile);
  const groups = [
    { bytes: 2, role: "teal", label: l.weight, above: false },
    { bytes: 2, role: "amber", label: l.correction, above: true },
    { bytes: 4, role: "purple", label: l.copy, above: false },
    { bytes: 8, role: "neutral", label: l.helpers, above: false },
  ];
  const cells = (y, list) => {
    const out = [];
    let x = BAR_X;
    for (const g of list) {
      const t = tone(g.role, profile);
      for (let k = 0; k < g.bytes; k++) {
        out.push(box({ left: `${x + 1}px`, top: `${y}px`, width: `${CELL - 2}px`, height: `${CELL}px`, background: t.fillStrong, border: `2px solid ${t.stroke}`, borderRadius: "3px" }));
        x += CELL;
      }
    }
    return out;
  };
  const children = [];
  children.push(at({ left: "0px", top: `${ROW_USE - 2}px`, width: `${BAR_X - 14}px`, flexDirection: "column", alignItems: "flex-end", children: [text(l.use, { fontWeight: 700, color: tone("teal", profile).text })] }));
  children.push(...cells(ROW_USE, [groups[0]]));
  children.push(at({ left: `${BAR_X + 2 * CELL + 14}px`, top: `${ROW_USE + 2}px`, children: [text(l.useBytes, { fontWeight: 700 })] }));
  children.push(at({ left: "0px", top: `${ROW_TRAIN - 2}px`, width: `${BAR_X - 14}px`, flexDirection: "column", alignItems: "flex-end", children: [text(l.train, { fontWeight: 700, color: tone("amber", profile).text })] }));
  children.push(...cells(ROW_TRAIN, groups));
  children.push(at({ left: `${BAR_X + 16 * CELL + 14}px`, top: `${ROW_TRAIN + 2}px`, children: [text(l.trainBytes, { fontWeight: 700 })] }));
  let x = BAR_X;
  for (const g of groups) {
    const w = g.bytes * CELL;
    const t = tone(g.role, profile);
    children.push(at({ left: `${x - 30}px`, top: g.above ? `${ROW_TRAIN - 28}px` : `${ROW_TRAIN + CELL + 8}px`, width: `${w + 60}px`, justifyContent: "center", children: [text(g.label, { color: t.text, fontWeight: 600, textAlign: "center" })] }));
    x += w;
  }
  children.push(box({ left: `${BAR_X}px`, top: `${ROW_TRAIN + CELL + 40}px`, width: `${16 * CELL}px`, height: "1px", background: ink.stroke }));
  children.push(at({ left: `${BAR_X}px`, top: `${ROW_TRAIN + CELL + 52}px`, width: `${T_W - BAR_X}px`, children: [text(l.example, { color: ink.text })] }));
  const tree = { type: "div", props: { style: { width: `${T_W}px`, height: `${T_H}px`, display: "flex", position: "relative" }, children } };
  return renderSvg(tree, T_W, T_H);
}

export const trainingMemoryDe = {
  outPath: "public/bausteine/modellgroesse-und-hardware/trainingsspeicher.svg",
  build: (profile) =>
    buildTrainingMemory(
      {
        use: "Benutzen",
        train: "Training",
        useBytes: "2 Byte",
        trainBytes: "16 Byte",
        weight: "Zahl",
        correction: "Steigung",
        copy: "genauere Kopie",
        helpers: "zwei Hilfswerte",
        example: "Llama 3.1 8B: 16 GB beim Benutzen, rund 128 GB im Training",
      },
      profile,
    ),
};

export const trainingMemoryEn = {
  outPath: "public/bausteine/modellgroesse-und-hardware/training-memory.svg",
  build: (profile) =>
    buildTrainingMemory(
      {
        use: "Using",
        train: "Training",
        useBytes: "2 bytes",
        trainBytes: "16 bytes",
        weight: "Number",
        correction: "Slope",
        copy: "more precise copy",
        helpers: "two helper values",
        example: "Llama 3.1 8B: 16 GB when used, about 128 GB in training",
      },
      profile,
    ),
};
