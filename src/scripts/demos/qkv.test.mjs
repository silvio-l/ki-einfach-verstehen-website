import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { OLD_STATE, SENTENCES, attend, dot, fmt, matVec, percents, queryOf, shareDecimal, softmax } from './qkv.js';

const SETTINGS = [
	['park', 'seat'],
	['park', 'money'],
	['money', 'seat'],
	['money', 'money'],
];

test('the shares of every setting add up to exactly 1 and to 100 %', () => {
	for (const [sentence, kind] of SETTINGS) {
		const r = attend(sentence, kind);
		const sum = r.rows.reduce((a, row) => a + row.weight, 0);
		assert.ok(Math.abs(sum - 1) < 1e-12, `${sentence}/${kind}: ${sum}`);
		assert.equal(
			r.rows.reduce((a, row) => a + row.pct, 0),
			100,
		);
		// The demo's numbers are chosen so plain rounding already gives 100.
		assert.deepEqual(
			r.rows.map((row) => row.pct),
			r.rows.map((row) => Math.round(row.weight * 100)),
		);
	}
});

test('softmax and the percent split work for any scores', () => {
	assert.ok(Math.abs(softmax([5, 5, 5]).reduce((a, b) => a + b, 0) - 1) < 1e-12);
	assert.deepEqual(percents([1 / 3, 1 / 3, 1 / 3]), [34, 33, 33]);
	assert.equal(percents(softmax([0, 1, 2, 3, 4, 9])).reduce((a, b) => a + b, 0), 100);
});

test('the query is a weighted sum of the state', () => {
	assert.deepEqual(OLD_STATE, [1, 1]);
	assert.deepEqual(queryOf('seat'), [1, 0]);
	assert.deepEqual(queryOf('money'), [0, 1]);
	assert.deepEqual(matVec([[0.5, 0.5]], [1, 1]), [1]);
	assert.equal(dot([1, 0], [2, 0]), 2);
});

test('start state: park sentence, query looks for seat clues', () => {
	const r = attend('park', 'seat');
	assert.equal(SENTENCES.park.words.de[r.focus], 'Bank');
	assert.equal(SENTENCES.park.words.en[r.focus], 'bank');
	assert.deepEqual(
		r.rows.map((row) => row.score),
		[0, 2, 1, 0, 1],
	);
	assert.deepEqual(
		r.rows.map((row) => row.pct),
		[7, 50, 18, 7, 18],
	);
	assert.equal(fmt(r.mix[0], 'de'), '1,2');
	assert.equal(fmt(r.mix[1], 'de'), '0,2');
	assert.equal(fmt(r.next[0], 'de'), '2,2');
	assert.equal(fmt(r.next[1], 'de'), '1,2');
});

test('the other three settings', () => {
	const pm = attend('park', 'money');
	assert.deepEqual(
		pm.rows.map((row) => row.pct),
		[15, 15, 15, 15, 40],
	);
	assert.deepEqual([fmt(pm.next[0], 'en'), fmt(pm.next[1], 'en')], ['1.7', '1.4']);
	const ms = attend('money', 'seat');
	assert.deepEqual(
		ms.rows.map((row) => row.pct),
		[13, 13, 13, 13, 13, 35],
	);
	assert.deepEqual([fmt(ms.next[0], 'en'), fmt(ms.next[1], 'en')], ['1.4', '1.7']);
	const mm = attend('money', 'money');
	assert.deepEqual(
		mm.rows.map((row) => row.score),
		[0, 2, 3, 0, 0, 1],
	);
	assert.deepEqual(
		mm.rows.map((row) => row.pct),
		[3, 22, 61, 3, 3, 8],
	);
	assert.deepEqual([fmt(mm.next[0], 'en'), fmt(mm.next[1], 'en')], ['1.1', '2.5']);
});

test('the mix written with the shown shares gives the shown result', () => {
	// Readers recompute the mix from the rounded shares; it must match.
	for (const [sentence, kind] of SETTINGS) {
		const r = attend(sentence, kind);
		for (const d of [0, 1]) {
			const byHand = r.rows.reduce((a, row) => a + (row.pct / 100) * row.value[d], 0);
			assert.equal(fmt(byHand, 'en'), fmt(r.mix[d], 'en'), `${sentence}/${kind} place ${d}`);
		}
	}
});

test('the old state stays and the mix is added to it', () => {
	for (const [sentence, kind] of SETTINGS) {
		const r = attend(sentence, kind);
		r.next.forEach((x, d) => assert.ok(Math.abs(x - (OLD_STATE[d] + r.mix[d])) < 1e-12));
	}
});

test('later words are locked: keys and values only up to "Bank"', () => {
	for (const s of Object.values(SENTENCES)) {
		assert.equal(s.keys.length, s.focus + 1);
		assert.equal(s.values.length, s.focus + 1);
		for (const lang of ['de', 'en']) assert.ok(s.words[lang].length >= s.focus + 1);
	}
});

test('numbers are written per language', () => {
	assert.equal(fmt(0.35, 'de'), '0,4');
	assert.equal(fmt(2, 'de'), '2');
	assert.equal(shareDecimal(50, 'de'), '0,50');
	assert.equal(shareDecimal(7, 'en'), '0.07');
});
