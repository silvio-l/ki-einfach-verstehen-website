import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Antworten prüfen", section "Fünf Prüfregeln, jede mit ihrem Grund":
// five rules, each with the mechanism that makes it necessary.
// At 720 units wide the smallest text must be 18 units (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 400;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

function row({ n, rule, reason, profile }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        height: "58px",
        padding: "0 16px",
        background: satoriBackground("teal", profile),
        border: satoriBorder("teal", profile, { width: 2 }),
        borderRadius: "12px",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: tone("teal", profile).text,
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontWeight: 700, width: "24px" }, children: `${n}` } },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", flex: 1 },
            children: [
              { type: "div", props: { style: { display: "flex", fontWeight: 700 }, children: rule } },
              { type: "div", props: { style: { display: "flex", color: MUTED }, children: reason } },
            ],
          },
        },
      ],
    },
  };
}

function build(profile, t) {
  const rules = t.rules.map((r, i) => ({ n: i + 1, ...r }));
  const children = rules.map((r) => row({ ...r, profile }));
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
            style: abs({ left: "24px", right: "24px", top: "52px", display: "flex", flexDirection: "column", gap: "8px" }),
            children,
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

const TEXT_DE = {
  frame: "Fünf Prüfregeln nach Art des Fehlers",
  rules: [
    { rule: "Erfundene Quelle", reason: "Quelle außerhalb öffnen und die Stelle lesen" },
    { rule: "Zahl ohne klare Herkunft", reason: "Herkunft suchen und die Bewertung prüfen" },
    { rule: "Veraltetes oder neues Wissen", reason: "Datum und Stichtag prüfen, Suche beachten" },
    { rule: "Zählen und Rechnen", reason: "Selbst nachzählen oder nachrechnen" },
    { rule: "Gesundheit, Recht, Geld", reason: "Fachperson, wenn du es nicht selbst beurteilen kannst" },
  ],
};
const TEXT_EN = {
  frame: "Five checking rules, by the kind of error",
  rules: [
    { rule: "Invented source", reason: "Open the source outside the chat and read the passage" },
    { rule: "Number without a clear origin", reason: "Find the origin and check how it was rated" },
    { rule: "Outdated or new knowledge", reason: "Check the date and cutoff, note whether search was used" },
    { rule: "Counting and calculating", reason: "Count or calculate again yourself" },
    { rule: "Health, law, money", reason: "A specialist, if you cannot judge it yourself" },
  ],
};

export const fuenfPruefregelnDe = {
  outPath: "public/bausteine/antworten-pruefen/fuenf-pruefregeln.svg",
  build: (profile) => build(profile, TEXT_DE),
};

export const fuenfPruefregelnEn = {
  outPath: "public/bausteine/antworten-pruefen/fuenf-pruefregeln.en.svg",
  build: (profile) => build(profile, TEXT_EN),
};
