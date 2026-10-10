import { renderD2 } from "../d2-render.mjs";
import { tone } from "../tokens.mjs";

const NEUTRAL_FONT_COLOR = "#1B1A17";

function block(role, profile, { fontColor, shape = "rectangle" } = {}) {
  const t = tone(role, profile);
  return `
  shape: ${shape}
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 20
  style.font-color: "${fontColor ?? t.text}"
  style.fill: "${t.fill}"
  style.stroke: "${t.stroke}"${t.d2Pattern ? `\n  style.fill-pattern: "${t.d2Pattern}"` : ""}${t.strokeDash ? `\n  style.stroke-dash: ${t.strokeDash}` : ""}`;
}

function edge(profile, label) {
  return `{
  label: "${label}"
  style.stroke: "${tone("teal", profile).stroke}"
  style.stroke-width: 2
  style.font-size: 18
}`;
}

// A hand-written rule filter: a mail passes three if-then rules in order and
// the first rule that matches decides. The address-book rule comes first, so
// every rule changes the outcome: known senders go straight to the inbox,
// then two spam rules, and whatever is left goes to the inbox as well.
function source({ mail, rules, spam, inbox, yes, no }, profile) {
  const neutral = block("neutral", profile, { fontColor: NEUTRAL_FONT_COLOR });
  const rule = block("teal", profile);
  const spamStyle = block("amber", profile);
  // A 3x3 grid keeps the figure close to the other diagrams' proportions
  // with large text: the rules run down the middle column, the inbox sits
  // to the left and spam to the right. Empty cells are invisible placeholders.
  const gap = `"" {style.opacity: 0; style.fill: transparent; style.stroke: transparent; width: 10; height: 10}`;
  return `
grid-rows: 3
grid-columns: 3
horizontal-gap: 100
vertical-gap: 70

mail: "${mail}" {${neutral}}
r1: "${rules[0]}" {${rule}}
g1: ${gap}
inbox: "${inbox}" {${neutral}}
r2: "${rules[1]}" {${rule}}
spam: "${spam}" {${spamStyle}}
g2: ${gap}
r3: "${rules[2]}" {${rule}}
g3: ${gap}

mail -> r1: ${edge(profile, "")}
r1 -> inbox: ${edge(profile, yes)}
r1 -> r2: ${edge(profile, no)}
r2 -> spam: ${edge(profile, yes)}
r2 -> r3: ${edge(profile, no)}
r3 -> spam: ${edge(profile, yes)}
r3 -> inbox: ${edge(profile, no)}
`;
}

export const ruleFilterDe = {
  outPath: "public/bausteine/programm-algorithmus-modell/regelfilter.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          mail: "neue Mail",
          rules: ["Absender im\\nAdressbuch?", "Betreff enthält\\n„Gewinn“?", "mehr als drei\\nAusrufezeichen?"],
          spam: "Spam",
          inbox: "Posteingang",
          yes: "ja",
          no: "nein",
        },
        profile,
      ),
    ),
};

export const ruleFilterEn = {
  outPath: "public/bausteine/programm-algorithmus-modell/rule-filter.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          mail: "new email",
          rules: ["sender in\\naddress book?", "subject contains\\n“prize”?", "more than three\\nexclamation marks?"],
          spam: "Spam",
          inbox: "Inbox",
          yes: "yes",
          no: "no",
        },
        profile,
      ),
    ),
};
