// Logic of the ChatSequenceDemo (Baustein tokenisierung-im-modell, learning
// goal 1: a chat template turns several messages with roles into one single
// token sequence, and adds text you never wrote). The template is the real
// one of OpenAI's gpt-oss models ("harmony"), rebuilt from its official
// chat_template.jinja for the case without tools: own system message with
// date and reasoning effort, the chat's system text as a "developer"
// message, every turn between <|start|> and <|end|>, and an open
// "<|start|>assistant" at the end. Tokens come from gpt-tokenizer's
// o200k_harmony encoding, gpt-oss's tokenizer. chat-sequence.test.mjs checks
// the result ID for ID against apply_chat_template references
// (scripts/demos/precompute/chat-sequence.py -> data/chat-sequence.json).
//
// One deliberate difference: text you type that looks like a special token
// ("<|end|>") stays ordinary text here, the way a chat interface treats it.

import { pieceOf } from './real-tokens.js';

/** The date and reasoning effort the Baustein's counts were made with. */
export const TEMPLATE_DATE = '2026-10-06';
export const REASONING = 'medium';

/** The model's own system message, exactly as the template writes it. */
export function harmonySystemText(date = TEMPLATE_DATE, reasoning = REASONING) {
	return (
		'You are ChatGPT, a large language model trained by OpenAI.\n' +
		'Knowledge cutoff: 2024-06\n' +
		`Current date: ${date}\n\n` +
		`Reasoning: ${reasoning}\n\n` +
		'# Valid channels: analysis, commentary, final. Channel must be included for every message.'
	);
}

/** Start chats: the example from the Baustein (86 tokens DE, 84 EN). */
export const START = {
	de: { system: 'Antworte kurz.', messages: [{ role: 'user', content: 'Wie heißt die Hauptstadt von Frankreich?' }] },
	en: { system: 'Answer briefly.', messages: [{ role: 'user', content: 'What is the capital of France?' }] },
};

/** Window size the demo's "try it" line suggests after one added round:
 * just small enough that exactly the first question drops out. */
export const GOAL_WINDOW = { de: 100, en: 95 };

/** Rounds the "add a round" button appends: an answer to the last question,
 * then a follow-up. The first pair is the follow-up from the Baustein. */
export const ROUNDS = {
	de: [
		['Paris.', 'Und von Italien?'],
		['Rom.', 'Und von Spanien?'],
		['Madrid.', 'Und von Portugal?'],
		['Lissabon.', 'Und von Österreich?'],
		['Wien.', 'Und von der Schweiz?'],
		['Bern ist der Sitz der Bundesbehörden.', 'Danke!'],
	],
	en: [
		['Paris.', 'And Italy?'],
		['Rome.', 'And Spain?'],
		['Madrid.', 'And Portugal?'],
		['Lisbon.', 'And Austria?'],
		['Vienna.', 'And Switzerland?'],
		['Bern is the seat of the federal authorities.', 'Thanks!'],
	],
};

/**
 * The template's text as blocks of parts. A part is a special token
 * (`special`: its name) or a piece of text with its origin: `added` (the
 * template wrote it: role names, channel, its own system message) or
 * `content` (a message of the chat). Blocks are what can drop out of a
 * full context window; only `message` blocks ever do.
 * @param {{ system: string, messages: { role: 'user' | 'assistant', content: string }[] }} chat
 */
export function harmonyBlocks(chat, { date = TEMPLATE_DATE, reasoning = REASONING } = {}) {
	const sp = (name) => ({ special: name });
	const added = (text) => ({ text, origin: 'added' });
	const content = (text) => ({ text, origin: 'content' });
	const blocks = [{ kind: 'template', parts: [sp('<|start|>'), added('system'), sp('<|message|>'), added(harmonySystemText(date, reasoning)), sp('<|end|>')] }];
	if (chat.system) {
		blocks.push({
			kind: 'system',
			parts: [sp('<|start|>'), added('developer'), sp('<|message|>'), added('# Instructions\n\n'), content(chat.system), added('\n\n'), sp('<|end|>')],
		});
	}
	chat.messages.forEach((m, index) => {
		const head = m.role === 'assistant' ? [added('assistant'), sp('<|channel|>'), added('final')] : [added('user')];
		blocks.push({ kind: 'message', role: m.role, index, parts: [sp('<|start|>'), ...head, sp('<|message|>'), content(m.content), sp('<|end|>')] });
	});
	blocks.push({ kind: 'prompt', parts: [sp('<|start|>'), added('assistant')] });
	return blocks;
}

