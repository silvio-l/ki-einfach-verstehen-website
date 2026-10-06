import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground } from "../tokens.mjs";

// Baustein "Tokenizer, IDs, Vokabular": how BPE learns and applies its
// merges. Top: the training loop (count pairs -> merge the most frequent ->
// repeat). Below: one word of the demo's practice text, row by row, as the
// first learned merges are replayed on it. Counts are the real counts of
// the BpeDemo practice text (src/scripts/demos/bpe.js), so text, graphic and
// demo show the same numbers.

const WIDTH = 720;
const HEIGHT = 360;
const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function styles(profile) {
  const amber = tone("amber", profile);
  const teal = tone("teal", profile);
  const neutral = tone("neutral", profile);
  return {
    piece: { fill: satoriBackground("teal", profile, { fillKey: "fillStrong" }), stroke: teal.stroke, borderStyle: teal.satoriBorderStyle, color: teal.text },
    merged: { fill: satoriBackground("amber", profile, { fillKey: "fillStrong" }), stroke: amber.stroke, borderStyle: amber.satoriBorderStyle, color: amber.text, bold: true },
    step: { fill: satoriBackground("neutral", profile, { fillKey: "fillStrong" }), stroke: neutral.stroke, borderStyle: "solid", color: INK },
  };
}

// The brand fonts have no glyph for U+2423 (␣), so the visible-space mark is
// drawn as an open box, as in concept-text-to-ids.mjs.
function spaceMark(color, size) {
  return {
    type: "div",
    props: {
      style: { display: "flex", width: `${Math.round(size * 0.5)}px`, height: `${Math.round(size * 0.3)}px`, margin: `${Math.round(size * 0.35)}px 2px 0`, borderLeft: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` },
      children: [],
    },
  };
}

function withSpaces(str, color, size) {
  if (!str.includes("␣")) return str;
  const parts = [];
  str.split("␣").forEach((seg, i) => {
    if (i > 0) parts.push(spaceMark(color, size));
    if (seg) parts.push({ type: "div", props: { style: { display: "flex", whiteSpace: "pre" }, children: seg } });
  });
  return { type: "div", props: { style: { display: "flex", alignItems: "center" }, children: parts } };
}

const text = (children, style = {}) => ({
  type: "div",
  props: { style: { display: "flex", fontFamily: FONT, color: INK, ...style }, children },
});

function chip(label, s) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "44px",
        minWidth: "40px",
        padding: "0 12px",
        background: s.fill,
        border: `${s.bold ? 2 : 1}px ${s.borderStyle} ${s.stroke}`,
        borderRadius: "8px",
        fontFamily: FONT,
        fontWeight: s.bold ? 700 : 400,
        fontSize: "21px",
        color: s.color,
        whiteSpace: "pre",
      },
      children: withSpaces(label, s.color, 21),
    },
  };
}

function loopBox(label, s) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "52px",
        padding: "0 16px",
        background: s.fill,
        border: `1px solid ${s.stroke}`,
        borderRadius: "10px",
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: "18px",
        color: INK,
      },
      children: label,
    },
  };
}

function row(label, pieces, mergedIndex, y, s) {
  return {
    type: "div",
    props: {
      style: { position: "absolute", display: "flex", alignItems: "center", gap: "6px", left: "20px", top: `${y}px`, height: "44px" },
      children: [
        text(withSpaces(label, INK, 18), { width: "250px", fontSize: "18px", fontWeight: 600 }),
        ...pieces.map((p, i) => chip(p, i === mergedIndex ? s.merged : s.piece)),
      ],
    },
  };
}

function build(t, profile) {
  const s = styles(profile);
  const arrow = text("→", { fontSize: "24px", color: "#5F594D" });
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative" },
      children: [
        {
          type: "div",
          props: {
            style: { position: "absolute", left: "20px", top: "10px", display: "flex", alignItems: "center", gap: "10px" },
            children: [loopBox(t.loop[0], s.step), arrow, loopBox(t.loop[1], s.step), arrow, loopBox(t.loop[2], s.step)],
          },
        },
        text(withSpaces(t.wordHead, "#5F594D", 18), { position: "absolute", left: "20px", top: "86px", fontSize: "18px", color: "#5F594D" }),
        ...t.rows.map((r, i) => row(r.label, r.pieces, r.merged, 120 + i * 62, s)),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

const DE = {
  loop: ["1  Paare zählen", "2  häufigstes verschmelzen", "3  wiederholen ↺"],
  wordHead: "Abgespielt auf das neue Wort „␣wachen“ (× = beim Lernen gezählt):",
  rows: [
    { label: "Start: nur Zeichen", pieces: ["␣", "w", "a", "c", "h", "e", "n"], merged: -1 },
    { label: "Regel 1: e + n (35×)", pieces: ["␣", "w", "a", "c", "h", "en"], merged: 5 },
    { label: "Regel 2: c + h (22×)", pieces: ["␣", "w", "a", "ch", "en"], merged: 3 },
    { label: "Regel 3: a + ch (17×)", pieces: ["␣", "w", "ach", "en"], merged: 2 },
  ],
};

const EN = {
  loop: ["1  count pairs", "2  merge the most frequent", "3  repeat ↺"],
  wordHead: "Replayed on the new word “␣then” (× = counted while learning):",
  rows: [
    { label: "Start: characters only", pieces: ["␣", "t", "h", "e", "n"], merged: -1 },
    { label: "Rule 1: h + e (27×)", pieces: ["␣", "t", "he", "n"], merged: 2 },
    { label: "Rule 4: ␣ + t (13×)", pieces: ["␣t", "he", "n"], merged: 0 },
    { label: "Rule 8: ␣t + he (11×)", pieces: ["␣the", "n"], merged: 0 },
  ],
};

export const bpeMergesDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/bpe-verschmelzen.svg",
  build: (profile) => build(DE, profile),
};

export const bpeMergesEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/bpe-merges.svg",
  build: (profile) => build(EN, profile),
};
