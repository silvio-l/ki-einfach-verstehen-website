import { renderSvg } from "../satori-render.mjs";

const WIDTH = 720;
const HEIGHT = 250;

const WORD_STYLE = { fill: "#FBF2E0", stroke: "#986816", color: "#62430E" };
const PIECE_STYLE = { fill: "#D7ECE7", stroke: "#0E7469", color: "#0A5148" };
const CHAR_STYLE = { fill: "#D7ECE7", stroke: "none", color: "#0A5148" };

function chip(text, { fill, stroke, color }, { minWidth, width, fontSize = 19 } = {}) {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "48px",
    background: fill,
    border: stroke === "none" ? "none" : `1px solid ${stroke}`,
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
            style: { display: "flex", width: "150px", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "16px", color: "#1B1A17" },
            children: labelText,
          },
        },
        ...chips,
      ],
    },
  };
}

function build({ rowLabels, wholeWord, pieces, chars }) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative" },
      children: [
        row(rowLabels[0], [chip(wholeWord, WORD_STYLE, { minWidth: 250 })], 14),
        row(rowLabels[1], pieces.map((p, i) => chip(p, i === 0 ? PIECE_STYLE : WORD_STYLE, { minWidth: 100 })), 92),
        row(rowLabels[2], chars.map((c) => chip(c, CHAR_STYLE, { width: 44, fontSize: 17 })), 170, 6),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const granularitaetDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/granularitaet.svg",
  build: () =>
    build({
      rowLabels: ["Ganzes Wort", "Wortstücke", "Zeichen"],
      wholeWord: "Lernmodell",
      pieces: ["Lern", "modell"],
      chars: [..."Lernmodell"],
    }),
};

export const granularityEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/granularity.svg",
  build: () =>
    build({
      rowLabels: ["Whole word", "Word pieces", "Characters"],
      wholeWord: "learning",
      pieces: ["learn", "ing"],
      chars: [..."learning"],
    }),
};
