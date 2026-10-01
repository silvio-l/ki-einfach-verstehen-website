import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground } from "../tokens.mjs";

const WIDTH = 720;
const HEIGHT = 250;

function styles(profile) {
  const amber = tone("amber", profile);
  const teal = tone("teal", profile);
  const word = { fill: satoriBackground("amber", profile, { fillKey: "fillStrong" }), stroke: amber.stroke, borderStyle: amber.satoriBorderStyle, color: amber.text };
  const piece = { fill: satoriBackground("teal", profile, { fillKey: "fillStrong" }), stroke: teal.stroke, borderStyle: teal.satoriBorderStyle, color: teal.text };
  // Chars deliberately reuse the piece fill with no border -- the
  // border's presence/absence is the shape signal that already tells
  // "pieces" and "chars" apart, independent of the profile.
  const char = { fill: piece.fill, stroke: "none", color: teal.text };
  return { word, piece, char };
}

function chip(text, { fill, stroke, borderStyle = "solid", color }, { minWidth, width, fontSize = 19 } = {}) {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "48px",
    background: fill,
    border: stroke === "none" ? "none" : `1px ${borderStyle} ${stroke}`,
    borderRadius: stroke === "none" ? "8px" : "10px",
    fontFamily: "IBM Plex Sans",
    fontSize: `${fontSize}px`,
    color,
  };
  if (width) {
    style.width = `${width}px`;
  } else {
    if (minWidth) style.minWidth = `${minWidth}px`;
    style.padding = "0 20px";
  }
  return { type: "div", props: { style, children: text } };
}

function row(labelText, chips, y, gap = 8) {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: `${gap}px`,
        left: "20px",
        top: `${y}px`,
        height: "48px",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", width: "150px", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "18px", color: "#1B1A17" },
            children: labelText,
          },
        },
        ...chips,
      ],
    },
  };
}

function build({ rowLabels, wholeWord, pieces, chars }, profile) {
  const s = styles(profile);
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative" },
      children: [
        row(rowLabels[0], [chip(wholeWord, s.word, { minWidth: 250 })], 14),
        row(rowLabels[1], pieces.map((p, i) => chip(p, i === 0 ? s.piece : s.word, { minWidth: 100 })), 92),
        row(rowLabels[2], chars.map((c) => chip(c, s.char, { width: 44, fontSize: 18 })), 170, 6),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const granularitaetDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/granularitaet.svg",
  build: (profile) =>
    build(
      {
        rowLabels: ["Ganzes Wort", "Wortstücke", "Zeichen"],
        wholeWord: "Lernmodell",
        pieces: ["Lern", "modell"],
        chars: [..."Lernmodell"],
      },
      profile,
    ),
};

export const granularityEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/granularity.svg",
  build: (profile) =>
    build(
      {
        rowLabels: ["Whole word", "Word pieces", "Characters"],
        wholeWord: "learning",
        pieces: ["learn", "ing"],
        chars: [..."learning"],
      },
      profile,
    ),
};
