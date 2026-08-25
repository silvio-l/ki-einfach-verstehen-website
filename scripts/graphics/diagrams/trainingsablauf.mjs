import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

const WIDTH = 620;
const HEIGHT = 160;

function box({ lines, role, profile }) {
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
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
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

function arrow(profile) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: tone("teal", profile).stroke,
        fontSize: "28px",
        padding: "0 14px",
      },
      children: "→",
    },
  };
}

function build({ examples, algorithm, model, fitted }, profile) {
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
        box({ lines: examples.map((text) => ({ text })), role: "neutral", profile }),
        arrow(profile),
        box({ lines: algorithm.map((text) => ({ text })), role: "teal", profile }),
        arrow(profile),
        box({
          lines: [
            { text: model, weight: 600, size: 16, color: "#1B1A17" },
            { text: fitted, weight: 400, size: 13, color: tone("neutral", profile).text },
          ],
          role: "amber",
          profile,
        }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const trainingsablaufDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/trainingsablauf.svg",
  build: (profile) =>
    build(
      {
        examples: ["Trainings-", "beispiele"],
        algorithm: ["Trainings-", "algorithmus"],
        model: "Modell",
        fitted: "eingestellte Parameter",
      },
      profile,
    ),
};

export const trainingFlowEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/training-flow.svg",
  build: (profile) =>
    build(
      {
        examples: ["Training", "examples"],
        algorithm: ["Training", "algorithm"],
        model: "Model",
        fitted: "fitted parameters",
      },
      profile,
    ),
};
