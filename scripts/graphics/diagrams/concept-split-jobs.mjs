import { renderSvg } from "../satori-render.mjs";

const WIDTH = 720;
const HEIGHT = 220;

function row({ left, center, right, fill, stroke, labelColor, barColor }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        padding: "18px 24px",
        background: fill,
        border: `2px solid ${stroke}`,
        borderRadius: "18px",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", width: "100%", alignItems: "baseline", justifyContent: "space-between", fontFamily: "IBM Plex Sans" },
            children: [
              { type: "div", props: { style: { display: "flex", fontWeight: 600, fontSize: "18px", color: labelColor }, children: left } },
              { type: "div", props: { style: { display: "flex", fontWeight: 600, fontSize: "18px", color: labelColor }, children: center } },
              { type: "div", props: { style: { display: "flex", fontSize: "16px", color: "#1B1A17" }, children: right } },
            ],
          },
        },
        { type: "div", props: { style: { display: "flex", width: "100%", height: "5px", borderRadius: "3px", background: barColor }, children: [] } },
      ],
    },
  };
}

function build({ tokenizerLabel, textIds, splitsAndNumbers, modelLabel, predicts, learnsPatterns }) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" },
      children: [
        row({ left: tokenizerLabel, center: textIds, right: splitsAndNumbers, fill: "#D7ECE7", stroke: "#0E7469", labelColor: "#0A5148", barColor: "#7DC6B6" }),
        row({ left: modelLabel, center: predicts, right: learnsPatterns, fill: "#E8E5F4", stroke: "#5E4B8B", labelColor: "#49386F", barColor: "#B9AED6" }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const conceptSplitJobsDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/aufgabenteilung.svg",
  build: () =>
    build({
      tokenizerLabel: "Tokenizer",
      textIds: "Text ↔ IDs",
      splitsAndNumbers: "zerlegt und nummeriert",
      modelLabel: "Modell",
      predicts: "sagt nächste ID voraus",
      learnsPatterns: "lernt Muster",
    }),
};

export const conceptSplitJobsEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/split-jobs.svg",
  build: () =>
    build({
      tokenizerLabel: "Tokenizer",
      textIds: "Text ↔ IDs",
      splitsAndNumbers: "splits and numbers",
      modelLabel: "Model",
      predicts: "predicts the next ID",
      learnsPatterns: "learns patterns",
    }),
};
