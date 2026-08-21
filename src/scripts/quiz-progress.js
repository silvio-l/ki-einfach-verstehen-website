export const QUIZ_STORAGE_KEY = 'kiev:quiz:v1';
export const QUIZ_SCHEMA_VERSION = 1;

const DAY_MS = 24 * 60 * 60 * 1000;
const CORRECT_INTERVAL_DAYS = [3, 7, 14, 30, 60];

export function questionKey(translationKey, questionId) {
	return `${translationKey}:${questionId}`;
}

export function scheduleReview(previous, correct, answeredAt = Date.now()) {
	const previousLevel = Number.isInteger(previous?.level) ? previous.level : 0;
	const level = correct
		? Math.min(Math.max(previousLevel, 0) + 1, CORRECT_INTERVAL_DAYS.length)
		: 0;
	const intervalDays = correct ? CORRECT_INTERVAL_DAYS[level - 1] : 1;

	return {
		level,
		attempts: (Number.isInteger(previous?.attempts) ? previous.attempts : 0) + 1,
		lastCorrect: correct,
		answeredAt: new Date(answeredAt).toISOString(),
		dueAt: new Date(answeredAt + intervalDays * DAY_MS).toISOString(),
	};
}

export function emptyQuizProgress() {
	return { version: QUIZ_SCHEMA_VERSION, records: {} };
}

export function readQuizProgress(storage = globalThis.localStorage) {
	try {
		const parsed = JSON.parse(storage.getItem(QUIZ_STORAGE_KEY) ?? 'null');
		if (parsed?.version !== QUIZ_SCHEMA_VERSION || typeof parsed.records !== 'object') {
			return emptyQuizProgress();
		}
		return parsed;
	} catch {
		return emptyQuizProgress();
	}
}

export function writeQuizProgress(progress, storage = globalThis.localStorage) {
	storage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(progress));
}

export function recordAnswer(progress, translationKey, questionId, correct, answeredAt = Date.now()) {
	const key = questionKey(translationKey, questionId);
	return {
		version: QUIZ_SCHEMA_VERSION,
		records: {
			...progress.records,
			[key]: scheduleReview(progress.records[key], correct, answeredAt),
		},
	};
}

export function isQuestionDue(progress, translationKey, questionId, now = Date.now()) {
	const record = progress.records[questionKey(translationKey, questionId)];
	if (!record) return true;
	const due = Date.parse(record.dueAt);
	return !Number.isFinite(due) || due <= now;
}

export function nextDueAt(progress, translationKey, questions) {
	const timestamps = questions
		.map((question) => progress.records[questionKey(translationKey, question.id)])
		.filter(Boolean)
		.map((record) => Date.parse(record.dueAt))
		.filter(Number.isFinite);
	return timestamps.length ? Math.min(...timestamps) : undefined;
}
