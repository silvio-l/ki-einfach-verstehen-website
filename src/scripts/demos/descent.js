// "Downhill to the smallest error" for Grundlagen-Baustein 6
// (parameter-training-inferenz-hardware), section "Woher kennt das Training
// die Richtung?". A made-up toy, marked as such in text and demo: a model
// with one fader w predicts the price of apples as w · kilos and learns from
// three made-up purchases. The error is the sum of the squared deviations
// (squared loss, Google ML Crash Course "Loss"); training follows the slope
// downhill, one step = slope · learning rate (Google ML Crash Course
// "Gradient descent" and "Learning rate").
//
// Numbers of the text: error 56 at w = 0, 26 at 1, 8 at 2, 2 at 3 (the
// bottom), 8 at 4. The error never reaches 0 because the two 1-kilo
// purchases disagree.

/** The three made-up purchases of the text. */
export const PURCHASES = [
	{ kg: 1, euro: 2 },
	{ kg: 1, euro: 4 },
	{ kg: 2, euro: 6 },
];

/** The fader starts at 0, like the spam filter's weights in Baustein 1. */
export const START = 0;

/** How far "a little higher / lower" probes. Small enough that a probe
 * never jumps across the bottom while the demo has not reached it. */
export const PROBE = 0.1;

/** Learning rates: `small` halves the distance to the bottom with every
 * step; `big` jumps exactly across the valley to the same height on the
 * other side, so it never arrives (1 − 12·rate = −1). */
export const RATES = { small: 1 / 24, big: 1 / 6 };

/** Below this steepness the demo calls the bottom reached (|w − 3| < 0.05). */
export const FLAT = 0.6;

/** Fader range shown in the chart. */
export const RANGE = { min: -0.5, max: 6.5 };

/** Predicted price of one purchase. */
export const predict = (w, kg) => w * kg;

/** Error: every deviation times itself, all added up. */
export function loss(w, data = PURCHASES) {
	return data.reduce((sum, p) => sum + (predict(w, p.kg) - p.euro) ** 2, 0);
}

/** Slope of the error at w, worked out exactly: d/dw Σ (w·kg − euro)². */
export function slope(w, data = PURCHASES) {
	return data.reduce((sum, p) => sum + 2 * p.kg * (predict(w, p.kg) - p.euro), 0);
}

/** Slope by trying: nudge a little up and down and compare the errors. */
export function numericSlope(w, h = 1e-4, data = PURCHASES) {
	return (loss(w + h, data) - loss(w - h, data)) / (2 * h);
}

/** The fader setting with the smallest error (Σ kg·euro / Σ kg²). */
export function best(data = PURCHASES) {
	const num = data.reduce((s, p) => s + p.kg * p.euro, 0);
	const den = data.reduce((s, p) => s + p.kg * p.kg, 0);
	return num / den;
}

/** Rounds away floating-point dust so 0 − (1/6)·(−36) shows as 6. */
const tidy = (x) => Math.round(x * 1e9) / 1e9;

/** One step downhill: move against the slope, by slope times learning rate. */
export function step(w, rate, data = PURCHASES) {
	return tidy(w - rate * slope(w, data));
}

/** Fader settings after n steps from w0 (w0 included). */
export function path(w0, rate, n, data = PURCHASES) {
	const ws = [w0];
	for (let i = 0; i < n; i++) ws.push(step(ws[ws.length - 1], rate, data));
	return ws;
}

/** What the error would be a little higher (dir = 1) or lower (dir = −1). */
export function probe(w, dir, size = PROBE, data = PURCHASES) {
	const to = tidy(w + dir * size);
	const before = loss(w, data);
	const after = loss(to, data);
	return { to, before, after, change: after - before, smaller: after < before };
}

/** True once the slope is so flat that the bottom counts as reached. */
export const atBottom = (w, data = PURCHASES) => Math.abs(slope(w, data)) < FLAT;

/** "56", "15,5", "2,01": at most two decimals, trailing zeros dropped. */
export function formatNumber(x, lang) {
	const s = String(Math.round(x * 100) / 100);
	return lang === 'de' ? s.replace('.', ',') : s;
}
