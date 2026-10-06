import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { CORPUS, PROBE, SHOWN, createModel, distance, nearestShown, point, tokenize, train, trainStep } from './embedding-training.js';

const WORDS = {
	de: { apple: 'Apfel', pear: 'Birne', laptop: 'Laptop', phone: 'Handy', dog: 'Hund', cat: 'Katze', barks: 'bellt' },
	en: { apple: 'apple', pear: 'pear', laptop: 'laptop', phone: 'phone', dog: 'dog', cat: 'cat', barks: 'barks' },
};

test('the corpus holds the example sentences of the text', () => {
	assert.ok(CORPUS.de.includes('Der Apfel ist reif.'));
	assert.ok(CORPUS.de.includes('Die Birne ist reif.'));
	assert.ok(CORPUS.en.includes('The apple is ripe.'));
	assert.ok(CORPUS.en.includes('The pear is ripe.'));
	// The laptop stands in sentences about batteries and screens.
	assert.ok(CORPUS.de.some((s) => s.includes('Laptop') && s.includes('Akku')));
	assert.ok(CORPUS.de.some((s) => s.includes('Laptop') && s.includes('Bildschirm')));
	assert.ok(CORPUS.en.some((s) => s.includes('laptop') && s.includes('screen')));
	assert.equal(CORPUS.de.length, CORPUS.en.length);
});

test('every word is one token; drawn words are in the vocabulary', () => {
	assert.deepEqual(tokenize('Der Apfel ist reif.'), ['der', 'Apfel', 'ist', 'reif']);
	for (const lang of ['de', 'en']) {
		const m = createModel(lang);
		const lower = new Set(m.vocab.map((w) => w.toLowerCase()));
		assert.equal(lower.size, m.vocab.length, 'no word appears in two spellings');
		for (const w of Object.values(SHOWN[lang]).flat()) assert.ok(m.index.has(w), w);
		assert.ok(SHOWN[lang].fruit.includes(PROBE[lang]));
	}
});

test('training is deterministic with the seed', () => {
	for (const lang of ['de', 'en']) {
		const a = createModel(lang);
		const b = createModel(lang);
		train(a, 300);
		train(b, 300);
		assert.deepEqual(a.emb, b.emb);
		const other = createModel(lang, 1);
		assert.notDeepEqual(createModel(lang).emb, other.emb);
	}
});

test('at the start, apple has no more in common with pear than with laptop', () => {
	for (const lang of ['de', 'en']) {
		const w = WORDS[lang];
		const m = createModel(lang);
		assert.ok(distance(m, w.apple, w.pear) > distance(m, w.apple, w.laptop));
		assert.ok(!SHOWN[lang].fruit.includes(nearestShown(m, PROBE[lang])));
	}
});

test('after training, words used alike sit together', () => {
	for (const lang of ['de', 'en']) {
		const w = WORDS[lang];
		const m = createModel(lang);
		for (const steps of [1500, 3000]) {
			train(m, steps - m.steps);
			assert.ok(distance(m, w.apple, w.pear) < distance(m, w.apple, w.laptop), `${lang} ${steps}`);
			assert.ok(distance(m, w.apple, w.pear) < distance(m, w.apple, w.barks), `${lang} ${steps}`);
			assert.ok(distance(m, w.apple, w.pear) * 5 < distance(m, w.apple, w.laptop), `${lang} ${steps}`);
			assert.equal(nearestShown(m, w.dog), w.cat);
			assert.equal(nearestShown(m, w.laptop), w.phone);
			// The plum, seen in only two sentences, lands among the fruit.
			assert.ok(SHOWN[lang].fruit.includes(nearestShown(m, PROBE[lang])), `${lang} ${steps}`);
		}
	}
});

test('one step trains one sentence and moves only its words', () => {
	const m = createModel('de');
	const before = m.emb.map((r) => [...r]);
	const step = trainStep(m);
	assert.equal(m.steps, 1);
	assert.ok(CORPUS.de.includes(step.sentence));
	const words = tokenize(step.sentence);
	for (const [i, w] of m.vocab.entries()) {
		const moved = point(m, w)[0] !== before[i][0] || point(m, w)[1] !== before[i][1];
		// The last word predicts nothing after it, so its row stays.
		assert.equal(moved, words.slice(0, -1).includes(w), w);
	}
});

test('the prediction error shrinks', () => {
	const m = createModel('en');
	let early = 0;
	for (let i = 0; i < 84; i++) early += trainStep(m).loss;
	train(m, 2000);
	let late = 0;
	for (let i = 0; i < 84; i++) late += trainStep(m).loss;
	assert.ok(late < early * 0.75);
});
