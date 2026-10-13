import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Trainingsdaten: Urheberrecht und Datenschutz", section
// "Gerichte, die noch entscheiden". Dates from the court press releases; status
// as of 2026-10-12. Not legal advice; the BGH case is still open.

const WIDTH = 720;
const HEIGHT = 300;
const FONT_SIZE = "18px";
const MUTED = "#5F594D";

const COPY = {
  de: {
    events: [
      { date: "27.09.2024", text: "LG Hamburg, Datensatz: Klage abgewiesen", role: "teal" },
      { date: "11.11.2025", text: "LG München I, Modell: GEMA überwiegend erfolgreich, nicht rechtskräftig", role: "amber" },
      { date: "10.12.2025", text: "OLG Hamburg, Datensatz: Berufung ohne Erfolg", role: "teal" },
      { date: "17.12.2026", text: "BGH, Datensatz: verhandelt 03.09.2026, Urteil geplant 17.12.2026", role: "neutral" },
    ],
    footer: "Stand 12.10.2026. Keine Rechtsberatung.",
  },
  en: {
    events: [
      { date: "27 Sep 2024", text: "LG Hamburg, dataset: claim dismissed", role: "teal" },
      { date: "11 Nov 2025", text: "LG München I, model: GEMA largely successful, not final", role: "amber" },
      { date: "10 Dec 2025", text: "OLG Hamburg, dataset: appeal unsuccessful", role: "teal" },
      { date: "17 Dec 2026", text: "BGH, dataset: heard 3 Sep 2026, judgment planned 17 Dec 2026", role: "neutral" },
    ],
    footer: "Status 12 Oct 2026. Not legal advice.",
  },
};

function event(index, profile, { date, text, role }) {
  const center = 90 + index * 180;
  const font = { fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE };
  return [
    {
      type: "div",
      props: {
        style: abs({ left: `${center - 80}px`, top: "20px", width: "160px", display: "flex", justifyContent: "center", ...font, color: MUTED }),
        children: date,
      },
    },
    {
      type: "div",
      props: {
        style: abs({
          left: `${center - 9}px`,
          top: "56px",
          width: "18px",
          height: "18px",
          borderRadius: "9px",
          background: satoriBackground(role, profile),
          border: satoriBorder(role, profile, { width: 2 }),
        }),
        children: "",
      },
    },
    {
      type: "div",
      props: {
        style: abs({
          left: `${center - 80}px`,
          top: "90px",
          width: "160px",
          height: "150px",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          padding: "6px",
          ...font,
          color: tone(role, profile).text,
        }),
        children: text,
      },
    },
  ];
}

function build(profile, lang = "de") {
  const c = COPY[lang];
  const children = [
    {
      type: "div",
      props: {
        style: abs({ left: "20px", top: "62px", width: "680px", height: "2px", background: tone("neutral", profile).stroke }),
        children: "",
      },
    },
    ...c.events.flatMap((e, i) => event(i, profile, e)),
    {
      type: "div",
      props: {
        style: abs({ left: "24px", bottom: "12px", fontFamily: "IBM Plex Sans", fontSize: FONT_SIZE, color: MUTED }),
        children: c.footer,
      },
    },
  ];
  const tree = {
    type: "div",
    props: {
      style: { position: "relative", width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", background: "#FFFFFF" },
      children,
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const verfahrenZeitleisteDe = {
  outPath: "public/bausteine/trainingsdaten-urheberrecht-und-datenschutz/verfahren-zeitleiste.svg",
  build: (profile) => build(profile, "de"),
};

export const proceedingsTimelineEn = {
  outPath: "public/bausteine/trainingsdaten-urheberrecht-und-datenschutz/proceedings-timeline.svg",
  build: (profile) => build(profile, "en"),
};
