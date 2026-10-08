// A real, tiny embedding training for Baustein W3 (embeddings), learning
// goal 2: random starting numbers become similar profiles for tokens that are
// used alike. Every word of a small built-in corpus is one token with only
// two numbers, so its row of the table can be drawn as a point. Training is
// the rule the text describes: from a word's row, one shared calculation
// (the same output weights for every token, a softmax over the vocabulary)
// predicts the words that follow it; after each sentence, every row used is
// nudged a little so that the prediction fits better (plain gradient descent
// on cross-entropy). Nobody tells the model which words are fruit.
// Deterministic: a fixed seed for the random start and the sentence order.

/** How many following words each word has to predict ("ist reif"). */
export const WINDOW = 2;
export const LEARNING_RATE = 0.05;
/** Spread of the random start. Real models start far smaller (GPT-1:
 * N(0; 0.02)); here the points must be visible from the first frame. */
export const INIT_SPREAD = 0.6;
export const SEED = 13;

// Sentences with words from the text: "Der Apfel ist reif." / "Der Pfirsich
// ist reif." and the laptop in sentences about batteries and screens. The
// made-up word "Quabbe" appears in only two sentences: the prediction question
// asks where its point ends up. It is invented so that world knowledge cannot
// give the answer away.
export const CORPUS = {
	de: [
		'Der Apfel ist reif.',
		'Der Pfirsich ist reif.',
		'Der Apfel ist süß.',
		'Der Pfirsich ist süß.',
		'Der Apfel schmeckt saftig.',
		'Der Pfirsich schmeckt saftig.',
		'Der Apfel hängt am Baum.',
		'Der Pfirsich hängt am Baum.',
		'Der Apfel liegt im Korb.',
		'Der Pfirsich liegt im Korb.',
		'Die Quabbe ist reif.',
		'Die Quabbe hängt am Baum.',
		'Der Hund schläft im Körbchen.',
		'Die Katze schläft im Körbchen.',
		'Der Hund frisst gern Fleisch.',
		'Die Katze frisst gern Fleisch.',
		'Der Hund spielt im Garten.',
		'Die Katze spielt im Garten.',
		'Der Hund ist müde.',
		'Die Katze ist müde.',
		'Der Hund bellt laut.',
		'Die Katze miaut laut.',
		'Der Laptop hat einen Akku.',
		'Das Handy hat einen Akku.',
		'Der Laptop hat einen Bildschirm.',
		'Das Handy hat einen Bildschirm.',
		'Der Laptop lädt über Nacht.',
		'Das Handy lädt über Nacht.',
		'Der Laptop liegt im Büro.',
		'Das Handy liegt im Büro.',
		'Der Laptop ist neu.',
		'Das Handy ist neu.',
		'Wir essen den Apfel.',
		'Wir essen den Pfirsich.',
		'Wir schälen den Apfel.',
		'Wir schälen den Pfirsich.',
		'Wir streicheln den Hund.',
		'Wir streicheln die Katze.',
		'Wir füttern den Hund.',
		'Wir füttern die Katze.',
		'Wir laden den Laptop.',
		'Wir laden das Handy.',
	],
	en: [
		'The apple is ripe.',
		'The peach is ripe.',
		'The apple is sweet.',
		'The peach is sweet.',
		'The apple tastes juicy.',
		'The peach tastes juicy.',
		'The apple hangs on the tree.',
		'The peach hangs on the tree.',
		'The apple lies in the basket.',
		'The peach lies in the basket.',
		'The glorp is ripe.',
		'The glorp hangs on the tree.',
		'The dog sleeps in its bed.',
		'The cat sleeps in its bed.',
		'The dog likes eating meat.',
		'The cat likes eating meat.',
		'The dog plays in the garden.',
		'The cat plays in the garden.',
		'The dog is tired.',
		'The cat is tired.',
		'The dog barks loudly.',
		'The cat meows loudly.',
		'The laptop has a battery.',
		'The phone has a battery.',
		'The laptop has a screen.',
		'The phone has a screen.',
		'The laptop charges overnight.',
		'The phone charges overnight.',
		'The laptop lies in the office.',
		'The phone lies in the office.',
		'The laptop is new.',
		'The phone is new.',
		'We eat the apple.',
		'We eat the peach.',
		'We peel the apple.',
		'We peel the peach.',
		'We pet the dog.',
		'We pet the cat.',
		'We feed the dog.',
		'We feed the cat.',
		'We charge the laptop.',
		'We charge the phone.',
	],
};

// The words drawn on the map, with a colour group for the reader (the
// puzzle word in a group of its own). The training never sees these groups.
export const SHOWN = {
	de: {
		fruit: ['Apfel', 'Pfirsich'],
		animal: ['Hund', 'Katze'],
		device: ['Laptop', 'Handy'],
		verb: ['essen', 'schälen', 'streicheln', 'füttern', 'laden', 'bellt'],
		probe: ['Quabbe'],
	},
	en: {
		fruit: ['apple', 'peach'],
		animal: ['dog', 'cat'],
		device: ['laptop', 'phone'],
		verb: ['eat', 'peel', 'pet', 'feed', 'charge', 'barks'],
		probe: ['glorp'],
	},
};

