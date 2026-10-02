import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { buildRedirects, routesFromPageFiles } from './community-redirects.js';

const bausteine = [
	{ lang: 'de', slug: 'input-und-output', translationKey: 'input-und-output' },
	{ lang: 'en', slug: 'input-and-output', translationKey: 'input-und-output' },
	{ lang: 'de', slug: 'tokenizer-ids-vokabular', translationKey: 'tokenizer-ids-vokabular' },
];

const routes = new Set([
	'/',
	'/de/',
	'/en/',
	'/de/bausteine/input-und-output/',
	'/en/lessons/input-and-output/',
	'/de/bausteine/tokenizer-ids-vokabular/',
	'/de/glossar/token/',
	'/de/datenschutz/',
]);

const build = (overrides = {}) => buildRedirects({ retired: [], redirects: [], bausteine, routes, ...overrides });

test('the empty case yields no redirects', () => {
	assert.deepEqual(build(), []);
});

test('an explicit redirect maps an old path to an existing page', () => {
	const list = build({ redirects: [{ from: '/de/bausteine/eingabe-und-ausgabe/', to: '/de/bausteine/input-und-output/' }] });
	assert.deepEqual(list, [{ from: '/de/bausteine/eingabe-und-ausgabe/', to: '/de/bausteine/input-und-output/' }]);
});

test('old slugs of a retired Baustein redirect to its first successor, per language', () => {
	const retired = [
		{ key: 'alter-baustein', successors: ['input-und-output'], oldSlugs: { de: ['alter-baustein', 'ganz-alt'], en: ['old-lesson'] } },
	];
	assert.deepEqual(build({ retired }), [
		{ from: '/de/bausteine/alter-baustein/', to: '/de/bausteine/input-und-output/' },
		{ from: '/de/bausteine/ganz-alt/', to: '/de/bausteine/input-und-output/' },
		{ from: '/en/lessons/old-lesson/', to: '/en/lessons/input-and-output/' },
	]);
});

test('without a successor, or without a translated successor, old slugs fall back to the language home', () => {
	const retired = [
		{ key: 'weg', successors: [], oldSlugs: { de: ['weg'], en: ['gone'] } },
		{ key: 'nur-de', successors: ['tokenizer-ids-vokabular'], oldSlugs: { de: ['alt-de'], en: ['old-en'] } },
	];
	assert.deepEqual(build({ retired }), [
		{ from: '/de/bausteine/alt-de/', to: '/de/bausteine/tokenizer-ids-vokabular/' },
		{ from: '/de/bausteine/weg/', to: '/de/' },
		{ from: '/en/lessons/gone/', to: '/en/' },
		{ from: '/en/lessons/old-en/', to: '/en/' },
	]);
});

test('a redirect source that collides with a real route fails the build', () => {
	assert.throws(() => build({ redirects: [{ from: '/de/bausteine/input-und-output/', to: '/de/' }] }), /collides/);
	assert.throws(() => build({ retired: [{ key: 'x', successors: [], oldSlugs: { de: ['tokenizer-ids-vokabular'], en: [] } }] }), /collides/);
	assert.throws(() => build({ redirects: [{ from: '/de/datenschutz/', to: '/de/' }] }), /collides/);
});

test('a redirect to a page that does not exist fails the build', () => {
	assert.throws(() => build({ redirects: [{ from: '/de/bausteine/alt/', to: '/de/bausteine/neu/' }] }), /does not exist/);
});

test('redirect chains, duplicates and self-redirects fail the build', () => {
	assert.throws(
		() =>
			build({
				redirects: [
					{ from: '/de/bausteine/a/', to: '/de/bausteine/input-und-output/' },
					{ from: '/de/bausteine/a/', to: '/de/' },
				],
			}),
		/twice/,
	);
	assert.throws(
		() =>
			build({
				redirects: [
					{ from: '/de/bausteine/a/', to: '/de/bausteine/b/' },
					{ from: '/de/bausteine/b/', to: '/de/bausteine/input-und-output/' },
				],
			}),
		/chain|does not exist/,
	);
	assert.throws(() => build({ redirects: [{ from: '/de/bausteine/a/', to: '/de/bausteine/a/' }] }), /itself|does not exist/);
});

test('only locale-prefixed, trailing-slash paths are accepted as sources and targets', () => {
	assert.throws(() => build({ redirects: [{ from: '/bausteine/alt/', to: '/de/' }] }), /from/);
	assert.throws(() => build({ redirects: [{ from: '/de/bausteine/alt', to: '/de/' }] }), /from/);
	assert.throws(() => build({ redirects: [{ from: '/de/bausteine/Alt/', to: '/de/' }] }), /from/);
	assert.throws(() => build({ redirects: [{ from: '/de/bausteine/alt/', to: 'https://evil.example/' }] }), /to/);
	assert.throws(() => build({ redirects: [{ from: '/de/bausteine/alt/', to: '//evil.example/' }] }), /to/);
});

test('page files map to the routes Astro generates from them', () => {
	const routes = routesFromPageFiles([
		'./index.astro',
		'./404.astro',
		'./de/index.astro',
		'./de/datenschutz.astro',
		'./de/community/index.astro',
		'./de/suche-index.json.ts',
		'./de/bausteine/[slug].astro',
		'./de/bausteine/[slug].md.ts',
		'./[...redirect].astro',
		'./community-manifest.json.ts',
	]);
	assert.deepEqual([...routes].sort(), ['/', '/404/', '/community-manifest.json', '/de/', '/de/community/', '/de/datenschutz/', '/de/suche-index.json']);
});
