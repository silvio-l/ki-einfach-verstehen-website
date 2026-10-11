// Shown percentages for a whole distribution (softmax shares, attention
// weights) that a reader can add up: rounding every share on its own can show
// 99 % or 101 % in total, although the demos say the shares make 100 %.

/**
 * Rounded percentages for `shares` (fractions 0..1, `null` for entries that
 * are not part of the distribution). Shares below one display step (1 % for
 * `decimals` 0, 0.1 % for 1) come back as `null`: the caller labels them
 * "< 1 %", and they count as what they are. The other
 * entries are rounded by largest remainder, so together they make exactly
 * 100 minus the small ones, rounded to the same step.
 * @param {Array<number | null>} shares
 * @param {number} [decimals]
 * @returns {Array<number | null>}
 */
export function hundredPercents(shares, decimals = 0) {
	const unit = 10 ** decimals;
	const steps = shares.map((s) => (s === null || s === undefined ? null : s * 100 * unit));
	const big = steps.map((x, i) => [x, i]).filter(([x]) => x !== null && x >= 1);
	const small = steps.reduce((sum, x) => (x !== null && x < 1 ? sum + x : sum), 0);
	const out = shares.map(() => null);
	for (const [x, i] of big) out[i] = Math.floor(x);
	let missing = Math.round(100 * unit - small) - big.reduce((sum, [x]) => sum + Math.floor(x), 0);
	const order = big.map(([x, i]) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
	for (let n = 0; missing > 0 && order.length; n = (n + 1) % order.length, missing -= 1) out[order[n][1]] += 1;
	return out.map((v) => (v === null ? null : v / unit));
}
