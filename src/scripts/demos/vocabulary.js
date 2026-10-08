// Logic of the VocabularyDemo (Baustein embeddings, learning goal 3:
// vocabulary size is a trade-off -- a larger vocabulary makes the token
// sequence shorter, but needs a larger embedding matrix with one row per
// entry).
// Three real OpenAI tokenizers from gpt-tokenizer (lazy-loaded via
// real-tokens.js): GPT-2's r50k_base, GPT-4's cl100k_base and o200k_base
// (GPT-4o; gpt-oss uses the same pieces). vocabulary.test.mjs checks the
// entry counts against the engines and pins the token counts of the start
// sentences (measured 2026-10-06), which the Baustein quotes.

/** Width of one table row: GPT-2's 768 numbers, the model of the text. The
 * larger tokenizers' models have longer, unpublished rows, so the table
 * sizes are an example calculation. */
export const ROW_WIDTH = 768;

/**
 * `entries` = number of token IDs (0 … entries − 1), special tokens
 * included, the way tiktoken counts them; one table row each.
 * r50k_base: 50,256 pieces + <|endoftext|> (50256).
 * cl100k_base: 100,256 pieces + specials up to <|endofprompt|> (100276).
 * o200k_base: 199,998 pieces + specials up to ID 200018 (in gpt-oss's
 * tokenizer: 21 special tokens, 199998-200018).
 */
export const TOKENIZERS = [
	{ key: 'r50k_base', name: 'GPT-2', encoding: 'r50k_base', entries: 50257 },
	{ key: 'cl100k_base', name: 'GPT-4', encoding: 'cl100k_base', entries: 100277 },
	{ key: 'o200k_base', name: 'GPT-4o · gpt-oss', encoding: 'o200k_base', entries: 200019 },
];

/** Start sentences: the Baustein's Katzensatz and its English version. */
export const SENTENCES = {
	de: 'Die Katze sitzt auf dem Fensterbrett.',
	en: 'The cat is sitting on the windowsill.',
};

/** Pinned token counts of the start sentences (regression check). */
export const TEXT_COUNTS = {
	de: { r50k_base: 14, cl100k_base: 12, o200k_base: 9 },
	en: { r50k_base: 9, cl100k_base: 9, o200k_base: 9 },
};

/** Numbers in one table: one row of ROW_WIDTH numbers per entry. */
export function tableSize(entries, width = ROW_WIDTH) {
	return entries * width;
}

/** Group digits per language: 50.257 (de) / 50,257 (en). */
export function formatInt(n, lang) {
	return Math.round(n).toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');
}

/** Large counts in millions, rounded: "206 Mio." / "206 million". */
export function formatMillions(n, lang) {
	const m = Math.round(n / 1e6);
	return lang === 'de' ? `${formatInt(m, lang)} Mio.` : `${formatInt(m, lang)} million`;
}

/**
 * Per tokenizer: tokens of `text` and the share of the largest token count
 * and table (0..1) for the bars.
 * @param {Record<string, (text: string) => unknown[]>} encoders by key
 */
export function compare(encoders, text, tokenizers = TOKENIZERS) {
	const rows = tokenizers.map((t) => ({ ...t, tokens: encoders[t.key](text), table: tableSize(t.entries) }));
	const maxTokens = Math.max(1, ...rows.map((r) => r.tokens.length));
	const maxTable = Math.max(...rows.map((r) => r.table));
	return rows.map((r) => ({ ...r, tokenShare: r.tokens.length / maxTokens, tableShare: r.table / maxTable }));
}
