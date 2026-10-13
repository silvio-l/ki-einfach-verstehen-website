import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Trainingsdaten: Urheberrecht und Datenschutz", section "Was im Modell
// bleibt". A chain, not a measurement: a text that appears often moves the
// settings so that a continuation fits the original. At 720 units wide the
// smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 200;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

function box({ left, role, profile, text }) {
  return {
    type: "div",
    props: {
      style: abs({
        left: `${left}px`,
        top: "40px",
        width: "200px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        textAlign: "center",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "10px",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: tone(role, profile).text,
      }),
      children: text,
    },
  };
}

function arrow(left, profile) {
  return {
    type: "div",
    props: {
      style: abs({ left: `${left}px`, top: "88px", width: "40px", height: "2px", background: tone("neutral", profile).stroke }),
      children: "",
    },
  };
}

const COPY = {
  de: {
    intro: "Ein Text, der oft vorkommt",
    teal: "Text oft im Training",
    amber: "Stellungen passen zum Original",
    neutral: "Fortsetzung wörtlich möglich",
    footer: "Eine Kette, keine Messung. Keine Textdatei im Modell.",
  },
  en: {
    intro: "A text that appears often",
    teal: "Text often in training",
    amber: "Settings fit the original",
    neutral: "Verbatim continuation possible",
    footer: "A chain, not a measurement. No text file in the model.",
  },
};

function build(profile, lang = "de") {
  const c = COPY[lang];
  const tree = {
    type: "div",
    props: {
      style: { position: "relative", width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", background: "#FFFFFF" },
      children: [
        {
          type: "div",
          props: {
            style: abs({ left: "24px", top: "10px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: c.intro,
          },
        },
        box({ left: 20, role: "teal", profile, text: c.teal }),
        arrow(220, profile),
        box({ left: 260, role: "amber", profile, text: c.amber }),
        arrow(460, profile),
        box({ left: 500, role: "neutral", profile, text: c.neutral }),
        {
          type: "div",
          props: {
            style: abs({ left: "24px", bottom: "12px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: c.footer,
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const memorierungStellungenDe = {
  outPath: "public/bausteine/trainingsdaten-urheberrecht-und-datenschutz/memorierung-stellungen.svg",
  build: (profile) => build(profile, "de"),
};

export const memorizationStatesEn = {
  outPath: "public/bausteine/trainingsdaten-urheberrecht-und-datenschutz/memorization-states.svg",
  build: (profile) => build(profile, "en"),
};
