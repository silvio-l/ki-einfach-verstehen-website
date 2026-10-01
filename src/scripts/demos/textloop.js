// The text loop of Baustein 2 (input-und-output): the model rates every
// possible next piece, a selection step picks one, the piece is appended
// and the longer text goes back in. All score lists are invented. The two
// lists printed in the Baustein ("Die Katze sitzt" → auf 8,1 …; "… auf" →
// dem 7,6 …) are reproduced exactly; the remaining lists continue the toy
// story so a run can branch, end at a stop marker or hit the length limit.

export const STOP = '■';

const DE = {
	start: 'Die Katze sitzt',
	lists: {
		'': [['auf', 8.1], ['still', 5.4], ['schnell', 2.0], ['Auto', -3.7], ['Regen', -4.9]],
		'auf': [['dem', 7.6], ['einem', 6.8], ['still', 1.2], ['Auto', -2.9], ['Regen', -5.3]],
		'still': [['da', 7.2], ['auf', 6.5], ['und', 3.0], ['Regen', -3.1], ['Auto', -4.4]],
		'schnell': [['auf', 6.9], ['da', 5.1], ['und', 2.4], ['Regen', -3.8], ['Auto', -4.1]],
		'Auto': [['.', 4.6], ['und', 3.9], ['auf', 2.2], ['Regen', -3.3], ['still', -3.9]],
		'Regen': [['.', 4.2], ['und', 3.1], ['auf', 1.8], ['Auto', -3.6], ['still', -4.0]],
		'auf dem': [['Sofa', 8.3], ['Tisch', 5.9], ['Boden', 4.4], ['Dach', 1.0], ['Regen', -4.2]],
		'auf einem': [['Sofa', 7.8], ['Stuhl', 6.1], ['Kissen', 4.7], ['Baum', 1.9], ['Regen', -4.6]],
		'still da': [['.', 7.0], ['und', 5.5], [',', 2.1], ['auf', -1.4], ['Regen', -4.3]],
		'schnell auf': [['dem', 7.1], ['einem', 6.4], ['den', 2.8], ['Regen', -3.5], ['Auto', -4.8]],
		'still auf': [['dem', 7.3], ['einem', 6.6], ['den', 2.5], ['Regen', -3.4], ['Auto', -4.7]],
	},
	afterNoun: [['.', 7.7], ['und', 4.1], [',', 3.2], ['aber', 0.4], ['Regen', -4.8]],
	afterAnd: [['schnurrt', 7.4], ['schläft', 6.9], ['wartet', 4.2], ['Regen', -3.5], ['Auto', -4.1]],
	afterStop: [[STOP, 9.0], ['Sie', 3.1], ['Die', 2.8], ['Dann', 1.5], ['Regen', -5.0]],
	stopLabel: 'Stopp',
};

const EN = {
	start: 'The cat sat',
	lists: {
		'': [['on', 8.1], ['still', 5.4], ['quietly', 2.0], ['car', -3.7], ['rain', -4.9]],
		'on': [['the', 7.6], ['a', 6.8], ['still', 1.2], ['car', -2.9], ['rain', -5.3]],
		'still': [['there', 7.2], ['on', 6.5], ['and', 3.0], ['rain', -3.1], ['car', -4.4]],
		'quietly': [['on', 6.9], ['there', 5.1], ['and', 2.4], ['rain', -3.8], ['car', -4.1]],
		'car': [['.', 4.6], ['and', 3.9], ['on', 2.2], ['rain', -3.3], ['still', -3.9]],
		'rain': [['.', 4.2], ['and', 3.1], ['on', 1.8], ['car', -3.6], ['still', -4.0]],
		'on the': [['sofa', 8.3], ['table', 5.9], ['floor', 4.4], ['roof', 1.0], ['rain', -4.2]],
		'on a': [['sofa', 7.8], ['chair', 6.1], ['cushion', 4.7], ['tree', 1.9], ['rain', -4.6]],
		'still there': [['.', 7.0], ['and', 5.5], [',', 2.1], ['on', -1.4], ['rain', -4.3]],
		'quietly on': [['the', 7.1], ['a', 6.4], ['its', 2.8], ['rain', -3.5], ['car', -4.8]],
		'still on': [['the', 7.3], ['a', 6.6], ['its', 2.5], ['rain', -3.4], ['car', -4.7]],
	},
	afterNoun: [['.', 7.7], ['and', 4.1], [',', 3.2], ['but', 0.4], ['rain', -4.8]],
	afterAnd: [['purrs', 7.4], ['sleeps', 6.9], ['waits', 4.2], ['rain', -3.5], ['car', -4.1]],
	afterStop: [[STOP, 9.0], ['She', 3.1], ['The', 2.8], ['Then', 1.5], ['rain', -5.0]],
	stopLabel: 'stop',
};

export const STORY = { de: DE, en: EN };

export const MAX_ROUNDS = 6;

/**
 * Score list for the pieces appended so far (the start text is implied).
 * @param {string[]} pieces
 * @returns {[string, number][]}
 */
export function scoresFor(pieces, lang) {
	const story = STORY[lang] ?? DE;
	const last = pieces[pieces.length - 1];
	if (last === STOP) return [];
	if (last === '.') return story.afterStop;
	if (last === 'und' || last === 'and' || last === ',') return story.afterAnd;
	const key = pieces.join(' ');
	return story.lists[key] ?? story.afterNoun;
}

/** Greedy: the piece with the highest score. */
export function pickBest(list) {
	return list.reduce((best, entry) => (entry[1] > best[1] ? entry : best), list[0]);
}

/**
 * Selection with some randomness: higher scores get a larger share, lower
 * ones still get a chance (softmax at temperature 1.2; a later Baustein
 * explains the formula). `random` is injectable for tests.
 */
export function pickRandom(list, random = Math.random) {
	const temperature = 1.2;
	const max = Math.max(...list.map(([, score]) => score));
	const weights = list.map(([, score]) => Math.exp((score - max) / temperature));
	const total = weights.reduce((sum, w) => sum + w, 0);
	let r = random() * total;
	for (let i = 0; i < list.length; i += 1) {
		r -= weights[i];
		if (r <= 0) return list[i];
	}
	return list[list.length - 1];
}

/** Share of the probability mass per entry, for showing how much chance each piece has. */
export function shares(list) {
	const temperature = 1.2;
	const max = Math.max(...list.map(([, score]) => score));
	const weights = list.map(([, score]) => Math.exp((score - max) / temperature));
	const total = weights.reduce((sum, w) => sum + w, 0);
	return weights.map((w) => w / total);
}

/** Joins the start text and the pieces the way a tokenizer's decode would. */
export function render(pieces, lang) {
	const story = STORY[lang] ?? DE;
	let text = story.start;
	for (const piece of pieces) {
		if (piece === STOP) break;
		text += /^[.,]$/.test(piece) ? piece : ` ${piece}`;
	}
	return text;
}

export function isFinished(pieces) {
	const last = pieces[pieces.length - 1];
	return last === STOP || pieces.length >= MAX_ROUNDS;
}
