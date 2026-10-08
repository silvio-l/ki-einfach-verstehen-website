// Logic of the ModelProbe live demo (Baustein "Was ein KI-Modell eigentlich
// ist" / "What an AI model actually is"): a real base model continues a
// sentence start one token at a time. The data is precomputed with
// scripts/demos/precompute/modelprobe.py (Qwen3-0.6B-Base and Qwen3-4B-Base,
// the same setup as the experiment in the Baustein) and loaded lazily.
//
// Data shape (data/modelprobe.json): models[key].runs[prompt].nodes is a flat
// list of states; node 0 is the bare sentence start. Every node has `c`, its
// top-5 candidates as [piece, percent, childIndex | null]. Candidate 0 is the
// most likely token; a null child means that branch was not computed.

/** The sentence starts in the demo's order; `compare` shows two side by side. */
export const PROMPT_KEYS = ['capital', 'reverse', 'einstein', 'quelling'];
export const VIEWS = [...PROMPT_KEYS, 'compare'];
/** Real person and invented person of the compare view. */
export const COMPARE = ['einstein', 'quelling'];
export const MODEL_KEYS = ['small', 'large'];
export const START = { view: 'capital', model: 'small' };

/** Loads the precomputed trees (a separate chunk, not in the page bundle). */
export function loadProbeData() {
	return import('./data/modelprobe.json').then((m) => m.default ?? m);
}

/** A walk through one run: the visited node indices and the pieces appended. */
export function startWalk() {
	return { nodes: [0], pieces: [], ranks: [] };
}

export function currentNode(run, walk) {
	return run.nodes[walk.nodes[walk.nodes.length - 1]];
}

/** Whether candidate `rank` of the current node leads to a computed state. */
export function canTake(run, walk, rank = 0) {
	const cand = currentNode(run, walk).c[rank];
	return Boolean(cand) && cand[2] !== null && cand[2] !== undefined;
}

/** Append candidate `rank` (0 = most likely); returns a new walk, or null. */
export function take(run, walk, rank = 0) {
	if (!canTake(run, walk, rank)) return null;
	const [piece, , child] = currentNode(run, walk).c[rank];
	return { nodes: [...walk.nodes, child], pieces: [...walk.pieces, piece], ranks: [...walk.ranks, rank] };
}

/** One step back; the start stays the start. */
export function back(walk) {
	if (walk.nodes.length <= 1) return walk;
	return { nodes: walk.nodes.slice(0, -1), pieces: walk.pieces.slice(0, -1), ranks: walk.ranks.slice(0, -1) };
}

/** Percent the model gave each appended piece, in order. */
export function chosenShares(run, walk) {
	return walk.ranks.map((rank, i) => run.nodes[walk.nodes[i]].c[rank][1]);
}

/** The greedy continuation of `steps` tokens as text. */
export function greedyText(run, steps = Infinity) {
	let walk = startWalk();
	for (let i = 0; i < steps; i += 1) {
		const next = take(run, walk, 0);
		if (!next) break;
		walk = next;
	}
	return walk.pieces.join('');
}

/** Whitespace made visible: line breaks as ↵, any other space (also a
 * non-breaking one) as ␣, the marker the tokenizer demos use. */
const visible = (s) => s.replace(/\n/g, '↵').replace(/\s/g, '␣');

/**
 * How a token is shown on a bar: leading whitespace becomes `lead` (shown as
 * a muted marker before the text), a token of pure whitespace is spelled out
 * with ␣ and ↵ so it does not look empty. `blank` marks such tokens; `kind`
 * says which word names them ('newline' or 'space').
 */
export function tokenLabel(piece) {
	if (piece.trim() === '') {
		return { lead: '', text: visible(piece), blank: true, kind: piece.includes('\n') ? 'newline' : 'space' };
	}
	const lead = piece.match(/^\s*/)[0];
	return { lead: visible(lead), text: visible(piece.slice(lead.length)), blank: false, kind: null };
}

/** "47,5 %" / "47.5%" with one decimal, as the text writes them. */
export function formatPct(p, lang) {
	const s = p.toFixed(1);
	return lang === 'de' ? `${s.replace('.', ',')} %` : `${s}%`;
}

/** Mean of the shares, rounded to whole percent; null without any step. */
export function meanShare(shares) {
	if (!shares.length) return null;
	return Math.round(shares.reduce((a, b) => a + b, 0) / shares.length);
}
