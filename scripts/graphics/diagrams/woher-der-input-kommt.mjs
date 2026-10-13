import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Vom Textfortsetzer zum Assistenten", section "Das Datum steht im Text,
// nicht im Modell": four stations from the app to the model. One arrow means
// "is passed on". The dashed frame marks the limit of the picture: there is no
// separate channel for the instructions, everything is one sequence.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 200;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

function box({ title, sub, role, profile }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        width: "146px",
        height: "112px",
        padding: "6px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "12px",
        textAlign: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: tone(role, profile).text,
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontWeight: 700, lineHeight: 1.15 }, children: title } },
        { type: "div", props: { style: { display: "flex", lineHeight: 1.15 }, children: sub } },
      ],
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
        width: "28px",
        fontFamily: "IBM Plex Sans",
        fontSize: "26px",
        color: tone("teal", profile).stroke,
      },
      children: "→",
    },
  };
}

function build({ frame, stations, legend }, profile) {
  const tree = {
    type: "div",
    props: {
      style: {
        position: "relative",
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: "flex",
        background: "#FFFFFF",
      },
      children: [
        {
          type: "div",
          props: {
            style: abs({
              left: "8px",
              top: "8px",
              right: "8px",
              bottom: "8px",
              border: `2px dashed ${tone("neutral", profile).stroke}`,
              borderRadius: "14px",
            }),
            children: "",
          },
        },
        {
          type: "div",
          props: {
            style: abs({ left: "24px", top: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: frame,
          },
        },
        {
          type: "div",
          props: {
            style: abs({ left: "22px", right: "22px", top: "44px", height: "112px", alignItems: "center", justifyContent: "center" }),
            children: [
              box({ ...stations[0], role: "neutral", profile }),
              arrow(profile),
              box({ ...stations[1], role: "teal", profile }),
              arrow(profile),
              box({ ...stations[2], role: "teal", profile }),
              arrow(profile),
              box({ ...stations[3], role: "amber", profile }),
            ],
          },
        },
        {
          type: "div",
          props: {
            style: abs({ left: "24px", bottom: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: legend,
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const woherDerInputKommtDe = {
  outPath: "public/bausteine/vom-textfortsetzer-zum-assistenten/woher-der-input-kommt.svg",
  build: (profile) =>
    build(
      {
        frame: "Ein Eingang: keine getrennte Leitung für Vorgaben",
        stations: [
          { title: "App", sub: "Vorgaben und Datum als Text" },
          { title: "Chat-Vorlage", sub: "Marken um jede Nachricht" },
          { title: "Folge aus Tokens", sub: "eine einzige Folge" },
          { title: "Modell", sub: "setzt die Folge fort" },
        ],
        legend: "→ wird weitergegeben",
      },
      profile,
    ),
};

export const whereTheInputComesFromEn = {
  outPath: "public/bausteine/vom-textfortsetzer-zum-assistenten/where-the-input-comes-from.svg",
  build: (profile) =>
    build(
      {
        frame: "One input: no separate channel for instructions",
        stations: [
          { title: "App", sub: "instructions and date as text" },
          { title: "Chat template", sub: "role markers around each message" },
          { title: "Token sequence", sub: "one single sequence" },
          { title: "Model", sub: "continues the sequence" },
        ],
        legend: "→ is passed on",
      },
      profile,
    ),
};
