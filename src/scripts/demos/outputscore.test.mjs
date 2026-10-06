import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DIMS, MAX_ABS_SCORE, RANGE, ROWS, START_STATE, equalRow, formatNumber, products, ranking, score } from './outputscore.js';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const TEXTS = {
	de: read('../../content/bausteine/de/output-head.mdx'),
	en: read('../../content/bausteine/en/output-head.mdx'),
};
const QUOTE = { de: (w) => `„${w}“`, en: (w) => `“${w}”` };
const tuple = (v, lang) => `(${v.map((x) => formatNumber(x, lang)).join(' | ')})`;

test('the start state and every row are exactly the numbers of the text', () => {
	for (const lang of ['de', 'en']) {
		const text = TEXTS[lang];
		const state = tuple(START_STATE, lang);
		assert.ok(text.includes(`the state ${state}`) || text.includes(`der Zustand ${state}`), `${lang}: state ${state} not in the text`);
		for (const r of ROWS) {
			const word = QUOTE[lang](r.word[lang]);
			const row = tuple(r.row, lang);
			const at = text.indexOf(word, text.indexOf(state));
			assert.ok(at >= 0, `${lang}: ${word} not in the toy example`);
			const near = text.slice(at, at + 60);
			assert.ok(near.includes(row), `${lang}: ${word} should read ${row}, text has "${near}"`);
		}
	}
});

test('the scores are the ones the text works out', () => {
	assert.deepEqual(
		ROWS.map((r) => score(START_STATE, r.row)),
		[4, 2.5, 1.5, -1],
	);
	assert.deepEqual(products(START_STATE, ROWS[0].row), [2, 0.5, 1.5]);
	assert.ok(TEXTS.de.includes('2,0 + 0,5 + 1,5 = 4,0'));
	assert.ok(TEXTS.en.includes('2.0 + 0.5 + 1.5 = 4.0'));
	assert.deepEqual(
		ranking(START_STATE).map((r) => r.key),
		['cat', 'pigeon', 'duck', 'cloud'],
	);
});

test('the invented position names fit the numbers of the rows', () => {
	// animal: every animal positive, the cloud negative
	assert.equal(DIMS[0].key, 'animal');
	for (const r of ROWS) assert.equal(r.row[0] > 0, r.key !== 'cloud');
	// quick: cat and pigeon yes, duck and cloud neutral
	assert.deepEqual(ROWS.map((r) => r.row[1]), [1, 1, 0, 0]);
	// object: every animal clearly not one, the cloud undecided
	for (const r of ROWS) assert.equal(r.row[2] < 0, r.key !== 'cloud');
	assert.equal(DIMS.length, START_STATE.length);
});

test('turning "animal" negative puts the cloud in front', () => {
	assert.equal(ranking([-1, 0.5, -1])[0].key, 'cloud');
	assert.equal(ranking([-1, 0, 0])[0].key, 'cloud');
});

test('equal is not needed: a state equal to the pigeon row still ranks the cat first', () => {
	const pigeon = ROWS.find((r) => r.key === 'pigeon').row;
	assert.equal(equalRow(pigeon)?.key, 'pigeon');
	assert.equal(equalRow(START_STATE), undefined);
	const ranked = ranking(pigeon);
	assert.equal(ranked[0].key, 'cat');
	assert.equal(ranked[0].score, 4.5);
	assert.equal(ranked[1].score, 3);
});

test('ties keep the order of the text', () => {
	assert.deepEqual(
		ranking([0, 0, 0]).map((r) => r.key),
		['cat', 'pigeon', 'duck', 'cloud'],
	);
});

test('every reachable score fits the bar scale', () => {
	const steps = [];
	for (let v = RANGE.min; v <= RANGE.max; v += RANGE.step) steps.push(v);
	for (const a of steps) for (const b of steps) for (const c of steps) {
		for (const r of ranking([a, b, c])) assert.ok(Math.abs(r.score) <= MAX_ABS_SCORE);
	}
	assert.ok(START_STATE.every((x) => x >= RANGE.min && x <= RANGE.max && (x - RANGE.min) % RANGE.step === 0));
});

test('numbers are written like the text writes them', () => {
	assert.equal(formatNumber(2, 'de'), '2,0');
	assert.equal(formatNumber(-1.5, 'de'), '−1,5');
	assert.equal(formatNumber(0, 'de'), '0');
	assert.equal(formatNumber(-0, 'en'), '0');
	assert.equal(formatNumber(0.25, 'en'), '0.25');
	assert.equal(formatNumber(0.5, 'en', { sign: true }), '+0.5');
	assert.equal(formatNumber(-1, 'en', { sign: true }), '−1.0');
});
