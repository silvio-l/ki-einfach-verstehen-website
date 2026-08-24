import { renderSvg } from "../satori-render.mjs";

const WIDTH = 640;
const HEIGHT = 360;

const PETROL_DARK = "#0A5148";
const PETROL_LIGHT = "#D7ECE7";
const AMBER_DARK = "#986816";
const AMBER_LIGHT = "#FBF2E0";

function line(width) {
  return { type: "div", props: { style: { display: "flex", width: `${width}px`, height: "8px", borderRadius: "4px", background: "#DAD6CB" }, children: [] } };
}

function chip({ text, tone, width }) {
  const isTeal = tone === "teal";
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${width}px`,
        height: "38px",
        borderRadius: "9px",
        background: isTeal ? PETROL_LIGHT : AMBER_LIGHT,
        fontFamily: "IBM Plex Sans",
        fontSize: "19px",
        color: isTeal ? PETROL_DARK : AMBER_DARK,
      },
      children: text,
    },
  };
}

function sourceCard(chips) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "18px",
        width: "240px",
        height: "252px",
        padding: "0 32px",
        background: "#FFFFFF",
        border: "3px solid #0A5148",
        borderRadius: "18px",
      },
      children: [
        { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [line(176), line(142), line(164)] } },
        { type: "div", props: { style: { display: "flex", gap: "6px" }, children: chips.map((c) => chip(c)) } },
      ],
    },
  };
}

function idBadge({ value, tone }) {
  const isTeal = tone === "teal";
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "88px",
        height: "64px",
        borderRadius: "14px",
        background: isTeal ? PETROL_DARK : AMBER_DARK,
        fontFamily: "IBM Plex Sans",
        fontWeight: 600,
        fontSize: "26px",
        color: "#FFFFFF",
      },
      children: value,
    },
  };
}

function idGrid(values) {
  return {
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", gap: "16px" },
      children: [
        { type: "div", props: { style: { display: "flex", gap: "16px" }, children: [idBadge({ value: values[0], tone: "teal" }), idBadge({ value: values[1], tone: "amber" })] } },
        { type: "div", props: { style: { display: "flex", gap: "16px" }, children: [idBadge({ value: values[2], tone: "teal" }), idBadge({ value: values[3], tone: "amber" })] } },
      ],
    },
  };
}

function arrow() {
  return { type: "div", props: { style: { display: "flex", alignItems: "center", justifyContent: "center", color: "#0E7469", fontSize: "30px" }, children: "→" } };
}

function build({ chips, ids }) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F5EF", borderRadius: "28px", gap: "40px" },
      children: [
        sourceCard(chips),
        arrow(),
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "16px" },
            children: [idGrid(ids), { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "6px" }, children: [line(184), line(136)] } }],
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const conceptTextToIdsDe = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/text-zu-ids.svg",
  build: () =>
    build({
      chips: [
        { text: "Die", tone: "teal", width: 46 },
        { text: " Kat", tone: "amber", width: 68 },
        { text: "ze", tone: "teal", width: 43 },
        { text: ".", tone: "amber", width: 18 },
      ],
      ids: ["417", "82", "903", "13"],
    }),
};

export const conceptTextToIdsEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/text-to-ids.svg",
  build: () =>
    build({
      chips: [
        { text: "The", tone: "teal", width: 58 },
        { text: " cat", tone: "amber", width: 68 },
        { text: "s", tone: "teal", width: 18 },
        { text: ".", tone: "amber", width: 18 },
      ],
      ids: ["417", "82", "903", "13"],
    }),
};
