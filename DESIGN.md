---
name: Leuchtkern
description: Light-first educational brand for an approachable AI-explainer site. Petrol structure accent on white, a mint zone tint for chrome, an amber progress accent for attention moments, warm-cream paper explicitly excluded.

# All values below are the enforceable token set for packages/website. Source
# spec: packages/content/design/designsprache.md (brand-wide "Leuchtkern"
# language, decided 2026-08-20) plus the CI grilling session that adapted it
# for a light, long-form reading site (docs/chatverlauf.md), plus the
# 2026-08-20 homepage-synthesis session that added the amber second accent.
# This frontmatter is the source of truth; src/styles/tokens.css mirrors it
# verbatim by hand — keep both in sync when values change.
colors:
  # Ground and zones
  ground-page: "#FFFFFF"       # default reading surface: article bodies, glossary
  ground-zone: "#D7ECE7"       # chrome/section tint: nav, homepage sections, card grids, announcement pages (= PETROL_SOFT)
  ground-hero-0: "#0C5049"     # hero radial ground, 0% stop
  ground-hero-34: "#073B36"    # hero radial ground, 34% stop
  ground-hero-62: "#042723"    # hero radial ground, 62% stop
  ground-hero-100: "#021613"   # hero radial ground, 100% stop

  # Text
  ink: "#1B1A17"                # primary text, headings
  ink-muted: "#55524A"          # secondary text, meta, captions

  # Neutral hairlines (ground-page only — see Elevation Needs A Border rule)
  line: "#DAD6CB"
  line-deep: "#B8B3A5"

  # Petrol accent family (structure/brand accent: nav, buttons, links, cards)
  petrol: "#0E7469"             # accent on white; do not use for small text on ground-zone (4.58:1)
  petrol-deep: "#0A5148"        # links, buttons, borders, success — safe on ground-page AND ground-zone
  petrol-soft: "#D7ECE7"        # = ground-zone
  petrol-viv: "#12907F"         # large accents, icons, focus rings only — fails small-text contrast on ground-zone (3.20:1)

  # Amber accent family (second accent: progress/attention only — see "Amber Accent" below)
  amber: "#986816"              # accent on white; do not use for small text on ground-zone (3.94:1)
  amber-deep: "#62430E"         # text/borders where amber must carry small text — safe on ground-page AND ground-zone
  amber-soft: "#FBF2E0"         # pale tint for badges/highlight chips only — never a section ground (see Do Not)
  amber-viv: "#AA7418"          # large accents, icons, progress markers only — fails small-text contrast on ground-zone (3.26:1)

  # Hero-exclusive glow (never used outside Hero/announcement headers)
  halo: "#12907F"               # 44% opacity at 0%, 15% at 55%, 0% at 100%
  coreglow-hot: "#F2FCF8"       # 95% opacity
  coreglow-mid: "#9FE2D2"       # 50% opacity at 22%
  coreglow-edge: "#3FA894"      # 22% opacity at 50%
  corehot: "#FFFFFF"            # 85% opacity
  corehot-edge: "#D8F4EA"       # 30% opacity at 60%

  # State
  success: "{colors.petrol-deep}"   # 7.46:1 on ground-zone
  error: "#A8431F"                  # 4.89:1 on ground-zone, 6.02:1 on ground-page
  focus: "{colors.petrol-viv}"      # non-text UI, 3.20:1 — meets WCAG 1.4.11, not for text

