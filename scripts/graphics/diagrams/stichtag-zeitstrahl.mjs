import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Was ein Chatbot in einem Gespräch weiß", section "Die Regler kennen
// nur den Stichtag". A timeline: everything before the cutoff can be in the
// weights; an event after it is only on the desk if text brings it there.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 230;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

function block({ left, width, top, height, role, profile, dashed, text }) {
  return {
    type: "div",
    props: {
      style: abs({
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px",
        background: dashed ? "#FFFFFF" : satoriBackground(role, profile),
        border: dashed
          ? `2px dashed ${tone(role, profile).stroke}`
          : satoriBorder(role, profile, { width: 2 }),
        borderRadius: "10px",
        textAlign: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: tone(role, profile).text,
      }),
      children: text,
    },
  };
}

function label(left, top, width, text) {
  return {
    type: "div",
    props: {
      style: abs({ left: `${left}px`, top: `${top}px`, width: `${width}px`, display: "flex", justifyContent: "center", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
      children: text,
    },
  };
}

function build({ frame, trained, after, marker, event, note }, profile) {
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
        block({ left: 40, width: 250, top: 60, height: 52, role: "teal", profile, text: trained }),
        block({ left: 300, width: 380, top: 60, height: 52, role: "neutral", profile, dashed: true, text: after }),
        {
          type: "div",
          props: {
            style: abs({ left: "299px", top: "50px", width: "2px", height: "72px", background: tone("neutral", profile).stroke }),
            children: "",
          },
        },
        label(200, 126, 200, marker),
        block({ left: 470, width: 210, top: 160, height: 46, role: "amber", profile, text: event }),
        {
          type: "div",
          props: {
            style: abs({ left: "24px", bottom: "12px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
            children: note,
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const stichtagDe = {
  outPath: "public/bausteine/was-ein-chatbot-im-gespraech-weiss/stichtag.svg",
  build: (profile) =>
    build(
      {
        frame: "Was die Gewichte kennen",
        trained: "Training",
        after: "nach dem Stichtag: nicht im Training",
        marker: "Wissensstichtag",
        event: "Ereignis im September",
        note: "Danach hilft nur Text auf dem Tisch.",
      },
      profile,
    ),
};

export const knowledgeCutoffEn = {
  outPath: "public/bausteine/was-ein-chatbot-im-gespraech-weiss/knowledge-cutoff.svg",
  build: (profile) =>
    build(
      {
        frame: "What the weights know",
        trained: "Training",
        after: "after the cutoff: not in training",
        marker: "Knowledge cutoff",
        event: "Event in September",
        note: "After the cutoff, only text on the desk can help.",
      },
      profile,
    ),
};
