// The memory rule of thumb of Baustein 6 (parameter-training-inferenz-hardware):
// billions of parameters times bytes per number gives gigabytes (Hugging Face
// LLM optimization guide: 2·X GB in 16 bit). Only the parameters are counted,
// so every figure is a lower bound. Device sizes are the manufacturer's
// (Pixel 10a: 8 GB shared RAM, RTX 4090: 24 GB, H100: 80 GB); training uses
// ZeRO's 16 bytes per parameter.

/** Parameter counts in billions the slider steps through, with known models. */
export const STEPS = [
	{ bn: 1.5, name: 'GPT-2' },
	{ bn: 3, name: { de: 'Apples Handy-Modell (rund 3 Mrd.)', en: 'Apple’s phone model (about 3 bn)' } },
	{ bn: 8, name: 'Llama 3.1 8B' },
	{ bn: 20 },
	{ bn: 40 },
	{ bn: 70, name: 'Llama 3.1 70B' },
	{ bn: 175, name: 'GPT-3' },
	{ bn: 405, name: 'Llama 3.1 405B' },
];

export const BITS = [16, 8, 4, 2];

// A phone shares its working memory with the system and every app, so a model
// counts as tight there well before it fills the memory and does not fit once
// it would take all of it.
export const DEVICES = [
	{ key: 'phone', gb: 8, tightShare: 0.4, noShare: 1 },
	{ key: 'gaming', gb: 24 },
	{ key: 'datacenter', gb: 80 },
];

export const TRAINING_BYTES = 16;

/** Gigabytes for the parameters alone. */
export function memoryGb(bn, bits) {
	return (bn * bits) / 8;
}

/** Gigabytes ZeRO counts for training with mixed precision and Adam. */
export function trainingGb(bn) {
	return bn * TRAINING_BYTES;
}

/** Share of a device above which the parameters leave no room to work. */
export const TIGHT_SHARE = 0.9;

/** 'fits', 'tight' (no room left for intermediate results) or 'no'. */
export function fitStatus(gb, capacity, { tightShare = TIGHT_SHARE, noShare } = {}) {
	if (noShare === undefined ? gb > capacity : gb >= capacity * noShare) return 'no';
	return gb > capacity * tightShare ? 'tight' : 'fits';
}

/** How many chips of a given size the parameters need at least. */
export function chipsNeeded(gb, capacity) {
	return Math.max(1, Math.ceil(gb / capacity));
}

/** "16", "4", "0,75", "810": rounded the way the text writes them. */
export function formatGb(gb, lang) {
	const rounded = gb >= 10 ? Math.round(gb) : Math.round(gb * 100) / 100;
	const s = String(rounded);
	return lang === 'de' ? s.replace('.', ',') : s;
}
