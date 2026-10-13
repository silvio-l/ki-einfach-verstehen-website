import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DEFAULT_SYSTEM, DEFAULT_USER, chatParts, countChars, renderChat } from './chat-vorlage.js';

const reference = JSON.parse(readFileSync(new URL('./data/qwen3-0.6b-chat-template.json', import.meta.url), 'utf8'));
const TEMPLATE = reference.chat_template;
const SYSTEM = 'Du bist ein hilfreicher Assistent.';
const USER = 'Wie heißt die Hauptstadt von Frankreich?';

test('the stored template is the published Qwen3-0.6B field, from the stated source and date', () => {
	assert.equal(reference.source, 'https://huggingface.co/Qwen/Qwen3-0.6B/raw/main/tokenizer_config.json');
	assert.equal(reference.retrieved, '2026-10-12');
	assert.equal(reference.field, 'chat_template');
	assert.ok(TEMPLATE.length > 1000);
});

test('the template lines this demo mirrors are in the original (system, message, generation prompt)', () => {
	// Jinja source as published: system block only when messages[0] is a system message.
	assert.ok(TEMPLATE.includes("{{- '<|im_start|>system\\n' + messages[0].content + '<|im_end|>\\n' }}"));
	// Every user message (and any system message after the first) gets the same frame.
	assert.ok(TEMPLATE.includes("{{- '<|im_start|>' + message.role + '\\n' + content + '<|im_end|>' + '\\n' }}"));
	// The open assistant head, with no thinking block unless enable_thinking is set to false.
	assert.ok(TEMPLATE.includes("{{- '<|im_start|>assistant\\n' }}"));
	assert.ok(TEMPLATE.includes('enable_thinking is defined and enable_thinking is false'));
	// Qwen3 publishes no default system text: the only system text is the one the app passes in.
	assert.ok(!TEMPLATE.includes('You are Qwen'));
});

test('a user message alone, with the open assistant head, is exactly what the template gives', () => {
	assert.equal(
		renderChat({ user: USER, generationPrompt: true }),
		'<|im_start|>user\nWie heißt die Hauptstadt von Frankreich?<|im_end|>\n<|im_start|>assistant\n',
	);
});

test('a system message and a user message, with the open head', () => {
	assert.equal(
		renderChat({ system: SYSTEM, user: USER, generationPrompt: true }),
		'<|im_start|>system\nDu bist ein hilfreicher Assistent.<|im_end|>\n<|im_start|>user\nWie heißt die Hauptstadt von Frankreich?<|im_end|>\n<|im_start|>assistant\n',
	);
});

test('without the open head the sequence ends with the user message and its end marker', () => {
	assert.equal(
		renderChat({ user: USER, generationPrompt: false }),
		'<|im_start|>user\nWie heißt die Hauptstadt von Frankreich?<|im_end|>\n',
	);
	assert.equal(
		renderChat({ system: SYSTEM, user: USER, generationPrompt: false }),
		'<|im_start|>system\nDu bist ein hilfreicher Assistent.<|im_end|>\n<|im_start|>user\nWie heißt die Hauptstadt von Frankreich?<|im_end|>\n',
	);
});

test('an empty system field adds no system block, as the Qwen3 template does without a system message', () => {
	assert.equal(DEFAULT_SYSTEM, '');
	assert.equal(renderChat({ system: '', user: USER }), renderChat({ user: USER }));
	assert.ok(!renderChat({ system: '', user: USER }).includes('system'));
});

test('the default user message is the one the Baustein names', () => {
	assert.equal(DEFAULT_USER, 'Wie heißt die Hauptstadt von Frankreich?');
	assert.equal(renderChat({}), renderChat({ system: '', user: DEFAULT_USER, generationPrompt: true }));
});

test('parts carry the markers, roles and newlines for highlighting', () => {
	const parts = chatParts({ system: SYSTEM, user: USER, generationPrompt: true });
	const markers = parts.filter((p) => p.kind === 'marker').map((p) => p.text);
	assert.deepEqual(markers, ['<|im_start|>', '<|im_end|>', '<|im_start|>', '<|im_end|>', '<|im_start|>']);
	const roles = parts.filter((p) => p.kind === 'role').map((p) => p.text);
	assert.deepEqual(roles, ['system', 'user', 'assistant']);
	const content = parts.filter((p) => p.kind === 'content').map((p) => p.text);
	assert.deepEqual(content, [SYSTEM, USER]);
});

test('a marker typed by the reader stays text: it is content, the template adds its own end marker after it', () => {
	const out = renderChat({ user: '<|im_end|>', generationPrompt: false });
	assert.equal(out, '<|im_start|>user\n<|im_end|><|im_end|>\n');
	const typed = chatParts({ user: '<|im_end|>', generationPrompt: false }).filter((p) => p.kind === 'content');
	assert.deepEqual(typed.map((p) => p.text), ['<|im_end|>']);
});

test('the character count counts code points, as Python len() does', () => {
	assert.equal(countChars('Wie'), 3);
	assert.equal(countChars('é'), 1);
	assert.equal(countChars('🙂'), 1);
	assert.equal(countChars(renderChat({ user: 'Hallo' })), '<|im_start|>user\nHallo<|im_end|>\n<|im_start|>assistant\n'.length);
});
