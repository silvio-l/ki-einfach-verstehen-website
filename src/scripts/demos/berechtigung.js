// Logic of the BerechtigungsDemo (Baustein vom-chatbot-zum-agenten, learning
// goal 3): whether an action runs without a question under a permission mode.
// The mode names are those of the Claude Code docs (status 12 Oct 2026); the
// rule table is simplified and invented (origin: simulation). No model runs.
// Tests: berechtigung.test.mjs.

export const MODES = ['default', 'dontAsk'];
export const ACTIONS = ['lesen', 'umbenennen'];
export const OUTCOMES = ['laeuft', 'fragt', 'laeuft_nicht'];

/** Simplified rule table: what the program does per mode and action. */
export const RULES = {
	default: { lesen: 'laeuft', umbenennen: 'fragt' },
	dontAsk: { lesen: 'laeuft', umbenennen: 'laeuft_nicht' },
};

/** The outcome the program applies; the model's wording never changes it. */
export function outcome(mode, action) {
	const row = RULES[mode];
	if (!row) throw new Error(`unknown mode: ${mode}`);
	if (!ACTIONS.includes(action)) throw new Error(`unknown action: ${action}`);
	return row[action];
}

/** Returns whether the guess matches the program's rule. */
export function judge(mode, action, pick) {
	if (!OUTCOMES.includes(pick)) throw new Error(`unknown outcome: ${pick}`);
	const real = outcome(mode, action);
	return { correct: pick === real, outcome: real };
}
