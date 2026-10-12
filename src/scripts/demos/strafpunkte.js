// Penalty points of one prediction, for StrafpunkteDemo (Baustein
// forward-pass-und-loss, learning goal 1). Same rule as the text and as
// PyTorch's CrossEntropyLoss for a single position: penalty = −ln(share of
// the token that actually follows). Halving the share always adds ln 2 ≈ 0.69.

export { formatNumber, formatPercent } from './softmax.js';

/** Where the demo starts: the text's 72 % for "sitzt" / "sat". */
export const START_PERCENT = 72;
/** The question of the demo: half of the start. */
export const GOAL_PERCENT = 36;
/** Smallest field the slider reaches; halving goes on below it. */
export const SLIDER_MIN = 0.5;
/** Smallest field the halving button goes to (a thousandth of a percent). */
export const HALVING_MIN = 0.001;

/**
 * Penalty points for a field of `percent` (0 < percent ≤ 100).
 * @param {number} percent
 */
export function penalty(percent) {
	if (!(percent > 0)) return Infinity;
	return Math.log(100 / Math.min(percent, 100));
}

/** How many halvings lead from 100 % to `percent`. */
export function halvings(percent) {
	return Math.log2(100 / percent);
}

/** The next field after one halving, never below HALVING_MIN. */
export function halve(percent) {
	return Math.max(HALVING_MIN, percent / 2);
}

/**
 * Points of the curve penalty(percent) for an SVG of `width` × `height`,
 * x = percent 0..100, y = penalty 0..maxPenalty (clipped at the top).
 * @returns {string} the `d` attribute of a path
 */
export function curvePath(width, height, maxPenalty) {
	const steps = 200;
	const pts = [];
	for (let k = 0; k <= steps; k++) {
		// Denser near 0 %, where the curve turns steep.
		const percent = 100 * (k / steps) ** 2;
		if (percent <= 0) continue;
		const y = Math.min(penalty(percent), maxPenalty);
		pts.push(`${(percent / 100) * width},${height - (y / maxPenalty) * height}`);
	}
	return `M${pts.join('L')}`;
}

/** A field size as the text writes it: "72", "36", "4,5", "0,28", "0,001". */
export function formatField(percent, lang) {
	const decimals = percent >= 10 ? 0 : percent >= 1 ? 1 : percent >= 0.1 ? 2 : 3;
	const s = Number(percent.toFixed(decimals)).toString();
	return lang === 'de' ? s.replace('.', ',') : s;
}
