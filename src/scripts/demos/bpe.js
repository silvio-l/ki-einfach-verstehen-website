// Logic of the "Build your own tokenizer" demo (Baustein 3, learning goals 2
// and 3: how BPE learns its pieces and splits a new word). A real, small byte pair
// encoding: the base vocabulary is the set of characters in a fixed practice
// text, with the space shown as ␣ and attached to the following word (as in
// GPT-2). Each training step counts all neighboring pairs inside the words,
// merges the most frequent one and appends it as a new vocabulary entry.
// Applying the tokenizer replays the learned merges on new text in the same
// order. Characters instead of bytes, so an unseen character stays unknown.

export const SPACE = '␣';

// Practice texts: short sentences with recurring word parts. Invented on
// purpose, small enough to watch. The first sentence is the toy example of
// the Baustein texts.
export const CORPUS = {
	de: [
		'Die Katze sitzt.',
		'Die Katzen lachen.',
		'Wir lachen im Garten.',
		'Sie lachte im Garten.',
		'Das Lachen machte Mut.',
		'Er machte den Garten neu.',
		'Wir machen die Gärten neu.',
		'Die Katze machte nichts.',
		'Sie sagte nichts.',
		'Er sagte, die Katze lachte.',
		'Wir sagen es den Katzen.',
		'Die Katzen sagen nichts.',
		'In den Gärten sitzen Katzen.',
		'Die Gärten sind grün.',
		'Wir lernen im Garten.',
		'Er lernt lachen.',
		'Sie hat das gelernt.',
		'Die Katze lernt nichts.',
		'Er lachte und sagte nichts.',
		'Wir machen das Lachen nach.',
		'Die Katzen machen den Garten.',
		'Sie sagen, wir lernen.',
		'Das Lachen ist gelernt.',
		'Im Garten lachen Katzen.',
	],
	en: [
		'The cat sits.',
		'The cats laugh.',
		'We laugh in the garden.',
		'She laughed in the garden.',
		'The laughing made us brave.',
		'He made the garden new.',
		'We make the gardens new.',
		'The cat made nothing.',
		'She said nothing.',
		'He said the cat laughed.',
		'We say it to the cats.',
		'The cats say nothing.',
		'In the gardens sit cats.',
		'The gardens are green.',
		'We learn in the garden.',
		'He learns to laugh.',
		'She has learned it.',
		'The cat learns nothing.',
		'He laughed and said nothing.',
		'We make the laughing last.',
		'The cats make the garden.',
		'They say we learn.',
		'The laughing is learned.',
		'In the garden cats laugh.',
	],
};

// The worked example of the Baustein text and its diagram (bpe-merges.mjs),
// small enough to check on paper: nine words without spaces, so only pairs
// inside a word count. The first three merges have distinct counts (DE
// 7/6/5, EN 7/6/5). The new word is absent from the list but uses only its
// characters, so no piece stays unknown. bpe.test.mjs recounts all of it.
export const BOOK_EXAMPLE = {
	de: {
		words: [['lachen', 2], ['machen', 2], ['sagen', 3], ['nicht', 1], ['lacht', 1]],
		newWord: 'machten',
	},
	en: {
		words: [['playing', 2], ['saying', 2], ['going', 1], ['rain', 1], ['day', 1], ['sing', 1]],
		newWord: 'laying',
	},
};

/** The book example as a practice text: every word repeated by its count. */
export function bookExampleText(lang) {
	return BOOK_EXAMPLE[lang].words.flatMap(([word, n]) => Array.from({ length: n }, () => word));
}

// Start sentence of the "apply" step: the toy example of the Baustein text.
export const SAMPLE = { de: 'Die Katze sitzt.', en: 'The cat sits.' };

// GPT-2-style pre-split: a word takes its leading space; letters, digits and
// other characters form separate runs. Merges never cross these boundaries.
const PRESPLIT = / ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;

/** Splits text into words, each with its leading space. */
export function pretokenize(text) {
	return String(text ?? '').normalize('NFC').match(PRESPLIT) ?? [];
}

/** A word as its starting symbols: one per character, the space as ␣. */
export function symbolsOf(word) {
	return [...word].map((ch) => (/\s/.test(ch) ? SPACE : ch));
}

/** Merges every occurrence of the pair a,b in one symbol list, left to right. */
export function mergeSymbols(symbols, a, b) {
	const out = [];
	for (let i = 0; i < symbols.length; i += 1) {
		if (i < symbols.length - 1 && symbols[i] === a && symbols[i + 1] === b) {
			out.push(a + b);
			i += 1;
		} else {
			out.push(symbols[i]);
		}
	}
	return out;
}

