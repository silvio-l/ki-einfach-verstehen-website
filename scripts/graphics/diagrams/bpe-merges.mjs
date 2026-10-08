import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground } from "../tokens.mjs";
import { BOOK_EXAMPLE, bookExampleText, createTrainer, encode, trainStep } from "../../../src/scripts/demos/bpe.js";

// Baustein "Tokenizer: Wie Text in Tokens zerfällt": how BPE learns and
// applies its merges. Top: the training loop (count pairs -> merge the most
// frequent -> repeat) and the small practice text of the Baustein text.
// Below: a new word, row by row, as the first three learned merges are
// replayed on it. Rules, counts and pieces are computed from BOOK_EXAMPLE
// in src/scripts/demos/bpe.js (recounted by bpe.test.mjs), so text and
// graphic cannot drift apart.

const WIDTH = 720;
const HEIGHT = 390;
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
        text(t.practice, { position: "absolute", left: "20px", top: "80px", fontSize: "18px", fontWeight: 600 }),
        text(t.wordHead, { position: "absolute", left: "20px", top: "116px", fontSize: "18px", color: "#5F594D" }),
        ...t.rows.map((r, i) => row(r.label, r.pieces, r.merged, 150 + i * 60, s)),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

// The rows: start from characters, then one row per learned rule with the
// piece it created highlighted.
function rowsFor(lang, label) {
  const trainer = createTrainer(bookExampleText(lang));
  for (let i = 0; i < 3; i += 1) trainStep(trainer);
  const word = BOOK_EXAMPLE[lang].newWord;
  const rows = [{ label: label.start, pieces: [...word], merged: -1 }];
  for (const { merge, pieces } of encode(word, trainer).steps) {
    rows.push({ label: label.rule(merge), pieces, merged: pieces.indexOf(merge.text) });
  }
  return rows;
}

const practiceLine = (lang, head, times) =>
  `${head} ${BOOK_EXAMPLE[lang].words.map(([w, n]) => (n > 1 ? `${w} ${n}${times}` : w)).join(", ")}`;

const DE = {
  loop: ["1  Paare zählen", "2  häufigstes verschmelzen", "3  wiederholen ↺"],
  practice: practiceLine("de", "Übungstext:", "×"),
  wordHead: `Abgespielt auf das neue Wort „${BOOK_EXAMPLE.de.newWord}“ (× = beim Lernen gezählt):`,
  rows: rowsFor("de", { start: "Start: nur Zeichen", rule: (m) => `Regel ${m.rank}: ${m.a} + ${m.b} (${m.count}×)` }),
};

const EN = {
  loop: ["1  count pairs", "2  merge the most frequent", "3  repeat ↺"],
  practice: practiceLine("en", "Practice text:", "×"),
  wordHead: `Replayed on the new word “${BOOK_EXAMPLE.en.newWord}” (× = counted while learning):`,
  rows: rowsFor("en", { start: "Start: characters only", rule: (m) => `Rule ${m.rank}: ${m.a} + ${m.b} (${m.count}×)` }),
};

export const bpeMergesDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/bpe-verschmelzen.svg",
  build: (profile) => build(DE, profile),
};

export const bpeMergesEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/bpe-merges.svg",
  build: (profile) => build(EN, profile),
};
