import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder, printLine } from "../tokens.mjs";

// Baustein "Versteht KI, was sie sagt?", section on probes. Schematic only: the
// intermediate values flow into a probe, which reads them out and changes nothing;
// what it reads out is the state (here a 4x4 board without numbers). An arrow
// means exactly "wird ausgelesen" (is read out).
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 262;
const FONT_SIZE = "18px";
const BOX_TOP = 16;
const BOX_HEIGHT = 186;
const ARROW_CENTER = BOX_TOP + BOX_HEIGHT / 2;
const MUTED = "#5F594D";

function box({ title, sub, role, profile, left, width, extra }) {
  const t = tone(role, profile);
  return {
    type: "div",
    props: {
      style: abs({
        left: `${left}px`,
        top: `${BOX_TOP}px`,
        width: `${width}px`,
        height: `${BOX_HEIGHT}px`,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "8px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "12px",
        textAlign: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: t.text,
      }),
      children: [
        { type: "div", props: { style: { display: "flex", fontWeight: 700, lineHeight: 1.15 }, children: title } },
        { type: "div", props: { style: { display: "flex", lineHeight: 1.15 }, children: sub } },
        ...(extra ? [extra] : []),
      ],
    },
  };
}

function arrow({ left, profile }) {
  return {
    type: "div",
    props: {
      style: abs({
        left: `${left}px`,
        top: `${ARROW_CENTER - 18}px`,
        width: "46px",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: "26px",
        color: tone("neutral", profile).stroke,
      }),
      children: "→",
    },
  };
}

// Schematic 4x4 board: no numbers, three filled squares as pieces.
function board(profile) {
  const t = tone("neutral", profile);
  const pieces = new Set(["0,1", "2,3", "3,0"]);
  const rows = [0, 1, 2, 3].map((r) => ({
    type: "div",
    props: {
      style: { display: "flex", gap: "4px" },
      children: [0, 1, 2, 3].map((c) => ({
        type: "div",
        props: {
          style: {
            display: "flex",
            width: "18px",
            height: "18px",
            border: `${printLine(1, profile)}px solid ${t.stroke}`,
            background: pieces.has(`${r},${c}`) ? t.stroke : t.fillStrong,
          },
          children: "",
        },
      })),
    },
  }));
  return {
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", gap: "4px" },
      children: rows,
    },
  };
}

function build({ labels }, profile) {
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
        box({ title: labels.values.title, sub: labels.values.sub, role: "neutral", profile, left: 0, width: 200 }),
        arrow({ left: 208, profile }),
        box({ title: labels.probe.title, sub: labels.probe.sub, role: "amber", profile, left: 262, width: 176 }),
        arrow({ left: 446, profile }),
        box({ title: labels.state.title, sub: labels.state.sub, role: "neutral", profile, left: 500, width: 220, extra: board(profile) }),
        {
          type: "div",
          props: {
            style: abs({
              left: "0px",
              top: `${BOX_TOP + BOX_HEIGHT + 14}px`,
              fontFamily: "IBM Plex Sans",
              fontSize: FONT_SIZE,
              color: MUTED,
            }),
            children: labels.schematic,
          },
        },
        {
          type: "div",
          props: {
            style: abs({
              left: "360px",
              top: `${BOX_TOP + BOX_HEIGHT + 14}px`,
              width: "360px",
              justifyContent: "flex-end",
              fontFamily: "IBM Plex Sans",
              fontSize: FONT_SIZE,
              color: MUTED,
            }),
            children: labels.arrowLegend,
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const sondeSchemaDe = {
  outPath: "public/bausteine/versteht-ki-was-sie-sagt/sonde-schema.svg",
  build: (profile) =>
    build(
      {
        labels: {
          values: { title: "Zwischenwerte im Modell", sub: "Zahlen, die bei jeder Eingabe neu entstehen" },
          probe: { title: "Sonde", sub: "liest aus, verändert nichts" },
          state: { title: "Zustand", sub: "Spielbrett" },
          schematic: "schematisch",
          arrowLegend: "→ wird ausgelesen",
        },
      },
      profile,
    ),
};

export const probeSchemaEn = {
  outPath: "public/bausteine/versteht-ki-was-sie-sagt/probe-schema.svg",
  build: (profile) =>
    build(
      {
        labels: {
          values: { title: "Intermediate values in the model", sub: "numbers that form anew with each input" },
          probe: { title: "Probe", sub: "reads out, changes nothing" },
          state: { title: "State", sub: "board" },
          schematic: "schematic",
          arrowLegend: "→ is read out",
        },
      },
      profile,
    ),
};
