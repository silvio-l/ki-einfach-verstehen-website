// Logic for the "text becomes practice problems" demo (Baustein
// aus-text-werden-uebungsaufgaben): a text of n tokens yields n - 1
// problems, each "everything so far" as the question and the next token
// as the answer. The sentence is split word by word as in the text, or
// with GPT-2's real tokenizer (r50k_base). The real tokens of the two
// example sentences are stored here so the demo shows them without
// loading the engine; aufgaben.test.mjs re-encodes them with it.
// packSequences() shows the second step: texts joined with an end token
// and cut into sequences of a fixed window length.

/** Marker for the end token between two packed texts. */
export const END = '\u0000end';

/** Word-wise toy tokens: every word and every punctuation mark is one. */
export function wordTokens(text) {
	return text.match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) ?? [];
}

/** Number of problems in a text of n tokens: one for every token that is
 * followed by another one. */
export function taskCount(n) {
	return Math.max(0, n - 1);
}

/** All problems of a token list: question = tokens up to i, answer = token i + 1. */
export function tasksOf(tokens) {
	return tokens.slice(0, -1).map((_, i) => ({ question: tokens.slice(0, i + 1), answer: tokens[i + 1] }));
}

/**
 * Feedback on the reader's guess for a text of n tokens: 'right', 'one-too-many'
 * (counted the last token as well), or 'wrong'. Anything that is not a whole
 * number is 'invalid'.
 */
export function checkGuess(guess, n) {
	const value = typeof guess === 'number' ? guess : Number(String(guess).trim());
	if (!Number.isInteger(value) || value < 0 || String(guess).trim() === '') return 'invalid';
	if (value === taskCount(n)) return 'right';
	if (value === n) return 'one-too-many';
	return 'wrong';
}

/**
 * Pack texts (each a token list) into one stream with END after every text,
 * then cut it into sequences of `window` tokens. The last sequence may be
 * shorter: in training the next text would fill it.
 */
export function packSequences(texts, window) {
	const size = Math.max(1, Math.floor(window));
	const stream = texts.flatMap((tokens, text) => [...tokens.map((token) => ({ token, text })), { token: END, text }]);
	const sequences = [];
	for (let i = 0; i < stream.length; i += size) sequences.push(stream.slice(i, i + size));
	return sequences;
}

export const EXAMPLES = {
	de: {
		sentence: 'Am Morgen fährt der Bus wieder pünktlich um acht Uhr ab.',
		// GPT-2 (r50k_base), checked in aufgaben.test.mjs.
		real: ['Am', ' Morg', 'en', ' f', 'ä', 'hr', 't', ' der', ' Bus', ' w', 'ied', 'er', ' p', 'ü', 'n', 'kt', 'lich', ' um', ' a', 'cht', ' U', 'hr', ' ab', '.'],
		pack: ['Heute bleibt es trocken.', 'Der Kuchen ist im Ofen.'],
	},
	en: {
		sentence: 'The bus leaves again on time at eight in the morning.',
		real: ['The', ' bus', ' leaves', ' again', ' on', ' time', ' at', ' eight', ' in', ' the', ' morning', '.'],
		pack: ['It stays dry today.', 'The cake is baking now.'],
	},
};
