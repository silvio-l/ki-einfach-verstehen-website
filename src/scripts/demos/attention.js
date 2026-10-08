// Real attention weights for the AttentionDemo of Baustein
// transformerbloecke-und-attention (EN transformer-blocks-and-attention).
// Learning goal 2 of the lesson plan: attention is a weighted mix; every
// visible earlier position gets a weight, all weights add up to 1, and you
// can predict which earlier word gets a lot. The causal mask (goal 4) is
// visible too: later tokens get no light.
//
// The weights are not made up. scripts/demos/precompute/attention.py ran the
// text's sentences through Qwen/Qwen3-0.6B-Base (revision in the JSON) and
// stored every layer and head, quantised per row to integers that sum to
// exactly `quant`. Only pairs the causal mask allows are stored.

/** Lazy-load one language's sentences (a separate chunk, not the page bundle). */
export async function loadAttention(lang) {
	const mod = lang === 'en' ? await import('./data/attention-en.json') : await import('./data/attention-de.json');
	return mod.default;
}

/** Base64 to bytes, in the browser and in Node. */
function decodeBase64(b64) {
	const bin = atob(b64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return bytes;
}

/** Number of stored weights per layer and head: one row per position, each
 * row as long as the positions it may see (itself and all before). */
export function triangle(n) {
	return (n * (n + 1)) / 2;
}

/**
 * Decode one sentence of the JSON into a lookup.
 * @param {{ tokens: string[], weights: string }} sentence
 * @param {{ layers: number, heads: number, quant: number }} meta
 */
export function decodeSentence(sentence, meta) {
	const n = sentence.tokens.length;
	const bytes = decodeBase64(sentence.weights);
	const block = triangle(n);
	if (bytes.length !== block * meta.layers * meta.heads) {
		throw new Error(`attention data for "${sentence.text}" has ${bytes.length} weights, expected ${block * meta.layers * meta.heads}`);
	}
	return {
		...sentence,
		n,
		/** Raw integers of one row (positions 0..query), summing to meta.quant. */
		raw(layer, head, query) {
			const start = (layer * meta.heads + head) * block + triangle(query);
			return bytes.subarray(start, start + query + 1);
		},
		/** Weights for every position as seen from `query`: a share 0..1 for
		 * itself and every earlier position, null for later ones (masked). */
		spotlight(layer, head, query) {
			const row = this.raw(layer, head, query);
			return sentence.tokens.map((_, k) => (k <= query ? row[k] / meta.quant : null));
		},
	};
}

/** Sum of the visible weights of a row (1 up to rounding of the display). */
export function total(weights) {
	return weights.reduce((sum, w) => sum + (w ?? 0), 0);
}

/** "32 %", "<1 %", "0 %" -- a weight as the demo prints it. */
export function percentLabel(w, lang) {
	if (w === null) return '';
	if (w > 0 && w < 0.005) return lang === 'de' ? '<1 %' : '<1%';
	const p = String(Math.round(w * 100));
	return lang === 'de' ? `${p} %` : `${p}%`;
}

/** The token as shown: a leading space as ␣, the separator token named. */
export function tokenLabel(piece, prefix, lang) {
	if (piece === prefix) return lang === 'de' ? 'Textgrenze' : 'text boundary';
	return piece.replace(/ /g, '␣');
}

/** Indices of the `count` largest visible weights, largest first. */
export function brightest(weights, count = 3) {
	return weights
		.map((w, k) => [w, k])
		.filter(([w]) => w !== null)
		.sort((a, b) => b[0] - a[0])
		.slice(0, count)
		.map(([, k]) => k);
}

/** Start state: the money sentence, "Bank" at its turn, in block 1, head 1.
 * Deliberately not the clearest head: readers first guess where most light
 * usually goes and try a few heads before the button shows the exception. */
export function startState(doc) {
	const sentence = doc.sentences.findIndex((s) => s.id === 'geld');
	return { sentence, query: doc.sentences[sentence].focus, layer: 0, head: 0 };
}

/** For every layer and head, which position gets the most light from the
 * sentence's focus token; returns how often each position wins. */
export function winnerCounts(sentence, meta) {
	const counts = new Array(sentence.n).fill(0);
	for (let l = 0; l < meta.layers; l++) {
		for (let h = 0; h < meta.heads; h++) {
			const row = sentence.raw(l, h, sentence.focus);
			let best = 0;
			for (let k = 1; k < row.length; k++) if (row[k] > row[best]) best = k;
			counts[best]++;
		}
	}
	return counts;
}
