import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

const WIDTH = 720;
const HEIGHT = 220;

function bar({ width, role, profile, bordered = false }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: `${width}px`,
        height: "32px",
        background: satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border: bordered ? satoriBorder(role, profile, { width: 1 }) : "none",
        borderRadius: "9px",
      },
      children: [],
    },
  };
}

function sourceCard({ title, nextPieceCaption, profile }) {
  const tealText = tone("teal", profile).text;
  const amberText = tone("amber", profile).text;
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
        background: satoriBackground("neutral", profile),
        border: `2px solid ${tealText}`,
        borderRadius: "18px",
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "17px", color: tealText }, children: title } },
        bar({ width: 214, role: "teal", profile }),
        {
          type: "div",
          props: {
            style: { display: "flex", gap: "8px" },
            children: [bar({ width: 166, role: "teal", profile }), bar({ width: 40, role: "amber", profile, bordered: true })],
          },
        },
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "13px", color: amberText, textAlign: "center" }, children: nextPieceCaption } },
      ],
    },
  };
}

function labeledValue({ label, valueWidth, role, profile }) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", gap: "12px" },
      children: [
        { type: "div", props: { style: { display: "flex", width: "60px", fontFamily: "IBM Plex Sans", fontSize: "16px", color: "#1B1A17" }, children: label } },
        bar({ width: valueWidth, role, profile }),
      ],
    },
  };
}

function sampleCard({ title, inputLabel, labelLabel, profile }) {
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
        border: satoriBorder("teal", profile, { width: 2 }),
        borderRadius: "18px",
      },
      children: [
        { type: "div", props: { style: { display: "flex", justifyContent: "center", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "17px", color: tone("teal", profile).text }, children: title } },
        labeledValue({ label: inputLabel, valueWidth: 166, role: "teal", profile }),
        labeledValue({ label: labelLabel, valueWidth: 88, role: "amber", profile }),
      ],
    },
  };
}

function arrow(profile) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", justifyContent: "center", color: tone("teal", profile).stroke, fontSize: "26px", padding: "0 12px" },
      children: "→",
    },
  };
}

function build({ excerptTitle, nextPieceCaption, sampleTitle, inputLabel, labelLabel }, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center" },
      children: [
        sourceCard({ title: excerptTitle, nextPieceCaption, profile }),
        arrow(profile),
        sampleCard({ title: sampleTitle, inputLabel, labelLabel, profile }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const conceptTrainingSamplesDe = {
  outPath: "public/bausteine/input-und-output/uebungsbeispiel.svg",
  build: (profile) =>
    build(
      {
        excerptTitle: "Textausschnitt",
        nextPieceCaption: "nächstes Textstück",
        sampleTitle: "Übungsbeispiel",
        inputLabel: "Input",
        labelLabel: "Label",
      },
      profile,
    ),
};

export const conceptTrainingSamplesEn = {
  outPath: "public/bausteine/input-und-output/training-sample.svg",
  build: (profile) =>
    build(
      {
        excerptTitle: "Text excerpt",
        nextPieceCaption: "next text piece",
        sampleTitle: "Practice sample",
        inputLabel: "Input",
        labelLabel: "Label",
      },
      profile,
    ),
};
