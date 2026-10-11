import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expectedFiles, LANGS, loadCourse, splitFrontmatter, TOC_END, TOC_START, withToc } from './export-lessons.mjs';

const websiteRoot = fileURLToPath(new URL('..', import.meta.url));

test('every published Baustein exports without leftover component tags', () => {
	const files = expectedFiles(websiteRoot);
	const lessons = [...files].filter(([rel]) => rel.startsWith('lessons/'));
	assert.ok(lessons.length >= 2, 'expected exported lessons');
	for (const [rel, md] of lessons) {
		assert.doesNotMatch(md, /<\/?[A-Z][A-Za-z]*\b/, `${rel} still contains a component tag`);
		assert.doesNotMatch(md, /<iframe|^import /m, `${rel} still contains web-only markup`);
		assert.match(md, /CC BY 4\.0/, `${rel} lacks the licence line`);
	}
});

// A Baustein missing from its Themenbereich's list is live on the site but
// absent from the topic page, the README contents and lessons/ -- and the
// two languages then drift apart (found 2026-10-11: EN "Layers").
test('every Baustein file is listed in its Themenbereich, the same way in both languages', () => {
	const course = loadCourse(websiteRoot);
	for (const lang of LANGS) {
		const dir = join(websiteRoot, 'src/content/bausteine', lang);
		const files = readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).sort();
		const joined = course[lang].flatMap((tb) => tb.bausteine.filter((b) => b.published).map((b) => b.file)).sort();
		assert.deepEqual(joined, files, `${lang}: Bausteine missing from their Themenbereich list`);
	}
	const shape = (lang) => course[lang].map((tb) => `${tb.key}:${tb.bausteine.map((b) => (b.published ? 'p' : '-')).join('')}`);
	assert.deepEqual(shape('en'), shape('de'), 'DE and EN Themenbereiche plan or publish different Bausteine');
});

test('withToc replaces only the text between the markers', () => {
	const readme = `head\n${TOC_START}\nold\n${TOC_END}\ntail`;
	assert.equal(withToc(readme, 'new'), `head\n${TOC_START}\nnew\n${TOC_END}\ntail`);
	assert.throws(() => withToc('no markers', 'x'), /markers/);
});

test('splitFrontmatter parses YAML and keeps the body', () => {
	const { data, body } = splitFrontmatter("---\ntitle: 'A ''b'''\norder: 2\n---\n\nBody");
	assert.deepEqual(data, { title: "A 'b'", order: 2 });
	assert.equal(body, '\nBody');
});
