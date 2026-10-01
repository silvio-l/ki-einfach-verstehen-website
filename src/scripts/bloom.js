// Phyllotaxis bloom generator — parameters from
// packages/content/design/designsprache.md (golden angle 137.50776405°,
// r = R*sqrt(i/N) sunflower distribution, ±0.02 jitter, neighbor edges,
// inner-edge glow, filament chains, satellites). The Leuchtkern motif is
// restricted to exactly two placement types (DESIGN.md §4): the Hero bloom,
// and one small, low-density section-end/footer mark per view. Current
// section-end call sites: the Wegkarte's goal mark on the homepage, the
// article-end mark closing a Baustein (ContentEntryLayout), and the
// story-end mark on standalone editorial pages (StoryArticle). Adding a
// new call site is fine as long as it fits the section-end/footer-marker
// category in DESIGN.md §4 — do not invent a third placement type (e.g.
// generic card/background texture).
//
// With `growth: true` every node carries `--bi` (its phyllotaxis spawn
// index) and every edge `--bt` (its radial position 0..1) as inline custom
// properties, so CSS can stage the bloom's entrance in the motif's actual
// generative order — the same order a sunflower head grows in. The
// animation itself lives in the caller's CSS (inside a
// prefers-reduced-motion guard); without that CSS the SVG renders complete
// and static.
const GOLDEN = (137.50776405 * Math.PI) / 180;
const SVGNS = 'http://www.w3.org/2000/svg';

