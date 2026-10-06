// Softmax, temperature and drawing, shared by two live demos:
// SoftmaxDemo (Baustein wahrscheinlichkeit-und-softmax) and SamplingDemo
// (Baustein output-head). Same rule as the text and as torch.softmax:
// weight = e^(score / T), share = weight / sum of weights. Temperature 0 is
// the providers' convention "take the most likely one" (greedy).
//
// Entries may carry a `count`: n scores that are equal (or close enough to
// be folded into one histogram bin) count as n weights. SamplingDemo uses it
// for the ~150,000 rows of the board it does not ship one by one.

/** @typedef {{ score: number, count?: number }} Entry */

/** The made-up example of the softmax Baustein: "Die Katze …" / "The cat …",
 * scores 3.0, 2.0 and −1.0 (72 / 27 / 1 % at temperature 1). */
export const CAT_EXAMPLE = {
	de: { prompt: 'Die Katze …', words: ['sitzt', 'schläft', 'fliegt'] },
	en: { prompt: 'The cat …', words: ['sat', 'slept', 'flew'] },
	scores: [3, 2, -1],
	temperature: 1,
};

/**
 * Shares (fractions that add up to 1) of each entry at a temperature.
 * Temperature 0 gives everything to the highest score (the first one on a tie).
 * @param {(number | Entry)[]} entries
 * @param {number} [temperature]
 * @returns {number[]}
 */
export function softmax(entries, temperature = 1) {
	const list = entries.map((e) => (typeof e === 'number' ? { score: e, count: 1 } : { score: e.score, count: e.count ?? 1 }));
	if (list.length === 0) return [];
	let best = 0;
	for (let i = 1; i < list.length; i++) if (list[i].score > list[best].score) best = i;
	if (!(temperature > 0)) return list.map((_, i) => (i === best ? 1 : 0));
	// Subtracting the highest score first changes no share (only the gaps
	// count) and keeps e^x from overflowing.
	const max = list[best].score;
	const weights = list.map((e) => e.count * Math.exp((e.score - max) / temperature));
	const sum = weights.reduce((a, b) => a + b, 0);
	return weights.map((w) => w / sum);
}

/** The scores softmax actually sees at a temperature: each divided by T. */
export function scaled(scores, temperature) {
	return scores.map((s) => s / temperature);
}

/**
 * One spin of the wheel: the index whose share the random number falls into.
 * @param {number[]} shares fractions that add up to 1
 * @param {() => number} [random] uniform in [0, 1), injectable for tests
 */
export function draw(shares, random = Math.random) {
	let r = random();
	let last = -1;
	for (let i = 0; i < shares.length; i++) {
		if (shares[i] <= 0) continue;
		last = i;
		if (r < shares[i]) return i;
		r -= shares[i];
	}
	return last; // floating-point remainder lands on the last possible entry
}

/** n spins: how often each index came up. */
export function drawMany(shares, n, random = Math.random) {
	const counts = shares.map(() => 0);
	for (let k = 0; k < n; k++) counts[draw(shares, random)] += 1;
	return counts;
}

/** Small seeded generator (mulberry32) for reproducible tests. */
export function seeded(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const local = (s, lang) => (lang === 'de' ? s.replace('.', ',') : s);

/**
 * A share written the way the texts write it: "72", "0,03", "48,8".
 * `decimals` applies from 1 % up; below that the value keeps enough digits
 * not to read as zero (softmax never gives zero), and just under 100 % it
 * never rounds up to 100.
 * @param {number} share fraction 0..1
 * @param {'de' | 'en'} lang
 * @param {number} [decimals]
 */
export function formatPercent(share, lang, decimals = 0) {
	const pct = share * 100;
	if (pct === 0 || pct === 100) return String(pct);
	if (pct > 99.9) return local('> 99.9', lang);
	if (pct > 99 && decimals < 1) return local(pct.toFixed(1), lang);
	if (pct >= 1) return local(pct.toFixed(decimals), lang);
	if (pct >= 0.1) return local(pct.toFixed(Math.max(1, decimals)), lang);
	if (pct >= 0.01) return local(pct.toFixed(2), lang);
	return local('< 0.01', lang);
}

/** A score or temperature as the texts write it: "3,0", "−1,0", "0,5". */
export function formatNumber(n, lang, decimals = 1) {
	const s = n.toFixed(decimals);
	// -0.04 rounds to "-0.0": no sign on a zero.
	return local(/^-0\.?0*$/.test(s) ? s.slice(1) : s, lang).replace('-', '−');
}
