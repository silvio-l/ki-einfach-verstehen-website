// Rules for DenkschritteDemo (Baustein "Wie ein Modell „nachdenkt“"). The demo
// counts passes: one pass per generated token (a simplified count, not FLOPs). It does not
// time anything, because the sources give no fixed time per token, and it runs
// no model. All numbers the reader sees are invented.

/** Tokens of the question, fixed in this demo. */
export const INPUT_TOKENS = 60;

/** Slider ranges and start values. */
export const THINK = { min: 0, max: 2000, step: 50, start: 400 };
export const ANSWER = { min: 50, max: 500, step: 10, start: 150 };

/** Passes for one answer: one per thinking token and one per answer token. */
export function passes(denk, antwort) {
	return denk + antwort;
}

/** Length of the context at the end: question plus thinking plus answer. */
export function kontext(denk, antwort, eingabe = INPUT_TOKENS) {
	return eingabe + denk + antwort;
}

/** Passes relative to the start values (1 = the same as at the start). */
export function verhaeltnis(denk, antwort, denk0 = THINK.start, antwort0 = ANSWER.start) {
	return passes(denk, antwort) / passes(denk0, antwort0);
}

/** Shares of thinking and answer in the passes, for the proportional bar. */
export function anteile(denk, antwort) {
	const total = passes(denk, antwort);
	if (total === 0) return { denken: 0, antwort: 0 };
	return { denken: denk / total, antwort: antwort / total };
}
