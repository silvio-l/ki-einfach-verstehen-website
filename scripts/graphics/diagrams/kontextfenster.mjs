import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground } from "../tokens.mjs";

// Baustein "Token-IDs: Wie aus Tokens Zahlen werden", section on the
// context window: an invented chat as one row of token places. The window
// has a fixed number of places (here an invented 12); the history has grown
// past it, so its oldest part no longer fits. The answer the model is about
// to write needs places inside the window too (empty boxes with a solid border; dashes are kept for the places outside). What an
// application does with the part that no longer fits (drop, summarize,
// refuse) is left to the text -- the graphic only shows that the limit
// counts tokens, the answer included.

const WIDTH = 720;
const HEIGHT = 264;
const FONT = "IBM Plex Sans";
const INK = "#1B1A17";
const MUTED = "#5F594D";
const CELL = 28;
const GAP = 5;
const LEFT = 20;

// Message lengths in tokens (invented): question 1, answer 1, question 2,
// answer 2, the new question, and the places the coming answer will take.
const MESSAGES = [4, 5, 3, 4, 2, 2];
const ANSWER = MESSAGES.length - 1;
const WINDOW = 12;

const text = (children, style = {}) => ({
  type: "div",
  props: { style: { display: "flex", fontFamily: FONT, color: INK, ...style }, children },
});

function cells(profile) {
  const out = [];
  let pos = 0;
  const total = MESSAGES.reduce((a, b) => a + b, 0);
  MESSAGES.forEach((n, m) => {
    const role = m % 2 ? "amber" : "teal";
    const t = tone(role, profile);
    for (let k = 0; k < n; k += 1, pos += 1) {
      const inside = pos >= total - WINDOW;
      if (m === ANSWER) {
        // Reserved for the answer: inside the window, but still empty.
        out.push({
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: `${LEFT + pos * (CELL + GAP)}px`,
              top: "96px",
              width: `${CELL}px`,
              height: `${CELL}px`,
              borderRadius: "7px",
              background: "#FFFFFF",
              border: `2px solid ${t.stroke}`,
              display: "flex",
            },
            children: [],
          },
        });
        continue;
      }
      out.push({
        type: "div",
        props: {
          style: {
            position: "absolute",
            left: `${LEFT + pos * (CELL + GAP)}px`,
            top: "96px",
            width: `${CELL}px`,
            height: `${CELL}px`,
            borderRadius: "7px",
            background: inside ? satoriBackground(role, profile, { fillKey: "fillStrong" }) : "#FFFFFF",
            border: `${inside ? 1 : 2}px ${inside ? t.satoriBorderStyle : "dashed"} ${inside ? t.stroke : tone("neutral", profile).stroke}`,
            display: "flex",
          },
          children: [],
        },
      });
    }
  });
  return { out, total };
}

function build(t, profile) {
  const { out, total } = cells(profile);
  const start = total - WINDOW;
  const x = (pos) => LEFT + pos * (CELL + GAP);
  const frameLeft = x(start) - 8;
  const frameWidth = WINDOW * (CELL + GAP) - GAP + 16;
  const teal = tone("teal", profile);
  // Labels under each message group.
  let pos = 0;
  const groupLabels = MESSAGES.map((n, m) => {
    const left = x(pos);
    pos += n;
    return text(t.messages[m], { position: "absolute", left: `${left}px`, top: "138px", width: `${Math.max(n * (CELL + GAP) - GAP, 72)}px`, marginLeft: `${Math.min(n * (CELL + GAP) - GAP - 72, 0) / 2}px`, justifyContent: "center", fontSize: "18px", color: MUTED });
  });
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative" },
      children: [
        text(t.windowLabel, { position: "absolute", left: `${frameLeft}px`, top: "20px", width: `${frameWidth}px`, justifyContent: "center", fontSize: "20px", fontWeight: 600 }),
        text(t.outsideLabel, { position: "absolute", left: `${LEFT}px`, top: "46px", width: `${start * (CELL + GAP) - GAP}px`, justifyContent: "center", fontSize: "18px", color: MUTED }),
        {
          type: "div",
          props: {
            style: { position: "absolute", left: `${frameLeft}px`, top: "84px", width: `${frameWidth}px`, height: `${CELL + 24}px`, border: `3px solid ${teal.stroke}`, borderRadius: "12px", display: "flex" },
            children: [],
          },
        },
        ...out,
        ...groupLabels,
        text(t.footer, { position: "absolute", left: `${LEFT}px`, top: "196px", width: `${WIDTH - 2 * LEFT}px`, fontSize: "18px", color: MUTED }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

const DE = {
  windowLabel: `Kontextfenster: ${WINDOW} Plätze`,
  outsideLabel: "passt nicht mehr hinein",
  messages: ["Frage 1", "Antwort 1", "Frage 2", "Antwort 2", "neu", "Antwort"],
  footer: "Jedes Kästchen ist ein Token, die leeren rechts braucht die Antwort. Alle Zahlen sind ausgedacht; echte Fenster fassen Tausende Tokens, manche rund eine Million.",
};

const EN = {
  windowLabel: `Context window: ${WINDOW} places`,
  outsideLabel: "no longer fits",
  messages: ["Question 1", "Answer 1", "Question 2", "Answer 2", "new", "answer"],
  footer: "Each box is one token. The answer needs the empty places on the right. All numbers are invented; real windows hold many thousands of tokens, some around a million.",
};

export const kontextfensterDe = {
  outPath: "public/bausteine/token-ids-und-vokabular/kontextfenster.svg",
  build: (profile) => build(DE, profile),
};

export const contextWindowEn = {
  outPath: "public/bausteine/token-ids-und-vokabular/context-window.svg",
  build: (profile) => build(EN, profile),
};
