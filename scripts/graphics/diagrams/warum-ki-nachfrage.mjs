import { renderSvg } from "../satori-render.mjs";
import { tone, printLine } from "../tokens.mjs";

// Baustein warum-ki-ueberzeugend-falsch-liegt: a follow-up question in which
// the chatbot confirms a fabricated case with a second, equally made-up
// confirmation. Simplified after the lawyer's sworn statement in Mata v.
// Avianca (2023); paraphrased, not a quotation.

const FONT = "IBM Plex Sans";
const W = 720;

const BUBBLE_W = 470;
const LABEL_H = 24;
const ARROW_H = 28;
const CAPTION_H = 56;
const CAPTION_GAP = 14;
const PAD = 8;

// Bubble height follows the text: about 36 characters fit on one line of
// 470 px at 18 px; longer texts take two lines (96 px box).
function bubbleHeight(text) {
  return text.length > 36 ? 96 : 64;
}

function speakerBlock(msg, profile) {
  const isUser = msg.side === "user";
  const t = tone(isUser ? "teal" : "neutral", profile);
  const h = bubbleHeight(msg.text);
  return {
    height: LABEL_H + 4 + h,
    node: {
      type: "div",
      props: {
        style: { display: "flex", flexDirection: "column", alignItems: isUser ? "flex-start" : "flex-end", width: `${W}px`, paddingLeft: "16px", paddingRight: "16px" },
        children: [
          { type: "div", props: { style: { display: "flex", height: `${LABEL_H}px`, marginBottom: "4px", fontFamily: FONT, fontSize: "18px", fontWeight: 700, color: t.text }, children: msg.speaker } },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                width: `${BUBBLE_W}px`,
                height: `${h}px`,
                padding: "10px 18px",
                borderRadius: "16px",
                background: t.fill,
                border: `${printLine(2, profile)}px solid ${t.stroke}`,
                fontFamily: FONT,
                fontSize: "18px",
                lineHeight: "24px",
                color: t.text,
              },
              children: msg.text,
            },
          },
        ],
      },
    },
  };
}

// Short downward arrow between two messages, centred on the column.
function arrowBlock(profile) {
  const ink = tone("neutral", profile);
  return {
    height: ARROW_H,
    node: {
      type: "div",
      props: {
        style: { display: "flex", justifyContent: "center", alignItems: "center", width: `${W}px`, height: `${ARROW_H}px` },
        children: [
          {
            type: "svg",
            props: {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 16 24",
              width: 16,
              height: 24,
              children: [
                { type: "line", props: { x1: 8, y1: 0, x2: 8, y2: 16, stroke: ink.stroke, strokeWidth: printLine(2, profile) } },
                { type: "polygon", props: { points: "2,14 8,24 14,14", fill: ink.stroke } },
              ],
            },
          },
        ],
      },
    },
  };
}

function build(l, profile) {
  const ink = tone("neutral", profile);
  const blocks = [];
  l.messages.forEach((msg, i) => {
    if (i > 0) blocks.push(arrowBlock(profile));
    blocks.push(speakerBlock(msg, profile));
  });

  const captionNode = {
    type: "div",
    props: {
      style: { display: "flex", width: "688px", height: `${CAPTION_H}px`, marginLeft: "16px", marginTop: `${CAPTION_GAP}px`, fontFamily: FONT, fontSize: "18px", lineHeight: "24px", color: ink.text },
      children: l.caption,
    },
  };

  const H = PAD + blocks.reduce((sum, b) => sum + b.height, 0) + CAPTION_GAP + CAPTION_H + PAD;
  const tree = {
    type: "div",
    props: {
      style: { width: `${W}px`, height: `${H}px`, display: "flex", flexDirection: "column", paddingTop: `${PAD}px` },
      children: [...blocks.map((b) => b.node), captionNode],
    },
  };
  return renderSvg(tree, W, H);
}

const DE = {
  caption: "Vereinfacht nach den Screenshots der Eidesstattlichen Erklärung vom 25. Mai 2023 im Verfahren Mata gegen Avianca (ECF 54, Rn. 45). Sinngemäß übersetzt.",
  messages: [
    { side: "user", speaker: "Du", text: "Gibt es den Fall Varghese wirklich?" },
    { side: "bot", speaker: "Chatbot", text: "Ja, der Fall existiert und steht in Westlaw und LexisNexis." },
    { side: "user", speaker: "Du", text: "Bist du sicher? Sind die anderen Fälle auch erfunden?" },
    { side: "bot", speaker: "Chatbot", text: "Nein, das sind echte Entscheidungen." },
  ],
};

const EN = {
  caption: "Simplified from the screenshots annexed to the lawyer's affidavit of 25 May 2023 in Mata v. Avianca, as reported in ECF 54 para. 45. Paraphrased.",
  messages: [
    { side: "user", speaker: "You", text: "Is the case Varghese real?" },
    { side: "bot", speaker: "Chatbot", text: "Yes, the case exists and is in Westlaw and LexisNexis." },
    { side: "user", speaker: "You", text: "Are you sure? Are the other cases also made up?" },
    { side: "bot", speaker: "Chatbot", text: "No, they are real decisions." },
  ],
};

export const followUpDe = {
  outPath: "public/bausteine/warum-ki-ueberzeugend-falsch-liegt/nachfrage-gespraech.svg",
  build: (profile) => build(DE, profile),
};

export const followUpEn = {
  outPath: "public/bausteine/warum-ki-ueberzeugend-falsch-liegt/follow-up-chat.svg",
  build: (profile) => build(EN, profile),
};
