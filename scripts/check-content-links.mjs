#!/usr/bin/env node
// Verifies that every /de/glossar|/en/glossary link inside a Baustein body,
// and every /de/bausteine|/en/lessons link inside a glossary entry body,
// resolves to an entry that actually exists. Content links live in Markdown
// prose, not in frontmatter, so Astro's content-collection schema (Zod)
// never sees or validates them — this script is the only thing that does.
// Also checks that each glossary entry's closing back-reference still names
// the Baustein by its current title (scripts/glossary-backlinks.mjs).

import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { backlinkTitleErrors } from './glossary-backlinks.mjs';

const websiteRoot = fileURLToPath(new URL('..', import.meta.url));
const contentRoot = join(websiteRoot, 'src/content');
const languages = ['de', 'en'];
const CONTENT_EXTENSIONS = new Set(['.md', '.mdx']);

function slugFor(file) {
  return file.slice(0, -extname(file).length);
}

function collectSlugs(collection) {
  const slugs = { de: new Set(), en: new Set() };
  for (const lang of languages) {
    let files = [];
    try {
      files = readdirSync(join(contentRoot, collection, lang));
    } catch {
      // directory may not exist yet
    }
    for (const file of files) {
      if (CONTENT_EXTENSIONS.has(extname(file))) slugs[lang].add(slugFor(file));
    }
  }
  return slugs;
}

function bodyOf(filePath) {
  return readFileSync(filePath, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
}

const bausteineSlugs = collectSlugs('bausteine');
const glossarSlugs = collectSlugs('glossar');

// Old Baustein slugs that still resolve through a redirect stub
// (src/pages/[...redirect].astro, fed by src/content/community/*.json --
// docs/community/spec.md §7.4). A link to one of them is not broken, the
// reader lands on the successor; it is reported as a note so it can be
// updated at leisure.
function collectRedirectedSlugs() {
  const slugs = { de: new Set(), en: new Set() };
  const readJson = (file) => {
    try {
      return JSON.parse(readFileSync(join(contentRoot, 'community', file), 'utf8'));
    } catch {
      return {};
    }
  };
  for (const entry of Object.values(readJson('retired-bausteine.json'))) {
    for (const lang of languages) for (const slug of entry?.oldSlugs?.[lang] ?? []) slugs[lang].add(slug);
  }
  const segment = { de: 'bausteine', en: 'lessons' };
  for (const from of Object.keys(readJson('redirects.json'))) {
    for (const lang of languages) {
      const match = new RegExp(`^/${lang}/${segment[lang]}/([a-z0-9-]+)/$`).exec(from);
      if (match) slugs[lang].add(match[1]);
    }
  }
  return slugs;
}
const redirectedSlugs = collectRedirectedSlugs();

const linkChecks = [
  { collection: 'bausteine', lang: 'de', pattern: /\(\/de\/glossar\/([a-z0-9-]+)\)/g, targetSlugs: glossarSlugs.de, targetName: 'Glossareintrag' },
  { collection: 'bausteine', lang: 'en', pattern: /\(\/en\/glossary\/([a-z0-9-]+)\)/g, targetSlugs: glossarSlugs.en, targetName: 'glossary entry' },
  { collection: 'glossar', lang: 'de', pattern: /\(\/de\/bausteine\/([a-z0-9-]+)\)/g, targetSlugs: bausteineSlugs.de, redirected: redirectedSlugs.de, targetName: 'Baustein' },
  { collection: 'glossar', lang: 'en', pattern: /\(\/en\/lessons\/([a-z0-9-]+)\)/g, targetSlugs: bausteineSlugs.en, redirected: redirectedSlugs.en, targetName: 'lesson' },
];

const errors = [];
const notes = [];

for (const { collection, lang, pattern, targetSlugs, redirected, targetName } of linkChecks) {
  let files = [];
  try {
    files = readdirSync(join(contentRoot, collection, lang));
  } catch {
    continue;
  }
  for (const file of files) {
    if (!CONTENT_EXTENSIONS.has(extname(file))) continue;
    const filePath = join(contentRoot, collection, lang, file);
    const body = bodyOf(filePath);
    for (const match of body.matchAll(pattern)) {
      const slug = match[1];
      if (targetSlugs.has(slug)) continue;
      if (redirected?.has(slug)) {
        notes.push(`${collection}/${lang}/${file}: link to ${targetName} "${slug}" resolves via redirect stub -- update it when convenient`);
        continue;
      }
      errors.push(`${collection}/${lang}/${file}: broken link to ${targetName} "${slug}"`);
    }
  }
}

// Frontmatter `title:` -- YAML single/double quoted or plain.
function titleOf(filePath) {
  const raw = /^title:\s*(.*?)\s*$/m.exec(readFileSync(filePath, 'utf8').split('\n---\n')[0])?.[1] ?? '';
  if (raw.startsWith("'")) return raw.slice(1, -1).replaceAll("''", "'");
  if (raw.startsWith('"')) return JSON.parse(raw);
  return raw;
}

for (const lang of languages) {
  const titles = new Map();
  for (const slug of bausteineSlugs[lang]) {
    const file = readdirSync(join(contentRoot, 'bausteine', lang)).find((f) => slugFor(f) === slug && CONTENT_EXTENSIONS.has(extname(f)));
    titles.set(slug, titleOf(join(contentRoot, 'bausteine', lang, file)));
  }
  for (const file of readdirSync(join(contentRoot, 'glossar', lang))) {
    if (!CONTENT_EXTENSIONS.has(extname(file))) continue;
    for (const error of backlinkTitleErrors(bodyOf(join(contentRoot, 'glossar', lang, file)), lang, titles)) {
      errors.push(`glossar/${lang}/${file}: ${error}`);
    }
  }
}

for (const note of notes) console.log(`  note: ${note}`);

if (errors.length > 0) {
  console.error('Content link problems found:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const bausteineCount = bausteineSlugs.de.size + bausteineSlugs.en.size;
const glossarCount = glossarSlugs.de.size + glossarSlugs.en.size;
console.log(`Content links OK (${bausteineCount} Bausteine, ${glossarCount} Glossareinträge geprüft).`);
