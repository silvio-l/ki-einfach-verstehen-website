import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Vom Textfortsetzer zum Assistenten", section "Drei Schritte, die aus
// Fortsetzern Helfer machen": pre-training and post-training side by side.
// The procedure is the same (weights are adjusted in both columns); only the
// examples and the rating differ. Deliberately without any numbers.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 360;
const FONT_SIZE = "18px";
const LABEL_WIDTH = 146;

function cell(text, role, profile, { bold = false, width, height } = {}) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        ...(width ? { width: `${width}px`, flex: "none" } : { flex: 1 }),
        ...(height ? { height: `${height}px` } : {}),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4px 6px",
        background: satoriBackground(role, profile),
        border: satoriBorder(role, profile, { width: 2 }),
        borderRadius: "10px",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        fontWeight: bold ? 700 : 400,
        color: tone(role, profile).text,
        lineHeight: 1.22,
      },
      children: text,
    },
  };
}

function row({ label, pre, post, height }, profile) {
  return {
    type: "div",
    props: {
      style: { display: "flex", gap: "6px", height: `${height}px` },
      children: [
        cell(label, "neutral", profile, { bold: true, width: LABEL_WIDTH }),
        cell(pre, "teal", profile),
        cell(post, "amber", profile),
      ],
    },
  };
}

function build({ header, rows }, profile) {
  const tree = {
    type: "div",
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "3px",
        padding: "8px 12px",
        background: "#FFFFFF",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", gap: "6px", height: "30px" },
            children: [
              cell("", "neutral", profile, { width: LABEL_WIDTH }),
              cell(header.pre, "teal", profile, { bold: true }),
              cell(header.post, "amber", profile, { bold: true }),
            ],
          },
        },
        ...rows.map((r) => row(r, profile)),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const vortrainingNachtrainingDe = {
  outPath: "public/bausteine/vom-textfortsetzer-zum-assistenten/vortraining-nachtraining.svg",
  build: (profile) =>
    build(
      {
        header: { pre: "Vortraining", post: "Nachtraining" },
        rows: [
          { label: "Daten", pre: "Text aus dem Netz", post: "Beispiele, die Menschen geschrieben oder bewertet haben", height: 78 },
          { label: "Ziel des Trainings", pre: "das nächste Textstück vorhersagen", post: "Musterantworten nachahmen, Rangfolgen vorhersagen, gegen ein Belohnungsmodell optimieren", height: 102 },
          { label: "Bewertung", pre: "das Textstück selbst", post: "Menschen oder ein Belohnungsmodell", height: 58 },
          { label: "Was angepasst wird", pre: "die Gewichte", post: "die Gewichte, mit anderen Beispielen", height: 58 },
        ],
      },
      profile,
    ),
};

export const pretrainingPosttrainingEn = {
  outPath: "public/bausteine/vom-textfortsetzer-zum-assistenten/pretraining-posttraining.svg",
  build: (profile) =>
    build(
      {
        header: { pre: "Pretraining", post: "Post-training" },
        rows: [
          { label: "Data", pre: "text from the web", post: "examples written or rated by people", height: 78 },
          { label: "Goal of training", pre: "predict the next piece of text", post: "imitate model answers, predict rankings, optimise against a reward model", height: 102 },
          { label: "Rating", pre: "the piece of text itself", post: "people or a reward model", height: 58 },
          { label: "What is adjusted", pre: "the weights", post: "the weights, with other examples", height: 58 },
        ],
      },
      profile,
    ),
};
