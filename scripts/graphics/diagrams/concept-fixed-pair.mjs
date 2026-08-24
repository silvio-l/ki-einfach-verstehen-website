import { renderSvg } from "../satori-render.mjs";

const WIDTH = 720;
const HEIGHT = 220;

function card({ label, value, fill, stroke, labelColor, width }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        width: `${width}px`,
        padding: "18px",
        background: fill,
        border: `2px solid ${stroke}`,
        borderRadius: "18px",
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontWeight: 600, fontSize: "18px", color: labelColor }, children: label } },
        {
          type: "div",
          props: {
            style: { display: "flex", width: "100%", height: "56px", alignItems: "center", justifyContent: "center", background: "#FFFFFF", borderRadius: "12px", fontFamily: "IBM Plex Sans", fontSize: "16px", color: "#1B1A17" },
            children: value,
          },
        },
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

function badge(text) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        position: "absolute",
        top: "0px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0A5148",
        color: "#FFFFFF",
        fontFamily: "IBM Plex Sans",
        fontWeight: 600,
        fontSize: "14px",
        padding: "8px 20px",
        borderRadius: "19px",
      },
      children: text,
    },
  };
}

function build({ tokenizerLabel, tokenizerValue, modelLabel, modelValue, sharedVocab }) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative", flexDirection: "column", alignItems: "center", justifyContent: "center" },
      children: [
        badge(sharedVocab),
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", marginTop: "24px" },
            children: [
              card({ label: tokenizerLabel, value: tokenizerValue, fill: "#D7ECE7", stroke: "#0E7469", labelColor: "#0A5148", width: 280 }),
              arrow(),
              card({ label: modelLabel, value: modelValue, fill: "#E8E5F4", stroke: "#5E4B8B", labelColor: "#49386F", width: 300 }),
            ],
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const conceptFixedPairDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/fester-tokenizer.svg",
  build: () =>
    build({
      tokenizerLabel: "Tokenizer",
      tokenizerValue: "417 = „Die“",
      modelLabel: "Modell",
      modelValue: "417 = gelernter Vektor",
      sharedVocab: "gemeinsames Vokabular",
    }),
};

export const conceptFixedPairEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/fixed-tokenizer.svg",
  build: () =>
    build({
      tokenizerLabel: "Tokenizer",
      tokenizerValue: '417 = "The"',
      modelLabel: "Model",
      modelValue: "417 = learned vector",
      sharedVocab: "shared vocabulary",
    }),
};
