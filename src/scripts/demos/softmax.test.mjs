import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { CAT_EXAMPLE, draw, drawMany, formatNumber, formatPercent, scaled, seeded, softmax } from './softmax.js';

const pct = (shares, lang = 'de', decimals = 0) => shares.map((s) => formatPercent(s, lang, decimals));

test('the start state is the example of the Baustein: 72 / 27 / 1 %', () => {
	assert.deepEqual(CAT_EXAMPLE.scores, [3, 2, -1]);
	assert.equal(CAT_EXAMPLE.temperature, 1);
	assert.deepEqual(CAT_EXAMPLE.de.words, ['sitzt', 'schläft', 'fliegt']);
	assert.deepEqual(CAT_EXAMPLE.en.words, ['sat', 'slept', 'flew']);
	assert.deepEqual(pct(softmax(CAT_EXAMPLE.scores, 1)), ['72', '27', '1']);
});

test('the temperatures of the text: 0.5 -> 88 / 12 / 0,03, 2 -> 57 / 35 / 8, 0.2 -> over 99', () => {
	assert.deepEqual(pct(softmax([3, 2, -1], 0.5)), ['88', '12', '0,03']);
	assert.deepEqual(pct(softmax([3, 2, -1], 0.5), 'en'), ['88', '12', '0.03']);
	assert.deepEqual(scaled([3, 2, -1], 0.5), [6, 4, -2]);
	assert.deepEqual(pct(softmax([3, 2, -1], 2)), ['57', '35', '8']);
	assert.ok(softmax([3, 2, -1], 0.2)[0] > 0.99);
});

test('shares always add up to 1 and nobody falls to zero', () => {
	for (const t of [0.1, 0.5, 1, 2]) {
		const s = softmax([3, 2, -1], t);
		assert.ok(Math.abs(s.reduce((a, b) => a + b, 0) - 1) < 1e-12);
		assert.ok(s.every((x) => x > 0));
	}
});

test('only the gaps count: adding 10 to every score changes nothing', () => {
	const a = softmax([3, 2, -1]);
	const b = softmax([13, 12, 9]);
	a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-12));
});

test('temperature 0 always takes the most likely one', () => {
	assert.deepEqual(softmax([3, 2, -1], 0), [1, 0, 0]);
	assert.deepEqual(softmax([1, 5, 5], 0), [0, 1, 0]);
	const counts = drawMany(softmax([3, 2, -1], 0), 50, seeded(1));
	assert.deepEqual(counts, [50, 0, 0]);
});

test('counted entries weigh like that many equal scores', () => {
	const folded = softmax([{ score: 3 }, { score: -10, count: 4 }]);
	const flat = softmax([3, -10, -10, -10, -10]);
	assert.ok(Math.abs(folded[1] - flat.slice(1).reduce((a, b) => a + b, 0)) < 1e-12);
	// The long tail of the Baustein's box: 50,000 pieces at -10 take 7.5 %.
	const tail = softmax([3, 2, -1, { score: -10, count: 50000 }]);
	assert.equal(formatPercent(tail[3], 'de', 1), '7,5');
});

test('draw picks the slice the random number falls into', () => {
	const s = [0.72, 0.27, 0.01];
	assert.equal(draw(s, () => 0), 0);
	assert.equal(draw(s, () => 0.71), 0);
	assert.equal(draw(s, () => 0.73), 1);
	assert.equal(draw(s, () => 0.995), 2);
	assert.equal(draw([0.5, 0.5, 0], () => 0.9999999999), 1);
});

test('many draws come close to the shares (seeded)', () => {
	const counts = drawMany(softmax([3, 2, -1]), 10000, seeded(42));
	assert.equal(counts.reduce((a, b) => a + b, 0), 10000);
	assert.ok(Math.abs(counts[0] / 10000 - 0.721) < 0.02);
	assert.ok(Math.abs(counts[1] / 10000 - 0.265) < 0.02);
	assert.ok(counts[2] > 50 && counts[2] < 250);
	// Same seed, same result.
	assert.deepEqual(drawMany(softmax([3, 2, -1]), 100, seeded(7)), drawMany(softmax([3, 2, -1]), 100, seeded(7)));
});

test('numbers are written per language and never round up to 100 or down to 0', () => {
	assert.equal(formatPercent(0.4876, 'de', 1), '48,8');
	assert.equal(formatPercent(0.4876, 'en', 1), '48.8');
	assert.equal(formatPercent(0.9933, 'de'), '99,3');
	assert.equal(formatPercent(0.99995, 'de'), '> 99,9');
	assert.equal(formatPercent(1e-7, 'en'), '< 0.01');
	assert.equal(formatPercent(1, 'de'), '100');
	assert.equal(formatPercent(0, 'de'), '0');
	assert.equal(formatNumber(-1, 'de'), '−1,0');
	assert.equal(formatNumber(-0.04, 'de'), '0,0');
	assert.equal(formatNumber(0.5, 'en'), '0.5');
});
