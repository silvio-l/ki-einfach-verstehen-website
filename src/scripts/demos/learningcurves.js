// The learning curves of Baustein batch-epoch-step-tokenbudget: a real, tiny
// character model trained on Kafka's "Die Verwandlung"
// (scripts/demos/precompute/lernkurven.py writes data/lernkurven.json).
// Training and validation loss after every epoch, for a small and a large
// training text; epoch 0 is the untrained model.

/** Epoch with the lowest validation loss (the first one on a tie). */
export function bestEpoch(run) {
	return run.val.indexOf(Math.min(...run.val));
}

/** Steps made after `epoch` full passes. */
export function stepsAfter(run, epoch) {
	return run.stepsPerEpoch * epoch;
}

/** Plot box for the SVG drawn by the demo, in viewBox units. */
export const PLOT = { left: 44, right: 584, top: 16, bottom: 236, yMax: 4.5 };

/** SVG path data for the first `upTo` epochs of a curve (all of it by default). */
export function curvePath(values, upTo = values.length - 1, plot = PLOT) {
	const last = values.length - 1;
	const x = (e) => plot.left + (e / last) * (plot.right - plot.left);
	const y = (v) => plot.bottom - (Math.min(v, plot.yMax) / plot.yMax) * (plot.bottom - plot.top);
	return values
		.slice(0, upTo + 1)
		.map((v, e) => `${e === 0 ? 'M' : 'L'}${x(e).toFixed(1)},${y(v).toFixed(1)}`)
		.join(' ');
}

/** Point of a curve at an epoch, in viewBox units. */
export function pointAt(values, epoch, plot = PLOT) {
	const last = values.length - 1;
	return {
		x: plot.left + (epoch / last) * (plot.right - plot.left),
		y: plot.bottom - (Math.min(values[epoch], plot.yMax) / plot.yMax) * (plot.bottom - plot.top),
	};
}

/** "2,44" / "2.44": a loss with two decimals. */
export function formatLoss(v, lang) {
	const s = v.toFixed(2);
	return lang === 'de' ? s.replace('.', ',') : s;
}