typography:
  # Root baseline (2026-08-20): the html root is set to font-size 118%, so the
  # nominal rem tiers below render 18% larger site-wide (1rem ≈ 18.9px, body
  # "18" ≈ 21px). Tiers stay written in nominal rem — the raised baseline is a
  # single root factor, not a rewrite of the scale. A reader-facing nav toggle
  # (`data-text-size="large"`, localStorage `kev:text-size`) offers one more
  # step at 136%; it only ever raises sizes above the Legibility Floor.
  scale:
    "12": "0.75rem"      # tracked-uppercase eyebrow/badge labels only — never body/reading text
    "13": "0.8125rem"    # dense diagram annotation (Wegkarte tick/cluster labels, ProgressRail label) — not for body copy
    "14": "0.875rem"     # legal smallprint, two-letter language pill — never links or list items users read
    "15": "0.9375rem"    # compact pill-style link chrome (footer link pills) — not for paragraph/body copy
    "16": "1rem"         # compact UI chrome floor (nav link, card CTA link) — not for paragraph/body copy
    "18": "1.125rem"     # default body — legibility floor, all prose copy must be ≥ this size (see §3 Legibility Floor)
    "20": "1.25rem"      # lead paragraph / card & panel titles
    "28": "1.75rem"      # H3 / subsection heads
    "40": "2.5rem"       # H2 / headline
    "64": "4rem"         # H1 / display, wide viewports
  display:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  lede:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  eyebrow:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.16em"
    lineHeight: 1.4

rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "999px"

spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  2xl: "80px"
  3xl: "112px"

components:
  button-primary:
    backgroundColor: "{colors.petrol-deep}"
    textColor: "{colors.ground-page}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.ground-page}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.petrol-deep}"
    borderColor: "{colors.petrol-deep}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  card-on-zone:
    backgroundColor: "{colors.ground-page}"
    textColor: "{colors.ink}"
    borderColor: "{colors.petrol-deep}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-on-page:
    backgroundColor: "{colors.ground-page}"
    textColor: "{colors.ink}"
    borderColor: "{colors.line}"
    rounded: "{rounded.lg}"
    padding: "24px"
  badge:
    backgroundColor: "{colors.ground-zone}"
    textColor: "{colors.petrol-deep}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  link:
    textColor: "{colors.petrol-deep}"
  quiz-correct:
    backgroundColor: "{colors.ground-zone}"
    borderColor: "{colors.success}"
    textColor: "{colors.success}"
    rounded: "{rounded.md}"
  quiz-incorrect:
    backgroundColor: "{colors.ground-page}"
    borderColor: "{colors.error}"
    textColor: "{colors.error}"
    rounded: "{rounded.md}"
  progress-marker:
    backgroundColor: "{colors.amber-viv}"
    ringColor: "{colors.amber-soft}"
    rounded: "{rounded.pill}"
  badge-progress:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber-deep}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: Leuchtkern (Website)

## 1. Overview

"Leuchtkern" is decided brand-wide (`packages/content/design/designsprache.md`, extracted from the E-Book cover). This document formalizes it for `packages/website`, which has a different job than a book cover: it carries 16 dense, long-form learning articles (Bausteine) that people read start to finish, aimed at readers who may be encountering neural networks for the first time. Light, readable, approachable — not a dark technical tool, not a cream/paper "book" pastiche.

**Key characteristics**

- Petrol is the structure/brand accent — nav, buttons, links, cards, everything that says "this is the site." Amber is a second, functionally scoped accent for progress and attention moments only (reading-position markers, "reached" states, single spotlight moments) — see "Amber Accent" below. It is not a second brand color and never appears on buttons, links, or nav.
- White is the default reading surface. The mint zone tint (`ground-zone`) marks chrome and overview sections, never body copy.
- The dark radial petrol ground + glow technique from the cover is a Hero-only signature, not a page background.
- Soft, generous radii and pill buttons — the brand is a learning companion, not a developer tool.
- Literata carries headlines only; IBM Plex Sans carries everything you actually read for more than a sentence.

## 2. Colors

### Ground and Zones

- **`ground-page`** (`#FFFFFF`): default surface for anything meant to be read at length — Baustein articles, glossary entries, quiz body copy.
- **`ground-zone`** (`#D7ECE7`, = `PETROL_SOFT`): chrome and overview surfaces — navigation, homepage sections, Themenbereich card grids, announcement pages. Never the background of a reading page.
- **Hero ground** (`ground-hero-0` → `ground-hero-100`, four-stop radial): the dark petrol-to-black gradient from the cover, `cx=0.5 cy=0.27 r=1.15`. Hero sections and announcement headers only.
- **`PAPER`/`PAPER_HI`** (the warm cream tokens from `wortbildmarke-generate.py`) are explicitly **not used** on the website. They read as book/paper pastiche; the website's light mode is `ground-page` white, not warm paper.

