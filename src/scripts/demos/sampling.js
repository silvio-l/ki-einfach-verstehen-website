// Real boards for SamplingDemo (Baustein output-head): the scores Qwen3-0.6B-Base
// gives at the last position for a few prompts, precomputed by
// scripts/demos/precompute/sampling.py into data/sampling.json (model ID and
// revision inside). Kept by name: the 200 highest scores; the rest of the
// 151,936 rows is folded into a histogram, so the share of "all other tokens"
// stays exact enough at every temperature. Softmax and drawing: softmax.js.
import { draw, softmax } from './softmax.js';

/** Lazy-load the boards (browser): one small JSON chunk, not in the page bundle. */
export async function loadBoards() {
	return (await import('./data/sampling.json')).default;
}

/** The prompts offered in a language. The EN Baustein quotes the German
 * Paris prompt too, so it comes first there as well. */
export function promptsFor(data, lang) {
	const own = data.prompts.filter((p) => p.lang === lang);
	if (lang === 'de') return own;
	const paris = data.prompts.find((p) => p.key === 'paris-de');
	return paris ? [paris, ...own] : own;
}

/** Every row of the board as softmax entries: kept tokens one by one, then the histogram bins. */
export function entriesOf(data, prompt) {
	const named = prompt.tokens.map(([, score]) => ({ score, count: 1 }));
	// Each bin: its rows at one representative score, lower edge + offset.
	const { start, counts, offsets } = prompt.restBins;
	const binned = [];
	counts.forEach((count, i) => {
		if (count > 0) binned.push({ score: (start + i) * data.bin + offsets[i] * data.offsetUnit, count });
	});
	return [...named, ...binned];
}

/**
 * The board at a temperature: the top rows with score and share, and the
 * share of everything else.
 * @returns {{ rows: { text: string, score: number, share: number }[], other: number, shares: number[] }}
 */
export function board(data, prompt, temperature) {
	const shares = softmax(entriesOf(data, prompt), temperature);
	const rows = prompt.tokens.slice(0, data.top).map(([text, score], i) => ({ text, score, share: shares[i] }));
	const other = 1 - rows.reduce((a, r) => a + r.share, 0);
	return { rows, other: Math.max(0, other), shares };
}

/**
 * One draw from the board. `rank` is 1-based for a token kept by name, or
 * null for one of the rarely drawn rows further down.
 * @returns {{ rank: number | null, text: string | null }}
 */
export function drawToken(prompt, shares, random = Math.random) {
	const i = draw(shares, random);
	if (i < prompt.tokens.length) return { rank: i + 1, text: prompt.tokens[i][0] };
	return { rank: null, text: null };
}

/** A token as the Baustein writes it: without its leading space; a bare
 * space and line breaks made visible. */
export function displayToken(text) {
	if (text === null) return '…';
	const shown = text.startsWith(' ') && text.trim() !== '' ? text.slice(1) : text;
	return shown.replace(/ /g, '␣').replace(/\n/g, '⏎');
}
