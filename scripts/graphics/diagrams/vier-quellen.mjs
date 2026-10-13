import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Was ein Chatbot in einem Gespräch weiß", section "Vier Quellen, ein
// Kontextfenster". The weights stay outside the context window and shape every
// answer; context, tool results and saved notes arrive as text and sit on the
// desk (the context window) until the conversation drops them.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 290;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

function box({ title, sub, role, profile, left, top, width, height }) {
  return {
    type: "div",
    props: {
      style: abs({
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "6px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "12px",
        textAlign: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: tone(role, profile).text,
      }),
      children: [
        { type: "div", props: { style: { display: "flex", fontWeight: 700, lineHeight: 1.15 }, children: title } },
        { type: "div", props: { style: { display: "flex", lineHeight: 1.15 }, children: sub } },
      ],
    },
  };
}

function arrow(profile, top) {
  return {
    type: "div",
    props: {
      style: abs({
        left: "462px",
        top: `${top}px`,
        width: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: "26px",
        color: tone("teal", profile).stroke,
      }),
      children: "→",
    },
  };
}

function build({ frame, weights, sources, window: win }, profile) {
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
            style: abs({ left: "24px", top: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: frame,
          },
        },
        box({ ...weights, role: "neutral", profile, left: 20, top: 88, width: 170, height: 124 }),
        {
          type: "div",
          props: {
            style: abs({
              left: "210px",
              top: "50px",
              width: "0px",
              height: "220px",
              borderLeft: `2px dashed ${tone("neutral", profile).stroke}`,
            }),
            children: "",
          },
        },
        box({ ...sources[0], role: "teal", profile, left: 228, top: 52, width: 232, height: 62 }),
        box({ ...sources[1], role: "teal", profile, left: 228, top: 130, width: 232, height: 62 }),
        box({ ...sources[2], role: "teal", profile, left: 228, top: 208, width: 232, height: 62 }),
        arrow(profile, 126),
        box({ ...win, role: "amber", profile, left: 500, top: 88, width: 200, height: 124 }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const vierQuellenDe = {
  outPath: "public/bausteine/was-ein-chatbot-im-gespraech-weiss/vier-quellen.svg",
  build: (profile) =>
    build(
      {
        frame: "Vier Quellen, ein Kontextfenster",
        weights: { title: "Gewichte", sub: "Regler im Modell" },
        sources: [
          { title: "Kontext", sub: "Vorgaben, Verlauf" },
          { title: "Werkzeug", sub: "Suche, Ergebnis als Text" },
          { title: "Gespeicherte Notiz", sub: "geholt, dann als Text" },
        ],
        window: { title: "Kontextfenster", sub: "was gerade vorliegt" },
      },
      profile,
    ),
};

export const fourSourcesEn = {
  outPath: "public/bausteine/was-ein-chatbot-im-gespraech-weiss/four-sources.svg",
  build: (profile) =>
    build(
      {
        frame: "Four sources, one context window",
        weights: { title: "Weights", sub: "settings of the model" },
        sources: [
          { title: "Context", sub: "instructions, history" },
          { title: "Tool", sub: "search, result as text" },
          { title: "Saved note", sub: "fetched, then as text" },
        ],
        window: { title: "Context window", sub: "what is present now" },
      },
      profile,
    ),
};
