// The word-weight filter of Baustein 1 (programm-algorithmus-modell): every
// known word carries a weight, the filter adds up the weights of the words
// in a subject line and compares the sum with a threshold. The values are
// the invented ones from the text (prize +3, free +2, invoice −2, threshold
// 2); the reader moves them in the demo.

export const FILTER = {
	de: {
		words: [
			{ key: 'gewinn', label: 'Gewinn', weight: 3 },
			{ key: 'gratis', label: 'gratis', weight: 2 },
			{ key: 'rechnung', label: 'Rechnung', weight: -2 },
		],
		threshold: 2,
		mails: ['Gratis: Dein Gewinn wartet', 'Pokal-Gewinn: Rechnung für die Feier'],
	},
	en: {
		words: [
			{ key: 'prize', label: 'prize', weight: 3 },
			{ key: 'free', label: 'free', weight: 2 },
			{ key: 'invoice', label: 'invoice', weight: -2 },
		],
		threshold: 2,
		mails: ['Free: your prize is waiting', 'Cup prize: invoice for the party'],
	},
};

/** Splits a subject into runs of letters and everything between them. */
export function segments(subject) {
	return subject.match(/[\p{L}\p{N}]+|[^\p{L}\p{N}]+/gu) ?? [];
}

/**
 * @param {string} subject
 * @param {{ key: string, weight: number }[]} words
 * @param {number} threshold
 */
export function score(subject, words, threshold) {
	const byKey = new Map(words.map((w) => [w.key, w]));
	const hits = [];
	let sum = 0;
	for (const part of segments(subject)) {
		const word = byKey.get(part.toLowerCase());
		if (!word) continue;
		hits.push(word);
		sum += word.weight;
	}
	return { hits, sum, spam: sum > threshold };
}

/** "2 + 3 = 5" / "3 − 2 = 1" / "−2 − 1 = −3": the sum written out as in the text. */
export function equation(hits) {
	if (hits.length === 0) return '';
	const minus = (n) => String(n).replace('-', '−');
	let out = minus(hits[0].weight);
	for (const hit of hits.slice(1)) out += hit.weight < 0 ? ` − ${Math.abs(hit.weight)}` : ` + ${hit.weight}`;
	const sum = hits.reduce((acc, hit) => acc + hit.weight, 0);
	return `${out} = ${minus(sum)}`;
}
