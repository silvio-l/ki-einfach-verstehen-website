// "Constant or planned?" for Baustein 3.4 (optimierung-der-gewichte),
// section "Erst hoch, dann lange runter: der Lernraten-Plan". A made-up
// toy, marked as such in text and demo: one fader w with the error 0.5 · w²,
// the valley at 0. Every batch brings a noisy note (slope plus made-up
// noise that does not vanish at the bottom; Goodfellow et al., Deep Learning
// 8.3.1), and the fader moves by learning rate · note. Three learning-rate
// choices run with the same notes: constantly high, constantly low, and a
// schedule that warms up linearly and then follows a cosine down to zero
// (the shape of the Llama 3 schedule, Grattafiori et al. 2024, §3.4.1).
// The noise is seeded, so "new notes" means a new seed.

/** Start of the fader, far from the valley. */
export const START = 6;

/** Spread of the made-up noise on every note. */
export const NOISE = 1;

/** Number of batches (steps) per run. */
export const STEPS = 100;

/** Steps of the warm-up at the start of the schedule. */
export const WARMUP = 10;

/** The two constant learning rates; the schedule peaks at HIGH. */
export const HIGH = 0.8;
export const LOW = 0.01;

/** The three choices, in display order. */
export const CHOICES = ['high', 'low', 'plan'];
/** The rates as the demo prints them in running text: "0,8" in German, "0.8" in English. */
export const RATE_TEXT = {
	high: { de: String(HIGH).replace('.', ','), en: String(HIGH) },
	low: { de: String(LOW).replace('.', ','), en: String(LOW) },
};

/** Error of the toy. */
export const loss = (w) => 0.5 * w * w;

/** Learning rate of each choice at step t (0-based). */
export function rateAt(choice, t, n = STEPS) {
	if (choice === 'high') return HIGH;
	if (choice === 'low') return LOW;
	if (t < WARMUP) return (HIGH * (t + 1)) / WARMUP;
	return HIGH * 0.5 * (1 + Math.cos((Math.PI * (t - WARMUP)) / (n - WARMUP)));
}

/** Small seeded random generator (mulberry32). */
export function random(seed) {
	let s = seed | 0;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Normally distributed noise (Box–Muller). */
function gauss(r) {
	let u = 0;
	while (!u) u = r();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

/** The made-up noise of every batch; the same for all three choices. */
export function noises(seed, n = STEPS) {
	const r = random(seed);
	return Array.from({ length: n }, () => gauss(r) * NOISE);
}

/** One run: fader settings and errors per step (start included). */
export function run(choice, { seed = 3, n = STEPS } = {}) {
	const nz = noises(seed, n);
	let w = START;
	const ws = [w];
	for (let t = 0; t < n; t++) {
		w -= rateAt(choice, t, n) * (w + nz[t]);
		ws.push(w);
	}
	return { choice, ws, errors: ws.map(loss) };
}

/** All three choices with the same notes. */
export const runAll = (opts = {}) => Object.fromEntries(CHOICES.map((c) => [c, run(c, opts)]));

/** Average error over the last k steps: where a run ends up. */
export const endError = (result, k = 10) => result.errors.slice(-k).reduce((a, b) => a + b, 0) / k;

/** The choice with the smallest end error. */
export function lowest(runs) {
	return CHOICES.reduce((best, c) => (endError(runs[c]) < endError(runs[best]) ? c : best), CHOICES[0]);
}

/** "0,38", "0.003": up to three decimals for small numbers. */
export function formatNumber(x, lang) {
	const digits = Math.abs(x) < 0.1 ? 1000 : 100;
	const s = String(Math.round(x * digits) / digits);
	return lang === 'de' ? s.replace('.', ',') : s;
}
