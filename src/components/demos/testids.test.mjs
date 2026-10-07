// Guard for the testability rule: every interactive element in the markup of
// a live demo carries a stable, language-independent data-testid, and no
// static id appears twice in one file. Elements built by the demo scripts get
// their ids in the script; this test only reads the static markup.
import { strict as assert } from 'node:assert';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const dir = new URL('./', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('Demo.astro'));
const INTERACTIVE = new Set(['button', 'input', 'select', 'textarea']);

/** The template part of an .astro file: no frontmatter, scripts or styles. */
function markupOf(source) {
	const body = source.replace(/^---\n[\s\S]*?\n---\n/, '');
	return body.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<style\b[\s\S]*?<\/style>/g, '');
}

/** Opening tags as { name, text }, skipping over `>` inside {expressions}. */
function openingTags(markup) {
	const tags = [];
	const start = /<([a-zA-Z][\w-]*)/g;
	let m;
	while ((m = start.exec(markup))) {
		let depth = 0;
		let quote = '';
		let i = m.index + m[0].length;
		for (; i < markup.length; i += 1) {
			const c = markup[i];
			if (quote) {
				if (c === quote) quote = '';
			} else if (c === '"' || c === "'" || c === '`') {
				quote = c;
			} else if (c === '{') {
				depth += 1;
			} else if (c === '}') {
				depth -= 1;
			} else if (c === '>' && depth === 0) {
				break;
			}
		}
		tags.push({ name: m[1].toLowerCase(), text: markup.slice(m.index, i + 1) });
		start.lastIndex = i + 1;
	}
	return tags;
}

test('the guard finds the demo components', () => {
	assert.ok(files.length >= 9, `only ${files.length} demo files found`);
	assert.ok(files.includes('Demo.astro'));
});

test('the tag scanner reads attributes with expressions', () => {
	const tags = openingTags('<input value={a > b ? 1 : 2} data-testid="x" /><button>ok</button>');
	assert.deepEqual(
		tags.map((t) => t.name),
		['input', 'button'],
	);
	assert.match(tags[0].text, /data-testid="x"/);
});

for (const file of files) {
	const tags = openingTags(markupOf(readFileSync(new URL(file, dir), 'utf8')));

	test(`${file}: every interactive element has a data-testid`, () => {
		const missing = tags.filter((t) => INTERACTIVE.has(t.name) && !/\sdata-testid=/.test(t.text));
		assert.deepEqual(
			missing.map((t) => t.text),
			[],
		);
	});

	test(`${file}: static data-testids are unique and kebab-case`, () => {
		const ids = tags.flatMap((t) => [...t.text.matchAll(/\sdata-testid="([^"]*)"/g)].map((m) => m[1]));
		const seen = new Set();
		for (const id of ids) {
			assert.match(id, /^demo-[a-z0-9]+(-[a-z0-9]+)*$/, `${id} is not kebab-case demo-<key>-…`);
			assert.ok(!seen.has(id), `duplicate data-testid "${id}"`);
			seen.add(id);
		}
	});
}

// Every demo says where its values come from (schreibanleitung.md §4): a live
// model call, real output computed in advance, or an invented simulation.
// Demos written before 2026-10-07 are listed here until they are revised;
// the list only shrinks.
const ORIGIN_LEGACY = new Set([
	'AttentionDemo.astro',
	'BpeDemo.astro',
	'ChatSequenceDemo.astro',
	'DescentDemo.astro',
	'EmbeddingTrainingDemo.astro',
	'MemoryDemo.astro',
	'NeighborsDemo.astro',
	'OutputScoreDemo.astro',
	'QkvDemo.astro',
	'SamplingDemo.astro',
	'ShapeDemo.astro',
	'TextLoopDemo.astro',
	'TokenizerDemo.astro',
	'VocabularyDemo.astro',
	'WeightsDemo.astro',
]);

for (const file of files.filter((f) => f !== 'Demo.astro')) {
	const source = readFileSync(new URL(file, dir), 'utf8');
	const declares = /<Demo\b[^>]*\sorigin=/.test(source);
	test(`${file}: declares the origin of its values`, () => {
		if (ORIGIN_LEGACY.has(file)) assert.ok(!declares, `${file} declares origin now -- remove it from ORIGIN_LEGACY`);
		else assert.ok(declares, `${file}: <Demo> needs origin="live" | "vorab" | "simulation"`);
	});
}
