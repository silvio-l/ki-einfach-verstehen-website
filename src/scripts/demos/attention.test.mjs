import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { brightest, decodeSentence, percentLabel, startState, tokenLabel, total, triangle, winnerCounts } from './attention.js';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const DOCS = { de: JSON.parse(read('./data/attention-de.json')), en: JSON.parse(read('./data/attention-en.json')) };
const TEXTS = {
	de: read('../../content/bausteine/de/transformerbloecke-und-attention.mdx'),
	en: read('../../content/bausteine/en/transformer-blocks-and-attention.mdx'),
};

test('the data comes from the real model, all layers and heads', () => {
	for (const doc of Object.values(DOCS)) {
		assert.equal(doc.model, 'Qwen/Qwen3-0.6B-Base');
		assert.match(doc.revision, /^[0-9a-f]{40}$/);
		assert.equal(doc.layers, 28);
		assert.equal(doc.heads, 16);
		assert.equal(doc.prefix, '<|endoftext|>');
		for (const s of doc.sentences) {
			// decodeSentence throws if the byte count does not match layers x heads x triangle
			decodeSentence(s, doc);
			assert.equal(s.tokens.join(''), doc.prefix + s.text);
		}
	}
});

test('every sentence is one the text uses', () => {
	for (const [lang, doc] of Object.entries(DOCS)) {
		for (const s of doc.sentences) {
			const quoted = lang === 'de' ? `„${s.text}` : s.text;
			assert.ok(TEXTS[lang].includes(quoted), `${lang}: "${s.text}" not in the Baustein`);
		}
	}
});

test('every row of every head adds up to exactly 100 %', () => {
	for (const doc of Object.values(DOCS)) {
		for (const s of doc.sentences.map((x) => decodeSentence(x, doc))) {
			for (let l = 0; l < doc.layers; l++) {
				for (let h = 0; h < doc.heads; h++) {
					for (let q = 0; q < s.n; q++) {
						const row = s.raw(l, h, q);
						assert.equal(row.reduce((a, b) => a + b, 0), doc.quant, `${s.id} L${l} H${h} q${q}`);
						assert.ok(Math.abs(total(s.spotlight(l, h, q)) - 1) < 1e-9);
					}
				}
			}
		}
	}
});

test('the causal mask: a token sees itself and everything before, nothing after', () => {
	const doc = DOCS.de;
	const s = decodeSentence(doc.sentences[0], doc);
	const bank = s.tokens.indexOf(' Bank');
	const w = s.spotlight(3, 5, bank);
	assert.equal(w.length, s.n);
	assert.deepEqual(
		w.map((x) => x === null),
		s.tokens.map((_, k) => k > bank),
	);
	assert.deepEqual(s.tokens.slice(bank + 1), [' im', ' Park']);
	// The first position sees only itself and so gives itself all the light.
	assert.deepEqual(s.spotlight(0, 0, 0), [1, ...Array(s.n - 1).fill(null)]);
	assert.equal(triangle(s.n), 45);
});

test('the start state: "Bank" in the money sentence, block 1, head 1', () => {
	for (const [lang, word] of [['de', ' Bank'], ['en', ' bank']]) {
		const doc = DOCS[lang];
		const st = startState(doc);
		const s = doc.sentences[st.sentence];
		assert.equal(s.id, 'geld');
		assert.equal(s.tokens[st.query], word);
		assert.equal(st.layer, 0);
		assert.equal(st.head, 0);
	}
	// The demo preselects the start sentence in the select and starts the
	// sliders at the start state, not at the clearest head.
	const astro = read('../../components/demos/AttentionDemo.astro');
	assert.match(astro, /const start = startState\(doc\);/);
	assert.match(astro, /selected=\{i === start\.sentence\}/);
	assert.match(astro, /select\.value = String\(state\.sentence\);/);
	assert.doesNotMatch(astro, /start\.best/);
});

test('the clearest head of the park sentence lights up "sitze" most', () => {
	const doc = DOCS.de;
	const s = decodeSentence(doc.sentences[0], doc);
	assert.equal(s.text, 'Ich sitze auf der Bank im Park');
	const w = s.spotlight(s.best.layer, s.best.head, s.focus);
	const sitze = s.target.reduce((sum, k) => sum + w[k], 0);
	assert.deepEqual(s.target.map((k) => s.tokens[k]), [' sit', 'ze']);
	assert.ok(Math.abs(sitze - s.best.share) < 0.02);
	assert.ok(sitze > 0.4);
});

test('the counts in the demo solution: where most light from "Bank" falls', () => {
	// AttentionDemo.astro, solution: DE 9 / 348 / 44 of 448 heads, EN 7 / 349 / 39.
	const expected = { de: [9, 348, 44, ' Bank'], en: [7, 349, 39, ' bank'] };
	for (const [lang, [money, boundary, self, word]] of Object.entries(expected)) {
		const doc = DOCS[lang];
		const s = decodeSentence(doc.sentences.find((x) => x.id === 'geld'), doc);
		const counts = winnerCounts(s, doc);
		assert.equal(counts.reduce((a, b) => a + b, 0), 448);
		assert.equal(s.target.length, 1);
		assert.equal(counts[s.target[0]], money);
		assert.equal(counts[0], boundary);
		assert.equal(s.tokens[s.focus], word);
		assert.equal(counts[s.focus], self);
	}
});

test('the clearest head is really the maximum over all layers and heads', () => {
	for (const doc of Object.values(DOCS)) {
		for (const s of doc.sentences.map((x) => decodeSentence(x, doc))) {
			const share = (l, h) => s.target.reduce((sum, k) => sum + s.raw(l, h, s.focus)[k], 0) / doc.quant;
			const best = share(s.best.layer, s.best.head);
			for (let l = 0; l < doc.layers; l++) for (let h = 0; h < doc.heads; h++) assert.ok(share(l, h) <= best + 0.02, `${s.id} L${l} H${h}`);
		}
	}
});

test('the start token is not filtered out: on average it gets a lot of light', () => {
	const doc = DOCS.de;
	const s = decodeSentence(doc.sentences[0], doc);
	let sum = 0;
	for (let l = 0; l < doc.layers; l++) for (let h = 0; h < doc.heads; h++) sum += s.spotlight(l, h, s.focus)[0];
	assert.ok(sum / (doc.layers * doc.heads) > 0.5);
});

test('labels', () => {
	assert.equal(tokenLabel(' Bank', '<|endoftext|>', 'de'), '␣Bank');
	assert.equal(tokenLabel('ze', '<|endoftext|>', 'de'), 'ze');
	assert.equal(tokenLabel('<|endoftext|>', '<|endoftext|>', 'de'), 'Textgrenze');
	assert.equal(tokenLabel('<|endoftext|>', '<|endoftext|>', 'en'), 'text boundary');
	assert.equal(percentLabel(0.324, 'de'), '32 %');
	assert.equal(percentLabel(0.324, 'en'), '32%');
	assert.equal(percentLabel(0.002, 'de'), '<1 %');
	assert.equal(percentLabel(0, 'de'), '0 %');
	assert.equal(percentLabel(null, 'de'), '');
	assert.deepEqual(brightest([0.1, 0.5, null, 0.3]), [1, 3, 0]);
});
