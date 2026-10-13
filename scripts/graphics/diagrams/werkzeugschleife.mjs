import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Vom Chatbot zum Agenten", section "Der Lieferschein kommt zurück
// auf den Tisch": one loop of a tool call. The model writes the call, the
// program runs it, the result comes back as text, the model writes on.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 240;
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
      style: { display: "flex", alignItems: "center", justifyContent: "center", width: "28px", fontFamily: "IBM Plex Sans", fontSize: "26px", color: tone("teal", profile).stroke },
      children: "→",
    },
  };
}

function build({ frame, stations, legend }, profile) {
  const roles = ["neutral", "teal", "teal", "amber"];
  const children = [];
  stations.forEach((st, i) => {
    if (i > 0) children.push(arrow(profile));
    children.push(box({ ...st, role: roles[i], profile }));
  });
  const tree = {
    type: "div",
    props: {
      style: { position: "relative", width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", background: "#FFFFFF" },
      children: [
        {
          type: "div",
          props: {
            style: abs({ left: "8px", top: "8px", right: "8px", bottom: "8px", border: `2px dashed ${tone("neutral", profile).stroke}`, borderRadius: "14px" }),
            children: "",
          },
        },
        {
          type: "div",
          props: { style: abs({ left: "24px", top: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }), children: frame },
        },
        {
          type: "div",
          props: {
            style: abs({ left: "22px", right: "22px", top: "60px", height: "112px", alignItems: "center", justifyContent: "center" }),
            children,
          },
        },
        {
          type: "div",
          props: { style: abs({ left: "24px", right: "24px", bottom: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }), children: legend },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const werkzeugschleifeDe = {
  outPath: "public/bausteine/vom-chatbot-zum-agenten/werkzeugschleife.svg",
  build: (profile) =>
    build(
      {
        frame: "Die Schleife: Aufruf, Ausführung, Ergebnis als Text",
        stations: [
          { title: "Modell", sub: "schreibt den Aufruf" },
          { title: "Programm", sub: "führt auf dem Rechner aus" },
          { title: "Ergebnis", sub: "kommt als Text zurück" },
          { title: "Modell", sub: "schreibt weiter" },
        ],
        legend: "Die Schleife beginnt von vorn, solange ein Aufruf folgt.",
      },
      profile,
    ),
};

export const toolLoopEn = {
  outPath: "public/bausteine/vom-chatbot-zum-agenten/tool-loop.svg",
  build: (profile) =>
    build(
      {
        frame: "The loop: call, execution, result as text",
        stations: [
          { title: "Model", sub: "writes the call" },
          { title: "Program", sub: "runs it on the computer" },
          { title: "Result", sub: "comes back as text" },
          { title: "Model", sub: "writes on" },
        ],
        legend: "The loop starts again as long as a call follows.",
      },
      profile,
    ),
};