### The Elevation Needs A Border Rule

`ground-zone` and white have almost no luminance difference (~1.2:1 — checked, not eyeballed). A white card floating on `ground-zone` with no border is invisible. Any card sitting on `ground-zone` (`card-on-zone`) **must** carry a `petrol-deep` hairline border — shadow or whitespace alone will not separate it. A card sitting on `ground-page` (`card-on-page`) uses the neutral `line` hairline instead; it doesn't need the stronger petrol border because the surrounding ground is already white.

### Text

- **`ink`** (`#1B1A17`): headings, primary body text. 14.1:1 on `ground-page`, 14.1:1 on `ground-zone`.
- **`ink-muted`** (`#55524A`): captions, meta lines, secondary copy. 6.3:1 on `ground-zone`.

### Petrol Accent

- **`petrol`** (`#0E7469`): accent on white. Do not use for small text on `ground-zone` — 4.58:1 there is borderline AA.
- **`petrol-deep`** (`#0A5148`): the safe default for links, button fills, borders, and success state — 7.46:1 on both grounds. When in doubt, use this one, not `petrol`.
- **`petrol-viv`** (`#12907F`): large accents, icons, and focus rings only. 3.20:1 on `ground-zone` clears WCAG 1.4.11 (non-text, 3:1) but fails normal-text AA (4.5:1) — never set body or label text in this color.

### Amber Accent (Second Accent)

Petrol reads cool and structural; amber (hue ≈38°, warm gold/brown) sits ~135° away on the wheel — a strong, deliberate contrast rather than a tint of petrol — while matching petrol's own four-tier lightness structure (base/deep/soft/viv) so the two families read as a designed pair, not an accident:

- **`amber`** (`#986816`): accent on white (4.85:1). Do not use for small text on `ground-zone` — 3.94:1 fails AA there.
- **`amber-deep`** (`#62430E`): the safe default when amber must carry small text, borders, or links — 9.02:1 on `ground-page`, 7.32:1 on `ground-zone`, matching `petrol-deep`'s role and headroom.
- **`amber-soft`** (`#FBF2E0`): pale warm tint for badges and highlight chips only. It is **not** a second zone ground — using it as a section background would create the second theme the brand explicitly rejects (see Do Not).
- **`amber-viv`** (`#AA7418`): large accents, icons, and progress markers only — 3.26:1 on `ground-zone` clears WCAG 1.4.11 (non-text, 3:1) but fails normal-text AA, same constraint as `petrol-viv`.

**Scope — what amber is for:** amber is the "you are here / this is new / this is done" color, not a decorative palette expansion. Valid uses: the reading-position marker and "reached" waypoint states (the Wegweiser spine/`Du`-dot motif), progress rings and completion badges, a single spotlight highlight per view (e.g. the next-unread Baustein on a returning visit), and a semantic axis in the homepage knowledge-graph (e.g. core vs. optional nodes) — never a second color assigned per Themenbereich, which wouldn't scale past two topic areas anyway. Amber never appears on `button-primary`/`button-secondary`, links, or nav — those stay petrol so the site's primary actions keep one unambiguous accent.

### State

- **Success** = `petrol-deep`. Reuses the brand accent rather than inventing a separate green.
- **Error** = a new vermillion `#A8431F` (4.89:1 on `ground-zone`, 6.02:1 on `ground-page` — checked against both surfaces this color can appear on, e.g. quiz feedback).
- **Focus** = `petrol-viv` ring, non-text use only.

These are foundational values for consistency across tickets. The Quiz-Mechanismus ticket may refine exact usage (icon shapes, animation) but works within this palette rather than inventing its own.

### Hero-Exclusive Glow

The three-stop glow (`halo` → `coreglow` → `corehot`) from the cover transfers directly to Hero sections and nothing else. See `packages/content/design/designsprache.md` for the full radial-gradient recipe — this document doesn't duplicate it, only fixes that its use is Hero-bound.

## 3. Typography

