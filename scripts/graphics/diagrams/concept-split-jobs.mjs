import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

const WIDTH = 720;
const HEIGHT = 220;

// A lighter mid-tone than `accent`, used only for this thin progress bar --
// unchanged hex in color (matches what this file hardcoded before), a
// distinct gray per role in grayscale (reuses the same well-separated
// lightness steps as tokens.mjs's `accent`, so a teal bar and a purple bar
// next to each other stay distinguishable without relying on hue).
function barColorFor(role, profile) {
  if (profile === "color") return role === "teal" ? "#7DC6B6" : "#B9AED6";
  return tone(role, profile).accent;
}

function row({ left, center, right, role, profile, labelColor }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        padding: "18px 24px",
        background: satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border: satoriBorder(role, profile, { width: 2 }),
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
        { type: "div", props: { style: { display: "flex", width: "100%", height: "5px", borderRadius: "3px", background: barColorFor(role, profile) }, children: [] } },
      ],
    },
  };
}

function build({ tokenizerLabel, textIds, splitsAndNumbers, modelLabel, predicts, learnsPatterns }, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" },
      children: [
        row({ left: tokenizerLabel, center: textIds, right: splitsAndNumbers, role: "teal", profile, labelColor: tone("teal", profile).text }),
        row({ left: modelLabel, center: predicts, right: learnsPatterns, role: "purple", profile, labelColor: tone("purple", profile).text }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const conceptSplitJobsDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/aufgabenteilung.svg",
  build: (profile) =>
    build(
      {
        tokenizerLabel: "Tokenizer",
        textIds: "Text ↔ IDs",
        splitsAndNumbers: "zerlegt und nummeriert",
        modelLabel: "Modell",
        predicts: "sagt nächste ID voraus",
        learnsPatterns: "lernt Muster",
      },
      profile,
    ),
};

export const conceptSplitJobsEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/split-jobs.svg",
  build: (profile) =>
    build(
      {
        tokenizerLabel: "Tokenizer",
        textIds: "Text ↔ IDs",
        splitsAndNumbers: "splits and numbers",
        modelLabel: "Model",
        predicts: "predicts the next ID",
        learnsPatterns: "learns patterns",
      },
      profile,
    ),
};
