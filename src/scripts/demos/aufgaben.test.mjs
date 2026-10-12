import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import r50k from 'gpt-tokenizer/encoding/r50k_base';
import { encodeReal } from './real-tokens.js';
import { END, EXAMPLES, checkGuess, packSequences, taskCount, tasksOf, wordTokens } from './aufgaben.js';

test('the stored GPT-2 tokens match the real tokenizer', () => {
	for (const [lang, example] of Object.entries(EXAMPLES)) {
		assert.deepEqual(
			encodeReal(r50k, example.sentence).map((t) => t.text),
			example.real,
			lang,
		);
	}
	assert.equal(EXAMPLES.de.real.length, 24);
	assert.equal(EXAMPLES.en.real.length, 12);
});

test('the bus sentence has 12 word-wise tokens and 11 problems, as in the text', () => {
	for (const example of Object.values(EXAMPLES)) {
		const tokens = wordTokens(example.sentence);
		assert.equal(tokens.length, 12);
		assert.equal(taskCount(tokens.length), 11);
		assert.equal(tasksOf(tokens).length, 11);
	}
	assert.deepEqual(wordTokens('Ab um acht.'), ['Ab', 'um', 'acht', '.']);
});

test('every problem asks for the next token after everything so far', () => {
	const tasks = tasksOf(['Am', 'Morgen', 'fährt', '.']);
	assert.deepEqual(tasks[0], { question: ['Am'], answer: 'Morgen' });
	assert.deepEqual(tasks[2], { question: ['Am', 'Morgen', 'fährt'], answer: '.' });
	assert.deepEqual(tasksOf(['Allein']), []);
	assert.equal(taskCount(0), 0);
});

test('guesses: n - 1 is right, n counts the last token too', () => {
	assert.equal(checkGuess('11', 12), 'right');
	assert.equal(checkGuess(12, 12), 'one-too-many');
	assert.equal(checkGuess('3', 12), 'wrong');
	assert.equal(checkGuess('', 12), 'invalid');
	assert.equal(checkGuess('1,5', 12), 'invalid');
	assert.equal(checkGuess('-1', 12), 'invalid');
});

test('packing two texts at window 8 gives the sequences of the figure', () => {
	const texts = EXAMPLES.de.pack.map(wordTokens);
	const sequences = packSequences(texts, 8);
	assert.equal(sequences.length, 2);
	assert.deepEqual(
		sequences[0].map((p) => p.token),
		['Heute', 'bleibt', 'es', 'trocken', '.', END, 'Der', 'Kuchen'],
	);
	assert.deepEqual(
		sequences[1].map((p) => p.token),
		['ist', 'im', 'Ofen', '.', END],
	);
	assert.equal(sequences[0][6].text, 1);
	assert.equal(packSequences(texts, 13).length, 1);
	assert.equal(packSequences(texts, 0).length, 13);
});