**Display/headline face:** Literata (serif) — `H1`/`H2` only.
**Body/UI face:** IBM Plex Sans — body copy, navigation, buttons, labels, meta, everything below headline scale.

Both are self-hosted via `@fontsource` (`@fontsource/literata`, `@fontsource/ibm-plex-sans`) — no Google Fonts CDN request, consistent with the project's cookie-free Matomo stance.

### The Two-Face Rule

Literata never carries body text — a full page of serif reads heavier than 16 dense Bausteine articles should. IBM Plex Sans never carries `H1`/`H2` — headlines need the brand's serif signature to read as "Leuchtkern," not generic UI.

### The Cover Lockup Is A Signature Moment

The three-weight single-line treatment ("**KI** *einfach* **verstehen**" — bold/italic/bold in one line) from the cover is reserved for the actual brand lockup wherever it appears verbatim (homepage hero, footer, announcement page headers). Regular `H1`/`H2` headings use a single Literata weight (700) — they are not brand-lockup moments and don't need the three-tone treatment.

### Eyebrow/Kicker Adaptation

The cover's kicker style (IBM Plex Sans 500, wide tracking, `PETROL_SOFT` text) was tuned for a dark hero ground — `PETROL_SOFT` text is illegible on white. On `ground-page`/`ground-zone`, the eyebrow uses `petrol-deep` (badge component) or `ink-muted` for neutral labels instead, keeping the wide-tracking mono-weight pattern but swapping the color for the light context.

### Legibility Floor (2026-08-20)

All prose/reading copy — paragraphs, list items, card descriptions, teaser text, and any link or CTA label a visitor actually reads rather than scans as chrome — must render at **≥1rem at default browser zoom**, with `body` (1.125rem) as the preferred default for long-form article text. Since 2026-08-20 the site ships a raised root baseline of **118%** (`:root { font-size: 118% }` in `tokens.css`), so those nominal sizes land at ≈18.9px and ≈21px in practice — the floor is therefore comfortably above the classic 16px/18px marks, and the nominal rem tiers must not be lowered to "compensate" for the baseline. A nav toggle offers readers one further step (`data-text-size="large"` → 136%, persisted in localStorage `kev:text-size`); it scales the whole rem ramp up and can never take any text below the floor. This applies site-wide, not only to Baustein article bodies: the goal is effortless reading for all age groups, glasses-wearers, and tired eyes, with no zooming required and no strain from squinting at small type.

Only genuine non-reading UI chrome may sit below that floor: tracked-uppercase eyebrow/badge labels (`12`/0.75rem), dense diagram annotation on the Wegkarte/ProgressRail signature elements (`13`/0.8125rem), and the two-letter DE/EN language pill plus the legal copyright line in the footer (`14`/0.875rem). Nothing else — nav links, footer link pills, card body text, list items, meta lines, button/link labels — may use the `12`, `13`, or `14` scale tiers; `15`/`16` are for compact-but-read chrome (footer link pills, nav links, card CTA links), never paragraph copy, and `18`+ is for anything meant to be read at length.

This is a project design decision, not something the Impeccable design hook enforces: its built-in floors (11px for functional/UI text, 10px for non-interactive smallprint, 12px for general body copy) are a mechanical safety net against genuinely broken type, not a target to design down to — and the hook's `ignore-value`/`ignore-rule` config only lowers or suppresses a finding, it has no mechanism to raise a floor. Upholding the stricter floor above is a manual review responsibility for every new component, human or agent.

## 4. Motif: Phyllotaxis

The Goldwinkel spiral (parameters in `packages/content/design/designsprache.md`) is a brand signature, not decoration — it appears in exactly two places:

1. **Hero bloom** — large, full parametrization, Hero sections only.
2. **Section mark** — small, low-density instance as a section-end/footer marker (e.g. closing a Baustein, or a footer flourish).

No other placement. Reusing it as generic background texture on cards, loading states, or dividers dilutes it into wallpaper.

## 5. Shape

Soft and approachable, not technical-precise: radii from `8px` (small chips) up to full `pill` (buttons, badges). This is a deliberate departure from a sharp-cornered "dev tool" aesthetic — the brand's "du"-address and beginner-friendly tone call for rounder, softer geometry.

