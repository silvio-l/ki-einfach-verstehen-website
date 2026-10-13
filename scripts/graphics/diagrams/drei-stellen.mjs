import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Trainingsdaten: Urheberrecht und Datenschutz", section intro
// "Drei Stellen". Three places where a text is touched legally, each with its
// own question and its own lever. At 720 units wide the smallest text must be
// 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 260;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

// Labels per language. The German values are the original text, unchanged.
const COPY = {
  de: {
    frage: "Frage:",
    hebel: "Hebel:",
    stellen: [
      { title: "1 Sammeln", sub: "Kopie des Textes", frage: "Darf die Kopie entstehen?", hebel: "Vorbehalt oder Einstellung" },
      { title: "2 Modell", sub: "Stellungen gespeichert", frage: "Sind Stellungen eine Kopie?", hebel: "Entduplizierung" },
      { title: "3 Antwort", sub: "neu berechnet", frage: "Ist eine wörtliche Antwort eine Vervielfältigung?" },
    ],
  },
  en: {
    frage: "Question:",
    hebel: "Lever:",
    stellen: [
      { title: "1 Collecting", sub: "copy of the text", frage: "Is the copy allowed?", hebel: "reservation or setting" },
      { title: "2 Model", sub: "stored fader positions", frage: "Are the fader positions a copy?", hebel: "deduplication" },
      { title: "3 Answer", sub: "newly generated", frage: "Is a verbatim answer a reproduction?" },
    ],
  },
};

function stelle({ left, role, profile, title, sub, frage, hebel, labels }) {
  const font = { fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: tone(role, profile).text };
  return {
    type: "div",
    props: {
      style: abs({
        left: `${left}px`,
        top: "24px",
        width: "200px",
        height: "220px",
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "10px",
        ...font,
      }),
      children: [
        { type: "div", props: { style: { display: "flex", fontWeight: 700 }, children: title } },
        { type: "div", props: { style: { display: "flex", marginBottom: "10px" }, children: sub } },
        { type: "div", props: { style: { display: "flex", color: MUTED, marginBottom: "2px" }, children: labels.frage } },
        { type: "div", props: { style: { display: "flex", marginBottom: "10px" }, children: frage } },
        ...(hebel
          ? [
              { type: "div", props: { style: { display: "flex", color: MUTED, marginBottom: "2px" }, children: labels.hebel } },
              { type: "div", props: { style: { display: "flex" }, children: hebel } },
            ]
          : []),
      ],
    },
  };
}

function build(profile, lang = "de") {
  const c = COPY[lang];
  const [s1, s2, s3] = c.stellen;
  const tree = {
    type: "div",
    props: {
      style: { position: "relative", width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", background: "#FFFFFF" },
      children: [
        stelle({ left: 20, role: "teal", profile, ...s1, labels: c }),
        stelle({ left: 260, role: "amber", profile, ...s2, labels: c }),
        stelle({ left: 500, role: "neutral", profile, ...s3, labels: c }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const dreiStellenDe = {
  outPath: "public/bausteine/trainingsdaten-urheberrecht-und-datenschutz/drei-stellen.svg",
  build: (profile) => build(profile, "de"),
};

export const dreiStellenEn = {
  outPath: "public/bausteine/trainingsdaten-urheberrecht-und-datenschutz/three-places.svg",
  build: (profile) => build(profile, "en"),
};
