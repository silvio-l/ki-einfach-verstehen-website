import { renderSvg } from "../satori-render.mjs";

const WIDTH = 720;
const HEIGHT = 270;

function textLine(text, { size, weight = 400, color, font = "IBM Plex Sans" }) {
  return {
    type: "div",
    props: {
      style: { display: "flex", fontFamily: font, fontWeight: weight, fontSize: `${size}px`, color },
      children: text,
    },
  };
}

function card({ fill, stroke, width, lines }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        width: `${width}px`,
        padding: "16px 12px",
        background: fill,
        border: `1px solid ${stroke}`,
        borderRadius: "14px",
      },
      children: lines,
    },
  };
}

function arrow() {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", justifyContent: "center", color: "#0E7469", fontSize: "26px", padding: "0 10px" },
      children: "→",
    },
  };
}

function build({ idLabel, idValue, vocabLabel, vocabValue, vocabCaption, modelLabel, vector1, vector2, modelCaption }) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center" },
      children: [
        card({
          fill: "#FBF2E0",
          stroke: "#986816",
          width: 150,
          lines: [textLine(idLabel, { size: 15, color: "#62430E" }), textLine(idValue, { size: 25, weight: 700, color: "#62430E" })],
        }),
        arrow(),
        card({
          fill: "#D7ECE7",
          stroke: "#0E7469",
          width: 180,
          lines: [
            textLine(vocabLabel, { size: 15, color: "#0A5148" }),
            textLine(vocabValue, { size: 21, weight: 700, color: "#0A5148" }),
            textLine(vocabCaption, { size: 14, color: "#0A5148" }),
          ],
        }),
        arrow(),
        card({
          fill: "#E8E5F4",
          stroke: "#5E4B8B",
          width: 142,
          lines: [
            textLine(modelLabel, { size: 15, color: "#49386F" }),
            textLine(vector1, { size: 13, color: "#49386F", font: "IBM Plex Mono" }),
            textLine(vector2, { size: 13, color: "#49386F", font: "IBM Plex Mono" }),
            textLine(modelCaption, { size: 13, color: "#49386F" }),
          ],
        }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const idPfadDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/id-pfad.svg",
  build: () =>
    build({
      idLabel: "Token-ID",
      idValue: "417",
      vocabLabel: "Vokabular",
      vocabValue: '417 ↔ „Die"',
      vocabCaption: "feste Zuordnung",
      modelLabel: "Modell",
      vector1: "[0,12; −0,7;",
      vector2: "0,03; …]",
      modelCaption: "gelernt",
    }),
};

export const idPathEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/id-path.svg",
  build: () =>
    build({
      idLabel: "Token ID",
      idValue: "417",
      vocabLabel: "Vocabulary",
      vocabValue: '417 ↔ "The"',
      vocabCaption: "fixed mapping",
      modelLabel: "Model",
      vector1: "[0.12; −0.7;",
      vector2: "0.03; …]",
      modelCaption: "learned",
    }),
};
