import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import r50k from 'gpt-tokenizer/encoding/r50k_base';
import cl100k from 'gpt-tokenizer/encoding/cl100k_base';
import o200k from 'gpt-tokenizer/encoding/o200k_base';
import harmony from 'gpt-tokenizer/encoding/o200k_harmony';
import { encodeReal } from './real-tokens.js';
import { compare, formatInt, formatMillions, ROW_WIDTH, SENTENCES, tableSize, TEXT_COUNTS, TOKENIZERS } from './vocabulary.js';

const apis = { r50k_base: r50k, cl100k_base: cl100k, o200k_base: o200k };
const encoders = Object.fromEntries(Object.entries(apis).map(([k, api]) => [k, (text) => encodeReal(api, text)]));
const pieces = (api) => api.bytePairEncodingCoreProcessor.mergeableBytePairRankCount;
const highestId = (api) => Math.max(pieces(api) - 1, ...api.specialTokensEncoder.values());

test('entry counts come from the engines', () => {
	const by = Object.fromEntries(TOKENIZERS.map((t) => [t.key, t.entries]));
	// GPT-2 and GPT-4: every ID up to the highest special token.
	assert.equal(by.r50k_base, highestId(r50k) + 1);
	assert.equal(by.r50k_base, 50257);
	assert.equal(by.cl100k_base, highestId(cl100k) + 1);
	// o200k: 199,998 ordinary pieces; the specials end at ID 200018. gpt-tokenizer
	// numbers o200k_base's chat specials differently, so the special IDs are
	// taken from gpt-oss's harmony encoding (same pieces, official specials).
	assert.equal(pieces(o200k), 199998);
	assert.equal(pieces(harmony), 199998);
	const ids = new Set(harmony.specialTokensEncoder.values());
	for (let id = 199998; id <= 200018; id += 1) assert.ok(ids.has(id), String(id));
	assert.equal(by.o200k_base, 200018 + 1);
});

test('the start sentences give the pinned token counts', () => {
	for (const lang of ['de', 'en']) {
		const rows = compare(encoders, SENTENCES[lang]);
		for (const [key, count] of Object.entries(TEXT_COUNTS[lang])) {
			assert.equal(rows.find((r) => r.key === key).tokens.length, count, `${lang} ${key}`);
		}
	}
	assert.equal(SENTENCES.de, 'Die Katze sitzt auf dem Fensterbrett.');
});

test('o200k keeps " Katze" and " sitzt" whole, GPT-2 does not', () => {
	const [gpt2, , big] = compare(encoders, SENTENCES.de);
	assert.ok(big.tokens.some((t) => t.text === ' Katze'));
	assert.ok(big.tokens.some((t) => t.text === ' sitzt'));
	assert.ok(!gpt2.tokens.some((t) => t.text === ' Katze'));
});

test('the larger the vocabulary, the larger the table', () => {
	assert.equal(ROW_WIDTH, 768);
	// GPT-2's real embedding matrix: 50,257 × 768.
	assert.equal(tableSize(50257), 38597376);
	const rows = compare(encoders, SENTENCES.en);
	assert.deepEqual(rows.map((r) => r.table), [...rows.map((r) => r.table)].sort((a, b) => a - b));
	assert.equal(rows[2].tableShare, 1);
	// English: all three need 9 tokens, so the bars are equally long.
	assert.deepEqual(rows.map((r) => r.tokenShare), [1, 1, 1]);
});

test('numbers are written per language', () => {
	assert.equal(formatInt(50257, 'de'), '50.257');
	assert.equal(formatInt(50257, 'en'), '50,257');
	assert.equal(formatMillions(tableSize(200019), 'de'), '154 Mio.');
	assert.equal(formatMillions(tableSize(50257), 'en'), '39 million');
});

test('an empty text gives empty rows without dividing by zero', () => {
	const rows = compare(encoders, '');
	assert.ok(rows.every((r) => r.tokens.length === 0 && r.tokenShare === 0));
});
