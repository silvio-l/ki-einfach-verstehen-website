// Published values for DenkvergleichDemo (Baustein "Wie ein Modell „nachdenkt“"):
// Qwen3 Technical Report (arXiv 2505.09388), tables 19 and 20 (thinking mode
// and without thinking). Nothing here is computed; the numbers are the report's.
// Percent values, one decimal as published.

const RESULTS = {
	math500: {
		'0.6': { mit: 77.6, ohne: 55.2 },
		'1.7': { mit: 93.4, ohne: 73.0 },
	},
	aime24: {
		'0.6': { mit: 10.7, ohne: 3.4 },
		'1.7': { mit: 48.3, ohne: 13.4 },
	},
};

/** The two series and the two model sizes the demo offers, in display order. */
export const SERIES = ['math500', 'aime24'];
export const SIZES = ['0.6', '1.7'];

/** One round to one decimal, so that 77.6 - 55.2 reads as 22.4. */
function round1(x) {
	return Math.round(x * 10) / 10;
}

/**
 * The published result for a series and a model size.
 * `abstand` is the gap in percentage points (with minus the without).
 * @returns {{ mit: number, ohne: number, abstand: number }}
 */
export function messung(reihe, groesse) {
	const r = RESULTS[reihe]?.[groesse];
	if (!r) throw new Error(`no published value for ${reihe} ${groesse}`);
	return { mit: r.mit, ohne: r.ohne, abstand: round1(r.mit - r.ohne) };
}
