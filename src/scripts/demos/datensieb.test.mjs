import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { PAGES, RULES, detectLanguage, qualityReasons, remainingAfter, sieve, stats } from './datensieb.js';

const byId = (results) => Object.fromEntries(results.map((r) => [r.id, r]));

test('the thresholds are the published Gopher values', () => {
	assert.deepEqual(RULES, {
		minWords: 50,
		maxWords: 100_000,
		minMeanWordLength: 3,
		maxMeanWordLength: 10,
		maxSymbolRatio: 0.1,
		maxBulletShare: 0.9,
		maxEllipsisShare: 0.3,
		minLetterShare: 0.8,
	});
});

test('stats measure words, lines and symbols', () => {
	const s = stats('• eins zwei\n• drei …\nvier');
	assert.equal(s.words, 7);
	assert.equal(s.bulletShare, 2 / 3);
	assert.equal(s.ellipsisShare, 1 / 3);
	assert.equal(s.letterShare, 4 / 7);
	assert.deepEqual(qualityReasons('kurz'), ['too-short']);
});

test('language: ordinary words decide, lists and menus stay undecided', () => {
	assert.equal(detectLanguage('Wisch den Rahmen und die Kette trocken, wenn du im Regen fährst.'), 'de');
	assert.equal(detectLanguage('Wipe the frame and the chain dry after you ride in the rain.'), 'en');
	assert.equal(detectLanguage('Start\nKontakt\nImpressum'), null);
});

test('German part: 9 invented pages, 2 stay, each removed at the stage the text describes', () => {
	const results = sieve(PAGES.de, 'de');
	const r = byId(results);
	assert.equal(PAGES.de.length, 9);
	assert.deepEqual([0, 1, 2, 3].map((d) => remainingAfter(results, d)), [9, 8, 3, 2]);
	assert.deepEqual(r.englisch, { id: 'englisch', stage: 0, reasons: ['en'] });
	assert.equal(r.menue.stage, 1);
	assert.deepEqual(r.menue.reasons, ['too-short']);
	assert.equal(r.suchbegriffe.stage, 1);
	assert.ok(r.suchbegriffe.reasons.includes('bullets'));
	assert.deepEqual(r.amtsdeutsch.reasons, ['word-length']);
	assert.ok(r.teaser.reasons.includes('ellipsis'));
	assert.ok(r.nummern.reasons.includes('letters'));
	assert.deepEqual(r.kopie, { id: 'kopie', stage: 2, reasons: ['duplicate'] });
	assert.equal(r.pflege.stage, null);
	assert.equal(r.rezept.stage, null);
});

test('the official-German page fails Gopher only by word length, within the 15 Aleph Alpha allows', () => {
	const s = stats(PAGES.de.find((p) => p.id === 'amtsdeutsch').text);
	assert.ok(s.words >= RULES.minWords);
	assert.ok(s.meanWordLength > 10 && s.meanWordLength <= 15, String(s.meanWordLength));
});

test('English part: 8 invented pages, 2 stay', () => {
	const results = sieve(PAGES.en, 'en');
	const r = byId(results);
	assert.deepEqual([0, 1, 2, 3].map((d) => remainingAfter(results, d)), [8, 7, 3, 2]);
	assert.deepEqual(r.englisch.reasons, ['de']);
	assert.equal(r.kopie.stage, 2);
	assert.equal(r.pflege.stage, null);
	assert.equal(r.rezept.stage, null);
});

test('every page id is unique per language', () => {
	for (const pages of Object.values(PAGES)) assert.equal(new Set(pages.map((p) => p.id)).size, pages.length);
});
