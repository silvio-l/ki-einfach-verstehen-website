import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { board, displayToken, drawToken, promptsFor } from './sampling.js';
import { drawMany, formatNumber, formatPercent, seeded } from './softmax.js';

const data = JSON.parse(readFileSync(new URL('./data/sampling.json', import.meta.url), 'utf8'));
const paris = data.prompts.find((p) => p.key === 'paris-de');

test('the data names its model and revision and stays small', () => {
	assert.equal(data.model, 'Qwen/Qwen3-0.6B-Base');
	assert.match(data.revision, /^[0-9a-f]{40}$/);
	assert.equal(data.vocab, 151936);
	assert.ok(readFileSync(new URL('./data/sampling.json', import.meta.url)).length < 150_000);
});

test('the start state reproduces the numbers of the Baustein', () => {
	// Both languages start with the Paris prompt the text discusses.
	assert.equal(promptsFor(data, 'de')[0].text, 'Die Hauptstadt von Frankreich ist');
	assert.equal(promptsFor(data, 'en')[0].text, 'Die Hauptstadt von Frankreich ist');
	// Scores with two decimals: the text rounds them to one from these
	// (20,5 / 19,1 / 17,8 / 17,8 / 17,0). Paris 47,5 % is the number of the
	// first Baustein (same model, revision and bfloat16 setup).
	const { rows } = board(data, paris, 1);
	const show = (i) => [displayToken(rows[i].text), formatNumber(rows[i].score, 'de', 2), formatPercent(rows[i].share, 'de', 1)];
	assert.deepEqual(show(0), ['Paris', '20,50', '47,5']);
	assert.deepEqual(show(1), ['____', '19,13', '12,0']);
	assert.deepEqual(show(2), ['______', '17,75', '3,0']);
	assert.deepEqual(show(3), ['_____', '17,75', '3,0']);
	assert.deepEqual(show(4), ['Bern', '17,00', '1,4']);
});

test('"Der Hund jagt die" leads with word beginnings such as T, F and Kat', () => {
	const hund = data.prompts.find((p) => p.key === 'hund-de');
	const top = board(data, hund, 1).rows.map((r) => displayToken(r.text));
	for (const t of ['T', 'F', 'Kat']) assert.ok(top.slice(0, 5).includes(t), t);
});

test('the folded tail matches the exact share outside the top rows', () => {
	for (const p of data.prompts) {
		const { rows, other } = board(data, p, 1);
		assert.ok(Math.abs(other * 100 - p.otherP) < 0.05, `${p.key}: ${other * 100} vs ${p.otherP}`);
		rows.forEach((r, i) => assert.ok(Math.abs(r.share * 100 - p.tokens[i][2]) < 0.05, `${p.key} row ${i}`));
	}
});

test('every language offers three to four prompts', () => {
	for (const lang of ['de', 'en']) {
		const n = promptsFor(data, lang).length;
		assert.ok(n >= 3 && n <= 4, `${lang}: ${n}`);
	}
});

test('temperature 0 always draws Paris; sampling sometimes draws something else', () => {
	const greedy = board(data, paris, 0);
	assert.equal(greedy.rows[0].share, 1);
	for (let k = 0; k < 20; k++) assert.equal(drawToken(paris, greedy.shares, seeded(k)).rank, 1);
	const counts = drawMany(board(data, paris, 1).shares, 2000, seeded(3));
	const parisShare = counts[0] / 2000;
	assert.ok(parisShare > 0.44 && parisShare < 0.54, String(parisShare));
});

test('"Zürich" starts with the word beginning "Z", far down the Paris board', () => {
	// The text explains the "Zürich" draw this way: "Z" at rank 17, about 0.6 %.
	const z = board(data, paris, 1);
	const at = paris.tokens.findIndex(([t]) => t === ' Z');
	assert.equal(at + 1, 17);
	assert.equal(formatPercent(paris.tokens[at][2] / 100, 'de', 1), '0,6');
	assert.ok(z.rows.length < 17, 'the bars show only the top rows');
});

test('a draw beyond the named tokens has no name', () => {
	const shares = board(data, paris, 1).shares;
	assert.deepEqual(drawToken(paris, shares, () => 0.9999999), { rank: null, text: null });
	assert.equal(drawToken(paris, shares, () => 0).text, ' Paris');
});

test('tokens are shown the way the text writes them', () => {
	assert.equal(displayToken(' Paris'), 'Paris');
	assert.equal(displayToken(' '), '␣');
	assert.equal(displayToken(':\n'), ':⏎');
	assert.equal(displayToken(null), '…');
});
