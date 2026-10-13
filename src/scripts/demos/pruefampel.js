// Logic of the PruefampelDemo (Baustein antworten-pruefen, learning goals 1
// and 2): the reader places four invented chatbot answers on the risk traffic
// light and picks the check that fits the likely error. Origin: simulation.
// No model runs. Tests: pruefampel.test.mjs.

export const AMPELN = ['gruen', 'gelb', 'rot'];
export const SCHRITTE = ['selbst', 'quelle', 'stichtag', 'fachperson'];

/** Four invented cases; `ampel` and `schritt` are the answers the rules give. */
export const FAELLE = [
	{ id: 'vereinsfest', ampel: 'gruen', schritt: 'selbst' },
	{ id: 'medikament', ampel: 'rot', schritt: 'fachperson' },
	{ id: 'zitat', ampel: 'gelb', schritt: 'quelle' },
	{ id: 'pokal', ampel: 'gelb', schritt: 'stichtag' },
];

/** Compares a guess with the rule for one case. */
export function judge(fallId, ampel, schritt) {
	const fall = FAELLE.find((f) => f.id === fallId);
	if (!fall) throw new Error(`unknown case: ${fallId}`);
	if (!AMPELN.includes(ampel)) throw new Error(`unknown light: ${ampel}`);
	if (!SCHRITTE.includes(schritt)) throw new Error(`unknown step: ${schritt}`);
	return {
		ampelRichtig: ampel === fall.ampel,
		schrittRichtig: schritt === fall.schritt,
		ampel: fall.ampel,
		schritt: fall.schritt,
	};
}
