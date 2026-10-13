import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Vom Chatbot zum Agenten", section "Wer darf das Lager öffnen?":
// who runs a tool call. Upper row: a tool of the app on the reader's computer,
// behind a permission check. Lower row: a tool of the provider. Both return text.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 300;
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
        width: "184px",
        height: "100px",
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
      style: { display: "flex", alignItems: "center", justifyContent: "center", width: "34px", fontFamily: "IBM Plex Sans", fontSize: "26px", color: tone("teal", profile).stroke },
      children: "→",
    },
  };
}

function row(top, items, profile) {
  const children = [];
  items.forEach((it, i) => {
    if (i > 0) children.push(arrow(profile));
    children.push(box({ ...it, profile }));
  });
  return {
    type: "div",
    props: {
      style: abs({ left: "22px", right: "22px", top: `${top}px`, height: "100px", alignItems: "center", justifyContent: "center" }),
      children,
    },
  };
}

const TEXT_DE = {
  frame: "Wer führt aus? Der Ort des Werkzeugs entscheidet",
  upper: [
    { title: "App", sub: "auf deinem Rechner", role: "teal" },
    { title: "Berechtigung", sub: "Regel der App", role: "amber" },
    { title: "Ergebnis", sub: "als Text im Verlauf", role: "neutral" },
  ],
  lower: [
    { title: "Anbieter", sub: "führt aus", role: "teal" },
    { title: "Du siehst", sub: "nur das Ergebnis", role: "neutral" },
    { title: "Ergebnis", sub: "als Text im Verlauf", role: "neutral" },
  ],
  legend: "Oben: Werkzeug der App. Unten: Werkzeug des Anbieters.",
};

const TEXT_EN = {
  frame: "Who runs it? Where the tool runs decides",
  upper: [
    { title: "App", sub: "on your computer", role: "teal" },
    { title: "Permission", sub: "rule of the app", role: "amber" },
    { title: "Result", sub: "as text in the history", role: "neutral" },
  ],
  lower: [
    { title: "Provider", sub: "runs it", role: "teal" },
    { title: "You see", sub: "only the result", role: "neutral" },
    { title: "Result", sub: "as text in the history", role: "neutral" },
  ],
  legend: "Top: a tool of the app. Bottom: a tool of the provider.",
};

function build(profile, t = TEXT_DE) {
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
        row(44, t.upper, profile),
        row(166, t.lower, profile),
        {
          type: "div",
          props: { style: abs({ left: "24px", right: "24px", bottom: "10px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }), children: t.legend },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const werFuehrtAusDe = {
  outPath: "public/bausteine/vom-chatbot-zum-agenten/wer-fuehrt-aus.svg",
  build: (profile) => build(profile),
};

export const whoRunsItEn = {
  outPath: "public/bausteine/vom-chatbot-zum-agenten/who-runs-it.svg",
  build: (profile) => build(profile, TEXT_EN),
};
