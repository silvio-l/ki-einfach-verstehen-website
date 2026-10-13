// The ChatVorlageDemo asks the reader to predict the sequence before it is
// shown: the result sits in a closed <details> element with a labelled summary.
// Static check of the template part only; the copy lives in the component.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('./ChatVorlageDemo.astro', import.meta.url), 'utf8');
const markup = source.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/<script\b[\s\S]*?<\/script>/g, '');

test('the sequence is folded away until the reader has predicted it', () => {
	assert.match(markup, /<details class="cv-reveal" data-testid="demo-chatvorlage-reveal">/);
	assert.doesNotMatch(markup, /<details[^>]*\bopen\b/);
	assert.match(markup, /<summary data-testid="demo-chatvorlage-reveal-toggle">\{copy\.reveal\}<\/summary>/);
	assert.match(markup, /<div class="cv-result">[\s\S]*data-testid="demo-chatvorlage-output"/);
});

test('the goal asks for the prediction in both languages', () => {
	assert.match(source, /goal: 'Wie endet die Folge, wenn der Antwortbeginn fehlt\?'/);
	assert.match(source, /goal: 'How does the sequence end when the answer start is missing\?'/);
	assert.doesNotMatch(source, /Was steht am Ende der Folge/);
});