## 6. Components

- **Buttons**: `button-primary` (`petrol-deep` fill, white text, pill), `button-secondary` (transparent, `petrol-deep` border + text, pill). No ghost/ternary variant defined yet — add one only when a real page needs it.
- **Cards**: `card-on-zone` (white fill, mandatory `petrol-deep` border — see Elevation rule) vs. `card-on-page` (white fill, `line` neutral border). Pick the variant by what ground the card sits on, not by preference.
- **Badge/eyebrow**: `ground-zone` fill, `petrol-deep` text, pill, used for tags and kickers on light grounds.
- **Links**: `petrol-deep` text (never `petrol` at small sizes on a zone ground).
- **Quiz feedback**: `quiz-correct` (zone fill, `success`/`petrol-deep` border+text), `quiz-incorrect` (page fill, `error` border+text). Exact card layout is the Quiz-Mechanismus ticket's job; the colors are fixed here so that ticket doesn't invent its own.
- **Progress marker**: `amber-viv` fill with an `amber-soft` ring, pill-shaped — the reading-position/"you are here" dot and "reached" waypoint states.
- **Progress badge**: `amber-soft` fill, `amber-deep` text, pill — completion/"new" chips, distinct from the neutral `badge` (which stays `ground-zone`/`petrol-deep`).

### Prose Elements (markdown-rendered article content)

Every standard markdown output element inside an article body (`.prose` in `ContentEntryLayout.astro`, Bausteine and Glossar entries alike, DE + EN) is part of the system — an unstyled browser-default table or list in a Baustein is a bug, not a content problem. Canonical treatments:

- **Running text**: `body` face at the local reading measure (~72ch), paragraphs spaced ≈1.35em for an airy rhythm; wide breakout elements (tables, code blocks, excursion cards, figures) may run up to ~12ch wider than the measure.
- **Tables**: collapsed borders — outer frame `line-deep`, inner cell hairlines `line`; header row `ground-zone` fill with IBM Plex Sans 600 in `petrol-deep`; cell padding from the `sp` spacing tokens; body cells use `tabular-nums` so number columns (scores, counts) align vertically.
- **Lists**: petrol-deep `::marker`, ~1.4em indent, breathing room between items.
- **Blockquotes**: 3px `petrol-soft` left bar, `ink-muted` text.
- **Inline code**: monospace on a `ground-zone` chip, small radius. **Code blocks** (Shiki): the highlighter brings its own theme background; the frame — `sp` padding, large radius, horizontal scroll — comes from the system.
- **`<details>` excursions** ("Eine Ebene tiefer"): quiet `line`-bordered card, border and summary text turning `petrol-deep` when open.
- **`<hr>`**: a `line-deep` hairline pause at the reading measure, never a decorative divider.

## 7. Do and Do Not

### Do

- Do default reading surfaces to `ground-page` (white).
- Do use `ground-zone` for chrome and overview/grid sections, never for a page of body copy.
- Do border every card on `ground-zone` with `petrol-deep` — it's the only thing that makes it visible there.
- Do keep the Hero radial-glow ground and the three-weight cover lockup exclusive to genuine brand moments.
- Do use `petrol-deep` as the default safe accent when unsure between it and `petrol`/`petrol-viv`.
- Do self-host Literata and IBM Plex Sans via `@fontsource`.
- Do use amber only for progress/attention moments (position markers, "reached"/"new" states, a single spotlight highlight, the core-vs-optional axis on the knowledge graph) — never as a general-purpose second brand color.

### Do Not

