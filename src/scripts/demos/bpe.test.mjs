import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { CORPUS, SAMPLE, SPACE, countPairs, createTrainer, encode, pretokenize, segmentation, symbolsOf, tokenCount, train, trainStep } from './bpe.js';

/** Occurrences of a string inside the words of a text (spaces as ␣), the
 * way one would count them on paper: words never share a pair. */
const occurrences = (sentences, needle) =>
	sentences
		.flatMap((s) => pretokenize(s))
		.map((w) => symbolsOf(w).join(''))
		.reduce((n, w) => n + w.split(needle).length - 1, 0);

test('the practice texts start with the examples of the Baustein', () => {
	assert.equal(CORPUS.de[0], 'Die Katze sitzt.');
	assert.equal(CORPUS.en[0], 'The cat sits.');
	assert.equal(SAMPLE.de, CORPUS.de[0]);
	assert.equal(SAMPLE.en, CORPUS.en[0]);
	const words = (lang) => new Set(CORPUS[lang].flatMap((s) => s.match(/\p{L}+/gu)));
	for (const w of ['lachen', 'lachte', 'Lachen', 'machen', 'machte', 'sagen', 'sagte', 'Garten', 'Gärten', 'Katze', 'Katzen', 'lernen', 'lernt', 'gelernt'])
		assert.ok(words('de').has(w), w);
	for (const w of ['laugh', 'laughed', 'laughing', 'make', 'made', 'say', 'said', 'garden', 'gardens', 'cat', 'cats', 'learn', 'learns', 'learned'])
		assert.ok(words('en').has(w), w);
	for (const lang of ['de', 'en']) assert.ok(CORPUS[lang].length >= 20 && CORPUS[lang].length <= 40);
});

test('the space belongs to the following word and shows as ␣', () => {
	assert.deepEqual(pretokenize('Die Katze sitzt.'), ['Die', ' Katze', ' sitzt', '.']);
	assert.deepEqual(symbolsOf(' Katze'), [SPACE, 'K', 'a', 't', 'z', 'e']);
	const t = createTrainer('de');
	assert.ok(t.base.includes(SPACE));
	assert.equal(t.vocab.length, t.base.length);
	assert.equal(tokenCount(t), CORPUS.de.join('').length, 'one piece per character at the start');
});

test('the first three merges, counted by hand', () => {
	// DE: "en" stands 35 times in the words (lachen, Katzen, Garten, …), "ch"
	// 22 times (lachen, machte, nichts, …), and once both are merged, "a"+"ch"
	// 17 times (lach-, mach-). EN: "he" 27 times (The, the, He), " l" 17
	// times (laugh…, learn…, last), "ar" 16 times (garden…, are).
	const expected = {
		de: [['e', 'n', 35, 'en'], ['c', 'h', 22, 'ch'], ['a', 'ch', 17, 'ach']],
		en: [['h', 'e', 27, 'he'], [SPACE, 'l', 17, `${SPACE}l`], ['a', 'r', 16, 'ar']],
	};
	for (const lang of ['de', 'en']) {
		const t = createTrainer(lang);
		const base = t.base.length;
		expected[lang].forEach(([a, b, count, text], i) => {
			assert.equal(occurrences(CORPUS[lang], text), count, `${lang}: paper count of ${text}`);
			const { merge, top } = trainStep(t);
			assert.deepEqual([merge.a, merge.b, merge.count, merge.text], [a, b, count, text], `${lang} merge ${i + 1}`);
			assert.equal(merge.id, base + i, 'new entries get the next ID');
			assert.equal(merge.tied, 0);
			assert.ok(top.length === 5 && top[0].count === count && top[1].count < count);
		});
	}
});

test('applying the merges to the practice text gives the training split', () => {
	for (const lang of ['de', 'en']) {
		for (const steps of [0, 3, 10, 25, 1000]) {
			const t = train(lang, steps);
			const split = segmentation(t);
			CORPUS[lang].forEach((sentence, i) => {
				assert.deepEqual(
					encode(sentence, t).tokens.map((tok) => tok.text),
					split[i],
					`${lang}, ${steps} steps, sentence ${i}`,
				);
			});
		}
	}
});

