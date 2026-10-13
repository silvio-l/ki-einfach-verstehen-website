import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Antworten prüfen", section "Seitwärtslesen wie Faktenchecker":
// the four SIFT steps (Caulfield, 2019), translated. Steps read left to right.
// At 720 units wide the smallest text must be 18 units (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 220;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

function step({ title, sub, role, profile }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        width: "148px",
        height: "140px",
        padding: "8px",
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
      style: { display: "flex", alignItems: "center", justifyContent: "center", width: "24px", fontFamily: "IBM Plex Sans", fontSize: "26px", color: tone("teal", profile).stroke },
      children: "→",
    },
  };
}

function build(profile, t) {
  const steps = [
    { title: t.steps[0].title, sub: t.steps[0].sub, role: "amber" },
    { title: t.steps[1].title, sub: t.steps[1].sub, role: "teal" },
    { title: t.steps[2].title, sub: t.steps[2].sub, role: "teal" },
    { title: t.steps[3].title, sub: t.steps[3].sub, role: "teal" },
  ];
  const children = [];
  steps.forEach((st, i) => {
    if (i > 0) children.push(arrow(profile));
    children.push(step({ ...st, profile }));
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
          props: { style: abs({ left: "24px", top: "16px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }), children: t.frame },
        },
        {
          type: "div",
          props: { style: abs({ left: "22px", right: "22px", top: "54px", height: "140px", alignItems: "center", justifyContent: "center" }), children },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

const TEXT_DE = {
  frame: "SIFT: vier Schritte, bevor du eine Angabe übernimmst",
  steps: [
    { title: "1 Stopp", sub: "Innehalten, bevor du weitergibst" },
    { title: "2 Quelle untersuchen", sub: "Wer steht dahinter?" },
    { title: "3 Andere Berichte", sub: "Prüft eine andere Quelle das?" },
    { title: "4 Zurück zum Ursprung", sub: "Bis zur ersten Stelle" },
  ],
};
const TEXT_EN = {
  frame: "SIFT: four steps before you take over a claim",
  steps: [
    { title: "1 Stop", sub: "Pause before you pass it on" },
    { title: "2 Investigate the source", sub: "Who stands behind it?" },
    { title: "3 Other reports", sub: "Does another source check this?" },
    { title: "4 Trace back to the origin", sub: "Back to the first place it appears" },
  ],
};

export const siftSchritteDe = {
  outPath: "public/bausteine/antworten-pruefen/sift-schritte.svg",
  build: (profile) => build(profile, TEXT_DE),
};

export const siftSchritteEn = {
  outPath: "public/bausteine/antworten-pruefen/sift-schritte.en.svg",
  build: (profile) => build(profile, TEXT_EN),
};
