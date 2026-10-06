// Lernpfad completion logic (CONTEXT.md "Lernpfad"): a Lernpfad is only an
// ordered list of existing Bausteine, so its status is derived entirely from
// the two progress stores that already exist in the browser -- the read set
// (progress.js, `kev:read-bausteine`) and the Abrufmoment records
// (quiz-progress.js, `kiev:quiz:v1`). Nothing new is stored about the
// learner; pure functions here, storage access stays with the callers.
//
// A step counts as done once its Baustein is read AND every current question
// of its Abrufmoment has been answered at least once. Right or wrong does
// not matter: the Lernnachweis carries no score (ADR-0004), it only records
// that the recall was actually done. A Baustein without questions only
// needs to be read.
import { questionKey } from './quiz-progress.js';

/**
 * @typedef {{ tk: string, questionIds: string[] }} PathStep
 * @typedef {{ version?: number, records: Record<string, unknown> }} QuizProgress
 */

/** Status of one step: read, how many of its questions were answered, done. */
export function stepStatus(step, readSet, quizProgress) {
	const records = quizProgress?.records ?? {};
	const read = readSet.has(step.tk);
	const answered = step.questionIds.filter((id) => Boolean(records[questionKey(step.tk, id)])).length;
	const quizDone = answered === step.questionIds.length;
	return {
		tk: step.tk,
		read,
		answered,
		questionCount: step.questionIds.length,
		quizDone,
		done: read && quizDone,
	};
}

/**
 * Status of a whole Lernpfad. `started` is true as soon as any step was read
 * or any of its questions answered; `next` is the first step (in path order)
 * that is not done yet, or null once the path is complete.
 */
export function pathStatus(steps, readSet, quizProgress) {
	const list = steps.map((step) => stepStatus(step, readSet, quizProgress));
	const doneCount = list.filter((s) => s.done).length;
	return {
		steps: list,
		total: list.length,
		readCount: list.filter((s) => s.read).length,
		quizDoneCount: list.filter((s) => s.quizDone).length,
		doneCount,
		started: list.some((s) => s.read || s.answered > 0),
		complete: list.length > 0 && doneCount === list.length,
		next: list.find((s) => !s.done) ?? null,
	};
}

// Fire-once bookkeeping for the Matomo events "Lernpfad gestartet" and
// "Lernpfad abgeschlossen": per path key, which of the two was already sent
// from this browser. Holds no personal data -- just two booleans per path.
export const LERNPFAD_EVENTS_KEY = 'kev:lernpfad-events';

export function readSentEvents(storage = globalThis.localStorage) {
	try {
		const parsed = JSON.parse(storage.getItem(LERNPFAD_EVENTS_KEY) ?? '{}');
		return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
}

/**
 * Returns true (and remembers it) the first time `event` is claimed for
 * `pathKey` in this browser, false on every later call. When storage is
 * unavailable it returns false, so a blocked localStorage never floods the
 * statistics with repeated events.
 */
export function claimEventOnce(pathKey, event, storage = globalThis.localStorage) {
	try {
		const sent = readSentEvents(storage);
		const entry = sent[pathKey] && typeof sent[pathKey] === 'object' ? sent[pathKey] : {};
		if (entry[event]) return false;
		storage.setItem(LERNPFAD_EVENTS_KEY, JSON.stringify({ ...sent, [pathKey]: { ...entry, [event]: true } }));
		return true;
	} catch {
		return false;
	}
}

/**
 * LinkedIn "Add to profile" link for the certifications section
 * (https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME, see
 * addtoprofile.linkedin.com). Plain link, no LinkedIn script on the page.
 * The learner's own name is never part of it -- `name` is the title of
 * the Lernnachweis, `organizationName` the issuer.
 */
export function linkedInAddUrl({ name, organizationName, issued, certUrl }) {
	const params = new URLSearchParams({
		startTask: 'CERTIFICATION_NAME',
		name,
		organizationName,
		issueYear: String(issued.getFullYear()),
		issueMonth: String(issued.getMonth() + 1),
		certUrl,
	});
	return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

/** Reading minutes to hours, rounded to the nearest half hour (min. 0.5). */
export function minutesToHalfHours(minutes) {
	return Math.max(0.5, Math.round((minutes / 60) * 2) / 2);
}
