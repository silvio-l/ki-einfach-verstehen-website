// Build-time PNGs for shared figures (docs/research/social-growth-loops.md
// §3 E2): the social preview card of a figure page (1200×630, exactly that
// graphic on the brand ground) and the download variant with the source
// line burnt in. Text is laid out by Satori (glyphs become paths, so the
// result never depends on the fonts of the build machine), the graphic
// itself is rasterised by sharp and composited on top.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { CONTENT_LICENSE, SITE_NAME } from './figure-share.mjs';

const FONT_DIR = path.resolve('scripts/graphics/fonts');
const PUBLIC_DIR = path.resolve('public');

let fonts: { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[] | undefined;
function loadFonts() {
	fonts ??= [
		{ name: 'IBM Plex Sans', data: readFileSync(path.join(FONT_DIR, 'IBMPlexSans-Regular.ttf')), weight: 400, style: 'normal' },
		{ name: 'IBM Plex Sans', data: readFileSync(path.join(FONT_DIR, 'IBMPlexSans-Bold.ttf')), weight: 700, style: 'normal' },
	];
	return fonts;
}

// Brand tokens (src/styles/tokens.css) -- the cards are always light.
const INK = '#1b1a17';
const INK_MUTED = '#55524a';
const PETROL_DEEP = '#0a5148';
const GROUND = '#ffffff';
const ZONE = '#d7ece7';
const LINE = '#dad6cb';

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

async function textLayer(tree: Node, width: number, height: number): Promise<Buffer> {
	const svg = await satori(tree as never, { width, height, fonts: loadFonts() });
	return sharp(Buffer.from(svg)).png().toBuffer();
}

/** The graphic as a PNG that fits into `maxW`×`maxH` (vectors render sharp at any size). */
async function graphic(file: string, maxW: number, maxH: number): Promise<{ data: Buffer; width: number; height: number }> {
	const source = path.join(PUBLIC_DIR, file);
	const isSvg = /\.svg$/i.test(file);
	// Rasterise vectors at a density high enough for the target box, then fit.
	const meta = await sharp(source).metadata();
	const scale = isSvg && meta.width && meta.height ? Math.min(maxW / meta.width, maxH / meta.height) : 1;
	const density = isSvg ? Math.min(1200, Math.max(72, Math.ceil(72 * scale * 1.2))) : undefined;
	const { data, info } = await sharp(source, density ? { density } : {})
		.resize({ width: maxW, height: maxH, fit: 'inside', withoutEnlargement: !isSvg })
		.png()
		.toBuffer({ resolveWithObject: true });
	return { data, width: info.width, height: info.height };
}

/** Social preview (og:image) for a figure page: the graphic large, brand and lesson below. */
export async function figureOgImage({ file, lessonTitle, lang }: { file: string; lessonTitle: string; lang: 'de' | 'en' }): Promise<Buffer> {
	const W = 1200;
	const H = 630;
	const BAR = 104;
	const PAD = 40;
	const from = lang === 'de' ? 'Abbildung aus' : 'Figure from';
	const bar = el(
		'div',
		{ display: 'flex', flexDirection: 'column', width: W, height: H, backgroundColor: GROUND, fontFamily: 'IBM Plex Sans' },
		[
			el('div', { display: 'flex', flexGrow: 1, backgroundImage: `linear-gradient(145deg, ${GROUND}, ${ZONE})` }),
			el(
				'div',
				{
					display: 'flex',
					height: BAR,
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: `0 ${PAD}px`,
					borderTop: `2px solid ${LINE}`,
					backgroundColor: GROUND,
				},
				[
					el('div', { display: 'flex', flexDirection: 'column', maxWidth: 820 }, [
						el('div', { fontSize: 20, color: INK_MUTED }, from),
						el('div', { fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.2 }, lessonTitle.length > 60 ? `${lessonTitle.slice(0, 58)}…` : lessonTitle),
					]),
					el('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }, [
						el('div', { fontSize: 26, fontWeight: 700, color: PETROL_DEEP }, SITE_NAME),
						el('div', { fontSize: 18, color: INK_MUTED }, CONTENT_LICENSE.name),
					]),
				],
			),
		],
	);
	const ground = await textLayer(bar, W, H);
	const box = { w: W - 2 * PAD, h: H - BAR - 2 * 28 };
	const g = await graphic(file, box.w, box.h);
	return sharp(ground)
		.composite([{ input: g.data, left: Math.round((W - g.width) / 2), top: Math.round(28 + (box.h - g.height) / 2) }])
		.png({ compressionLevel: 9 })
		.toBuffer();
}

/**
 * Download variant: the graphic at a print-friendly size with the CC BY
 * attribution set as a footer line under it.
 */
export async function figureWithSource({ file, title, url, lang }: { file: string; title: string; url: string; lang: 'de' | 'en' }): Promise<Buffer> {
	const meta = await sharp(path.join(PUBLIC_DIR, file)).metadata();
	const isSvg = /\.svg$/i.test(file);
	const natural = meta.width ?? 800;
	// Vectors at twice their drawn size (crisp on slides), rasters as they are;
	// never narrower than the footer text needs.
	const W = Math.max(1000, Math.min(1600, isSvg ? natural * 2 : natural));
	const PAD = 32;
	const g = await graphic(file, W - 2 * PAD, 2400);
	const FOOT = 96;
	const H = PAD + g.height + 16 + FOOT;
	const quoted = lang === 'de' ? `‚${title}‘` : `‘${title}’`;
	const licence = lang === 'de' ? `Lizenz: ${CONTENT_LICENSE.name}` : `License: ${CONTENT_LICENSE.name}`;
	const footer = el('div', { display: 'flex', width: W, height: H, backgroundColor: GROUND, fontFamily: 'IBM Plex Sans' }, [
		el(
			'div',
			{
				position: 'absolute',
				left: PAD,
				right: PAD,
				bottom: 0,
				height: FOOT,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				borderTop: `1px solid ${LINE}`,
			},
			[
				el('div', { display: 'flex', flexWrap: 'wrap', fontSize: 20, color: INK }, [
					el('span', { fontWeight: 700, color: PETROL_DEEP, marginRight: 8 }, `${SITE_NAME},`),
					el('span', { marginRight: 8 }, `${quoted},`),
					el('span', {}, licence),
				]),
				el('div', { fontSize: 18, color: INK_MUTED }, url.replace(/^https:\/\//, '')),
			],
		),
	]);
	const ground = await textLayer(footer, W, H);
	return sharp(ground)
		.composite([{ input: g.data, left: Math.round((W - g.width) / 2), top: PAD }])
		.png({ compressionLevel: 9 })
		.toBuffer();
}
