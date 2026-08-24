import { renderSvg } from "../satori-render.mjs";

const WIDTH = 620;
const HEIGHT = 160;

function box({ lines, fill, stroke }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "18px 22px",
        background: fill,
        border: `2px solid ${stroke}`,
        borderRadius: "12px",
        minWidth: "150px",
      },
      children: lines.map((line) => ({
        type: "div",
        props: {
          style: {
            display: "flex",
            fontFamily: "IBM Plex Sans",
            fontWeight: line.weight ?? 600,
            fontSize: `${line.size ?? 16}px`,
            color: line.color ?? "#1B1A17",
          },
          children: line.text,
        },
      })),
    },
  };
}

function arrow() {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0E7469",
        fontSize: "28px",
        padding: "0 14px",
      },
      children: "→",
    },
  };
}

function build({ examples, algorithm, model, fitted }) {
  const tree = {
    type: "div",
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0px",
      },
      children: [
        box({ lines: examples.map((text) => ({ text })), fill: "#F3F0E8", stroke: "#817B6D" }),
        arrow(),
        box({ lines: algorithm.map((text) => ({ text })), fill: "#E8F3F1", stroke: "#0E7469" }),
        arrow(),
        box({
          lines: [
            { text: model, weight: 600, size: 16, color: "#1B1A17" },
            { text: fitted, weight: 400, size: 13, color: "#5F594D" },
          ],
          fill: "#FFF3D8",
          stroke: "#986816",
        }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const trainingsablaufDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/trainingsablauf.svg",
  build: () =>
    build({
      examples: ["Trainings-", "beispiele"],
      algorithm: ["Trainings-", "algorithmus"],
      model: "Modell",
      fitted: "eingestellte Parameter",
    }),
};

export const trainingFlowEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/training-flow.svg",
  build: () =>
    build({
      examples: ["Training", "examples"],
      algorithm: ["Training", "algorithm"],
      model: "Model",
      fitted: "fitted parameters",
    }),
};
