import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { cheapest, costliest, formatNumber, isNearCostliest, meanLoss, sentencesFor, tokenLabel, tokensOf } from './satzloss.js';

const data = JSON.parse(readFileSync(new URL('./data/satzloss.json', import.meta.url), 'utf8'));
const de = sentencesFor(data, 'de');
const en = sentencesFor(data, 'en');

test('four sentences per language, each from the precomputed model', () => {
	assert.equal(data.model, 'Qwen/Qwen3-0.6B-Base');
	assert.equal(data.vocab, 151936);
	assert.equal(de.length, 4);
	assert.equal(en.length, 4);
	assert.ok(de.every((s) => s.lang === 'de') && en.every((s) => s.lang === 'en'));
});

test('every position: penalty points are −ln of the share of the right token', () => {
	for (const s of data.sentences) {
		for (const p of s.positions) {
			assert.ok(p.p > 0 && p.p <= 100);
			// Shares are stored rounded to 0.001 %; tiny ones lose precision.
			if (p.p >= 0.1) assert.ok(Math.abs(-Math.log(p.p / 100) - p.loss) < 0.01, `${s.key} ${p.target}`);
			assert.ok(p.topP >= p.p - 1e-9);
		}
	}
});

test('the sentence of the text: seven tokens, “jag” costs most, “ze” least, 4,8 on average', () => {
	const hund = de[0];
	assert.equal(hund.text, 'Der Hund jagt die Katze');
	assert.deepEqual(tokensOf(hund).map(tokenLabel), ['Der', 'Hund', 'jag', 't', 'die', 'Kat', 'ze']);
	assert.equal(tokenLabel(hund.positions[costliest(hund)].target), 'jag');
	assert.equal(tokenLabel(hund.positions[cheapest(hund)].target), 'ze');
	assert.equal(formatNumber(meanLoss(hund), 'de', 1), '4,8');
	assert.equal(formatNumber(hund.positions[cheapest(hund)].loss, 'de', 2), '0,16');
});

test('the stored average is the average of the positions', () => {
	for (const s of data.sentences) assert.ok(Math.abs(meanLoss(s) - s.mean) < 0.001, s.key);
});

test('“Paris” costs 0,74, as in the text', () => {
	const paris = de.find((s) => s.key === 'paris-de');
	assert.equal(formatNumber(paris.positions.at(-1).loss, 'de', 2), '0,74');
});

test('the solution of the demo: the Zürich sentence costs less on average than the Paris one', () => {
	const paris = de.find((s) => s.key === 'paris-de');
	const zuerich = de.find((s) => s.key === 'zuerich-de');
	assert.ok(meanLoss(zuerich) < meanLoss(paris));
	const z = zuerich.positions.find((p) => tokenLabel(p.target) === 'Z');
	assert.ok(z.loss > paris.positions.at(-1).loss);
	// In English “Zurich” is one token, and the sentence costs more.
	const parisEn = en.find((s) => s.key === 'paris-en');
	const zurichEn = en.find((s) => s.key === 'zurich-en');
	assert.ok(meanLoss(zurichEn) > meanLoss(parisEn));
	assert.equal(tokenLabel(zurichEn.positions.at(-1).target), 'Zurich');
});

test('a near tie with the costliest token counts as a hit', () => {
	const hund = sentencesFor(data, 'de').find((s) => s.text.startsWith('Der Hund'));
	const idx = (t) => hund.positions.findIndex((p) => tokenLabel(p.target) === t);
	assert.equal(isNearCostliest(hund, idx('jag')), true);
	assert.equal(isNearCostliest(hund, idx('Hund')), true);
	assert.equal(isNearCostliest(hund, idx('ze')), false);
});
