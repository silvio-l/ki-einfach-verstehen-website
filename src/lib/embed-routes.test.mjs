// Every live demo that a published Baustein embeds must have an embed page.
// The embed route (src/pages/embed/[demo]/[lang].astro) restates its demo
// list in three places (DEMOS, TITLES, the known-set in getStaticPaths), and
// getStaticPaths silently skips demos missing from the known-set, so a
// forgotten entry shows up only as a 404 behind the share row. This test
// reads those lists from the .astro source and checks them against the
// demos the Baustein MDX files actually embed.
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { extractDemos } from './figure-share.mjs';

const root = new URL('../../', import.meta.url);
const embedSource = readFileSync(new URL('src/pages/embed/[demo]/[lang].astro', root), 'utf8');

function keysOf(pattern, source, label) {
	const m = pattern.exec(source);
	assert.ok(m, `embed route: ${label} not found`);
	return m[1];
}

const demosBlock = keysOf(/const DEMOS = \{([^}]*)\}/, embedSource, 'DEMOS');
const DEMO_KEYS = new Set([...demosBlock.matchAll(/(\w+):/g)].map((m) => m[1]));
const knownBlock = keysOf(/new Set\(\[([^\]]*)\]\)/, embedSource, 'known-set in getStaticPaths');
const KNOWN_KEYS = new Set([...knownBlock.matchAll(/'(\w+)'/g)].map((m) => m[1]));
const TITLE_BLOCK = { de: /\n\tde: \{([^}]*)\}/, en: /\n\ten: \{([^}]*)\}/ };
const titleKeys = (lang) => new Set([...keysOf(TITLE_BLOCK[lang], embedSource, `TITLES.${lang}`).matchAll(/(\w+): '/g)].map((m) => m[1]));

const mdxFiles = (lang) => readdirSync(new URL(`src/content/bausteine/${lang}/`, root))
	.filter((f) => f.endsWith('.mdx'))
	.map((f) => ({ file: `${lang}/${f}`, source: readFileSync(new URL(`src/content/bausteine/${lang}/${f}`, root), 'utf8') }));

test('the embed route knows every demo that a Baustein embeds', () => {
	const embedded = new Map();
	for (const lang of ['de', 'en']) {
		for (const { file, source } of mdxFiles(lang)) {
			for (const demo of extractDemos(source)) {
				if (!embedded.has(demo)) embedded.set(demo, file);
			}
		}
	}
	assert.ok(embedded.size > 0, 'no embedded demos found in src/content/bausteine');

	const titles = { de: titleKeys('de'), en: titleKeys('en') };
	const missing = [];
	for (const [demo, file] of embedded) {
		const gaps = [];
		if (!DEMO_KEYS.has(demo)) gaps.push('DEMOS');
		if (!KNOWN_KEYS.has(demo)) gaps.push('known-set');
		if (!titles.de.has(demo)) gaps.push('TITLES.de');
		if (!titles.en.has(demo)) gaps.push('TITLES.en');
		if (gaps.length) missing.push(`${demo} (in ${file}): missing in ${gaps.join(', ')}`);
	}
	assert.deepEqual(missing, [], `embed route lacks demos:\n  ${missing.join('\n  ')}`);
});
