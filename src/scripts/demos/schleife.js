// Logic of the SchleifenDemo (Baustein vom-chatbot-zum-agenten, learning goals
// 1 and 2): which side writes each line of an agent run and which side runs it.
// The run is invented and fixed in advance (origin: simulation). No model runs.
// Tests: schleife.test.mjs.

/** Who acts in a line: the model writes text, the program runs or asks, or a result comes back as text. */
export const ACTORS = ['modell', 'programm', 'ergebnis'];

/** Six lines of an invented run: rename one file, with one permission check. */
export const STEPS = [
	{ actor: 'modell', de: 'Aufruf liste_dateien für den Ordner Entwürfe', en: 'Call liste_dateien for the folder Entwürfe' },
	{ actor: 'ergebnis', de: 'Ergebnis als Text im Verlauf: „entwurf.txt, notizen.txt“', en: 'Result as text in the history: “entwurf.txt, notizen.txt”' },
	{ actor: 'modell', de: 'Aufruf benenne_um: entwurf.txt wird kapitel3.txt', en: 'Call benenne_um: entwurf.txt becomes kapitel3.txt' },
	{ actor: 'programm', de: 'Das Programm fragt dich: Darf entwurf.txt in kapitel3.txt umbenannt werden?', en: 'The program asks you: may entwurf.txt be renamed to kapitel3.txt?' },
	{ actor: 'ergebnis', de: 'Nach deinem Ja: Ergebnis als Text im Verlauf: „erfolgreich“', en: 'After your yes: result as text in the history: “successful”' },
	{ actor: 'modell', de: 'Antwort an dich: „Die Datei ist umbenannt.“', en: 'Answer to you: “Die Datei ist umbenannt.”' },
];

/** Returns whether the reader's guess is right and who acts in the line. */
export function judge(index, pick) {
	const step = STEPS[index];
	if (!step) throw new Error(`unknown step: ${index}`);
	if (!ACTORS.includes(pick)) throw new Error(`unknown actor: ${pick}`);
	return { correct: pick === step.actor, actor: step.actor };
}
