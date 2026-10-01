#!/usr/bin/env node
// Content-gate (in addition to the Baustein limits in
// docs/content-plan/qualitaetspruefung.md):
// web-only content -- video embed, quiz, interactive exercise (ADR-0008,
// packages/ebook/CONTEXT.md "WebOnly-Block") -- may only appear inside a
// <WebOnly> block in a Baustein body, never loose in prose, because the
// book compiler (ADR-0014) strips WebOnly blocks by tag name from the raw
// MDX source. Neither a video component nor an ADR-0008 exercise component
// exists yet, so this checks for the concrete signals that *would* indicate
// such content leaking into prose today (raw iframe/script embeds, YouTube
// URLs) plus the live-demo components (src/components/demos/*Demo.astro,
// imported into a Baustein by name). Quiz content lives in the `quiz`
// frontmatter field, not the MDX body (rendered by ContentEntryLayout.astro,
// not `<Content />`), so it never needs to appear inside a WebOnly block to
// begin with.

import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = fileURLToPath(new URL('..', import.meta.url));
const contentRoot = join(websiteRoot, 'src/content/bausteine');
const languages = ['de', 'en'];
const CONTENT_EXTENSIONS = new Set(['.md', '.mdx']);

const WEB_ONLY_SIGNALS = [
  // A step-through animation with data-static-src has a static book figure
  // (ADR-0019), so it may stand in prose.
  { name: 'iframe embed', pattern: /<iframe\b(?![^>]*\bdata-static-src=)/gi },
  { name: 'inline script', pattern: /<script\b/gi },
  // Live demos (TokenizerDemo, ShapeDemo, ...) are JavaScript-only by design.
  { name: 'live demo component', pattern: /<[A-Z]\w*Demo\b/g },
  { name: 'YouTube URL', pattern: /youtube\.com|youtu\.be/gi },
];

const OPEN_TAG = /<WebOnly\b[^>]*>/g;
const CLOSE_TAG = '</WebOnly>';

function bodyOf(filePath) {
  return readFileSync(filePath, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
}

function webOnlySpans(body) {
  const spans = [];
  OPEN_TAG.lastIndex = 0;
  let match;
  while ((match = OPEN_TAG.exec(body))) {
    const closeIndex = body.indexOf(CLOSE_TAG, match.index);
    if (closeIndex === -1) continue; // unclosed -- flagged separately as a balance error
    spans.push([match.index, closeIndex + CLOSE_TAG.length]);
  }
  return spans;
}

function insideAnySpan(index, spans) {
  return spans.some(([start, end]) => index >= start && index < end);
}

const errors = [];

for (const lang of languages) {
  let files = [];
  try {
    files = readdirSync(join(contentRoot, lang));
  } catch {
    continue;
  }
  for (const file of files) {
    if (!CONTENT_EXTENSIONS.has(extname(file))) continue;
    const filePath = join(contentRoot, lang, file);
    const body = bodyOf(filePath);

    const openCount = (body.match(/<WebOnly\b[^>]*>/g) ?? []).length;
    const closeCount = (body.match(/<\/WebOnly>/g) ?? []).length;
    if (openCount !== closeCount) {
      errors.push(`bausteine/${lang}/${file}: unbalanced <WebOnly> block (${openCount} open, ${closeCount} close)`);
      continue;
    }

    const spans = webOnlySpans(body);
    for (const { name, pattern } of WEB_ONLY_SIGNALS) {
      for (const match of body.matchAll(pattern)) {
        if (!insideAnySpan(match.index, spans)) {
          errors.push(`bausteine/${lang}/${file}: ${name} found outside a <WebOnly> block`);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Web-only content found outside <WebOnly> blocks:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('Web-only content gate OK.');