/** The word the prediction question is about. */
export const PROBE = { de: 'Quabbe', en: 'glorp' };

/** Words of a sentence as tokens: punctuation dropped, the sentence-initial
 * article or pronoun lower-cased ("Der" and "der" are one token). */
export function tokenize(sentence) {
	const words = sentence.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
	return words.map((w, i) => (i === 0 ? w.charAt(0).toLowerCase() + w.slice(1) : w));
}

/** Small seeded PRNG (mulberry32), returns floats in [0, 1). */
export function rng(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function gauss(rand) {
	const u = Math.max(rand(), 1e-12);
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

/** A fresh model: random rows (the table), the shared output weights, the
 * tokenized corpus and a seeded sentence order. */
export function createModel(lang, seed = SEED, lr = LEARNING_RATE) {
	const rand = rng(seed);
	const sentences = CORPUS[lang].map(tokenize);
	const vocab = [...new Set(sentences.flat())];
	const index = new Map(vocab.map((w, i) => [w, i]));
	const emb = vocab.map(() => [gauss(rand) * INIT_SPREAD, gauss(rand) * INIT_SPREAD]);
	const out = vocab.map(() => [gauss(rand) * INIT_SPREAD, gauss(rand) * INIT_SPREAD]);
	const bias = vocab.map(() => 0);
	return { lang, rand, sentences, vocab, index, emb, out, bias, lr, steps: 0, order: [], loss: NaN };
}

function nextSentence(model) {
	if (model.order.length === 0) {
		// A new pass through the corpus in a fresh seeded order.
		const order = model.sentences.map((_, i) => i);
		for (let i = order.length - 1; i > 0; i--) {
			const j = Math.floor(model.rand() * (i + 1));
			[order[i], order[j]] = [order[j], order[i]];
		}
		model.order = order;
	}
	return model.order.pop();
}

/** Softmax over the vocabulary for one row: the shared calculation. */
export function predict(model, row) {
	const logits = model.out.map((u, k) => u[0] * row[0] + u[1] * row[1] + model.bias[k]);
	const max = Math.max(...logits);
	const exps = logits.map((z) => Math.exp(z - max));
	const sum = exps.reduce((s, e) => s + e, 0);
	return exps.map((e) => e / sum);
}

/** One training step on one sentence: every word predicts the WINDOW words
 * after it, and all rows used (plus the shared output weights) move a little
 * against the error. Returns what the demo shows. */
export function trainStep(model) {
	const s = nextSentence(model);
	const words = model.sentences[s];
	const ids = words.map((w) => model.index.get(w));
	let loss = 0;
	let pairs = 0;
	const moved = new Set();
	for (let i = 0; i < ids.length; i++) {
		const c = ids[i];
		for (let j = 1; j <= WINDOW && i + j < ids.length; j++) {
			const target = ids[i + j];
			const row = model.emb[c];
			const p = predict(model, row);
			loss -= Math.log(p[target]);
			pairs++;
			// d(loss)/d(logit_k) = p_k - [k = target]
			const g = [0, 0];
			for (let k = 0; k < p.length; k++) {
				const d = p[k] - (k === target ? 1 : 0);
				const u = model.out[k];
				g[0] += d * u[0];
				g[1] += d * u[1];
				u[0] -= model.lr * d * row[0];
				u[1] -= model.lr * d * row[1];
				model.bias[k] -= model.lr * d;
			}
			row[0] -= model.lr * g[0];
			row[1] -= model.lr * g[1];
			moved.add(words[i]);
		}
	}
	model.steps++;
	model.loss = loss / Math.max(1, pairs);
	return { sentence: CORPUS[model.lang][s], index: s, moved: [...moved], loss: model.loss };
}

/** Run several steps at once (the running animation). */
export function train(model, n) {
	let last;
	for (let i = 0; i < n; i++) last = trainStep(model);
	return last;
}

/** The two numbers of a word's row. */
export function point(model, word) {
	return model.emb[model.index.get(word)];
}

export function distance(model, a, b) {
	const p = point(model, a);
	const q = point(model, b);
	return Math.hypot(p[0] - q[0], p[1] - q[1]);
}

/** The nearest drawn word to `word` on the map. */
export function nearestShown(model, word) {
	const shown = Object.values(SHOWN[model.lang]).flat().filter((w) => w !== word);
	let best = shown[0];
	for (const w of shown) if (distance(model, word, w) < distance(model, word, best)) best = w;
	return best;
}

/** Bounding box of the drawn words, for the view. */
export function bounds(model) {
	const pts = Object.values(SHOWN[model.lang]).flat().map((w) => point(model, w));
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}