- Do not use `PAPER`/`PAPER_HI` (warm cream) anywhere on the website — that's cover-exclusive and explicitly rejected for the site's light mode.
- Do not set body or label text in `petrol` on a `ground-zone` background (4.58:1, borderline) or in `petrol-viv` anywhere (3.20:1, fails text AA). The same rule applies to `amber` on `ground-zone` (3.94:1) and `amber-viv` anywhere (3.26:1 on zone) — use `amber-deep` wherever amber must carry small text.
- Do not rely on shadow or whitespace alone to separate a card from `ground-zone` — it doesn't create enough contrast; use the border.
- Do not use Literata for body copy or IBM Plex Sans for `H1`/`H2`.
- Do not reuse the Phyllotaxis motif as generic decoration beyond the Hero bloom and the section mark.
- Do not introduce a second theme/dark mode — one committed theme for now. `amber-soft` is a chip/badge tint, not a section ground; it must never replace `ground-page`/`ground-zone` as a page or section background.
- Do not put amber on `button-primary`/`button-secondary`, links, or nav — those stay petrol so primary actions keep one unambiguous accent.
- Do not assign amber (or any hue) per Themenbereich as a category-color scheme — it doesn't scale as topic areas are added; differentiate Themenbereiche by content/position, not by a growing color palette.

## 8. Wortbildmarke

This section is binding, not descriptive. It exists because the wrong mark shipped
live twice before this was written down — once as an invented "small cut" nobody
decided on. Read it before touching any brand-mark file.

**There is exactly one decided Wortbildmarke: Kandidat A, weight-corrected.** Source of
truth is `packages/content/design/wortbildmarke-generate.py`, function `mark_a()` — a
textured, 13-mass, 10-stroke/7-node "K" geometry. The weight correction ("Gewichtskorrektur")
exists specifically so this SAME full-detail geometry holds up at every size the site
actually uses it at, nav and footer included — see the comparison at 24px/40px/56px in
`packages/content/design/wortbildmarke-forschung.html`, "Kandidat A · Gewichtskorrektur",
Runde 4.

**Use it everywhere, at every size ≥24px, with no alternate cut.** Exported files:
`export/mark-light.svg` (light ground) and `export/mark-dark.svg` (dark ground, footer),
both `viewBox="7.57 3.17 66 93.66"` — aspect ratio width:height = 66 : 93.66 ≈ **0.7046**.
Any CSS sizing a `<Fragment set:html={...} />` of these must derive width from height
times 0.7046 (or vice versa), never an approximated or rounded ratio.

**Do not invent or reintroduce a simplified "small cut."** The generator also contains
`mark_a_small()` and the export script writes `mark-small-light.svg`/`mark-small-dark.svg`
from it — a structurally different, 4-mass simplified geometry with viewBox
`4.73 1.12 71.58 97.77` (ratio ≈ 0.7322). This is not an approved alternate for small
sizes. It was used live in Nav/Footer/favicons in an earlier session without real sign-off,
renders as a smooth rounded blob barely readable as a "K," and was corrected on
2026-08-20. If a future session is tempted to reach for it because the full cut looks
noisy at very small pixel sizes (see below), that temptation is the bug, not the fix —
raise the sizing problem instead of quietly swapping geometry.

**Known open tension: raster favicons at 16×16px.** The full Kandidat-A cut's texture
(13 masses, fine Fugen) is close to the legibility limit at a true 16×16px raster —
`favicon-16.png` reads as soft/noisy at that size, `favicon-32.png` is legible but not
crisp. This is a real, disclosed trade-off, not a silently accepted defect: the
alternative (falling back to `mark_a_small()` for favicons only) was deliberately
rejected because it would let the "invent a small cut" pattern back in through a side
door. If this needs revisiting, it should be solved by generating a genuinely new,
purpose-built low-resolution glyph reduction (fewer masses, same silhouette logic,
explicitly scoped to "favicon raster only") and documenting it here as a named,
decided exception — not by reaching for `mark_a_small()`.

**Favicon raster pipeline**: `packages/content/design/wortbildmarke-export.py` renders
`mark-light.svg` at 768px via `rsvg-convert`, then Lanczos-downsamples to each target
size (16/32/48/180) — never a naive direct-size SVG rasterisation. Re-run that script
and copy its `export/favicon-*.png`, `export/apple-touch-icon-180.png`, and
`export/mark-light.svg` (→ `public/favicon.svg`) into `packages/website/public/`
whenever the generator geometry changes.
- Do not load fonts from Google Fonts CDN.
