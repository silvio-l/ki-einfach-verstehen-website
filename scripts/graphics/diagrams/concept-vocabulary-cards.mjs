import { renderSvg } from "../satori-render.mjs";

const WIDTH = 640;
const HEIGHT = 360;

function card({ word, id, tone }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "196px",
        height: "78px",
        padding: "0 24px",
        borderRadius: "12px",
        background: tone === "white" ? "#FFFFFF" : "#FBF2E0",
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "25px", color: "#1B1A17" }, children: word } },
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontSize: "20px", color: tone === "white" ? "#0A5148" : "#62430E" }, children: id } },
      ],
    },
  };
}

function build(cards) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center", background: "#D7ECE7", borderRadius: "28px" },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "20px", padding: "32px", background: "#0A5148", borderRadius: "24px" },
            children: [
              { type: "div", props: { style: { display: "flex", gap: "20px" }, children: [card(cards[0]), card(cards[1])] } },
              { type: "div", props: { style: { display: "flex", gap: "20px" }, children: [card(cards[2]), card(cards[3])] } },
            ],
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const conceptVocabularyCardsDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/vokabular-kartei.svg",
  build: () =>
    build([
      { word: "Die", id: "417", tone: "white" },
      { word: " Kat", id: "82", tone: "amber" },
      { word: "ze", id: "903", tone: "amber" },
      { word: ".", id: "13", tone: "white" },
    ]),
};

export const conceptVocabularyCardsEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/vocabulary-cards.svg",
  build: () =>
    build([
      { word: "The", id: "417", tone: "white" },
      { word: " cat", id: "82", tone: "amber" },
      { word: "s", id: "903", tone: "amber" },
      { word: ".", id: "13", tone: "white" },
    ]),
};
