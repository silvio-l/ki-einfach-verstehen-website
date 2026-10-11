import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { applyExceptions, bodyShape, findDrift } from './check-language-parity.mjs';

/** A throwaway website root with one Themenbereich, one Baustein and one glossary entry per language. */
function fixture(overrides = {}) {
	const root = mkdtempSync(join(tmpdir(), 'parity-'));
	const files = {
		'src/content/themenbereiche/de/grundlagen.md': '---\ntranslationKey: grundlagen\norder: 1\nbausteine:\n  - order: 1\n---\n',
		'src/content/themenbereiche/en/foundations.md': '---\ntranslationKey: grundlagen\norder: 1\nbausteine:\n  - order: 1\n---\n',
		'src/content/bausteine/de/modell.mdx':
			'---\ntranslationKey: modell\nthemenbereich: grundlagen\norder: 1\nquiz:\n  - id: q1\n    richtig: 0\n    optionen: [a, b]\n---\n## Eins\n\nSiehe [Token](/de/glossar/token).\n\n<Figure kind="diagramm"><img src="/bausteine/modell/bild.svg" alt="" /></Figure>\n',
		'src/content/bausteine/en/model.mdx':
			'---\ntranslationKey: modell\nthemenbereich: grundlagen\norder: 1\nquiz:\n  - id: q1\n    richtig: 0\n    optionen: [a, b]\n---\n## One\n\nSee [token](/en/glossary/token).\n\n<Figure kind="diagramm"><img src="/bausteine/modell/picture.svg" alt="" /></Figure>\n',
		'src/content/glossar/de/token.md': '---\ntranslationKey: token\n---\nEin Token.\n',
		'src/content/glossar/en/token.md': '---\ntranslationKey: token\n---\nA token.\n',
		...overrides,
	};
	for (const [rel, text] of Object.entries(files)) {
		if (text === null) continue;
		mkdirSync(dirname(join(root, rel)), { recursive: true });
		writeFileSync(join(root, rel), text);
	}
	return root;
}

const checks = (problems) => problems.map((p) => p.check).sort();

test('matching DE and EN content passes, translated image names included', () => {
	assert.deepEqual(findDrift(fixture()), []);
});

test('a Baustein without its translation is drift', () => {
	assert.deepEqual(checks(findDrift(fixture({ 'src/content/bausteine/en/model.mdx': null }))), ['baustein-pair']);
});

test('a Baustein missing from its Themenbereich list is drift (EN "Layers", 2026-10-11)', () => {
	const root = fixture({ 'src/content/themenbereiche/en/foundations.md': '---\ntranslationKey: grundlagen\norder: 1\nbausteine: []\n---\n' });
	assert.deepEqual(checks(findDrift(root)), ['themenbereich-listing', 'themenbereich-plan']);
});

test('quiz, structure and link differences are each reported', () => {
	const root = fixture({
		'src/content/bausteine/en/model.mdx':
			'---\ntranslationKey: modell\nthemenbereich: grundlagen\norder: 1\nquiz:\n  - id: q1\n    richtig: 1\n    optionen: [a, b]\n---\n## One\n\n## Two\n\nNo link.\n\n<Figure kind="diagramm"><img src="/bausteine/modell/picture.svg" alt="" /></Figure>\n',
	});
	assert.deepEqual(checks(findDrift(root)), ['baustein-links', 'baustein-quiz', 'baustein-structure']);
});

test('a link to the other language or to a missing page is reported', () => {
	const root = fixture({ 'src/content/glossar/en/token.md': '---\ntranslationKey: token\n---\nSee [Modell](/de/bausteine/modell) and [x](/en/glossary/nope).\n' });
	assert.deepEqual(checks(findDrift(root)), ['glossar-dead-link', 'glossar-foreign-link', 'glossar-links']);
});

test('a shared SVG with words in it is reported, a text-free one is not', () => {
	const shared = (svg) =>
		fixture({
			'public/bausteine/modell/bild.svg': svg,
			'src/content/bausteine/en/model.mdx':
				'---\ntranslationKey: modell\nthemenbereich: grundlagen\norder: 1\nquiz:\n  - id: q1\n    richtig: 0\n    optionen: [a, b]\n---\n## One\n\nSee [token](/en/glossary/token).\n\n<Figure kind="diagramm"><img src="/bausteine/modell/bild.svg" alt="" /></Figure>\n',
		});
	assert.deepEqual(checks(findDrift(shared('<svg><text x="0">Eingabe</text></svg>'))), ['baustein-shared-text-image']);
	assert.deepEqual(findDrift(shared('<svg><text x="0">42 %</text><circle r="1"/></svg>')), []);
});

test('a German page showing the -en variant of an image is reported', () => {
	const root = fixture({
		'public/bausteine/modell/bild.svg': '<svg/>',
		'public/bausteine/modell/bild-en.svg': '<svg/>',
		'src/content/bausteine/de/modell.mdx':
			'---\ntranslationKey: modell\nthemenbereich: grundlagen\norder: 1\nquiz:\n  - id: q1\n    richtig: 0\n    optionen: [a, b]\n---\n## Eins\n\nSiehe [Token](/de/glossar/token).\n\n<Figure kind="diagramm"><img src="/bausteine/modell/bild-en.svg" alt="" /></Figure>\n',
	});
	assert.deepEqual(checks(findDrift(root)), ['baustein-image-language']);
});

test('bodyShape ignores markup inside code fences', () => {
	assert.deepEqual(bodyShape('```\n## not a heading\n<Demo lang="en" />\n```\n## Real').h2, 1);
});

test('exceptions need a reason and must still match a finding', () => {
	const problems = [{ check: 'baustein-links', key: 'modell', message: '' }];
	assert.deepEqual(applyExceptions(problems, [{ check: 'baustein-links', key: 'modell', reason: 'deliberate' }]), { open: [], errors: [] });
	const missingReason = applyExceptions(problems, [{ check: 'baustein-links', key: 'modell' }]);
	assert.equal(missingReason.errors.length, 1);
	const stale = applyExceptions([], [{ check: 'baustein-links', key: 'modell', reason: 'gone' }]);
	assert.match(stale.errors[0], /stale exception/);
});
