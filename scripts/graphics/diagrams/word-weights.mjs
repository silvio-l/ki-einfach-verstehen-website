import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

const WIDTH = 580;
const HEIGHT = 300;
const TEXT = "#1B1A17";

function text(children, { size = 16, weight = 400, color = TEXT } = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: "IBM Plex Sans", fontSize: `${size}px`, fontWeight: weight, color }, children } };
}

function row(cells, { role, profile }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "8px 16px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "10px",
      },
      children: cells,
    },
  };
}

// A worked example of an (invented) word-weight filter: the weights of the
// words in one mail are summed and compared with a threshold.
function build({ title, mail, weights, sum, threshold, verdict }, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", gap: "14px", alignItems: "center", justifyContent: "center" },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "10px", width: "262px" },
            children: [
              text(title, { size: 15, color: tone("neutral", profile).text }),
              ...weights.map(([word, value, used]) =>
                row([text(word, { weight: used ? 600 : 400 }), text(value, { weight: used ? 600 : 400 })], { role: used ? "teal" : "neutral", profile }),
              ),
            ],
          },
        },
        text("→", { size: 28, color: tone("teal", profile).stroke }),
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "10px", width: "262px" },
            children: [
              row([text(mail, { size: 15 })], { role: "neutral", profile }),
              row([text(sum, { weight: 600 }), text(threshold, { size: 15 })], { role: "teal", profile }),
              row([text(verdict, { weight: 600 })], { role: "amber", profile }),
            ],
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const wordWeightsDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/wortgewichte.svg",
  build: (profile) =>
    build(
      {
        title: "Ausgedachte Gewichte",
        weights: [["Gewinn", "+3", true], ["gratis", "+2", false], ["Rechnung", "−2", true]],
        mail: "„Pokal-Gewinn: Rechnung für die Feier“",
        sum: "Summe: 3 − 2 = 1",
        threshold: "Schwelle: 2",
        verdict: "1 liegt unter 2: Posteingang",
      },
      profile,
    ),
};

export const wordWeightsEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/word-weights.svg",
  build: (profile) =>
    build(
      {
        title: "Made-up weights",
        weights: [["prize", "+3", true], ["free", "+2", false], ["invoice", "−2", true]],
        mail: "“Cup prize: invoice for the party”",
        sum: "Sum: 3 − 2 = 1",
        threshold: "Threshold: 2",
        verdict: "1 is below 2: inbox",
      },
      profile,
    ),
};
