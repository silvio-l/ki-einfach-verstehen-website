// Reading time shown on the site (lesson header, cards, learning paths).
// It counts what a reader reads, by the same rule as the content lint
// (scripts/lint-baustein.mjs, docs/content-plan/prinzipien.md, "Baustein-Länge"):
// running prose plus the quiz, 200 words per minute. Figures (alt texts,
// captions), imports, component tags, tables, code and <Uebung> exercises
// do not count.

export const WORDS_PER_MINUTE = 200;

const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;

/** Plain running prose of an MDX body. */
export function proseOf(body) {
	return body
		.replace(/<Uebung\b[\s\S]*?<\/Uebung>/g, '\n\n')
		.replace(/^import .*$/gm, '')
		.replace(/<Figure\b[\s\S]*?<\/Figure>/g, '\n\n')
		.replace(/^```[\s\S]*?^```/gm, '\n\n')
		.replace(/^\|.*$/gm, '')
		.replace(/<\/?[A-Za-z][^>]*>/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/^#{1,6}\s.*$/gm, '')
		.replace(/[*_`]/g, '')
		.replace(/\\([{}])/g, '$1');
}

/** Words that count toward the reading time: prose plus quiz. */
export function readingWords(body, quiz = []) {
	const quizWords = quiz.reduce(
		(sum, q) => sum + wordCount(q.frage ?? '') + (q.optionen ?? []).reduce((s, o) => s + wordCount(String(o)), 0) + wordCount(q.erklaerung ?? ''),
		0,
	);
	return wordCount(proseOf(body)) + quizWords;
}

/** Rounded minutes, at least 1. */
export function readingMinutes(body, quiz = []) {
	return Math.max(1, Math.round(readingWords(body, quiz) / WORDS_PER_MINUTE));
}
