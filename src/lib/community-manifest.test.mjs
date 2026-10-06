import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { KEY_PATTERN, buildManifest, truncateBytes } from './community-manifest.js';

const GENERATED_AT = new Date('2026-10-02T12:00:00.000Z');

const themenbereiche = [
	{ lang: 'de', key: 'grundlagen', order: 1, routeSlug: 'grundlagen', title: 'Grundlagen' },
	{ lang: 'en', key: 'grundlagen', order: 1, routeSlug: 'foundations', title: 'Foundations' },
	{ lang: 'de', key: 'weg-durchs-modell', order: 2, routeSlug: 'weg-durchs-modell', title: 'Der Weg durchs Modell' },
	{ lang: 'en', key: 'weg-durchs-modell', order: 2, routeSlug: 'inside-the-model', title: 'Inside the model' },
];

const bausteine = [
	{ lang: 'de', slug: 'input-und-output', translationKey: 'input-und-output', themenbereich: 'grundlagen', order: 2, title: 'Input und Output', ueberarbeitet: new Date('2026-10-01T00:00:00.000Z') },
	{ lang: 'en', slug: 'input-and-output', translationKey: 'input-und-output', themenbereich: 'grundlagen', order: 2, title: 'Input and output' },
	{ lang: 'de', slug: 'programm-algorithmus-modell', translationKey: 'programm-algorithmus-modell', themenbereich: 'grundlagen', order: 1, title: 'Programm, Algorithmus, Modell' },
	{ lang: 'en', slug: 'program-algorithm-model', translationKey: 'programm-algorithmus-modell', themenbereich: 'grundlagen', order: 1, title: 'Program, algorithm, model' },
];

const build = (overrides = {}) => buildManifest({ themenbereiche, bausteine, retired: [], generatedAt: GENERATED_AT, ...overrides });

test('the key pattern matches the forum contract', () => {
	assert.match('input-und-output', KEY_PATTERN);
	assert.match('a1', KEY_PATTERN);
	assert.doesNotMatch('Input', KEY_PATTERN);
	assert.doesNotMatch('-leading', KEY_PATTERN);
	assert.doesNotMatch('double--dash', KEY_PATTERN);
	assert.doesNotMatch('unter_strich', KEY_PATTERN);
});

test('a normal manifest lists Themenbereiche and published Bausteine in roadmap order', () => {
	const manifest = build();
	assert.equal(manifest.schemaVersion, 1);
	assert.equal(manifest.generatedAt, '2026-10-02T12:00:00Z');
	assert.deepEqual(manifest.themenbereiche, [
		{ key: 'grundlagen', order: 1, slug: { de: 'grundlagen', en: 'foundations' }, title: { de: 'Grundlagen', en: 'Foundations' } },
		{ key: 'weg-durchs-modell', order: 2, slug: { de: 'weg-durchs-modell', en: 'inside-the-model' }, title: { de: 'Der Weg durchs Modell', en: 'Inside the model' } },
	]);
	assert.deepEqual(manifest.bausteine, [
		{
			key: 'programm-algorithmus-modell',
			themenbereich: 'grundlagen',
			order: 1,
			status: 'published',
			slug: { de: 'programm-algorithmus-modell', en: 'program-algorithm-model' },
			title: { de: 'Programm, Algorithmus, Modell', en: 'Program, algorithm, model' },
			ueberarbeitet: null,
			successors: [],
		},
		{
			key: 'input-und-output',
			themenbereich: 'grundlagen',
			order: 2,
			status: 'published',
			slug: { de: 'input-und-output', en: 'input-and-output' },
			title: { de: 'Input und Output', en: 'Input and output' },
			ueberarbeitet: '2026-10-01',
			successors: [],
		},
	]);
});

test('the manifest is plain JSON data, no Dates or undefined', () => {
	const manifest = build();
	assert.deepEqual(JSON.parse(JSON.stringify(manifest)), manifest);
});

