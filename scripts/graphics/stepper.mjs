// Step-through animation on top of a D2 diagram (replaces the free-form
// layout of scripts/render-process.mjs, whose moving boxes overlapped).
//
// The layout comes entirely from D2, so nothing can overlap: the animation
// never moves a box. Each step only highlights the nodes and edges it names,
// dims the rest and runs a dot along the active edges. The static SVG for the
// book is the same D2 diagram (edge labels carry the step numbers).
//
// D2 marks every node as <g class="base64(id)"> and every edge as
// <g class="base64("(a -&gt; b)[0]")">, which is how steps address them.

import { renderD2 } from "./d2-render.mjs";

const LABELS = {
  de: { back: "Zurück", next: "Weiter", play: "Abspielen", pause: "Anhalten", restart: "Noch einmal", badge: "Animation", steps: "Schritte" },
  en: { back: "Back", next: "Next", play: "Play", pause: "Pause", restart: "Play again", badge: "Animation", steps: "steps" },
};

export function nodeClass(id) {
  return Buffer.from(id, "utf8").toString("base64");
}

export function edgeClass(edge, index = 0) {
  const [from, to] = edge.split("->").map((part) => part.trim());
  return Buffer.from(`(${from} -&gt; ${to})[${index}]`, "utf8").toString("base64");
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Every id a step refers to must exist in the SVG, otherwise a step would
// silently highlight nothing.
export function validateSteps(svg, steps) {
  const classes = new Set([...svg.matchAll(/<g class="([^"]+)"/g)].map((m) => m[1]));
  const errors = [];
  steps.forEach((step, i) => {
    for (const id of step.nodes ?? []) {
      if (!classes.has(nodeClass(id))) errors.push(`step ${i + 1}: node "${id}" not in diagram`);
    }
    for (const edge of step.edges ?? []) {
      if (!classes.has(edgeClass(edge))) errors.push(`step ${i + 1}: edge "${edge}" not in diagram`);
    }
    if (!step.caption) errors.push(`step ${i + 1}: caption missing`);
  });
  if (steps.length < 2 || steps.length > 8) errors.push(`expected 2-8 steps, got ${steps.length}`);
  if (errors.length) throw new Error(`stepper: ${errors.join("; ")}`);
}

// One landscape layout for every screen width: the whole diagram stays in
// view at once, and its text size is checked for phones (legibility.mjs).
// Controls and caption sit above the diagram so they are seen first; the
// animation plays once on its own when it scrolls into view. The page
// reports its height to the embedding Figure (postMessage) so the frame
// fits its content instead of a fixed aspect ratio.
export function renderStepper({ wide, steps, title, intro, lang = "de" }) {
  validateSteps(wide, steps);
  const t = LABELS[lang];
  // Never scale the diagram far beyond its drawn size, so its text stays
  // close to the size of the body text around the frame.
  const drawnWidth = parseFloat(wide.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+)/)?.[1] ?? "720");
  const maxWidth = Math.round(drawnWidth * 1.15);
  const data = steps.map((step) => ({
    caption: step.caption,
    nodes: (step.nodes ?? []).map(nodeClass),
    edges: (step.edges ?? []).map((edge) => edgeClass(edge)),
  }));
  // Only ever shown inside a Baustein's iframe: keep the bare file out of
  // search results, but let its content count for the embedding page.
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, indexifembedded">
<title>${escapeHtml(title)}</title>
<style>
  :root { --ink: #1B1A17; --muted: #5F594D; --teal: #0E7469; --teal-dark: #0A5148; --amber: #C9821B; --card: #F7F5EF; --line: #DDD7C8; }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #FFFFFF; color: var(--ink); font-family: 'IBM Plex Sans', system-ui, sans-serif; }
  body { display: flex; flex-direction: column; gap: 10px; padding: 10px 4px 4px; }
  .bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .bar button { font: inherit; font-size: 15px; line-height: 1; padding: 9px 14px; border-radius: 999px; border: 1.5px solid var(--teal); background: #FFFFFF; color: var(--teal-dark); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
  .bar button.primary { background: var(--teal); color: #FFFFFF; font-weight: 600; }
  .bar button:disabled { opacity: 0.35; cursor: default; }
  .bar button:focus-visible { outline: 3px solid #F1C46A; outline-offset: 2px; }
  .bar .icon { width: 12px; height: 12px; fill: currentColor; }
  .dots { display: flex; gap: 6px; margin-left: auto; align-items: center; }
  .dots span { width: 9px; height: 9px; border-radius: 50%; background: var(--line); transition: background 0.3s ease, transform 0.3s ease; }
  .dots span.is-past { background: #9CC9C2; }
  .dots span.is-current { background: var(--teal); transform: scale(1.3); }
  .badge { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #8A5A12; }
  .caption { margin: 0; padding: 10px 14px; border-radius: 10px; background: var(--card); border: 1px solid var(--line); border-left: 4px solid var(--teal); font-size: 16px; line-height: 1.45; }
  .stage svg { display: block; width: 100%; max-width: ${maxWidth}px; height: auto; margin-inline: auto; }
  .stage g[data-kev] { transition: opacity 0.35s ease; }
  .stage.is-stepping g[data-kev] { opacity: 0.2; }
  .stage.is-stepping g[data-kev].is-active { opacity: 1; }
  .dot { fill: var(--amber); stroke: #FFFFFF; stroke-width: 2; transition: opacity 0.4s ease 0.2s; }
  .dot.is-done { opacity: 0; }
  @media (max-width: 480px) {
    .bar button { padding: 8px 11px; font-size: 14px; }
    .bar .label-optional { display: none; }
    .caption { font-size: 15px; }
  }
</style>
</head>
<body>
<div class="bar">
  <button type="button" id="play" class="primary"><svg class="icon" viewBox="0 0 12 12" aria-hidden="true"><path id="play-icon" d="M2 1l9 5-9 5z"/></svg><span id="play-label">${t.play}</span></button>
  <button type="button" id="back" aria-label="${t.back}">‹<span class="label-optional"> ${t.back}</span></button>
  <button type="button" id="next" aria-label="${t.next}"><span class="label-optional">${t.next} </span>›</button>
  <div class="dots" id="dots" aria-hidden="true">${steps.map(() => "<span></span>").join("")}</div>
</div>
<p class="caption" id="caption" aria-live="polite"><span class="badge">${t.badge} · ${steps.length} ${t.steps}</span><br>${escapeHtml(intro)}</p>
<div class="stage" id="stage">${wide}</div>
<script>
(() => {
  const steps = ${JSON.stringify(data)};
  const t = ${JSON.stringify({ play: t.play, pause: t.pause, restart: t.restart })};
  const stepLabel = (i, n) => ${lang === "de" ? "`Schritt ${i} von ${n}: `" : "`Step ${i} of ${n}: `"};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.getElementById('stage');
  const caption = document.getElementById('caption');
  const introHtml = caption.innerHTML;
  const dots = [...document.getElementById('dots').children];
  const back = document.getElementById('back');
  const next = document.getElementById('next');
  const play = document.getElementById('play');
  const playLabel = document.getElementById('play-label');
  const playIcon = document.getElementById('play-icon');
  // D2 node and edge groups carry a base64 id as their only class; plain
  // style classes ("shape", "connection fill-B1") never round-trip.
  const isD2Id = (cls) => cls.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(cls) && (() => { try { return btoa(atob(cls)) === cls; } catch { return false; } })();
  for (const g of stage.querySelectorAll('g[class]')) {
    if (isD2Id(g.getAttribute('class'))) g.setAttribute('data-kev', '');
  }
  const groupsFor = (cls) => stage.querySelectorAll('g[data-kev][class~="' + cls + '"]');
  const ns = 'http://www.w3.org/2000/svg';
  let current = -1;
  let timer = null;
  let flying = [];

  function clearDots() { flying.forEach((d) => d.remove()); flying = []; }

  function runDot(edgeGroup) {
    const path = edgeGroup.querySelector('path');
    if (!path || reduceMotion) return;
    const length = path.getTotalLength();
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', '8');
    dot.setAttribute('class', 'dot');
    edgeGroup.parentNode.appendChild(dot);
    flying.push(dot);
    const start = performance.now();
    const duration = 900;
    function frame(now) {
      if (!dot.isConnected) return;
      const p = Math.min(1, (now - start) / duration);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const pt = path.getPointAtLength(eased * length);
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      if (p < 1) requestAnimationFrame(frame);
      // Fade out on arrival so the dot doesn't cover the arrowhead.
      else dot.classList.add('is-done');
    }
    requestAnimationFrame(frame);
  }

  function setPlayButton(state) {
    playLabel.textContent = t[state];
    playIcon.setAttribute('d', state === 'pause' ? 'M2 1h3v10H2zM7 1h3v10H7z' : 'M2 1l9 5-9 5z');
  }

  function show(index) {
    current = index;
    clearDots();
    for (const g of stage.querySelectorAll('g[data-kev]')) g.classList.remove('is-active');
    dots.forEach((d, i) => { d.classList.toggle('is-current', i === index); d.classList.toggle('is-past', i < index); });
    if (index < 0) {
      stage.classList.remove('is-stepping');
      caption.innerHTML = introHtml;
    } else {
      const step = steps[index];
      stage.classList.add('is-stepping');
      for (const id of [...step.nodes, ...step.edges]) groupsFor(id).forEach((g) => g.classList.add('is-active'));
      step.edges.forEach((id) => groupsFor(id).forEach(runDot));
      caption.textContent = '';
      const strong = document.createElement('strong');
      strong.textContent = stepLabel(index + 1, steps.length);
      caption.append(strong, step.caption);
    }
    back.disabled = index < 0;
    next.disabled = index >= steps.length - 1;
    reportHeight();
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    setPlayButton(current >= steps.length - 1 ? 'restart' : 'play');
  }

  function startPlaying() {
    if (current >= steps.length - 1) show(-1);
    setPlayButton('pause');
    show(current + 1);
    timer = setInterval(() => {
      if (current >= steps.length - 1) { stop(); return; }
      show(current + 1);
    }, 3400);
  }

  back.addEventListener('click', () => { stop(); show(Math.max(-1, current - 1)); });
  next.addEventListener('click', () => { stop(); show(Math.min(steps.length - 1, current + 1)); });
  play.addEventListener('click', () => { if (timer) stop(); else startPlaying(); });

  // Tell the embedding page how tall the content is; the tallest caption
  // is reserved up front so the frame doesn't jump between steps.
  function reportHeight() {
    // The body's own box, not scrollHeight: that never drops below the
    // current frame height, so the frame could grow but never shrink.
    parent.postMessage({ kevStepper: true, height: Math.ceil(document.body.getBoundingClientRect().height) }, '*');
  }
  const probe = caption.cloneNode();
  probe.style.cssText = 'position:absolute;visibility:hidden;left:0;right:0;margin:0 4px';
  document.body.append(probe);
  function reserveCaption() {
    let max = 0;
    for (const text of [introHtml, ...steps.map((s) => '<strong>' + stepLabel(steps.length, steps.length) + '</strong>' + s.caption)]) {
      probe.innerHTML = text;
      max = Math.max(max, probe.offsetHeight);
    }
    caption.style.minHeight = max + 'px';
    reportHeight();
  }
  window.addEventListener('resize', reserveCaption);
  window.addEventListener('load', reserveCaption);
  reserveCaption();

  // Play once on its own the first time most of the figure is in view.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        if (current < 0 && !timer) startPlaying();
      }
    }, { threshold: 0.6 });
    io.observe(stage);
  }
  show(-1);
})();
</script>
</body>
</html>
`;
}

// A gen-graphics entry for one animation: `source(text, profile)` returns
// the D2 diagram. `outPath`
// gets the static landscape figure (book, plus grayscale), `htmlPath` the
// interactive version.
export function stepperFigure({ source, text, copy, steps, lang, outPath, htmlPath }) {
  return {
    outPath,
    build: (profile) => renderD2(source(text, profile)),
    html: {
      outPath: htmlPath,
      build: () =>
        renderStepper({
          wide: renderD2(source(text, "color")),
          steps: steps(copy.captions),
          title: copy.title,
          intro: copy.intro,
          lang,
        }),
    },
  };
}
