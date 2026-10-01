import { renderSvg } from "../satori-render.mjs";
import { tone as roleTone, satoriBackground } from "../tokens.mjs";

const WIDTH = 640;
const HEIGHT = 360;


// A visible-space mark (the "␣" open-box shape), drawn as a bordered box
// because the brand fonts have no glyph for U+2423.
function withSpaceMark(text, color, size) {
  if (!text.startsWith("␣")) return text;
  const mark = {
    type: "div",
    props: {
      style: { display: "flex", width: `${Math.round(size * 0.5)}px`, height: `${Math.round(size * 0.3)}px`, marginRight: "3px", marginTop: `${Math.round(size * 0.35)}px`, borderLeft: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` },
      children: [],
    },
  };
  return { type: "div", props: { style: { display: "flex", alignItems: "center" }, children: [mark, { type: "div", props: { style: { display: "flex" }, children: text.slice(1) } }] } };
}

function card({ word, id, tone, profile }) {
  const isWhite = tone === "white";
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "166px",
        height: "78px",
        padding: "0 18px",
        borderRadius: "12px",
        background: isWhite ? "#FFFFFF" : satoriBackground("amber", profile, { fillKey: "fillStrong" }),
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "25px", color: "#1B1A17" }, children: withSpaceMark(word, "#1B1A17", 25) } },
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontSize: "20px", color: isWhite ? roleTone("teal", profile).text : roleTone("amber", profile).text }, children: id } },
      ],
    },
  };
}

function build(cards, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center", background: satoriBackground("teal", profile, { fillKey: "fillStrong" }), borderRadius: "28px" },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "20px", padding: "32px", background: roleTone("teal", profile).text, borderRadius: "24px" },
            children: [
              ...[cards.slice(0, 3), cards.slice(3)].map((row) => ({
                type: "div",
                props: { style: { display: "flex", gap: "20px" }, children: row.map((c) => card({ ...c, profile })) },
              })),
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
  build: (profile) =>
    build(
      [
        { word: "Die", id: "417", tone: "white" },
        { word: "␣Kat", id: "82", tone: "amber" },
        { word: "ze", id: "903", tone: "amber" },
        { word: "␣sitzt", id: "771", tone: "white" },
        { word: ".", id: "13", tone: "white" },
      ],
      profile,
    ),
};

export const conceptVocabularyCardsEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/vocabulary-cards.svg",
  build: (profile) =>
    build(
      [
        { word: "The", id: "417", tone: "white" },
        { word: "␣cat", id: "82", tone: "amber" },
        { word: "s", id: "903", tone: "amber" },
        { word: "␣sit", id: "771", tone: "white" },
        { word: ".", id: "13", tone: "white" },
      ],
      profile,
    ),
};
