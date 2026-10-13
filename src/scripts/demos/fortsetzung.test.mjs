import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { EXAMPLES, GPT3_SLOT, judge, slotsFor } from './fortsetzung.js';

// The paper's wording, as printed in Figure 8 (InstructGPT, arXiv:2203.02155, p. 15).
test('the French prompt and the English code prompt are quoted from Figure 8', () => {
	assert.equal(
		EXAMPLES.story.prompt.text,
		'Écrivez une courte histoire sur une grenouille qui voyage dans le temps jusqu’à la Grèce antique en français.',
	);
	assert.equal(EXAMPLES.code.prompt.text, 'What is the purpose of the list C in the code below?');
});

test('the GPT-3 story lines are the three tasks of the paper, in order', () => {
	assert.deepEqual(
		EXAMPLES.story.gpt3.map((l) => l.text),
		[
			'Écrivez une histoire au sujet d’un enfant qui voudrait tout savoir sur les jeux des dieux et qui se retrouve dans l’une de leurs histoires.',
			'Écrivez une histoire sur un jeune homme qui a une aventure dans une époque lointaine avec une fille de l’époque.',
			'Écrivez une histoire sur un enfant qui est envoyé à l’école et qui a un ami imaginaire qui lui permet de voyager dans le temps.',
		],
	);
});

test('the InstructGPT story keeps the paper’s opening sentences and the truncation marker', () => {
	const [first, second, third] = EXAMPLES.story.instruct.map((l) => l.text);
	assert.equal(
		first,
		'La grenouille était perdue et épuisée. Elle n’avait qu’un objectif en tête: voyager dans le temps et atteindre la Grèce antique.',
	);
	assert.match(second, /^Premier problème, trouver un moyen de transport\. Elle avait entendu dire/);
	assert.ok(third.endsWith('la ville antique. [...]'));
});

test('the code lines match the paper once indentation is restored', () => {
	const paper = [
		'def binomial_coefficient(n, r):',
		'C = [0 for i in range(r + 1)];',
		'C[0] = 1;',
		'for i in range(1, n + 1):',
		'j = min(i, r);',
		'while j > 0:',
		'C[j] += C[j - 1];',
		'j -= 1;',
		'return C[r]',
	];
	assert.deepEqual(
		EXAMPLES.code.code.map((l) => l.trim()),
		paper,
	);
	// Python needs the nesting; the lines inside the loops are indented further.
	assert.equal(EXAMPLES.code.code[6], '            C[j] += C[j - 1];');
});

test('the GPT-3 code answer is the four options, the InstructGPT answer is the paper’s sentence', () => {
	assert.deepEqual(
		EXAMPLES.code.gpt3.map((l) => l.text),
		[
			'A. to store the value of C[0]',
			'B. to store the value of C[1]',
			'C. to store the value of C[i]',
			'D. to store the value of C[i - 1]',
		],
	);
	assert.ok(EXAMPLES.code.instruct[0].text.startsWith('The list C in this code is used to store the values of the binomial coefficient'));
});

test('every example has a German rendering; English originals have no English rendering', () => {
	for (const ex of Object.values(EXAMPLES)) {
		const items = [ex.prompt, ...(ex.gpt3 ?? []), ...(ex.instruct ?? [])];
		for (const item of items) assert.ok(item.de && item.de.length > 0);
	}
	assert.equal(EXAMPLES.code.prompt.en, null);
	assert.equal(EXAMPLES.code.gpt3[0].en, null);
});

test('the GPT-3 output sits in a different slot for each example, so position gives nothing away', () => {
	assert.notEqual(GPT3_SLOT.story, GPT3_SLOT.code);
	for (const example of ['story', 'code']) {
		const slots = slotsFor(example);
		assert.notEqual(slots.a.source, slots.b.source);
		const gpt3Slot = Object.keys(slots).find((k) => slots[k].source === 'gpt3');
		assert.equal(gpt3Slot, GPT3_SLOT[example]);
		assert.deepEqual(slots[gpt3Slot].lines, EXAMPLES[example].gpt3);
	}
});

test('judge tells a right guess from a wrong one', () => {
	for (const example of ['story', 'code']) {
		const right = judge(example, GPT3_SLOT[example]);
		const wrong = judge(example, GPT3_SLOT[example] === 'a' ? 'b' : 'a');
		assert.equal(right.correct, true);
		assert.equal(wrong.correct, false);
		assert.equal(right.gpt3, GPT3_SLOT[example]);
		assert.notEqual(right.other, GPT3_SLOT[example]);
		assert.equal(wrong.gpt3, GPT3_SLOT[example]);
	}
});
