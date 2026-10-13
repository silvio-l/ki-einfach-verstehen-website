// Logic of the SchreibtischDemo (Baustein was-ein-chatbot-im-gespraech-weiss,
// learning goal 2: where an answer can come from). Nothing is computed: each
// scenario lists the slips of text that lie on the desk (the context window)
// and the one source the answer comes from. All texts are invented for the
// example (origin: simulation). Tests: schreibtisch.test.mjs.

/** The five answers a reader can pick. */
export const SOURCES = ['gewichte', 'kontext', 'werkzeug', 'notiz', 'geraten'];

/**
 * Each scenario: `zettel` lists what lies on the desk before the answer,
 * `answer` is the one source the answer really comes from.
 */
export const SCENARIOS = {
	hauptstadt: {
		zettel: [{ art: 'kontext', de: 'Systemanweisung: Antworte kurz und auf Deutsch.', en: 'System instruction: Answer briefly and in German.' }],
		answer: 'gewichte',
	},
	wetter: {
		zettel: [
			{ art: 'werkzeug', de: 'Suchergebnis (ausgedacht): 12 Grad.', en: 'Search result (invented): 12 degrees.' },
		],
		answer: 'werkzeug',
	},
	kinder: {
		zettel: [{ art: 'notiz', de: 'Gespeicherte Notiz (ausgedacht): „Du hast zwei Kinder.“', en: 'Saved memory (invented): “You have two children.”' }],
		answer: 'notiz',
	},
	stand: {
		zettel: [{ art: 'kontext', de: 'Systemanweisung: Heute ist der 12. Oktober 2026.', en: 'System instruction: Today is 12 October 2026.' }],
		answer: 'geraten',
	},
};

/** Returns whether the pick is right and which source the answer really has. */
export function judge(scenario, pick) {
	const s = SCENARIOS[scenario];
	if (!s) throw new Error(`unknown scenario: ${scenario}`);
	if (!SOURCES.includes(pick)) throw new Error(`unknown source: ${pick}`);
	return { correct: pick === s.answer, answer: s.answer };
}
