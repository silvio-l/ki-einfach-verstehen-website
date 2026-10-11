import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isRankTable, oversizedChunks } from './chunk-size-guard.mjs';

const LIMIT = 100;
const chunk = (fileName, code, modules) => ({ type: 'chunk', fileName, code, modules });

test('recognises gpt-tokenizer rank tables in every build flavour', () => {
	assert.ok(isRankTable('/x/node_modules/gpt-tokenizer/esm/bpeRanks/o200k_base.js'));
	assert.ok(isRankTable('C:\\x\\node_modules\\gpt-tokenizer\\cjs\\bpeRanks\\cl100k_base.js'));
	assert.ok(!isRankTable('/x/node_modules/gpt-tokenizer/esm/encoding/o200k_base.js'));
	assert.ok(!isRankTable('/x/src/scripts/demos/bpeRanks/fake.js'));
});

test('a chunk made of a rank table plus a little code passes', () => {
	const bundle = {
		a: chunk('o200k.js', 'x'.repeat(500), {
			'/n/gpt-tokenizer/esm/bpeRanks/o200k_base.js': { renderedLength: 450 },
			'/n/gpt-tokenizer/esm/encoding/o200k_base.js': { renderedLength: 50 },
		}),
	};
	assert.deepEqual(oversizedChunks(bundle, LIMIT), []);
});

test('ordinary code above the limit is still reported', () => {
	const bundle = {
		a: chunk('app.js', 'x'.repeat(300), { '/src/app.js': { renderedLength: 300 } }),
		b: chunk('small.js', 'x'.repeat(50), { '/src/small.js': { renderedLength: 50 } }),
		c: { type: 'asset', fileName: 'big.png', source: 'x'.repeat(999) },
	};
	assert.deepEqual(oversizedChunks(bundle, LIMIT), [{ fileName: 'app.js', bytes: 300 }]);
});

test('a rank table does not hide too much code next to it', () => {
	const bundle = {
		a: chunk('mixed.js', 'x'.repeat(600), {
			'/n/gpt-tokenizer/esm/bpeRanks/r50k_base.js': { renderedLength: 400 },
			'/src/heavy.js': { renderedLength: 200 },
		}),
	};
	assert.deepEqual(oversizedChunks(bundle, LIMIT), [{ fileName: 'mixed.js', bytes: 200 }]);
});