test('training and applying are deterministic, ties go to the first pair in the text', () => {
	for (const lang of ['de', 'en']) {
		const one = train(lang, 1000);
		const two = train(lang, 1000);
		assert.deepEqual(one.merges, two.merges);
		assert.deepEqual(one.vocab, two.vocab);
		assert.ok(one.merges.length > 30, `${lang}: ${one.merges.length} merges`);
		assert.deepEqual(encode('Die Katzen lachten.', one), encode('Die Katzen lachten.', two));
	}
	// "ab" and " cd" both occur twice: the earlier one in the text wins.
	const ab = createTrainer(['ab cd ab cd']);
	assert.deepEqual(countPairs(ab).slice(0, 3).map((p) => p.count), [2, 2, 2]);
	const first = trainStep(ab).merge;
	assert.deepEqual([first.a, first.b, first.tied], ['a', 'b', 2]);
	const cd = trainStep(createTrainer(['cd ab cd ab'])).merge;
	assert.deepEqual([cd.a, cd.b], ['c', 'd']);
	// Nothing occurs twice: training stops.
	assert.equal(trainStep(createTrainer(['ab'])), null);
});

test('a character outside the base vocabulary stays unknown', () => {
	const t = train('de', 20);
	const { tokens } = encode('Die Straße!', t);
	const unknown = tokens.filter((tok) => tok.unknown).map((tok) => tok.text);
	assert.deepEqual(unknown, ['ß', '!']);
	assert.ok(tokens.filter((tok) => tok.unknown).every((tok) => tok.id === null));
	assert.ok(tokens.filter((tok) => !tok.unknown).every((tok) => Number.isInteger(tok.id)));
});

test('the replay steps list only merges that fire, in learned order', () => {
	const t = train('de', 40);
	const { tokens, steps } = encode(SAMPLE.de, t);
	assert.ok(steps.length > 0);
	const ranks = steps.map((s) => s.merge.rank);
	assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b));
	assert.deepEqual(steps.at(-1).pieces, tokens.map((tok) => tok.text));
	assert.ok(tokens.some((tok) => tok.text === `${SPACE}Katze`), 'Katze is one learned piece after 40 steps');
	assert.deepEqual(encode(SAMPLE.de, createTrainer('de')).steps, []);
});

test('the worked example of the Baustein text: distinct counts, the new word from known characters', async () => {
	const { BOOK_EXAMPLE, bookExampleText } = await import('./bpe.js');
	const expected = {
		de: { merges: [['e', 'n', 7], ['c', 'h', 6], ['a', 'ch', 5]], next: ['ach', 'en', 4], pieces: ['m', 'ach', 't', 'en'] },
		en: { merges: [['i', 'n', 7], ['in', 'g', 6], ['a', 'y', 5]], next: ['ay', 'ing', 4], pieces: ['l', 'ay', 'ing'] },
	};
	for (const lang of ['de', 'en']) {
		const t = createTrainer(bookExampleText(lang));
		assert.ok(!t.base.includes(SPACE), `${lang}: no spaces, pairs only inside words`);
		for (const [a, b, count] of expected[lang].merges) {
			const { merge, top } = trainStep(t);
			assert.deepEqual([merge.a, merge.b, merge.count, merge.tied], [a, b, count, 0], `${lang}: ${a}+${b}`);
			assert.ok(top[1].count < count, `${lang}: the winner is clear`);
		}
		const [a, b, count] = expected[lang].next;
		const next = countPairs(t);
		assert.deepEqual([next[0].a, next[0].b, next[0].count], [a, b, count], `${lang}: the fourth merge`);
		assert.ok(next[1].count < count);
		assert.ok(!t.words.some((w) => w.text === BOOK_EXAMPLE[lang].newWord), 'the new word is not in the practice text');
		assert.ok([...BOOK_EXAMPLE[lang].newWord].every((ch) => t.base.includes(ch)), 'every character of the new word is in the base vocabulary');
		assert.deepEqual(encode(BOOK_EXAMPLE[lang].newWord, t).tokens.map((x) => x.text), expected[lang].pieces);
	}
});