function mulberry32(a) {
	return function () {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function hexLerp(a, b, t) {
	const c = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
	const A = c(a);
	const B = c(b);
	const out = A.map((v, i) => Math.round(v + (B[i] - v) * t));
	return `rgb(${out.join(',')})`;
}

// Radial falloff 1 at the center, 0 at the rim. The ±0.02 radius jitter can
// push the outermost points slightly past t = 1; without the clamp the
// fractional power of a negative base is NaN and the node's `r`/`opacity`
// attributes end up invalid ("<circle> attribute r: Expected length, NaN").
function falloff(t, exp) {
	return Math.pow(Math.max(0, 1 - t), exp);
}

function el(name, attrs, parent) {
	const n = document.createElementNS(SVGNS, name);
	for (const k in attrs) n.setAttribute(k, attrs[k]);
	if (parent) parent.appendChild(n);
	return n;
}

export function bloom(svg, opts) {
	if (!svg) return;
	const { n: N, r: R, cx, cy } = opts;
	const rand = mulberry32(opts.seed);
	const innerC = opts.innerColor;
	const outerC = opts.outerColor;
	const pts = [];
	for (let i = 0; i < N; i++) {
		const rr = R * Math.sqrt((i + 0.5) / N) * (1 + (rand() - 0.5) * 0.04);
		const ang = i * GOLDEN + (rand() - 0.5) * 0.04;
		pts.push({ x: cx + Math.cos(ang) * rr, y: cy + Math.sin(ang) * rr, t: rr / R });
	}

	const edgeKeys = new Set();
	const edges = [];
	const thr = R * 0.17;
	for (let a = 0; a < N; a++) {
		const near = [];
		for (let b = 0; b < N; b++) {
			if (a === b) continue;
			const dx = pts[a].x - pts[b].x;
			const dy = pts[a].y - pts[b].y;
			const d = Math.sqrt(dx * dx + dy * dy);
			if (d < thr) near.push({ j: b, d });
		}
		near.sort((p, q) => p.d - q.d);
		const kmax = pts[a].t < 0.5 ? 3 : 2;
		for (let k = 0; k < Math.min(kmax, near.length); k++) {
			const j = near[k].j;
			const key = a < j ? `${a}-${j}` : `${j}-${a}`;
			if (!edgeKeys.has(key)) {
				edgeKeys.add(key);
				edges.push([a, j]);
			}
		}
	}

	const defs = el('defs', {}, svg);
	if (opts.glow) {
		const f = el('filter', { id: `${svg.id}-blur`, x: '-40%', y: '-40%', width: '180%', height: '180%' }, defs);
		el('feGaussianBlur', { stdDeviation: '5.5' }, f);
	}
	const gGlow = opts.glow ? el('g', { class: 'bloom-glowlayer', filter: `url(#${svg.id}-blur)` }, svg) : null;
	const gEdges = el('g', { class: 'bloom-edges' }, svg);
	const gNodes = el('g', { class: 'bloom-nodes' }, svg);

	edges.forEach((e) => {
		const p = pts[e[0]];
		const q = pts[e[1]];
		const t = (p.t + q.t) / 2;
		const attrs = {
			x1: p.x.toFixed(1),
			y1: p.y.toFixed(1),
			x2: q.x.toFixed(1),
			y2: q.y.toFixed(1),
			stroke: hexLerp(innerC, outerC, t),
			'stroke-width': opts.edgeW,
			opacity: (falloff(t, 1.15) * 0.9 + 0.06).toFixed(2),
		};
		if (opts.growth) attrs.style = `--bt:${t.toFixed(3)}`;
		el('line', attrs, gEdges);
		if (gGlow && t < 0.55) {
			el(
				'line',
				{
					x1: p.x.toFixed(1),
					y1: p.y.toFixed(1),
					x2: q.x.toFixed(1),
					y2: q.y.toFixed(1),
					stroke: '#9FE2D2',
					'stroke-width': 2.6,
					opacity: (0.5 * (1 - t)).toFixed(2),
				},
				gGlow,
			);
		}
	});

	if (opts.filaments) {
		for (let fi = 0; fi < 10; fi++) {
			const idx = Math.floor(rand() * N * 0.15);
			const path = [pts[idx]];
			let cur = idx;
			for (let s = 0; s < 6; s++) {
				let best = -1;
				let bestD = 1e9;
				for (let j2 = 0; j2 < N; j2++) {
					if (pts[j2].t <= pts[cur].t + 0.02) continue;
					const ddx = pts[j2].x - pts[cur].x;
					const ddy = pts[j2].y - pts[cur].y;
					const dd = Math.sqrt(ddx * ddx + ddy * ddy);
					if (dd < bestD && dd < thr * 1.35) {
						bestD = dd;
						best = j2;
					}
				}
				if (best < 0) break;
				path.push(pts[best]);
				cur = best;
			}
			if (path.length > 2) {
				const d = 'M' + path.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L');
				el('path', { class: 'bloom-late', d, fill: 'none', stroke: '#D8F4EA', 'stroke-width': 0.9, opacity: 0.32, 'stroke-linecap': 'round' }, gEdges);
				if (gGlow) el('path', { d, fill: 'none', stroke: '#D8F4EA', 'stroke-width': 2.2, opacity: 0.22 }, gGlow);
			}
		}
	}

	if (opts.satellites) {
		for (let si = 0; si < 11; si++) {
			const sa = rand() * Math.PI * 2;
			const sr = R * (1.04 + rand() * 0.2);
			const sx = cx + Math.cos(sa) * sr;
			const sy = cy + Math.sin(sa) * sr;
			const len = 6 + rand() * 12;
			el(
				'line',
				{
					class: 'bloom-late',
					x1: sx.toFixed(1),
					y1: sy.toFixed(1),
					x2: (sx - Math.cos(sa) * len).toFixed(1),
					y2: (sy - Math.sin(sa) * len).toFixed(1),
					stroke: outerC,
					'stroke-width': 0.8,
					opacity: 0.5,
				},
				gEdges,
			);
			el('circle', { class: 'bloom-late', cx: sx.toFixed(1), cy: sy.toFixed(1), r: 1.4, fill: hexLerp(innerC, outerC, 0.6), opacity: 0.7 }, gNodes);
		}
	}

	pts.forEach((p, i) => {
		const attrs = {
			class: 'bloom-node',
			cx: p.x.toFixed(1),
			cy: p.y.toFixed(1),
			r: (opts.nodeMin + opts.nodeMax * falloff(p.t, 1.3)).toFixed(2),
			fill: hexLerp(innerC, outerC, Math.min(1, p.t)),
			opacity: Math.max(0.18, falloff(p.t, 1.15)).toFixed(2),
		};
		if (opts.growth) attrs.style = `--bi:${i}`;
		el('circle', attrs, gNodes);
	});
}