/**
 * Tokenize the blocks with a gpt-tokenizer encoding (o200k_harmony). Text
 * between special tokens is encoded on its own, which is what the real
 * tokenizer does: special tokens split the text before the BPE step.
 * @returns {{ kind: string, role?: string, index?: number, tokens: { id: number, text: string | null, bytes: number[] | null, kind: 'special' | 'added' | 'content' }[] }[]}
 */
export function tokenizeBlocks(api, blocks) {
	const specials = api.specialTokensEncoder;
	return blocks.map(({ parts, ...block }) => {
		const tokens = [];
		let run = [];
		const flush = () => {
			if (run.length) tokens.push(...encodeRun(api, run));
			run = [];
		};
		for (const part of parts) {
			if (!part.special) {
				run.push(part);
				continue;
			}
			flush();
			const id = specials.get(part.special);
			if (id === undefined) throw new Error(`unknown special token ${part.special}`);
			tokens.push({ id, text: part.special, bytes: null, kind: 'special' });
		}
		flush();
		return { ...block, tokens };
	});
}

const utf8 = new TextEncoder();

/** Encode adjacent text parts as one string (as the tokenizer sees them)
 * and give each token the origin of the part its first byte comes from. */
function encodeRun(api, run) {
	const text = run.map((p) => p.text).join('');
	if (!text) return [];
	const ends = [];
	let offset = 0;
	for (const part of run) {
		offset += utf8.encode(part.text).length;
		ends.push(offset);
	}
	let position = 0;
	return api.encode(text, { allowedSpecial: new Set(), disallowedSpecial: new Set() }).map((id) => {
		const piece = pieceOf(api, id);
		const at = ends.findIndex((end) => position < end);
		position += piece.text === null ? piece.bytes.length : utf8.encode(piece.text).length;
		return { ...piece, kind: run[at === -1 ? run.length - 1 : at].origin };
	});
}

/** The chat as one token sequence (all blocks in order). */
export function encodeChat(api, chat, options) {
	return tokenizeBlocks(api, harmonyBlocks(chat, options));
}

/**
 * Fit the sequence into a context window of `size` tokens the way chat apps
 * make room (Anthropic: claude.ai lets the oldest parts drop out): the
 * template's blocks, the system text and the newest message always stay;
 * older messages drop out oldest first until the rest fits. If even that is
 * too long, nothing is sent (`tooLong`, the API's "prompt is too long").
 * @returns {{ total: number, used: number, free: number, dropped: number, out: boolean[], tooLong: boolean }}
 */
export function fitWindow(blocks, size) {
	const lengths = blocks.map((b) => b.tokens.length);
	const total = lengths.reduce((a, b) => a + b, 0);
	const out = blocks.map(() => false);
	const messages = blocks.flatMap((b, i) => (b.kind === 'message' ? [i] : []));
	let used = total;
	for (const i of messages.slice(0, -1)) {
		if (used <= size) break;
		out[i] = true;
		used -= lengths[i];
	}
	const tooLong = used > size;
	return { total, used, free: Math.max(0, size - used), dropped: total - used, out, tooLong };
}

/** Token counts per kind (special tokens, template text, chat content). */
export function countKinds(blocks, out = []) {
	const counts = { special: 0, added: 0, content: 0 };
	blocks.forEach((b, i) => {
		if (out[i]) return;
		for (const t of b.tokens) counts[t.kind] += 1;
	});
	return counts;
}

/** Append the next prepared round (answer + follow-up), if any is left. */
export function addRound(chat, lang) {
	const round = ROUNDS[lang][Math.floor(chat.messages.length / 2)];
	if (!round) return chat;
	return { ...chat, messages: [...chat.messages, { role: 'assistant', content: round[0] }, { role: 'user', content: round[1] }] };
}

/** Remove the last round; the first question always stays. */
export function removeRound(chat) {
	if (chat.messages.length < 3) return chat;
	return { ...chat, messages: chat.messages.slice(0, -2) };
}
