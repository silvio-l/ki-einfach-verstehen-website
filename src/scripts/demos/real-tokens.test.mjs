import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import o200k from 'gpt-tokenizer/encoding/o200k_base';
import cl100k from 'gpt-tokenizer/encoding/cl100k_base';
import { countChars, countLetter, displayToken, encodeReal, EXAMPLES, LANGUAGES, letterPositions, spellOut } from './real-tokens.js';

const engines = { o200k_base: o200k, cl100k_base: cl100k };

test('every printed example matches the real tokenizer exactly', () => {
	for (const [key, example] of Object.entries(EXAMPLES)) {
		const api = engines[example.encoding ?? 'o200k_base'];
		assert.deepEqual(encodeReal(api, example.text), example.tokens, key);
	}
});

test('the language table matches both real tokenizers', () => {
	for (const row of LANGUAGES) {
		assert.equal(countChars(row.text), row.chars, row.lang);
		assert.equal(encodeReal(o200k, row.text).length, row.o200k, row.lang);
		assert.equal(encodeReal(cl100k, row.text).length, row.cl100k, row.lang);
	}
});

test('in the question, " strawberry" is one single token', () => {
	const strawberry = EXAMPLES.questionEn.tokens.filter((tok) => tok.text?.includes('strawberry'));
	assert.deepEqual(strawberry, [{ id: 101830, text: ' strawberry', bytes: null }]);
	assert.ok(EXAMPLES.questionDe.tokens.some((tok) => tok.id === 101830));
});

test('spelled out, each r becomes the same token three times', () => {
	assert.equal(EXAMPLES.spelled.text, spellOut('strawberry'));
	assert.equal(EXAMPLES.spelled.tokens.filter((tok) => tok.id === 428).length, 3);
});

test('decoding all pieces gives the text back, byte pieces included', () => {
	for (const example of Object.values(EXAMPLES)) {
		const bytes = example.tokens.flatMap((tok) => (tok.text === null ? tok.bytes : [...new TextEncoder().encode(tok.text)]));
		assert.equal(new TextDecoder().decode(new Uint8Array(bytes)), example.text);
	}
});

test('the strawberry emoji is two byte pieces, neither a whole character', () => {
	assert.deepEqual(EXAMPLES.emoji.tokens.map(displayToken), ['F0 9F 8D', '93']);
});

test('special-token look-alikes are encoded as ordinary text', () => {
	assert.equal(encodeReal(o200k, '<|endoftext|>').length, 7);
});

test('letter helpers count the way a person does', () => {
	assert.equal(countLetter('strawberry', 'r'), 3);
	assert.equal(countLetter('STRAWBERRY', 'r'), 3);
	assert.deepEqual(letterPositions('strawberry', 'r'), [3, 8, 9]);
	assert.equal(countChars('🍓a'), 2);
	assert.equal(displayToken({ id: 1, text: ' a‍', bytes: null }), '␣a‹ZWJ›');
});