test('a Baustein without an English variant carries null for the EN slug and title', () => {
	const manifest = build({ bausteine: bausteine.filter((b) => !(b.lang === 'en' && b.translationKey === 'input-und-output')) });
	const entry = manifest.bausteine.find((b) => b.key === 'input-und-output');
	assert.deepEqual(entry.slug, { de: 'input-und-output', en: null });
	assert.deepEqual(entry.title, { de: 'Input und Output', en: null });
});

test('a Themenbereich without an English variant carries null for the EN slug and title', () => {
	const manifest = build({ themenbereiche: themenbereiche.filter((t) => !(t.lang === 'en' && t.key === 'weg-durchs-modell')) });
	const entry = manifest.themenbereiche.find((t) => t.key === 'weg-durchs-modell');
	assert.deepEqual(entry.slug, { de: 'weg-durchs-modell', en: null });
	assert.deepEqual(entry.title, { de: 'Der Weg durchs Modell', en: null });
});

test('a retired Baustein with a successor is listed as retired after the published ones', () => {
	const retired = [
		{ key: 'alter-baustein', retiredOn: new Date('2026-09-30T00:00:00.000Z'), successors: ['input-und-output'], oldSlugs: { de: ['alter-baustein'], en: ['old-lesson'] } },
	];
	const manifest = build({ retired });
	assert.equal(manifest.bausteine.length, 3);
	assert.deepEqual(manifest.bausteine.at(-1), {
		key: 'alter-baustein',
		themenbereich: null,
		order: null,
		status: 'retired',
		slug: { de: null, en: null },
		title: { de: null, en: null },
		ueberarbeitet: null,
		successors: ['input-und-output'],
	});
});

test('a retired Baustein without a successor is still listed (the forum archives it)', () => {
	const retired = [{ key: 'alter-baustein', retiredOn: new Date('2026-09-30T00:00:00.000Z'), successors: [], oldSlugs: { de: [], en: [] } }];
	const manifest = build({ retired });
	assert.deepEqual(manifest.bausteine.at(-1).successors, []);
	assert.equal(manifest.bausteine.at(-1).status, 'retired');
});

test('a successor that is not a published Baustein fails the build', () => {
	const retired = [{ key: 'alter-baustein', retiredOn: new Date('2026-09-30T00:00:00.000Z'), successors: ['gibt-es-nicht'], oldSlugs: { de: [], en: [] } }];
	assert.throws(() => build({ retired }), /successor "gibt-es-nicht"/);
	// A retired key is not a valid successor either.
	const chain = [
		{ key: 'a', retiredOn: new Date('2026-09-30T00:00:00.000Z'), successors: ['b'], oldSlugs: { de: [], en: [] } },
		{ key: 'b', retiredOn: new Date('2026-09-30T00:00:00.000Z'), successors: [], oldSlugs: { de: [], en: [] } },
	];
	assert.throws(() => build({ retired: chain }), /successor "b"/);
});

test('a retired key that is still published is a contradiction and fails the build', () => {
	const retired = [{ key: 'input-und-output', retiredOn: new Date('2026-09-30T00:00:00.000Z'), successors: [], oldSlugs: { de: [], en: [] } }];
	assert.throws(() => build({ retired }), /"input-und-output".*published/);
});

test('keys outside the forum pattern fail the build', () => {
	assert.throws(() => build({ bausteine: [{ ...bausteine[0], translationKey: 'Input_Output' }, { ...bausteine[1], translationKey: 'Input_Output' }] }), /Input_Output/);
	assert.throws(() => build({ retired: [{ key: 'Alt', retiredOn: new Date(), successors: [], oldSlugs: { de: [], en: [] } }] }), /"Alt"/);
	assert.throws(() => build({ themenbereiche: themenbereiche.map((t) => ({ ...t, key: 'Grund lagen' })) }), /Grund lagen/);
});

test('a Baustein pointing at an unknown Themenbereich fails the build', () => {
	assert.throws(() => build({ bausteine: bausteine.map((b) => ({ ...b, themenbereich: 'nirgendwo' })) }), /nirgendwo/);
});

