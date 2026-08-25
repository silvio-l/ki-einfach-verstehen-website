import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

const WIDTH = 720;
const HEIGHT = 220;

function card({ label, value, role, profile, labelColor, width }) {
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
        background: satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border: satoriBorder(role, profile, { width: 2 }),
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

function arrow(profile) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", justifyContent: "center", color: tone("teal", profile).stroke, fontSize: "26px", padding: "0 12px" },
      children: "→",
    },
  };
}

function badge(text, profile) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        position: "absolute",
        top: "0px",
        left: "50%",
        transform: "translateX(-50%)",
        background: tone("teal", profile).text,
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

function build({ tokenizerLabel, tokenizerValue, modelLabel, modelValue, sharedVocab }, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative", flexDirection: "column", alignItems: "center", justifyContent: "center" },
      children: [
        badge(sharedVocab, profile),
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", marginTop: "24px" },
            children: [
              card({ label: tokenizerLabel, value: tokenizerValue, role: "teal", profile, labelColor: tone("teal", profile).text, width: 280 }),
              arrow(profile),
              card({ label: modelLabel, value: modelValue, role: "purple", profile, labelColor: tone("purple", profile).text, width: 300 }),
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
  build: (profile) =>
    build(
      {
        tokenizerLabel: "Tokenizer",
        tokenizerValue: "417 = „Die“",
        modelLabel: "Modell",
        modelValue: "417 = gelernter Vektor",
        sharedVocab: "gemeinsames Vokabular",
      },
      profile,
    ),
};

export const conceptFixedPairEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/fixed-tokenizer.svg",
  build: (profile) =>
    build(
      {
        tokenizerLabel: "Tokenizer",
        tokenizerValue: '417 = "The"',
        modelLabel: "Model",
        modelValue: "417 = learned vector",
        sharedVocab: "shared vocabulary",
      },
      profile,
    ),
};
