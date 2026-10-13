import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Antworten prüfen", section "Wann prüfen? Die Risiko-Ampel":
// three stages that set how much checking an answer needs. The light is
// carried by the text, so the grayscale profile reads the same.
// At 720 units wide the smallest text must be 18 units (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 300;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

function stage({ title, sub, role, profile }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2px",
        width: "672px",
        height: "60px",
        padding: "10px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "12px",
        textAlign: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: tone(role, profile).text,
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontWeight: 700 }, children: title } },
        { type: "div", props: { style: { display: "flex", lineHeight: 1.2 }, children: sub } },
      ],
    },
  };
}

function build(profile, t) {
  const stages = [
    { title: t.green, sub: t.greenSub, role: "teal" },
    { title: t.yellow, sub: t.yellowSub, role: "amber" },
    { title: t.red, sub: t.redSub, role: "purple" },
  ];
  const children = stages.map((st) => stage({ ...st, profile }));
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
          props: {
            style: abs({ left: "24px", right: "24px", top: "54px", height: "200px", display: "flex", flexDirection: "column", justifyContent: "space-between" }),
            children,
          },
        },
        {
          type: "div",
          props: { style: abs({ left: "24px", bottom: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }), children: t.note },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

const TEXT_DE = {
  green: "Grün: Folgen klein, Fehler fällt auf",
  greenSub: "Beispiel: Ideen für ein Vereinsfest",
  yellow: "Gelb: Folgen mittel, Fehler fällt oft spät auf",
  yellowSub: "Beispiel: Referat, Stellungnahme im Job",
  red: "Rot: Folgen groß, Fehler fällt selten auf",
  redSub: "Beispiel: Gesundheit, Recht, Geld, Sicherheit",
  frame: "Zwei Kriterien: Folgen und Auffälligkeit des Fehlers",
  note: "Die Ampel misst Folgen, nicht den Ton der Antwort.",
};
const TEXT_EN = {
  green: "Green: small consequences, error shows up at once",
  greenSub: "Example: ideas for a village party",
  yellow: "Yellow: medium consequences, error often shows up late",
  yellowSub: "Example: a talk, a statement at work",
  red: "Red: large consequences, error rarely shows up",
  redSub: "Example: health, law, money, safety",
  frame: "Two criteria: consequences and how visible the error is",
  note: "The traffic light measures consequences, not how confident the answer sounds.",
};

export const risikoAmpelDe = {
  outPath: "public/bausteine/antworten-pruefen/risiko-ampel.svg",
  build: (profile) => build(profile, TEXT_DE),
};

export const risikoAmpelEn = {
  outPath: "public/bausteine/antworten-pruefen/risiko-ampel.en.svg",
  build: (profile) => build(profile, TEXT_EN),
};