test('a Baustein without a German variant fails the build (DE is the lead language)', () => {
	assert.throws(() => build({ bausteine: bausteine.filter((b) => b.lang === 'en') }), /German/);
});

test('DE and EN variants must agree on Themenbereich and order', () => {
	const drift = bausteine.map((b) => (b.lang === 'en' && b.translationKey === 'input-und-output' ? { ...b, order: 5 } : b));
	assert.throws(() => build({ bausteine: drift }), /input-und-output/);
});

// ——— Glossary (newsletter, optional key) ———

const glossar = [
	{ lang: 'en', slug: 'token', translationKey: 'token', title: 'Token', description: 'The smallest unit a language model reads.' },
	{ lang: 'de', slug: 'token', translationKey: 'token', title: 'Token', description: 'Die kleinste Einheit, die ein Sprachmodell liest.' },
	{ lang: 'de', slug: 'algorithmus', translationKey: 'algorithmus', title: 'Algorithmus', description: 'Eine genaue Schrittfolge.' },
];

test('without glossar input the manifest has no glossar key', () => {
	assert.equal('glossar' in build(), false);
	assert.equal('glossar' in build({ glossar: null }), false);
	assert.equal('glossar' in build({ glossar: undefined }), false);
});

test('glossar groups DE/EN by translationKey, sorted by key, after bausteine', () => {
	const manifest = build({ glossar });
	assert.deepEqual(Object.keys(manifest), ['schemaVersion', 'generatedAt', 'themenbereiche', 'bausteine', 'glossar']);
	assert.deepEqual(manifest.glossar, [
		{
			key: 'algorithmus',
			slug: { de: 'algorithmus', en: null },
			title: { de: 'Algorithmus', en: null },
			description: { de: 'Eine genaue Schrittfolge.', en: null },
		},
		{
			key: 'token',
			slug: { de: 'token', en: 'token' },
			title: { de: 'Token', en: 'Token' },
			description: { de: 'Die kleinste Einheit, die ein Sprachmodell liest.', en: 'The smallest unit a language model reads.' },
		},
	]);
	assert.deepEqual(build({ glossar: [] }).glossar, []);
});

test('a glossary entry without a German variant fails the build', () => {
	assert.throws(() => build({ glossar: glossar.filter((g) => g.lang === 'en') }), /German/);
});

test('glossary keys and slugs outside the forum pattern fail the build', () => {
	assert.throws(() => build({ glossar: [{ ...glossar[1], translationKey: 'Token' }] }), /"Token"/);
	assert.throws(() => build({ glossar: [{ ...glossar[1], slug: 'to ken' }] }), /"to ken"/);
});

test('two glossary entries of one language under one key fail the build', () => {
	assert.throws(() => build({ glossar: [glossar[1], { ...glossar[1], slug: 'token-2' }] }), /share translationKey "token"/);
});

test('a glossary title over 200 bytes fails the build', () => {
	assert.doesNotThrow(() => build({ glossar: [{ ...glossar[1], title: 'ä'.repeat(100) }] }));
	assert.throws(() => build({ glossar: [{ ...glossar[1], title: 'ä'.repeat(101) }] }), /200 bytes/);
});

test('a glossary description over 400 bytes is cut at a word boundary with "…"', () => {
	const long = 'Wörter '.repeat(80).trim();
	const out = build({ glossar: [{ ...glossar[1], description: long }] }).glossar[0].description.de;
	assert.ok(new TextEncoder().encode(out).length <= 400);
	assert.match(out, /Wörter…$/);
	assert.ok(long.startsWith(out.slice(0, -1)));
});

test('truncateBytes keeps short text, cuts multibyte text safely', () => {
	assert.equal(truncateBytes('kurz', 400), 'kurz');
	assert.equal(truncateBytes('eins zwei drei', 12), 'eins zwei…');
	assert.equal(truncateBytes('ääääää', 9), 'äää…');
	assert.equal(truncateBytes('ääääää', 8), 'ää…');
	assert.equal(truncateBytes('eins, zwei', 9), 'eins…');
});
