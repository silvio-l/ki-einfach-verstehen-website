import { renderSvg } from "../satori-render.mjs";

const WIDTH = 720;
const HEIGHT = 220;

function bar({ width, fill, stroke }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: `${width}px`,
        height: "32px",
        background: fill,
        border: stroke ? `1px solid ${stroke}` : "none",
        borderRadius: "9px",
      },
      children: [],
    },
  };
}

function sourceCard({ title, nextPieceCaption }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        width: "270px",
        padding: "18px",
        background: "#F7F5EF",
        border: "2px solid #0A5148",
        borderRadius: "18px",
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "17px", color: "#0A5148" }, children: title } },
        bar({ width: 214, fill: "#D7ECE7" }),
        {
          type: "div",
          props: {
            style: { display: "flex", gap: "8px" },
            children: [bar({ width: 166, fill: "#D7ECE7" }), bar({ width: 40, fill: "#FBF2E0", stroke: "#986816" })],
          },
        },
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "13px", color: "#62430E", textAlign: "center" }, children: nextPieceCaption } },
      ],
    },
  };
}

function labeledValue({ label, valueWidth, fill, stroke }) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", gap: "12px" },
      children: [
        { type: "div", props: { style: { display: "flex", width: "60px", fontFamily: "IBM Plex Sans", fontSize: "16px", color: "#1B1A17" }, children: label } },
        bar({ width: valueWidth, fill, stroke }),
      ],
    },
  };
}

function sampleCard({ title, inputLabel, labelLabel }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
        padding: "18px",
        background: "#FFFFFF",
        border: "2px solid #0E7469",
        borderRadius: "18px",
      },
      children: [
        { type: "div", props: { style: { display: "flex", justifyContent: "center", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "17px", color: "#0A5148" }, children: title } },
        labeledValue({ label: inputLabel, valueWidth: 166, fill: "#D7ECE7" }),
        labeledValue({ label: labelLabel, valueWidth: 88, fill: "#FBF2E0" }),
      ],
    },
  };
}

function arrow() {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", justifyContent: "center", color: "#0E7469", fontSize: "26px", padding: "0 12px" },
      children: "→",
    },
  };
}

function build({ excerptTitle, nextPieceCaption, sampleTitle, inputLabel, labelLabel }) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center" },
      children: [sourceCard({ title: excerptTitle, nextPieceCaption }), arrow(), sampleCard({ title: sampleTitle, inputLabel, labelLabel })],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const conceptTrainingSamplesDe = {
  outPath: "public/bausteine/input-und-output/uebungsbeispiel.svg",
  build: () =>
    build({
      excerptTitle: "Textausschnitt",
      nextPieceCaption: "nächstes Textstück",
      sampleTitle: "Übungsbeispiel",
      inputLabel: "Input",
      labelLabel: "Label",
    }),
};

export const conceptTrainingSamplesEn = {
  outPath: "public/bausteine/input-und-output/training-sample.svg",
  build: () =>
    build({
      excerptTitle: "Text excerpt",
      nextPieceCaption: "next text piece",
      sampleTitle: "Practice sample",
      inputLabel: "Input",
      labelLabel: "Label",
    }),
};
