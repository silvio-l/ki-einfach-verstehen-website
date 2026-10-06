#!/usr/bin/env node
// Renders the GitHub social preview card (.github/social-preview.png,
// 1280x640, GitHub's recommended size) in the site's brand style: the
// Hero's four-stop radial petrol ground (115% ellipse at 50% 27%), its three-stop glow and phyllotaxis bloom
// (src/scripts/bloom.js, same parameters as Hero.astro), and the reserved
// Literata lockup. Text goes through Satori (glyphs become paths, so the
// result doesn't depend on installed fonts); rsvg-convert rasterises the
// final SVG. The PNG is uploaded by hand in the repository settings
// (Settings -> Social preview); rerun only when the card should change:
//
//   node scripts/social-preview.mjs   (needs rsvg-convert, e.g. `brew install librsvg`)

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';

const W = 1280;
const H = 640;
const websiteRoot = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const font = (pkg, file) => readFileSync(path.join(path.dirname(require.resolve(`${pkg}/package.json`)), 'files', file));

// --- bloom: run the site's generator against a tiny SVG DOM stand-in -------
function svgNode(name) {
	return {
		name,
		attrs: {},
		children: [],
		setAttribute(k, v) {
			this.attrs[k] = String(v);
		},
		appendChild(child) {
			this.children.push(child);
		},
		toString() {
			const attrs = Object.entries(this.attrs)
				.filter(([k]) => k !== 'class' && k !== 'style')
				.map(([k, v]) => ` ${k}="${v}"`)
				.join('');
			return `<${this.name}${attrs}>${this.children.join('')}</${this.name}>`;
		},
	};
}
globalThis.document = { createElementNS: (_ns, name) => svgNode(name) };
const { bloom } = await import('../src/scripts/bloom.js');
const bloomSvg = svgNode('svg');
bloomSvg.id = 'bloom';
bloom(bloomSvg, {
	n: 210,
	r: 236,
	cx: 260,
	cy: 260,
	seed: 20260820,
	innerColor: '#F0FAF6',
	outerColor: '#0E6A5D',
	edgeW: 0.7,
	nodeMin: 1.1,
	nodeMax: 2.7,
	glow: true,
	filaments: true,
	satellites: true,
});

// --- text block (Satori) ---------------------------------------------------
const TEXT_W = 700;
const text = await satori(
	{
		type: 'div',
		props: {
			style: { display: 'flex', flexDirection: 'column', width: TEXT_W, height: H, justifyContent: 'center', color: '#fbfaf7' },
			children: [
				{
					type: 'div',
					props: {
						style: { fontFamily: 'Plex', fontWeight: 500, fontSize: 19, letterSpacing: '0.16em', color: '#d7ece7', marginBottom: 26 },
						children: 'KOSTENLOSER KURS · DEUTSCH + ENGLISH',
					},
				},
				{ type: 'div', props: { style: { fontFamily: 'Literata', fontWeight: 800, fontSize: 124, lineHeight: 1 }, children: 'KI' } },
				{
					type: 'div',
					props: {
						style: { display: 'flex', fontFamily: 'Literata', fontSize: 74, lineHeight: 1.1, marginTop: 4 },
						children: [
							{ type: 'span', props: { style: { fontStyle: 'italic', fontWeight: 600, color: '#9fe2d2', marginRight: 22 }, children: 'einfach' } },
							{ type: 'span', props: { style: { fontWeight: 700 }, children: 'verstehen' } },
						],
					},
				},
				{
					type: 'div',
					props: {
						style: { fontFamily: 'Plex', fontWeight: 600, fontSize: 36, color: '#d8f4ea', marginTop: 34 },
						children: 'Verstehen statt nur bedienen.',
					},
				},
				{
					type: 'div',
					props: {
						style: { fontFamily: 'Plex', fontWeight: 400, fontSize: 26, color: '#d7ece7', marginTop: 10 },
						children: 'Learn how AI really works, step by step.',
					},
				},
				{
					type: 'div',
					props: {
						style: { fontFamily: 'Plex', fontWeight: 500, fontSize: 20, letterSpacing: '0.04em', color: '#9fe2d2', marginTop: 34 },
						children: 'ki-einfach-verstehen.de',
					},
				},
			],
		},
	},
	{
		width: TEXT_W,
		height: H,
		fonts: [
			{ name: 'Literata', data: font('@fontsource/literata', 'literata-latin-800-normal.woff'), weight: 800, style: 'normal' },
			{ name: 'Literata', data: font('@fontsource/literata', 'literata-latin-700-normal.woff'), weight: 700, style: 'normal' },
			{ name: 'Literata', data: font('@fontsource/literata', 'literata-latin-600-italic.woff'), weight: 600, style: 'italic' },
			{ name: 'Plex', data: font('@fontsource/ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff'), weight: 400, style: 'normal' },
			{ name: 'Plex', data: font('@fontsource/ibm-plex-sans', 'ibm-plex-sans-latin-500-normal.woff'), weight: 500, style: 'normal' },
			{ name: 'Plex', data: font('@fontsource/ibm-plex-sans', 'ibm-plex-sans-latin-600-normal.woff'), weight: 600, style: 'normal' },
		],
	},
);

