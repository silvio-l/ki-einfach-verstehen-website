import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground } from "../tokens.mjs";
import gpt2 from "gpt-tokenizer/encoding/r50k_base";

// Baustein "Tokenizer: Wie Text in Tokens zerfällt", section on why tokens
// are not words: three texts as the real GPT-2 tokenizer (r50k_base from
// gpt-tokenizer, the same engine the BpeDemo compares with) splits them.
// The pieces are computed at generation time, so the graphic always shows
// what the tokenizer really does; the counts in the text are the same.

const WIDTH = 720;
const HEIGHT = 300;
const FONT = "IBM Plex Sans";
const INK = "#1B1A17";
const MUTED = "#5F594D";

/** The real GPT-2 pieces of a text, the space shown as ␣. */
export function gpt2Pieces(text) {
  return gpt2.encode(text).map((id) => gpt2.decode([id]).replace(/ /g, "␣"));
}

const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;

// The brand fonts have no glyph for U+2423 (␣), so the visible-space mark is
// drawn as an open box, as in bpe-merges.mjs.
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

function chip(label, i, profile) {
  // Alternating tones mark where one token ends and the next begins.
  const role = i % 2 ? "amber" : "teal";
  const t = tone(role, profile);
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        padding: "0 9px",
        background: satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border: `1px ${t.satoriBorderStyle} ${t.stroke}`,
        borderRadius: "8px",
        fontFamily: FONT,
        fontSize: "19px",
        color: t.text,
        whiteSpace: "pre",
      },
      children: withSpaces(label, t.text, 19),
    },
  };
}

function block({ sample, note }, y, t, profile) {
  const pieces = gpt2Pieces(sample);
  const words = wordCount(sample);
  return {
    type: "div",
    props: {
      style: { position: "absolute", left: "20px", top: `${y}px`, display: "flex", flexDirection: "column", gap: "8px" },
      children: [
        text(
          [
            text(`${t.quote(sample)}${note ? ` ${note}` : ""}`, { fontWeight: 600 }),
            text(t.counts(words, pieces.length), { color: MUTED, marginLeft: "14px" }),
          ],
          { fontSize: "18px", alignItems: "baseline" },
        ),
        { type: "div", props: { style: { display: "flex", gap: "5px" }, children: pieces.map((p, i) => chip(p, i, profile)) } },
      ],
    },
  };
}

function build(t, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative" },
      children: t.samples.map((s, i) => block(s, 12 + i * 106, t, profile)),
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const SAMPLES = {
  de: [
    { sample: "Die Hauptstadt von Frankreich ist" },
    { sample: "The capital of France is", note: "(englisch)" },
    { sample: "unwahrscheinlich" },
  ],
  en: [
    { sample: "The capital of France is" },
    { sample: "Die Hauptstadt von Frankreich ist", note: "(German)" },
    { sample: "unwahrscheinlich", note: "(German: “improbable”)" },
  ],
};

const DE = {
  samples: SAMPLES.de,
  quote: (s) => `„${s}“`,
  counts: (w, n) => `${w} ${w === 1 ? "Wort" : "Wörter"} → ${n} Tokens`,
};

const EN = {
  samples: SAMPLES.en,
  quote: (s) => `“${s}”`,
  counts: (w, n) => `${w} ${w === 1 ? "word" : "words"} → ${n} tokens`,
};

export const woerterUndTokensDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/woerter-und-tokens.svg",
  build: (profile) => build(DE, profile),
};

export const wordsAndTokensEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/words-and-tokens.svg",
  build: (profile) => build(EN, profile),
};
