#!/usr/bin/env node
// Verifies that every /de/glossar|/en/glossary link inside a Baustein body,
// and every /de/bausteine|/en/lessons link inside a glossary entry body,
// resolves to an entry that actually exists. Content links live in Markdown
// prose, not in frontmatter, so Astro's content-collection schema (Zod)
// never sees or validates them — this script is the only thing that does.

import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = fileURLToPath(new URL('..', import.meta.url));
const contentRoot = join(websiteRoot, 'src/content');
const languages = ['de', 'en'];

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
      if (extname(file) === '.md') slugs[lang].add(file.slice(0, -3));
    }
  }
  return slugs;
}

function bodyOf(filePath) {
  return readFileSync(filePath, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
}

const bausteineSlugs = collectSlugs('bausteine');
const glossarSlugs = collectSlugs('glossar');

const linkChecks = [
  { collection: 'bausteine', lang: 'de', pattern: /\(\/de\/glossar\/([a-z0-9-]+)\)/g, targetSlugs: glossarSlugs.de, targetName: 'Glossareintrag' },
  { collection: 'bausteine', lang: 'en', pattern: /\(\/en\/glossary\/([a-z0-9-]+)\)/g, targetSlugs: glossarSlugs.en, targetName: 'glossary entry' },
  { collection: 'glossar', lang: 'de', pattern: /\(\/de\/bausteine\/([a-z0-9-]+)\)/g, targetSlugs: bausteineSlugs.de, targetName: 'Baustein' },
  { collection: 'glossar', lang: 'en', pattern: /\(\/en\/lessons\/([a-z0-9-]+)\)/g, targetSlugs: bausteineSlugs.en, targetName: 'lesson' },
];

const errors = [];

for (const { collection, lang, pattern, targetSlugs, targetName } of linkChecks) {
  let files = [];
  try {
    files = readdirSync(join(contentRoot, collection, lang));
  } catch {
    continue;
  }
  for (const file of files) {
    if (extname(file) !== '.md') continue;
    const filePath = join(contentRoot, collection, lang, file);
    const body = bodyOf(filePath);
    for (const match of body.matchAll(pattern)) {
      const slug = match[1];
      if (!targetSlugs.has(slug)) {
        errors.push(`${collection}/${lang}/${file}: broken link to ${targetName} "${slug}"`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Broken content links found:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const bausteineCount = bausteineSlugs.de.size + bausteineSlugs.en.size;
const glossarCount = glossarSlugs.de.size + glossarSlugs.en.size;
console.log(`Content links OK (${bausteineCount} Bausteine, ${glossarCount} Glossareinträge geprüft).`);