// --- compose ---------------------------------------------------------------
// Bloom stage: 520-unit viewBox drawn at 560px, centred right of the text.
const STAGE = 560;
const sx = 1280 - STAGE - 20;
const sy = (H - STAGE) / 2;
const cx = sx + STAGE / 2;
const cy = sy + STAGE / 2;
const glow = (id, r, stops) =>
	`<radialGradient id="${id}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>` +
	`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;
const bloomInner = bloomSvg.children.join('');
const textInner = text.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><radialGradient id="ground" cx="${W / 2}" cy="${H * 0.27}" r="${W * 1.15}" gradientUnits="userSpaceOnUse" gradientTransform="translate(${W / 2} ${H * 0.27}) scale(1 ${H / W}) translate(${-W / 2} ${-H * 0.27})">
<stop offset="0" stop-color="#0c5049"/><stop offset="0.34" stop-color="#073b36"/><stop offset="0.62" stop-color="#042723"/><stop offset="1" stop-color="#021613"/>
</radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#ground)"/>
${glow('halo', STAGE * 0.8, [[0, 'rgba(18,144,127,0.44)'], [0.55, 'rgba(18,144,127,0.15)'], [1, 'rgba(18,144,127,0)']])}
${glow('core', STAGE * 0.28, [[0, 'rgba(242,252,248,0.95)'], [0.22, 'rgba(159,226,210,0.5)'], [0.5, 'rgba(63,168,148,0.22)'], [1, 'rgba(63,168,148,0)']])}
${glow('hot', STAGE * 0.12, [[0, 'rgba(255,255,255,0.85)'], [0.6, 'rgba(216,244,234,0.3)'], [1, 'rgba(216,244,234,0)']])}
<svg x="${sx}" y="${sy}" width="${STAGE}" height="${STAGE}" viewBox="0 0 520 520" overflow="visible">${bloomInner}</svg>
<svg x="96" y="0" width="${TEXT_W}" height="${H}" viewBox="0 0 ${TEXT_W} ${H}">${textInner}</svg>
</svg>`;

const outDir = path.join(websiteRoot, '.github');
mkdirSync(outDir, { recursive: true });
const svgPath = path.join(tmpdir(), 'kiev-social-preview.svg');
const pngPath = path.join(outDir, 'social-preview.png');
writeFileSync(svgPath, svg);
execFileSync('rsvg-convert', ['--width', String(W), '--height', String(H), '--output', pngPath, svgPath]);
const kb = Math.round(statSync(pngPath).size / 1024);
console.log(`Wrote ${path.relative(websiteRoot, pngPath)} (${W}x${H}, ${kb} KB)`);
if (kb >= 1024) {
	console.error('Social preview must stay below 1 MB.');
	process.exit(1);
}
