import { strict as assert } from 'node:assert';
import { readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';
import {
	COMPARE,
	PROMPT_KEYS,
	START,
	back,
	canTake,
	chosenShares,
	currentNode,
	formatPct,
	greedyText,
	meanShare,
	startWalk,
	take,
	tokenLabel,
} from './modelprobe.js';

const dataUrl = new URL('./data/modelprobe.json', import.meta.url);
const data = JSON.parse(readFileSync(dataUrl, 'utf8'));
const run = (model, prompt) => data.models[model].runs[prompt];
const top = (model, prompt) => run(model, prompt).nodes[0].c;
const share = (model, prompt, piece) => top(model, prompt).find((c) => c[0] === piece)?.[1];

const mdx = {
	de: readFileSync(new URL('../../content/bausteine/de/was-ein-ki-modell-eigentlich-ist.mdx', import.meta.url), 'utf8'),
	en: readFileSync(new URL('../../content/bausteine/en/what-an-ai-model-actually-is.mdx', import.meta.url), 'utf8'),
};

test('the data names the models and revisions of the documented experiment', () => {
	assert.equal(data.models.small.id, 'Qwen/Qwen3-0.6B-Base');
	assert.equal(data.models.small.revision, 'da87bfb608c14b7cf20ba1ce41287e8de496c0cd');
	assert.equal(data.models.large.id, 'Qwen/Qwen3-4B-Base');
	assert.equal(data.models.large.revision, '906bfd4b4dc7f14ee4320094d8b41684abff8539');
	for (const model of ['small', 'large']) assert.deepEqual(Object.keys(data.models[model].runs), PROMPT_KEYS);
});

test('the start state is the opening example with the text’s number', () => {
	assert.deepEqual(START, { view: 'capital', model: 'small' });
	assert.equal(run('small', 'capital').prompt, 'Die Hauptstadt von Frankreich ist');
	assert.deepEqual(top('small', 'capital')[0].slice(0, 2), [' Paris', 47.5]);
});

test('every percentage the Baustein quotes comes out of the data', () => {
	const quoted = [
		['small', 'capital', ' Paris', 47.5],
		['small', 'reverse', ' Deutschland', 28.9],
		['small', 'reverse', ' Frank', 9.4],
	];
	for (const [model, prompt, piece, pct] of quoted) {
		assert.equal(share(model, prompt, piece), pct, `${model} ${prompt} ${piece}`);
		assert.ok(mdx.de.includes(String(pct).replace('.', ',')), `DE text quotes ${pct}`);
		assert.ok(mdx.en.includes(String(pct)), `EN text quotes ${pct}`);
	}
	// The prose rounds the larger model's share; the rounding must still hold.
	const largeFrank = share('large', 'reverse', ' Frank');
	assert.ok(largeFrank > 60 && largeFrank < 65, `large reverse Frank ${largeFrank}`);
	assert.ok(mdx.de.includes('mit gut 60 Prozent'), 'DE text rounds the large share');
	assert.ok(mdx.en.includes('at just over 60 percent'), 'EN text rounds the large share');
	assert.equal(top('small', 'reverse')[0][0], ' Deutschland');
	assert.equal(top('large', 'reverse')[0][0], ' Frank');
});

test('the greedy continuations are the ones the Baustein quotes', () => {
	assert.ok(greedyText(run('small', 'einstein')).startsWith(' 14. August 1879 in Zürich'));
	assert.ok(greedyText(run('large', 'einstein')).startsWith(' 14. März 1879 in Ulm'));
	assert.ok(greedyText(run('small', 'quelling')).startsWith(' 13. August 1920 in der Stadt Berlin'));
	assert.match(greedyText(run('large', 'quelling')), /\d/);
	assert.ok(greedyText(run('small', 'capital')).startsWith(' Paris'));
	assert.ok(greedyText(run('small', 'reverse')).startsWith(' Deutschland'));
	assert.ok(mdx.de.includes('„14. August 1879 in Zürich“'));
	assert.ok(mdx.de.includes('„14. März 1879 in Ulm“'));
	assert.ok(mdx.de.includes('„13. August 1920 in der Stadt Berlin“'));
});

test('every node offers five candidates, sorted, with a computed greedy path', () => {
	for (const model of ['small', 'large']) {
		for (const prompt of PROMPT_KEYS) {
			const r = run(model, prompt);
			for (const node of r.nodes) {
				assert.equal(node.c.length, 5);
				for (let i = 1; i < 5; i += 1) assert.ok(node.c[i - 1][1] >= node.c[i][1]);
				for (const [, pct, child] of node.c) {
					assert.ok(pct >= 0 && pct <= 100);
					assert.ok(child === null || (child > 0 && child < r.nodes.length));
				}
			}
			assert.ok(greedyText(r).length > 10, `${model} ${prompt} has a greedy path`);
			// Step 1 branches: every top-5 candidate of the start leads on.
			assert.ok([0, 1, 2, 3, 4].every((rank) => canTake(r, startWalk(), rank)));
		}
	}
});

test('a walk appends the chosen piece and can go back', () => {
	const r = run('small', 'reverse');
	let walk = take(r, startWalk(), 1);
	assert.deepEqual(walk.pieces, [' Frank']);
	assert.deepEqual(chosenShares(r, walk), [9.4]);
	walk = take(r, walk, 0);
	assert.equal(walk.pieces.length, 2);
	assert.equal(back(back(walk)).pieces.length, 0);
	assert.deepEqual(back(startWalk()), startWalk());
	assert.equal(currentNode(r, startWalk()), r.nodes[0]);
});

test('a branch that was not computed cannot be taken', () => {
	const r = run('small', 'capital');
	let walk = startWalk();
	while (canTake(r, walk, 0)) walk = take(r, walk, 0);
	assert.equal(take(r, walk, 0), null);
	assert.ok(walk.pieces.length >= 12);
});

test('the compare view pairs the real and the invented person', () => {
	assert.deepEqual(COMPARE, ['einstein', 'quelling']);
	assert.match(run('small', 'quelling').prompt, /Bernhard Quelling/);
});

test('tokens are labelled readably', () => {
	assert.deepEqual(tokenLabel(' Paris'), { lead: '␣', text: 'Paris', blank: false, kind: null });
	assert.deepEqual(tokenLabel(' '), { lead: '', text: '␣', blank: true, kind: 'space' });
	assert.deepEqual(tokenLabel(' '), { lead: '', text: '␣', blank: true, kind: 'space' });
	assert.deepEqual(tokenLabel(' .\n'), { lead: '␣', text: '.↵', blank: false, kind: null });
	assert.deepEqual(tokenLabel('\n\n'), { lead: '', text: '↵↵', blank: true, kind: 'newline' });
	assert.deepEqual(tokenLabel('1'), { lead: '', text: '1', blank: false, kind: null });
});

test('every whitespace candidate in the data gets a visible label', () => {
	for (const m of Object.values(data.models))
		for (const r of Object.values(m.runs))
			for (const n of r.nodes)
				for (const [piece] of n.c) {
					const { lead, text } = tokenLabel(piece);
					assert.doesNotMatch(lead + text, /\s/, JSON.stringify(piece));
					assert.ok(text.length > 0, JSON.stringify(piece));
				}
});

test('percentages are written per language', () => {
	assert.equal(formatPct(47.5, 'de'), '47,5 %');
	assert.equal(formatPct(47.5, 'en'), '47.5%');
	assert.equal(formatPct(3, 'de'), '3,0 %');
	assert.equal(meanShare([]), null);
	assert.equal(meanShare([97.3, 50]), 74);
});

test('the data file stays small', () => {
	assert.ok(statSync(dataUrl).size < 150_000);
});
