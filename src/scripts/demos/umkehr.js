// Values for UmkehrDemo (Baustein versteht-ki-was-sie-sagt, learning goal 2:
// does a fact learned in one direction also answer the reverse question?).
// Published measurements, copied as constants; no model runs in the browser.
// Source: Berglund et al. 2024, "The Reversal Curse", ICLR 2024, Experiment 2:
// GPT-4 (accessed via the OpenAI API, no version stated), 1573 child-parent
// pairs of the 1000 most popular IMDB celebrities (2023).

/** Share of correct answers in percent. */
export const PUBLISHED = { parent: 79, child: 33 };

/** The question the reader guesses about. */
export const QUESTIONS = ['parent', 'child'];

/**
 * Compares a guess with the published values.
 * @param {'parent' | 'child'} guess the question the reader expects to be answered better
 * @returns {{ guess: string, correct: boolean, better: 'parent' | 'child' }}
 */
export function compareGuess(guess) {
	if (!QUESTIONS.includes(guess)) throw new RangeError(`unknown question: ${guess}`);
	const better = PUBLISHED.parent > PUBLISHED.child ? 'parent' : 'child';
	return { guess, correct: guess === better, better };
}
