import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Trainingsdaten: Urheberrecht und Datenschutz", section
// "Ein Vorbehalt, den nur ein Computer lesen kann". An Nutzungsvorbehalt acts
// forwards: what was collected before it is not touched by it. The timeline is
// illustrative and shows only the order of events.

const WIDTH = 720;
const HEIGHT = 240;
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
        border: dashed ? `2px dashed ${tone(role, profile).stroke}` : satoriBorder(role, profile, { width: 2 }),
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

const COPY = {
  de: {
    teal: "Sammeln ohne Vorbehalt",
    dashed: "Nach dem Vorbehalt: Sammeln nicht gedeckt",
    reservation: "Maschinenlesbarer Vorbehalt",
    amber: "Vorher Gesammeltes: Wirkung offen",
    footer: "Der Vorbehalt wirkt von seinem Tag an nach vorn.",
  },
  en: {
    teal: "Collecting without reservation",
    dashed: "After the reservation: collecting not covered",
    reservation: "Machine-readable reservation",
    amber: "Effect open for copies already made",
    footer: "The reservation takes effect forward from its date.",
  },
};

function build(profile, lang = "de") {
  const c = COPY[lang];
  const tree = {
    type: "div",
    props: {
      style: { position: "relative", width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", background: "#FFFFFF" },
      children: [
        block({ left: 30, width: 250, top: 70, height: 60, role: "teal", profile, text: c.teal }),
        block({ left: 440, width: 250, top: 70, height: 60, role: "neutral", profile, dashed: true, text: c.dashed }),
        {
          type: "div",
          props: {
            style: abs({ left: "359px", top: "50px", width: "2px", height: "100px", background: tone("neutral", profile).stroke }),
            children: "",
          },
        },
        label(209, 22, 300, c.reservation),
        block({ left: 30, width: 660, top: 160, height: 44, role: "amber", profile, text: c.amber }),
        label(24, 212, 672, c.footer),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const vorbehaltZeitleisteDe = {
  outPath: "public/bausteine/trainingsdaten-urheberrecht-und-datenschutz/vorbehalt-zeitleiste.svg",
  build: (profile) => build(profile, "de"),
};

export const reservationTimelineEn = {
  outPath: "public/bausteine/trainingsdaten-urheberrecht-und-datenschutz/reservation-timeline.svg",
  build: (profile) => build(profile, "en"),
};
