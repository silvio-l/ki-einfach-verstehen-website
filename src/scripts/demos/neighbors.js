// Nearest neighbors in GPT-2's real input table, for Baustein W3
// (embeddings), learning goal 1: an ID says nothing about similarity, the
// looked-up row does. The data (data/gpt2-neighbors.json) is precomputed by
// scripts/demos/precompute/gpt2-neighbors.py from openai-community/gpt2 at a
// pinned revision: per word the 8 nearest whole-word tokens by cosine, the
// tokens with the neighboring IDs, the cosine of every pair of listed words
// and the random-pair baseline. Only the helpers live here; the JSON is
// loaded on demand so it never lands in the page bundle.

/** Lazy-load the precomputed data (browser: one small JSON chunk). */
export async function loadNeighbors() {
	const mod = await import('./data/gpt2-neighbors.json');
	return mod.default;
}

// German glosses for the select labels. GPT-2's vocabulary is English, so the
// German page works with the same English tokens.
export const GLOSS_DE = {
	apple: 'Apfel', Apple: 'die Firma', pear: 'Birne', banana: 'Banane', peach: 'Pfirsich',
	lemon: 'Zitrone', fruit: 'Obst', laptop: 'Laptop', computer: 'Computer', phone: 'Telefon',
	iPhone: 'iPhone', Microsoft: 'Microsoft', Google: 'Google', dog: 'Hund', dogma: 'Dogma',
	cat: 'Katze', horse: 'Pferd', bark: 'bellen, Rinde', bank: 'Bank, Ufer', river: 'Fluss',
	money: 'Geld', king: 'König', queen: 'Königin', man: 'Mann', woman: 'Frau', doctor: 'Ärztin, Arzt',
	teacher: 'Lehrerin, Lehrer', eat: 'essen', drink: 'trinken', run: 'rennen', walk: 'gehen',
	Paris: 'Paris', Berlin: 'Berlin', London: 'London', Germany: 'Deutschland', France: 'Frankreich',
	red: 'rot', blue: 'blau', green: 'grün', happy: 'glücklich', sad: 'traurig', good: 'gut',
	bad: 'schlecht', big: 'groß', small: 'klein', car: 'Auto', train: 'Zug', house: 'Haus',
	school: 'Schule', water: 'Wasser', coffee: 'Kaffee', bread: 'Brot', cheese: 'Käse',
	Monday: 'Montag', January: 'Januar', three: 'drei', music: 'Musik',
};

/** Label of a word in the select: "apple (Apfel)" on the German page. */
export function optionLabel(word, lang) {
	const gloss = GLOSS_DE[word];
	return lang === 'de' && gloss && gloss !== word ? `${word} (${gloss})` : word;
}

export function findWord(data, word) {
	return data.words.find((w) => w.w === word);
}

/** Cosine of two listed words from the stored upper triangle. */
export function pairCosine(data, a, b) {
	const n = data.words.length;
	let i = data.words.findIndex((w) => w.w === a);
	let j = data.words.findIndex((w) => w.w === b);
	if (i < 0 || j < 0) return NaN;
	if (i === j) return 1;
	if (i > j) [i, j] = [j, i];
	// Rows before i hold (n-1) + (n-2) + ... + (n-i) entries.
	const offset = i * n - (i * (i + 1)) / 2;
	return data.pairs[offset + (j - i - 1)];
}

export function idDistance(data, a, b) {
	return Math.abs(findWord(data, a).id - findWord(data, b).id);
}

/** "0,456" / "0.456" (or two decimals for the bars, like the diagram). */
export function formatCos(value, lang, digits = 3) {
	const s = value.toFixed(digits);
	return lang === 'de' ? s.replace('.', ',') : s;
}

/** "8.106" / "8,106": IDs and ID distances as the text writes them. */
export function formatInt(n, lang) {
	return n.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');
}

/** Bar width in percent: cosine 0 is empty, 1 is full (negatives empty). */
export function barPercent(value) {
	return Math.max(0, Math.min(1, value)) * 100;
}