/**
 * A fresh trainer: the practice text split into words, the base vocabulary
 * (its distinct characters in Unicode order, IDs from 0) and no merges yet.
 * @param {'de' | 'en' | string[]} source a language or a list of sentences
 */
export function createTrainer(source) {
	const sentences = Array.isArray(source) ? source : CORPUS[source];
	/** @type {{ text: string, symbols: string[], freq: number }[]} */
	const words = [];
	const index = new Map();
	const text = sentences.map((s) =>
		pretokenize(s).map((w) => {
			if (!index.has(w)) {
				index.set(w, words.length);
				words.push({ text: w, symbols: symbolsOf(w), freq: 0 });
			}
			const i = index.get(w);
			words[i].freq += 1;
			return i;
		}),
	);
	const base = [...new Set(words.flatMap((w) => w.symbols))].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
	const vocab = base.map((piece, id) => ({ id, text: piece }));
	return { sentences, text, words, base, vocab, ids: new Map(base.map((p, i) => [p, i])), merges: [] };
}

/**
 * All neighboring pairs with their count, most frequent first. Ties go to
 * the pair that occurs first in the practice text (`first` is its position
 * in reading order), so every run gives the same result.
 */
export function countPairs(trainer) {
	const pairs = new Map();
	let pos = 0;
	for (const word of trainer.words) {
		for (let i = 0; i < word.symbols.length - 1; i += 1, pos += 1) {
			const a = word.symbols[i];
			const b = word.symbols[i + 1];
			const key = `${a}\u0000${b}`;
			const entry = pairs.get(key);
			if (entry) entry.count += word.freq;
			else pairs.set(key, { a, b, count: word.freq, first: pos });
		}
		pos += 1;
	}
	return [...pairs.values()].sort((x, y) => y.count - x.count || x.first - y.first);
}

/**
 * One training step: count, merge the most frequent pair everywhere, add the
 * result to the vocabulary. Returns null when no pair occurs twice any more.
 */
export function trainStep(trainer, top = 5) {
	const ranked = countPairs(trainer);
	const best = ranked[0];
	if (!best || best.count < 2) return null;
	const piece = best.a + best.b;
	let id = trainer.ids.get(piece);
	const added = id === undefined;
	if (added) {
		id = trainer.vocab.length;
		trainer.vocab.push({ id, text: piece });
		trainer.ids.set(piece, id);
	}
	for (const word of trainer.words) word.symbols = mergeSymbols(word.symbols, best.a, best.b);
	const tied = ranked.filter((p) => p.count === best.count).length - 1;
	const merge = { rank: trainer.merges.length + 1, a: best.a, b: best.b, text: piece, id, count: best.count, added, tied };
	trainer.merges.push(merge);
	return { merge, top: ranked.slice(0, top) };
}

/** A trainer after `steps` training steps (fewer if it runs out of pairs). */
export function train(source, steps) {
	const trainer = createTrainer(source);
	for (let i = 0; i < steps; i += 1) if (!trainStep(trainer)) break;
	return trainer;
}

/** The practice text as pieces, one array per sentence. */
export function segmentation(trainer) {
	return trainer.text.map((sentence) => sentence.flatMap((i) => trainer.words[i].symbols));
}

/** Number of pieces the whole practice text currently consists of. */
export function tokenCount(trainer) {
	return trainer.text.reduce((sum, sentence) => sum + sentence.reduce((n, i) => n + trainer.words[i].symbols.length, 0), 0);
}

/**
 * Applies a trained tokenizer to new text: start from characters, replay the
 * merges in learned order. Characters outside the base vocabulary stay single
 * and unknown (id null). `steps` lists every merge that changed something.
 * @param {string} text
 * @param {{ ids: Map<string, number>, merges: { a: string, b: string, rank: number, text: string }[] }} trainer
 */
export function encode(text, trainer) {
	let words = pretokenize(text).map(symbolsOf);
	const steps = [];
	for (const m of trainer.merges) {
		let changed = false;
		words = words.map((symbols) => {
			const next = mergeSymbols(symbols, m.a, m.b);
			if (next.length !== symbols.length) changed = true;
			return next;
		});
		if (changed) steps.push({ merge: m, pieces: words.flat() });
	}
	const tokens = words.flat().map((piece) => {
		const id = trainer.ids.get(piece);
		return id === undefined ? { text: piece, id: null, unknown: true } : { text: piece, id, unknown: false };
	});
	return { tokens, steps };
}
