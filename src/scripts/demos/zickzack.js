// "Three rules in a ravine" for Baustein 3.4 (optimierung-der-gewichte),
// section "Jeder Regler seine eigene Schrittweite". A made-up toy, marked as
// such in text and demo: a model with two faders whose error is a long,
// narrow ravine, 0.5 · (10 · across² + 0.1 · along²). Every batch brings
// noisy notes (gradient plus made-up noise), and three optimizers turn the
// faders with them:
// - plain: step = learning rate · note (Goodfellow et al., Deep Learning 8.3.1),
// - momentum: keep 90 % of the old momentum, add 10 % of the new note, step
//   = learning rate · momentum (exponential moving average as in Adam's first
//   moment; Goodfellow et al. 8.3.2),
// - Adam: momentum divided by the usual size of the notes (square root of the
//   moving average of their squares), bias-corrected (Kingma & Ba 2014), with
//   β1 = 0.9 and β2 = 0.95 as in GPT-3 (Brown et al. 2020, appendix B).
// The noise is seeded, so a run can be repeated exactly.

/** Steepness across and along the ravine: across is a hundred times steeper. */
export const CURVE = { across: 10, along: 0.1 };

/** Start: a little off the middle, far up the ravine. */
export const START = { across: 0.8, along: 9 };

/** Spread of the made-up noise on the notes, across and along. */
export const NOISE = { across: 2, along: 0.2 };

/** Number of batches (notes) per run. */
export const STEPS = 80;

/** Below this error the valley counts as reached. */
export const VALLEY = 0.3;

/** Beyond this distance from the middle a path has left the ravine. */
export const WALL = 3;

/** Adam's settings: share of old momentum and of the old usual size. */
export const ADAM = { beta1: 0.9, beta2: 0.95, eps: 1e-8 };

/** Slider settings: learning rates and momentum shares the reader can pick. */
export const RATES = [0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22];
export const BETAS = [0.5, 0.8, 0.9, 0.95, 0.99];
export const DEFAULT = { rate: 0.18, beta: 0.9, seed: 7 };

/** The three rules, in display order. */
export const RULES = ['plain', 'momentum', 'adam'];

/** Error of the toy at one fader setting. */
export const loss = (p) => 0.5 * (CURVE.across * p.across ** 2 + CURVE.along * p.along ** 2);

/** Exact slope (gradient) of the toy, without noise. */
export const gradient = (p) => ({ across: CURVE.across * p.across, along: CURVE.along * p.along });

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

/** The made-up noise of every batch; the same for all three rules. */
export function noises(seed, n = STEPS) {
	const r = random(seed);
	const out = [];
	for (let i = 0; i < n; i++) out.push({ across: gauss(r) * NOISE.across, along: gauss(r) * NOISE.along });
	return out;
}

/**
 * One run of one rule. Returns the fader settings (start included), the
 * errors, the first step below VALLEY (or -1) and whether it left the ravine.
 */
export function run(rule, { rate = DEFAULT.rate, beta = DEFAULT.beta, seed = DEFAULT.seed, n = STEPS, start = START } = {}) {
	const nz = noises(seed, n);
	let p = { ...start };
	const m = { across: 0, along: 0 };
	const v = { across: 0, along: 0 };
	const points = [{ ...p }];
	let reached = loss(p) < VALLEY ? 0 : -1;
	let escaped = false;
	for (let t = 0; t < n; t++) {
		const g = gradient(p);
		const note = { across: g.across + nz[t].across, along: g.along + nz[t].along };
		const next = {};
		for (const k of ['across', 'along']) {
			if (rule === 'plain') {
				next[k] = p[k] - rate * note[k];
			} else if (rule === 'momentum') {
				m[k] = beta * m[k] + (1 - beta) * note[k];
				next[k] = p[k] - rate * m[k];
			} else {
				m[k] = ADAM.beta1 * m[k] + (1 - ADAM.beta1) * note[k];
				v[k] = ADAM.beta2 * v[k] + (1 - ADAM.beta2) * note[k] ** 2;
				const mHat = m[k] / (1 - ADAM.beta1 ** (t + 1));
				const vHat = v[k] / (1 - ADAM.beta2 ** (t + 1));
				next[k] = p[k] - (rate * mHat) / (Math.sqrt(vHat) + ADAM.eps);
			}
		}
		p = next;
		if (Math.abs(p.across) > WALL || !Number.isFinite(p.across)) {
			escaped = true;
			points.push({ across: Math.sign(p.across) * WALL || WALL, along: p.along });
			break;
		}
		points.push({ ...p });
		if (reached < 0 && loss(p) < VALLEY) reached = t + 1;
	}
	return { rule, points, errors: points.map(loss), reached, escaped };
}

/** All three rules with the same notes. */
export const runAll = (opts = {}) => Object.fromEntries(RULES.map((r) => [r, run(r, opts)]));

/** The rule that reaches the valley first (ties: earlier in RULES), or null. */
export function winner(runs) {
	let best = null;
	for (const r of RULES) {
		const x = runs[r];
		if (x.escaped || x.reached < 0) continue;
		if (!best || x.reached < runs[best].reached) best = r;
	}
	return best;
}

/** The reader's guess options: how much sooner Adam reaches the valley. */
export const SPEEDS = ['same', 'double', 'tenfold'];

/** How much sooner Adam is in the valley than the plain rule, as one of SPEEDS (null if either misses). */
export function speedup(runs) {
	const plain = runs.plain.reached;
	const adam = runs.adam.reached;
	if (plain < 0 || adam < 0 || runs.plain.escaped) return null;
	const x = plain / adam;
	return x < 1.4 ? 'same' : x < 4 ? 'double' : 'tenfold';
}

/** Largest distance from the middle over the last `k` steps (calm or not). */
export function sway(result, k = 20) {
	return Math.max(...result.points.slice(-k).map((p) => Math.abs(p.across)));
}

/** "0,18", "0.9": at most two decimals, trailing zeros dropped. */
export function formatNumber(x, lang) {
	const s = String(Math.round(x * 100) / 100);
	return lang === 'de' ? s.replace('.', ',') : s;
}
