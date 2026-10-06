import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { FADERS, RANGE, SENTENCES, bar, clampFader, diff, equation, run, runAll, startValues } from './hiddenstate.js';

test('the starting state computes the documented toy numbers', () => {
	const [a, b] = runAll(startValues());
	assert.deepEqual(SENTENCES.map((s) => s.input), [[2, 1, 1], [1, 2, 1]]);
	assert.deepEqual(a.hidden, [4, 1]);
	assert.deepEqual(a.scores, [9, 6]);
	assert.equal(a.winner, 0);
	assert.deepEqual(b.hidden, [1, 4]);
	assert.deepEqual(b.scores, [6, 9]);
	assert.equal(b.winner, 1);
});

test('the same faders give different meters for the two sentence starts', () => {
	const values = startValues();
	const [a, b] = runAll(values);
	assert.notDeepEqual(a.hidden, b.hidden);
	assert.deepEqual(values, startValues());
});

test('every single fader move changes the scores of both sentence starts', () => {
	for (const f of FADERS) {
		for (let v = RANGE.min; v <= RANGE.max; v++) {
			if (v === f.value) continue;
			const changes = diff(runAll(startValues()), runAll({ ...startValues(), [f.key]: v }));
			assert.ok(changes.every((c) => c.changed), `${f.key} = ${v} leaves a sentence untouched`);
		}
	}
});

test('one fader can flip the answer for A while B keeps its answer, with B’s scores still moving', () => {
	const [a, b] = diff(runAll(startValues()), runAll({ ...startValues(), r9: 3 }));
	assert.equal(a.winnerFlipped, true);
	assert.deepEqual(a.scores, [{ answer: 'france', from: 6, to: 14 }]);
	assert.equal(b.winnerFlipped, false);
	assert.deepEqual(b.scores, [{ answer: 'france', from: 9, to: 11 }]);
});

test('stages are written out as sums of products, fader first', () => {
	const a = run(startValues(), SENTENCES[0].input);
	assert.equal(equation(a.hiddenTerms[0]), '2 × 2 + (−1) × 1 + 1 × 1 = 4');
	assert.equal(equation(a.hiddenTerms[1]), '(−1) × 2 + 2 × 1 + 1 × 1 = 1');
	assert.equal(equation(a.scoreTerms[0]), '2 × 4 + 1 × 1 = 9');
	assert.equal(equation(a.scoreTerms[1]), '1 × 4 + 2 × 1 = 6');
	assert.equal(equation([{ value: -2, factor: -3 }]), '(−2) × (−3) = 6');
});

test('faders clamp to the range and bars to their scale', () => {
	assert.equal(clampFader(7), 3);
	assert.equal(clampFader('-9'), -3);
	assert.equal(clampFader('x'), 0);
	assert.deepEqual(bar(0, 10), { left: 50, width: 0 });
	assert.deepEqual(bar(5, 10), { left: 50, width: 25 });
	assert.deepEqual(bar(-20, 10), { left: 0, width: 50 });
});
