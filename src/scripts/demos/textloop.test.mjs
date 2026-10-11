import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { MAX_ROUNDS, STOP, isFinished, pickBest, pickRandom, render, scoresFor, shares } from './textloop.js';
import { formatShares } from './softmax.js';

test('greedy selection reproduces the three rounds of the Baustein', () => {
	const pieces = [];
	for (let i = 0; i < 3; i += 1) pieces.push(pickBest(scoresFor(pieces, 'de'))[0]);
	assert.deepEqual(pieces, ['auf', 'dem', 'Sofa']);
	assert.equal(render(pieces, 'de'), 'Die Katze sitzt auf dem Sofa');
	assert.deepEqual(scoresFor([], 'de')[0], ['auf', 8.1]);
	assert.deepEqual(scoresFor(['auf'], 'de')[0], ['dem', 7.6]);
});

test('a greedy run ends at the stop marker within the round limit', () => {
	const pieces = [];
	while (!isFinished(pieces)) pieces.push(pickBest(scoresFor(pieces, 'de'))[0]);
	assert.equal(pieces[pieces.length - 1], STOP);
	assert.ok(pieces.length <= MAX_ROUNDS);
	assert.equal(render(pieces, 'de'), 'Die Katze sitzt auf dem Sofa.');
});

test('random selection can take the runner-up and shares sum to one', () => {
	const list = scoresFor(['auf'], 'de');
	assert.equal(pickRandom(list, () => 0.0)[0], 'dem');
	assert.equal(pickRandom(list, () => 0.99)[0], 'einem');
	const total = shares(list).reduce((sum, s) => sum + s, 0);
	assert.ok(Math.abs(total - 1) < 1e-9);
	assert.ok(shares(list)[0] > shares(list)[1]);
});

test('the first chance list shows its leftovers as < 0,1', () => {
	assert.deepEqual(formatShares(shares(scoresFor([], 'de')), 'de', 1), ['89,9', '9,5', '0,6', '< 0,1', '< 0,1']);
	assert.deepEqual(formatShares(shares(scoresFor([], 'en')), 'en', 1), ['89.9', '9.5', '0.6', '< 0.1', '< 0.1']);
});

test('the English story mirrors the German one', () => {
	const pieces = [];
	for (let i = 0; i < 3; i += 1) pieces.push(pickBest(scoresFor(pieces, 'en'))[0]);
	assert.equal(render(pieces, 'en'), 'The cat sat on the sofa');
});

test('the chance column adds up to 100,0 % in every round of both stories', () => {
	for (const lang of ['de', 'en']) {
		const pieces = [];
		while (!isFinished(pieces)) {
			const list = scoresFor(pieces, lang);
			const labels = formatShares(shares(list), lang, 1);
			const total = labels.reduce((sum, l) => sum + (l.startsWith('<') ? 0 : Number(l.replace(',', '.'))), 0);
			assert.equal(total.toFixed(1), '100.0', `${lang} round ${pieces.length + 1}: ${labels.join(' / ')}`);
			// Leftovers under a tenth of a percent show as "< 0,1", never as a finer value.
			assert.ok(labels.every((l) => /^\d+[.,]\d$|^< 0[.,]1$/.test(l)), labels.join(' / '));
			pieces.push(pickBest(list)[0]);
		}
	}
});
