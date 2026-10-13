// Logic of the FortsetzungDemo (Baustein vom-textfortsetzer-zum-assistenten,
// learning goal 1). Both examples are the outputs printed in Figure 8 of
// Ouyang et al. 2022 (InstructGPT, arXiv:2203.02155, p. 15). The completions
// are quoted from the paper; the German and English renderings are ours.
// Nothing is computed here: the demo shows published outputs and checks the
// reader's guess. Tests: fortsetzung.test.mjs.

/** The slot ('a' or 'b') that shows the GPT-3 completion, per example. */
export const GPT3_SLOT = { story: 'a', code: 'b' };

/**
 * Each text has `text` as printed in the paper, `de` (our German rendering)
 * and `en` (our English rendering, null when the paper text is already English).
 */
export const EXAMPLES = {
	story: {
		prompt: {
			text: 'Écrivez une courte histoire sur une grenouille qui voyage dans le temps jusqu’à la Grèce antique en français.',
			de: 'Schreib eine kurze Geschichte über einen Frosch, der in der Zeit bis ins antike Griechenland reist, auf Französisch.',
			en: 'Write a short story about a frog who travels through time to ancient Greece, in French.',
		},
		gpt3: [
			{
				text: 'Écrivez une histoire au sujet d’un enfant qui voudrait tout savoir sur les jeux des dieux et qui se retrouve dans l’une de leurs histoires.',
				de: 'Schreib eine Geschichte über ein Kind, das alles über die Spiele der Götter wissen möchte und sich in einer ihrer Geschichten wiederfindet.',
				en: 'Write a story about a child who wants to know everything about the games of the gods and finds themselves in one of their stories.',
			},
			{
				text: 'Écrivez une histoire sur un jeune homme qui a une aventure dans une époque lointaine avec une fille de l’époque.',
				de: 'Schreib eine Geschichte über einen jungen Mann, der in einer fernen Zeit ein Abenteuer mit einem Mädchen aus dieser Zeit erlebt.',
				en: 'Write a story about a young man who has an adventure in a distant era with a girl from that time.',
			},
			{
				text: 'Écrivez une histoire sur un enfant qui est envoyé à l’école et qui a un ami imaginaire qui lui permet de voyager dans le temps.',
				de: 'Schreib eine Geschichte über ein Kind, das in die Schule geschickt wird und einen imaginären Freund hat, der ihm erlaubt, durch die Zeit zu reisen.',
				en: 'Write a story about a child who is sent to school and has an imaginary friend who lets them travel through time.',
			},
		],
		instruct: [
			{
				text: 'La grenouille était perdue et épuisée. Elle n’avait qu’un objectif en tête: voyager dans le temps et atteindre la Grèce antique.',
				de: 'Der Frosch war verloren und erschöpft. Er hatte nur ein Ziel im Kopf: durch die Zeit reisen und das antike Griechenland erreichen.',
				en: 'The frog was lost and exhausted. It had only one goal in mind: to travel through time and reach ancient Greece.',
			},
			{
				text: 'Premier problème, trouver un moyen de transport. Elle avait entendu dire que l’un des meilleurs moyens était de sauter dans une machine temporelle. Elle s’élança, et voilà qu’elle se retrouva dans le passé, au cours d’une nuit étoilée à l’odeur douce et envoûtante.',
				de: 'Erstes Problem: ein Transportmittel finden. Er hatte gehört, eine der besten Möglichkeiten sei, in eine Zeitmaschine zu springen. Er sprang, und schon fand er sich in der Vergangenheit wieder, in einer sternklaren Nacht mit süßem, betörendem Duft.',
				en: 'First problem: finding a means of transport. It had heard that one of the best ways was to jump into a time machine. It jumped, and soon found itself in the past, on a starry night with a sweet, enchanting scent.',
			},
			{
				text: 'La grenouille avance alors d’un pas rapide et aventureux dans les rues en pente et les petites auberges de la ville antique. [...]',
				de: 'Der Frosch machte sich nun mit raschen, abenteuerlustigen Schritten auf den Weg durch die abschüssigen Gassen und kleinen Herbergen der antiken Stadt. [...]',
				en: 'The frog then set off at a quick, adventurous pace through the sloping streets and small inns of the ancient city. [...]',
			},
		],
	},
	code: {
		prompt: {
			text: 'What is the purpose of the list C in the code below?',
			de: 'Was ist der Zweck der Liste C im folgenden Code?',
			en: null,
		},
		code: [
			'def binomial_coefficient(n, r):',
			'    C = [0 for i in range(r + 1)];',
			'    C[0] = 1;',
			'    for i in range(1, n + 1):',
			'        j = min(i, r);',
			'        while j > 0:',
			'            C[j] += C[j - 1];',
			'            j -= 1;',
			'    return C[r]',
		],
		gpt3: [
			{ text: 'A. to store the value of C[0]', de: 'A. um den Wert von C[0] zu speichern', en: null },
			{ text: 'B. to store the value of C[1]', de: 'B. um den Wert von C[1] zu speichern', en: null },
			{ text: 'C. to store the value of C[i]', de: 'C. um den Wert von C[i] zu speichern', en: null },
			{ text: 'D. to store the value of C[i - 1]', de: 'D. um den Wert von C[i - 1] zu speichern', en: null },
		],
		instruct: [
			{
				text: 'The list C in this code is used to store the values of the binomial coefficient as the function iterates through the values of n and r. It is used to calculate the value of the binomial coefficient for a given value of n and r, and stores the result in the final return value of the function.',
				de: 'Die Liste C wird in diesem Code verwendet, um die Werte des Binomialkoeffizienten zu speichern, während die Funktion die Werte von n und r durchläuft. Sie dient dazu, den Wert des Binomialkoeffizienten für ein gegebenes n und r zu berechnen, und speichert das Ergebnis im Rückgabewert der Funktion.',
				en: null,
			},
		],
	},
};

/** The two slots shown for an example, with the source of each output. */
export function slotsFor(example) {
	const gpt3 = { source: 'gpt3', lines: EXAMPLES[example].gpt3 };
	const instruct = { source: 'instruct', lines: EXAMPLES[example].instruct };
	return GPT3_SLOT[example] === 'a' ? { a: gpt3, b: instruct } : { a: instruct, b: gpt3 };
}

/** Checks the reader's pick ('a' or 'b') for an example. */
export function judge(example, pick) {
	const gpt3 = GPT3_SLOT[example];
	return { correct: pick === gpt3, gpt3, other: gpt3 === 'a' ? 'b' : 'a' };
}
