import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Was ein Chatbot in einem Gespräch weiß", section "Viel Text heißt
// nicht, dass alles gleich gut gelesen wird". Ordinal only: three equal zones for
// the start, the middle and the end of a long input. Liu et al. (2024) publish
// no values per position that could be read off the paper, so no heights and no
// scores are drawn.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 280;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

function zone({ label, inner, height, role, profile }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "170px",
        height: "150px",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "120px",
              height: `${height}px`,
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              background: satoriBackground(role, profile),
              border: satoriBorder(role, profile, { width: 2 }),
              borderRadius: "10px",
              fontFamily: "IBM Plex Sans",
              fontSize: FONT_SIZE,
              color: tone(role, profile).text,
              textAlign: "center",
            },
            children: inner,
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", marginTop: "8px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: tone("neutral", profile).text },
            children: label,
          },
        },
      ],
    },
  };
}

function build({ frame, scale, zones, note }, profile) {
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
        {
          type: "div",
          props: {
            style: abs({ left: "24px", top: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: frame,
          },
        },
        {
          type: "div",
          props: {
            style: abs({ left: "24px", top: "46px", width: "672px", height: "150px", display: "flex", alignItems: "flex-end", justifyContent: "space-around" }),
            children: zones.map((z) => zone({ ...z, profile })),
          },
        },
        {
          type: "div",
          props: {
            style: abs({ left: "24px", bottom: "14px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: `${scale} · ${note}`,
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const lageImFensterDe = {
  outPath: "public/bausteine/was-ein-chatbot-im-gespraech-weiss/lage-im-fenster.svg",
  build: (profile) =>
    build(
      {
        frame: "Wie gut eine Angabe genutzt wird, nach Lage",
        scale: "schematisch, keine Messung",
        note: "Befund: Liu et al. 2024",
        zones: [
          { label: "Anfang", inner: "besser genutzt", height: 110, role: "teal" },
          { label: "Mitte", inner: "schlechter genutzt", height: 110, role: "amber" },
          { label: "Ende", inner: "besser genutzt", height: 110, role: "teal" },
        ],
      },
      profile,
    ),
};

export const positionInContextEn = {
  outPath: "public/bausteine/was-ein-chatbot-im-gespraech-weiss/position-in-context.svg",
  build: (profile) =>
    build(
      {
        frame: "How well a detail is used, by position",
        scale: "schematic, not measured",
        note: "Finding: Liu et al. 2024",
        zones: [
          { label: "Start", inner: "used better", height: 110, role: "teal" },
          { label: "Middle", inner: "used worse", height: 110, role: "amber" },
          { label: "End", inner: "used better", height: 110, role: "teal" },
        ],
      },
      profile,
    ),
};
