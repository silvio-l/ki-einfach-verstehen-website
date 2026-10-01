import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { countWords, decode, display, tokenizeChars, tokenizePieces, tokenizeWords } from './tokenize.js';

test('the toy sentence encodes to the IDs printed in the Baustein', () => {
	const tokens = tokenizePieces('Die Katze sitzt.', 'de');
	assert.deepEqual(
		tokens.map((t) => [t.text, t.id]),
		[['Die', 417], [' Kat', 82], ['ze', 903], [' sitzt', 771], ['.', 13]],
	);
	const en = tokenizePieces('The cats sit.', 'en');
	assert.deepEqual(en.map((t) => t.id), [417, 82, 903, 771, 13]);
});

test('reordering the IDs reorders the decoded text, spaces included', () => {
	const tokens = tokenizePieces('Die Katze sitzt.', 'de');
	const swapped = [tokens[1], tokens[2], tokens[0]];
	assert.equal(decode(swapped, 'pieces'), ' KatzeDie');
	assert.equal(decode(tokens, 'pieces'), 'Die Katze sitzt.');
});

test('the piece tokenizer never produces an unknown token', () => {
	const tokens = tokenizePieces('Xylophon-Quiz 😀 ünd mehr', 'de');
	assert.ok(tokens.every((t) => typeof t.id === 'number'));
	assert.equal(tokens.map((t) => t.text).join(''), 'Xylophon-Quiz 😀 ünd mehr');
});

test('the word tokenizer drops spaces and marks words outside its list', () => {
	const tokens = tokenizeWords('Die Katze sitzt auf dem Xylophon.', 'de');
	assert.deepEqual(tokens.map((t) => t.text), ['Die', 'Katze', 'sitzt', 'auf', 'dem', 'Xylophon', '.']);
	assert.equal(tokens.filter((t) => t.unknown).length, 1);
	assert.equal(tokens[5].id, null);
	assert.equal(decode(tokens, 'words'), 'Die Katze sitzt auf dem ?.');
});

test('the character tokenizer uses one token per character', () => {
	const tokens = tokenizeChars('Ab c');
	assert.deepEqual(tokens.map((t) => t.id), [65, 98, 32, 99]);
	assert.equal(display(' a'), '␣a');
});

test('word count ignores punctuation-only tokens', () => {
	assert.equal(countWords('Die Katze sitzt.'), 3);
	assert.equal(countWords('  '), 0);
});
