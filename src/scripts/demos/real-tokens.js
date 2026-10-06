// Real-tokenizer helpers for the "strawberry" explorable
// (/en/explore/strawberry/, /de/entdecken/strawberry/). Unlike the toy
// tokenizers in tokenize.js, everything here is the actual o200k_base
// vocabulary that OpenAI's tiktoken assigns to GPT-4o and later models
// (and cl100k_base, GPT-4's, for one comparison). The engine is the
// gpt-tokenizer package; it is ~1 MB gzipped, so the page renders its
// guided steps from the precomputed EXAMPLES below and only loads the
// engine for free input (loadTokenizer). real-tokens.test.mjs re-encodes
// every example with the engine, so the printed IDs can never drift from
// what the real tokenizer produces.

/** @typedef {{ id: number, text: string | null, bytes: number[] | null }} RealToken */

/**
 * One token as displayable data. A byte-level BPE token is usually a
 * piece of text; sometimes it is only part of a character's UTF-8 bytes
 * (emoji, rare scripts). Then `text` is null and `bytes` holds them.
 * @param {any} api a gpt-tokenizer encoding module's default export
 * @param {number} id
 * @returns {RealToken}
 */
export function pieceOf(api, id) {
	const core = api?.bytePairEncodingCoreProcessor;
	if (core && typeof core.decodeNativeGenerator === 'function') {
		for (const piece of core.decodeNativeGenerator([id])) {
			if (typeof piece === 'string') return { id, text: piece, bytes: null };
			return { id, text: null, bytes: [...piece] };
		}
	}
	// Fallback for a changed engine API: a whole-token decode. A lone
	// partial-character token then shows as the replacement character.
	return { id, text: api.decode([id]), bytes: null };
}

/** Encode text into displayable real tokens. Text that looks like a
 * special token ("<|endoftext|>") is encoded as ordinary text, the way a
 * chat interface treats what you type. */
export function encodeReal(api, text) {
	const ids = api.encode(text, { allowedSpecial: new Set(), disallowedSpecial: new Set() });
	return ids.map((id) => pieceOf(api, id));
}

/** Lazy-load a real tokenizer engine (browser): one network chunk each. */
export async function loadTokenizer(name = 'o200k_base') {
	const mod =
		name === 'cl100k_base'
			? await import('gpt-tokenizer/encoding/cl100k_base')
			: await import('gpt-tokenizer/encoding/o200k_base');
	const api = mod.default;
	return { name, encode: (text) => encodeReal(api, text) };
}

/** Visible form of a token's text: spaces as an open box, line breaks and
 * invisible joiners named, byte pieces as hex. */
export function displayToken(token) {
	if (token.text === null) return token.bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
	return token.text
		.replace(/ /g, '␣')
		.replace(/\n/g, '⏎')
		.replace(/\t/g, '⇥')
		.replace(/‍/g, '‹ZWJ›')
		.replace(/️/g, '‹VS16›');
}

/** Number of visible characters (code points), as a person would count. */
export function countChars(text) {
	return [...text].length;
}

/** How often a letter occurs, case-insensitive. */
export function countLetter(text, letter) {
	const needle = letter.toLowerCase();
	return [...text.toLowerCase()].filter((ch) => ch === needle).length;
}

/** Positions (1-based) of a letter in a word, case-insensitive. */
export function letterPositions(text, letter) {
	const needle = letter.toLowerCase();
	return [...text.toLowerCase()].flatMap((ch, i) => (ch === needle ? [i + 1] : []));
}

/** "strawberry" -> "s t r a w b e r r y": the word spelled out. */
export function spellOut(word) {
	return [...word].join(' ');
}

const t = (id, text) => ({ id, text, bytes: null });
const b = (id, bytes) => ({ id, text: null, bytes });

// Precomputed with gpt-tokenizer 4.0.0 (o200k_base unless noted) and
// verified by real-tokens.test.mjs. Keys are stable; the page picks them.
export const EXAMPLES = {
	questionEn: { text: "How many r's are in strawberry?", tokens: [t(5299, 'How'), t(1991, ' many'), t(428, ' r'), t(885, "'s"), t(553, ' are'), t(306, ' in'), t(101830, ' strawberry'), t(30, '?')] },
	questionDe: { text: 'Wie viele r hat strawberry?', tokens: [t(34130, 'Wie'), t(19877, ' viele'), t(428, ' r'), t(4545, ' hat'), t(101830, ' strawberry'), t(30, '?')] },
	strawberry: { text: 'strawberry', tokens: [t(302, 'st'), t(1618, 'raw'), t(19772, 'berry')] },
	spaceStrawberry: { text: ' strawberry', tokens: [t(101830, ' strawberry')] },
	capStrawberry: { text: 'Strawberry', tokens: [t(3504, 'Str'), t(1134, 'aw'), t(19772, 'berry')] },
	upperStrawberry: { text: 'STRAWBERRY', tokens: [t(1117, 'ST'), t(46176, 'RAW'), t(33, 'B'), t(132354, 'ERRY')] },
	spelled: { text: 's t r a w b e r r y', tokens: [t(82, 's'), t(260, ' t'), t(428, ' r'), t(261, ' a'), t(286, ' w'), t(287, ' b'), t(319, ' e'), t(428, ' r'), t(428, ' r'), t(342, ' y')] },
	strawberryCl100k: { text: 'strawberry', encoding: 'cl100k_base', tokens: [t(496, 'str'), t(675, 'aw'), t(15717, 'berry')] },
	number: { text: '1234567', tokens: [t(7633, '123'), t(19354, '456'), t(22, '7')] },
	emoji: { text: '🍓', tokens: [b(102415, [0xf0, 0x9f, 0x8d]), b(241, [0x93])] },
	erdbeere: { text: 'Erdbeere', tokens: [t(36, 'E'), t(9290, 'rd'), t(1464, 'be'), t(512, 'ere')] },
};

// Same request in four languages: characters and token counts in the
// current (o200k_base) and the previous (cl100k_base) OpenAI tokenizer.
export const LANGUAGES = [
	{ lang: 'en', text: 'I would like a cup of coffee, please.', chars: 37, o200k: 10, cl100k: 10 },
	{ lang: 'de', text: 'Ich hätte gern eine Tasse Kaffee, bitte.', chars: 40, o200k: 10, cl100k: 13 },
	{ lang: 'el', text: 'Θα ήθελα ένα φλιτζάνι καφέ, παρακαλώ.', chars: 37, o200k: 18, cl100k: 37 },
	{ lang: 'hi', text: 'मुझे एक कप कॉफ़ी चाहिए, कृपया।', chars: 30, o200k: 13, cl100k: 34 },
];
