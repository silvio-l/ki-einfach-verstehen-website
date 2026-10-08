import { strict as assert } from 'node:assert';
import { readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';
import { GLOSS_DE, barPercent, findWord, formatCos, formatInt, idDistance, optionLabel, pairCosine } from './neighbors.js';

const dataUrl = new URL('./data/gpt2-neighbors.json', import.meta.url);
const data = JSON.parse(readFileSync(dataUrl, 'utf8'));
const lesson = (lang) => readFileSync(new URL(`../../content/bausteine/${lang}/embeddings.mdx`, import.meta.url), 'utf8');
const names = (w) => findWord(data, w).nb.map(([t]) => t.replace('␣', ''));
const two = (w) => findWord(data, w).nb.map(([t, , c]) => [t.replace('␣', ''), Number(c.toFixed(2))]);

test('the data names its model and pinned revision and stays small', () => {
	assert.equal(data.model, 'openai-community/gpt2');
	assert.match(data.revision, /^[0-9a-f]{40}$/);
	assert.equal(data.vocabSize, 50257);
	assert.ok(statSync(dataUrl).size < 150_000);
});

test('the IDs are the ones of the text', () => {
	assert.equal(findWord(data, 'apple').id, 17180);
	assert.equal(findWord(data, 'laptop').id, 13224);
	assert.equal(findWord(data, 'peach').id, 47565);
	for (const lang of ['de', 'en']) for (const id of ['17180', '13224', '47565']) assert.ok(lesson(lang).includes(id));
});

test('the neighbor lists match the text and its diagram exactly', () => {
	// Text and diagram: apples, Apple, cider, peach, lemon, fruit (the top six).
	assert.deepEqual(two('apple').slice(0, 6), [['apples', 0.7], ['Apple', 0.62], ['cider', 0.55], ['peach', 0.53], ['lemon', 0.52], ['fruit', 0.51]]);
	// "Apple": the diagram is a selection (it skips "iPhones"), so its six
	// must appear in this order and with these values.
	const want = [['iPhone', 0.64], ['apple', 0.62], ['iOS', 0.59], ['Microsoft', 0.55], ['iPad', 0.54], ['Macintosh', 0.54]];
	const got = two('Apple').filter(([t]) => want.some(([w]) => w === t));
	assert.deepEqual(got, want);
	// "iPhone" only turns up among apple's neighbors after many fruit words.
	assert.ok(!names('apple').includes('iPhone'));
	for (const lang of ['de', 'en']) for (const word of ['cider', 'peach', 'lemon', 'iPhone', 'iOS', 'Microsoft', 'iPad', 'Macintosh']) assert.ok(lesson(lang).includes(word));
});

test('the pair values of the text and the box come out of the data', () => {
	assert.equal(pairCosine(data, 'apple', 'peach'), 0.533);
	assert.equal(pairCosine(data, 'peach', 'apple'), 0.533);
	assert.equal(pairCosine(data, 'apple', 'laptop'), 0.357);
	assert.equal(data.baseline.pairs, 20000);
	assert.equal(formatCos(data.baseline.mean, 'de', 2), '0,27');
	assert.equal(formatCos(data.baseline.p95, 'en', 2), '0.35');
	assert.ok(lesson('de').includes('0,533') && lesson('de').includes('0,357') && lesson('de').includes('0,27'));
	assert.ok(lesson('en').includes('0.533') && lesson('en').includes('0.357') && lesson('en').includes('0.27'));
	// The main text rounds them: 0,53 and 0,36.
	assert.ok(lesson('de').includes('0,53,') || lesson('de').includes('0,53 '));
	assert.ok(lesson('de').includes('0,36'));
});

test('the pair table agrees with the per-word neighbor lists', () => {
	// "queen" is among king's neighbors and also listed, so both must agree.
	const queen = findWord(data, 'king').nb.find(([t]) => t === '␣queen');
	assert.equal(pairCosine(data, 'king', 'queen'), queen[2]);
	assert.equal(pairCosine(data, 'dog', 'dog'), 1);
});

test('only whole-word tokens are neighbors, never the word itself', () => {
	for (const w of data.words) {
		assert.equal(w.nb.length, 8);
		for (const [t, id, c] of w.nb) {
			assert.match(t, /^␣[A-Za-z]+$/);
			assert.notEqual(id, w.id);
			assert.ok(c <= w.nb[0][2]);
		}
		assert.deepEqual(w.idn.map(([, id]) => id), [w.id - 1, w.id + 1]);
	}
});

test('a neighboring ID is no similar word', () => {
	// The tokens next to "apple" in the vocabulary are far less similar than
	// its real neighbors, and below the random-pair 95 % mark.
	for (const w of data.words) for (const [, , c] of w.idn) assert.ok(c < w.nb[0][2]);
	for (const [, , c] of findWord(data, 'apple').idn) assert.ok(c < data.baseline.p95);
	assert.equal(idDistance(data, 'apple', 'laptop'), 3956);
	assert.equal(idDistance(data, 'apple', 'peach'), 30385);
});

test('every word has a German gloss and labels read naturally', () => {
	for (const w of data.words) assert.ok(GLOSS_DE[w.w], w.w);
	assert.equal(optionLabel('apple', 'de'), 'apple (Apfel)');
	assert.equal(optionLabel('Paris', 'de'), 'Paris');
	assert.equal(optionLabel('apple', 'en'), 'apple');
});

test('numbers are written per language', () => {
	assert.equal(formatCos(0.456, 'de'), '0,456');
	assert.equal(formatCos(0.456, 'en'), '0.456');
	assert.equal(formatInt(8106, 'de'), '8.106');
	assert.equal(formatInt(8106, 'en'), '8,106');
	assert.equal(barPercent(-0.1), 0);
	assert.equal(barPercent(0.5), 50);
});
