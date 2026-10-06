import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
	claimEventOnce,
	linkedInAddUrl,
	minutesToHalfHours,
	pathStatus,
	readSentEvents,
	stepStatus,
} from './lernpfad-progress.js';
import { emptyQuizProgress, recordAnswer } from './quiz-progress.js';

const steps = [
	{ tk: 'a', questionIds: ['q1', 'q2'] },
	{ tk: 'b', questionIds: ['q1'] },
	{ tk: 'c', questionIds: [] },
];

const answer = (progress, tk, id, correct = true) => recordAnswer(progress, tk, id, correct, Date.UTC(2026, 9, 6));

function memoryStorage(initial = {}) {
	const data = new Map(Object.entries(initial));
	return {
		getItem: (key) => (data.has(key) ? data.get(key) : null),
		setItem: (key, value) => data.set(key, String(value)),
	};
}

test('nothing read, nothing answered: not started, first step is next', () => {
	const status = pathStatus(steps, new Set(), emptyQuizProgress());
	assert.equal(status.started, false);
	assert.equal(status.complete, false);
	assert.equal(status.doneCount, 0);
	assert.equal(status.next?.tk, 'a');
});

test('reading alone does not finish a step that has an Abrufmoment', () => {
	const status = stepStatus(steps[0], new Set(['a']), emptyQuizProgress());
	assert.deepEqual(
		{ read: status.read, quizDone: status.quizDone, done: status.done, answered: status.answered },
		{ read: true, quizDone: false, done: false, answered: 0 },
	);
});

test('every question must be answered at least once; partial answers do not count', () => {
	const partial = answer(emptyQuizProgress(), 'a', 'q1');
	assert.equal(stepStatus(steps[0], new Set(['a']), partial).done, false);
	const full = answer(partial, 'a', 'q2');
	assert.equal(stepStatus(steps[0], new Set(['a']), full).done, true);
});

test('wrong answers count as done -- no score is involved', () => {
	let progress = answer(emptyQuizProgress(), 'b', 'q1', false);
	assert.equal(stepStatus(steps[1], new Set(['b']), progress).done, true);
	progress = answer(progress, 'b', 'q1', true);
	assert.equal(stepStatus(steps[1], new Set(['b']), progress).done, true);
});

test('answering without reading leaves the step open but marks the path started', () => {
	const progress = answer(emptyQuizProgress(), 'b', 'q1');
	const status = pathStatus(steps, new Set(), progress);
	assert.equal(status.started, true);
	assert.equal(status.steps[1].done, false, 'the Baustein itself is not read yet');
	assert.equal(status.quizDoneCount, 2, 'step b and the question-free step c');
});

test('a step without questions only needs to be read', () => {
	assert.equal(stepStatus(steps[2], new Set(), emptyQuizProgress()).done, false);
	assert.equal(stepStatus(steps[2], new Set(['c']), emptyQuizProgress()).done, true);
});

test('answers to other Bausteine or old question ids do not leak in', () => {
	let progress = answer(emptyQuizProgress(), 'x', 'q1');
	progress = answer(progress, 'a', 'removed-question');
	const status = stepStatus(steps[0], new Set(['a']), progress);
	assert.equal(status.answered, 0);
	assert.equal(status.done, false);
});

test('next is the first open step in path order, gaps first', () => {
	let progress = answer(emptyQuizProgress(), 'b', 'q1');
	const status = pathStatus(steps, new Set(['b', 'c']), progress);
	assert.equal(status.next?.tk, 'a');
	assert.equal(status.doneCount, 2);
	assert.equal(status.readCount, 2);
});

test('all steps read and all questions answered: complete, no next step', () => {
	let progress = emptyQuizProgress();
	progress = answer(progress, 'a', 'q1');
	progress = answer(progress, 'a', 'q2', false);
	progress = answer(progress, 'b', 'q1');
	const status = pathStatus(steps, new Set(['a', 'b', 'c']), progress);
	assert.equal(status.complete, true);
	assert.equal(status.next, null);
	assert.equal(status.doneCount, 3);
});

test('an empty path is never complete', () => {
	assert.equal(pathStatus([], new Set(), emptyQuizProgress()).complete, false);
});

test('a malformed quiz store behaves like an empty one', () => {
	const status = pathStatus(steps, new Set(['a', 'b', 'c']), /** @type {any} */ ({}));
	assert.equal(status.complete, false);
	assert.equal(status.steps[2].done, true);
});

test('events are claimed once per path and event', () => {
	const storage = memoryStorage();
	assert.equal(claimEventOnce('p', 'started', storage), true);
	assert.equal(claimEventOnce('p', 'started', storage), false);
	assert.equal(claimEventOnce('p', 'completed', storage), true);
	assert.equal(claimEventOnce('other', 'started', storage), true);
	assert.deepEqual(readSentEvents(storage), { p: { started: true, completed: true }, other: { started: true } });
});

test('blocked or corrupt storage never claims an event', () => {
	const throwing = {
		getItem: () => {
			throw new Error('blocked');
		},
		setItem: () => {
			throw new Error('blocked');
		},
	};
	assert.equal(claimEventOnce('p', 'started', throwing), false);
	assert.deepEqual(readSentEvents(memoryStorage({ 'kev:lernpfad-events': 'not json' })), {});
});

test('the LinkedIn link carries title, issuer, date and URL, never a person name', () => {
	const url = new URL(
		linkedInAddUrl({
			name: 'Lernpfad KI-Grundkompetenz',
			organizationName: 'KI einfach verstehen',
			issued: new Date(2026, 9, 6),
			certUrl: 'https://ki-einfach-verstehen.de/de/lernpfad/ki-grundkompetenz/',
		}),
	);
	assert.equal(url.origin + url.pathname, 'https://www.linkedin.com/profile/add');
	assert.equal(url.searchParams.get('startTask'), 'CERTIFICATION_NAME');
	assert.equal(url.searchParams.get('name'), 'Lernpfad KI-Grundkompetenz');
	assert.equal(url.searchParams.get('organizationName'), 'KI einfach verstehen');
	assert.equal(url.searchParams.get('issueYear'), '2026');
	assert.equal(url.searchParams.get('issueMonth'), '10');
	assert.equal(url.searchParams.get('certUrl'), 'https://ki-einfach-verstehen.de/de/lernpfad/ki-grundkompetenz/');
	assert.deepEqual([...url.searchParams.keys()].sort(), ['certUrl', 'issueMonth', 'issueYear', 'name', 'organizationName', 'startTask']);
});

test('reading minutes round to half hours', () => {
	assert.equal(minutesToHalfHours(80), 1.5);
	assert.equal(minutesToHalfHours(83), 1.5);
	assert.equal(minutesToHalfHours(100), 1.5);
	assert.equal(minutesToHalfHours(106), 2);
	assert.equal(minutesToHalfHours(5), 0.5);
});
