import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Vom Chatbot zum Agenten", section "Warum das Ende nichts über die
// Arbeit sagt": the loop ends when no call follows. The check is not part of it.
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
      style: { display: "flex", alignItems: "center", justifyContent: "center", width: "28px", fontFamily: "IBM Plex Sans", fontSize: "26px", color: tone("teal", profile).stroke },
      children: "→",
    },
  };
}

const TEXT_DE = {
  frame: "Das Ende ist eine Station, kein Urteil",
  legend: "Die Prüfung gehört nicht zur Schleife.",
  stations: [
    { title: "Kein Aufruf", sub: "mehr im Format", role: "neutral" },
    { title: "Schleife endet", sub: "nach dem Format", role: "teal" },
    { title: "Ergebnis liegt vor", sub: "ist noch ungeprüft", role: "teal" },
    { title: "Prüfung", sub: "Mensch oder Test", role: "amber" },
  ],
};

const TEXT_EN = {
  frame: "The end is a station, not a verdict",
  legend: "The check is not part of the loop.",
  stations: [
    { title: "No call", sub: "left in the format", role: "neutral" },
    { title: "Loop ends", sub: "with no call left", role: "teal" },
    { title: "Result in hand", sub: "still unchecked", role: "teal" },
    { title: "Check", sub: "human or test", role: "amber" },
  ],
};

function build(profile, t = TEXT_DE) {
  const stations = t.stations;
  const children = [];
  stations.forEach((st, i) => {
    if (i > 0) children.push(arrow(profile));
    children.push(box({ ...st, profile }));
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
          props: { style: abs({ left: "24px", top: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }), children: t.frame },
        },
        {
          type: "div",
          props: {
            style: abs({ left: "22px", right: "22px", top: "44px", height: "112px", alignItems: "center", justifyContent: "center" }),
            children,
          },
        },
        {
          type: "div",
          props: { style: abs({ left: "24px", bottom: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }), children: t.legend },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const stoppUndPruefenDe = {
  outPath: "public/bausteine/vom-chatbot-zum-agenten/stopp-und-pruefen.svg",
  build: (profile) => build(profile),
};

export const stopAndCheckEn = {
  outPath: "public/bausteine/vom-chatbot-zum-agenten/stop-and-check.svg",
  build: (profile) => build(profile, TEXT_EN),
};
