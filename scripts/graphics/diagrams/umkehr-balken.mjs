import { renderSvg, abs } from "../satori-render.mjs";
import { tone, printLine } from "../tokens.mjs";

// Baustein "Versteht KI, was sie sagt?", section on the reversal curse: two bars on
// one 0-100 % axis, lengths proportional to the published values (Berglund et al.,
// 2024, ICLR, experiment 2). Nothing else is plotted, so only 0 % and 100 % are labelled.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 232;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";
const AXIS_LEFT = 230;
const AXIS_WIDTH = 450; // 100 %
const BAR_HEIGHT = 44;
const ROWS = [
  { top: 40, value: 79 },
  { top: 110, value: 33 },
];

function label(text, top, profile) {
  return {
    type: "div",
    props: {
      style: abs({
        left: "0px",
        top: `${top}px`,
        width: `${AXIS_LEFT - 16}px`,
        height: `${BAR_HEIGHT}px`,
        alignItems: "center",
        justifyContent: "flex-end",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        fontWeight: 700,
        color: tone("neutral", profile).text,
      }),
      children: text,
    },
  };
}

function bar({ value, top, text }, profile) {
  const t = tone("teal", profile);
  const n = tone("neutral", profile);
  const length = (AXIS_WIDTH * value) / 100;
  return [
    // Track for the full 0-100 % range, so the length of the bar reads against the axis.
    {
      type: "div",
      props: {
        style: abs({ left: `${AXIS_LEFT}px`, top: `${top}px`, width: `${AXIS_WIDTH}px`, height: `${BAR_HEIGHT}px`, background: n.fill }),
        children: "",
      },
    },
    {
      type: "div",
      props: {
        style: abs({ left: `${AXIS_LEFT}px`, top: `${top}px`, width: `${length}px`, height: `${BAR_HEIGHT}px`, background: t.accent }),
        children: "",
      },
    },
    {
      type: "div",
      props: {
        style: abs({
          left: `${AXIS_LEFT + length + 10}px`,
          top: `${top}px`,
          height: `${BAR_HEIGHT}px`,
          alignItems: "center",
          fontFamily: "IBM Plex Sans",
          fontSize: FONT_SIZE,
          fontWeight: 700,
          color: n.text,
        }),
        children: text,
      },
    },
  ];
}

function axisLine(left, profile) {
  return {
    type: "div",
    props: {
      style: abs({
        left: `${left}px`,
        top: "28px",
        width: "0px",
        height: "140px",
        borderLeft: `${printLine(1, profile)}px solid ${tone("neutral", profile).stroke}`,
      }),
      children: "",
    },
  };
}

function tick(text, centerX, profile) {
  return {
    type: "div",
    props: {
      style: abs({
        left: `${centerX - 40}px`,
        top: "174px",
        width: "80px",
        justifyContent: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: MUTED,
      }),
      children: text,
    },
  };
}

function build({ rows, labels, caption }, profile) {
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
        ...rows.flatMap((r, i) => [label(labels[i], r.top, profile), ...bar({ value: r.value, top: r.top, text: `${r.value} %` }, profile)]),
        axisLine(AXIS_LEFT, profile),
        axisLine(AXIS_LEFT + AXIS_WIDTH, profile),
        tick("0 %", AXIS_LEFT, profile),
        tick("100 %", AXIS_LEFT + AXIS_WIDTH, profile),
        {
          type: "div",
          props: {
            style: abs({ left: "20px", top: "204px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: caption,
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const umkehrBalkenDe = {
  outPath: "public/bausteine/versteht-ki-was-sie-sagt/umkehr-balken.svg",
  build: (profile) =>
    build(
      { rows: ROWS, labels: ["Elternfrage", "Kindfrage"], caption: "GPT-4, Experiment 2, veröffentlichte Werte" },
      profile,
    ),
};

export const reversalBarsEn = {
  outPath: "public/bausteine/versteht-ki-was-sie-sagt/reversal-bars.svg",
  build: (profile) =>
    build(
      { rows: ROWS, labels: ["Parent question", "Child question"], caption: "GPT-4, experiment 2, published values" },
      profile,
    ),
};
