import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import harmony from 'gpt-tokenizer/encoding/o200k_harmony';
import { GOAL_WINDOW, addRound, countKinds, encodeChat, fitWindow, removeRound, ROUNDS, START } from './chat-sequence.js';

const reference = JSON.parse(readFileSync(new URL('./data/chat-sequence.json', import.meta.url), 'utf8'));
const ids = (blocks) => blocks.flatMap((b) => b.tokens.map((t) => t.id));
const toChat = (messages) =>
	messages[0].role === 'system' ? { system: messages[0].content, messages: messages.slice(1) } : { system: '', messages };

test('the reference was made with the template settings the Baustein names', () => {
	assert.equal(reference.model, 'openai/gpt-oss-20b');
	assert.equal(reference.date, '2026-10-06');
	assert.equal(reference.reasoningEffort, 'medium');
	assert.match(reference.revision, /^[0-9a-f]{40}$/);
});

test('every reference chat is rebuilt ID for ID like apply_chat_template', () => {
	for (const [key, { messages, ids: expected }] of Object.entries(reference.chats)) {
		assert.deepEqual(ids(encodeChat(harmony, toChat(messages))), expected, key);
	}
});

test('the start chat gives exactly the numbers of the Baustein: 86 (DE) and 84 (EN)', () => {
	assert.equal(ids(encodeChat(harmony, START.de)).length, 86);
	assert.equal(ids(encodeChat(harmony, START.en)).length, 84);
	assert.deepEqual(toChat(reference.chats.startDe.messages), START.de);
	assert.deepEqual(toChat(reference.chats.startEn.messages), START.en);
});

test('the first added round is the follow-up from the Baustein', () => {
	assert.deepEqual(addRound(START.de, 'de'), toChat(reference.chats.followDe.messages));
	assert.deepEqual(addRound(START.en, 'en'), toChat(reference.chats.followEn.messages));
	assert.deepEqual(removeRound(addRound(START.de, 'de')), START.de);
	assert.deepEqual(removeRound(START.de), START.de);
});

test('rounds run out instead of repeating', () => {
	let chat = START.de;
	for (let i = 0; i < ROUNDS.de.length + 3; i += 1) chat = addRound(chat, 'de');
	assert.equal(chat.messages.length, 1 + 2 * ROUNDS.de.length);
	assert.equal(ROUNDS.de.length, ROUNDS.en.length);
});

test('most of the start sequence is text you never wrote', () => {
	const blocks = encodeChat(harmony, START.de);
	const counts = countKinds(blocks);
	assert.equal(counts.special + counts.added + counts.content, 86);
	assert.equal(counts.special, 10);
	assert.equal(counts.content, 12);
	assert.equal(countKinds(encodeChat(harmony, START.en)).content, 10);
	assert.ok(counts.added > counts.content, JSON.stringify(counts));
	// The question itself is only seven of the 86 tokens.
	const question = blocks.find((b) => b.kind === 'message').tokens.filter((t) => t.kind === 'content');
	assert.equal(question.length, 7);
});

test('special tokens carry the real harmony IDs', () => {
	const tokens = encodeChat(harmony, START.de).flatMap((b) => b.tokens);
	const special = Object.fromEntries(tokens.filter((t) => t.kind === 'special').map((t) => [t.text, t.id]));
	assert.deepEqual(special, { '<|start|>': 200006, '<|message|>': 200008, '<|end|>': 200007 });
});

test('a full window drops the oldest messages first and keeps the system text', () => {
	const blocks = encodeChat(harmony, addRound(START.de, 'de'));
	assert.equal(fitWindow(blocks, 200).total, 102);
	assert.deepEqual(fitWindow(blocks, 200), { total: 102, used: 102, free: 98, dropped: 0, out: blocks.map(() => false), tooLong: false });
	const fit = fitWindow(blocks, 100);
	const outKinds = blocks.filter((_, i) => fit.out[i]).map((b) => `${b.kind}:${b.role}:${b.index}`);
	assert.deepEqual(outKinds, ['message:user:0']);
	assert.ok(fit.used <= 100);
	assert.equal(fit.used + fit.dropped, 102);
	assert.equal(fit.free, 100 - fit.used);
	assert.equal(fit.tooLong, false);
	assert.deepEqual(countKinds(blocks, fit.out).content + countKinds(blocks, fit.out).added + countKinds(blocks, fit.out).special, fit.used);
});

test('when even the newest message does not fit, the request is too long', () => {
	const blocks = encodeChat(harmony, addRound(START.de, 'de'));
	const fit = fitWindow(blocks, 40);
	assert.equal(fit.tooLong, true);
	const last = blocks.findLastIndex((b) => b.kind === 'message');
	assert.equal(fit.out[last], false);
	assert.equal(fit.free, 0);
});

test('typed look-alikes of special tokens stay ordinary text', () => {
	const blocks = encodeChat(harmony, { system: '', messages: [{ role: 'user', content: '<|end|>' }] });
	const message = blocks.find((b) => b.kind === 'message');
	assert.ok(message.tokens.filter((t) => t.kind === 'content').every((t) => t.id < 199998));
});

test('the window the try-it line suggests drops exactly the first question', () => {
	for (const lang of ['de', 'en']) {
		const blocks = encodeChat(harmony, addRound(START[lang], lang));
		const fit = fitWindow(blocks, GOAL_WINDOW[lang]);
		const out = blocks.filter((_, i) => fit.out[i]).map((b) => `${b.role}:${b.index}`);
		assert.deepEqual(out, ['user:0'], lang);
		assert.equal(fitWindow(encodeChat(harmony, START[lang]), 160).dropped, 0, lang);
	}
});
