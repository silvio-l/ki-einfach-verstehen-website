// Build-time index of every shareable graphic: the Figures and live demos of
// each published Baustein, read straight from the MDX source
// (src/lib/figure-share.mjs), with the facts the share menu, the figure
// pages, the embed routes and the PNG renderers need (delivered file,
// anchors, routes, DE/EN pairing, citation year). Memoised per build --
// Figure.astro asks once per figure, but the index is built once per
// language.
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
	SITE_ORIGIN,
	demoAnchor,
	demoEmbedPath,
	extractDemos,
	extractFigures,
	figureAnchor,
	figurePagePath,
	figurePngPath,
	lessonPath,
	pairFigures,
	type FigureSource,
} from './figure-share.mjs';
import { lastCommit } from './last-commit';

export type Lang = 'de' | 'en';

export interface ShareFigure extends FigureSource {
	/** Public path of the file a reader gets (static fallback for animations, WebP when the PNG is only delivered as WebP). */
	file: string;
	anchor: string;
	pagePath: string;
	/** Share page of the same figure in the other language, when the pairing is certain. */
	otherPagePath?: string;
}

export interface ShareLesson {
	lang: Lang;
	slug: string;
	title: string;
	translationKey: string;
	/** Year of the last change -- the version a citation refers to. */
	year: number;
	path: string;
	otherPath?: string;
	figures: ShareFigure[];
	demos: string[];
}

const PUBLIC_DIR = path.resolve('public');
const inPublic = (src: string) => existsSync(path.join(PUBLIC_DIR, src));

/** The file actually served for a figure (rehype-content-images.mjs delivers PNGs as WebP when one exists). */
function deliveredFile(f: FigureSource): string {
	const src = f.kind === 'mechanism' && f.staticSrc ? f.staticSrc : f.src;
	if (/\.png$/i.test(src)) {
		const webp = src.replace(/\.png$/i, '.webp');
		if (inPublic(webp)) return webp;
	}
	return src;
}

const slugOf = (entry: CollectionEntry<'bausteine'>, lang: Lang) => entry.id.slice(lang.length + 1);

let index: Promise<Record<Lang, ShareLesson[]>> | undefined;

async function build(): Promise<Record<Lang, ShareLesson[]>> {
	const entries = await getCollection('bausteine');
	const byLang = (lang: Lang) => entries.filter((e) => e.id.startsWith(`${lang}/`));
	const sources = new Map(entries.map((e) => [e.id, extractFigures(e.body ?? '')]));
	const out: Record<Lang, ShareLesson[]> = { de: [], en: [] };
	for (const lang of ['de', 'en'] as const) {
		const other: Lang = lang === 'de' ? 'en' : 'de';
		for (const entry of byLang(lang)) {
			const slug = slugOf(entry, lang);
			const counterpart = byLang(other).find((e) => e.data.translationKey === entry.data.translationKey);
			const otherSlug = counterpart ? slugOf(counterpart, other) : undefined;
			const pairs = counterpart ? pairFigures(sources.get(entry.id)!, sources.get(counterpart.id)!) : new Map<string, string>();
			const date = lastCommit(entry.filePath)?.date;
			out[lang].push({
				lang,
				slug,
				title: entry.data.title,
				translationKey: entry.data.translationKey,
				year: date ? Number(date.slice(0, 4)) : new Date().getFullYear(),
				path: lessonPath(lang, slug),
				...(otherSlug ? { otherPath: lessonPath(other, otherSlug) } : {}),
				figures: sources.get(entry.id)!.map((f) => {
					const otherId = pairs.get(f.id);
					const file = deliveredFile(f);
					if (!inPublic(file)) throw new Error(`figures: ${entry.id} figure "${f.id}" points at a missing file ${file}`);
					return {
						...f,
						file,
						anchor: figureAnchor(lang, f.id),
						pagePath: figurePagePath(lang, slug, f.id),
						...(otherSlug && otherId ? { otherPagePath: figurePagePath(other, otherSlug, otherId) } : {}),
					};
				}),
				demos: extractDemos(entry.body ?? ''),
			});
		}
	}
	return out;
}

export function getShareLessons(lang: Lang): Promise<ShareLesson[]> {
	index ??= build();
	return index.then((all) => all[lang]);
}

export async function getShareLesson(lang: Lang, slug: string): Promise<ShareLesson | undefined> {
	return (await getShareLessons(lang)).find((l) => l.slug === slug);
}

/** The Baustein a demo lives in -- the embed's attribution links back to it. */
export async function getDemoLesson(lang: Lang, demo: string): Promise<ShareLesson | undefined> {
	return (await getShareLessons(lang)).find((l) => l.demos.includes(demo));
}

export const absolute = (p: string) => new URL(p, SITE_ORIGIN).href;

/** Matomo event name for everything shared from one graphic: `<translationKey>#<anchor>`. */
export const trackName = (lesson: ShareLesson, anchor: string) => `${lesson.translationKey}#${anchor}`;

export { demoAnchor, demoEmbedPath };

// ——— Data for the share dialog (ShareGraphic.astro) ———

/** Everything the client-side share dialog needs for one graphic; texts are built there from figure-share.mjs. */
export interface ShareData {
	kind: 'figure' | 'demo';
	lang: Lang;
	/** Baustein title -- the work the attribution names. */
	title: string;
	caption: string;
	alt: string;
	/** The link to share and to credit: the figure page, or the demo anchor in the Baustein. */
	shareUrl: string;
	/** The graphic in its Baustein (with anchor). */
	lessonUrl: string;
	year: number;
	citeKey: string;
	/** Matomo event name. */
	track: string;
	imageUrl?: string;
	width?: number;
	height?: number;
	downloadName?: string;
	sourcePngUrl?: string;
	sourcePngName?: string;
	embedUrl?: string;
	embedHeight?: number;
	demoTitle?: string;
}

const fileExt = (file: string) => /\.([a-z0-9]+)$/i.exec(file)?.[1]?.toLowerCase() ?? 'png';

export function figureShareData(lesson: ShareLesson, f: ShareFigure): ShareData {
	return {
		kind: 'figure',
		lang: lesson.lang,
		title: lesson.title,
		caption: f.caption,
		alt: f.alt,
		shareUrl: absolute(f.pagePath),
		lessonUrl: absolute(`${lesson.path}#${f.anchor}`),
		year: lesson.year,
		citeKey: `kiev-${lesson.translationKey}-${f.id}`,
		track: trackName(lesson, f.anchor),
		imageUrl: absolute(f.file),
		...(f.width && f.height && f.kind !== 'mechanism' ? { width: f.width, height: f.height } : {}),
		downloadName: `ki-einfach-verstehen-${f.id}.${fileExt(f.file)}`,
		sourcePngUrl: absolute(figurePngPath(lesson.lang, lesson.slug, f.id, 'source')),
		sourcePngName: `ki-einfach-verstehen-${f.id}-${lesson.lang === 'de' ? 'mit-quelle' : 'with-source'}.png`,
	};
}

// Starting heights of the demo iframes; the embed page reports its real
// height (postMessage), so these only matter where the host strips scripts.
// Measured at a 720 px wide frame, the larger of DE/EN, rounded up to 50.
const DEMO_EMBED_HEIGHT: Record<string, number> = { attention: 1450, bpe: 1550, chatsequence: 1500, descent: 1450, embeddingtraining: 1900, hiddenstate: 1900, memory: 1350, modelprobe: 1150, neighbors: 1800, outputscore: 1600, qkv: 2300, sampling: 1100, shape: 880, softmax: 1350, textloop: 800, tokenizer: 1250, vocabulary: 1550, weights: 820 };

export function demoShareData(lesson: ShareLesson, demo: string, demoTitle: string, intro: string): ShareData {
	const anchor = demoAnchor(lesson.lang, demo);
	const lessonUrl = absolute(`${lesson.path}#${anchor}`);
	return {
		kind: 'demo',
		lang: lesson.lang,
		title: lesson.title,
		caption: intro,
		alt: demoTitle,
		shareUrl: lessonUrl,
		lessonUrl,
		year: lesson.year,
		citeKey: `kiev-${lesson.translationKey}-demo-${demo}`,
		track: trackName(lesson, anchor),
		embedUrl: absolute(demoEmbedPath(lesson.lang, demo)),
		embedHeight: DEMO_EMBED_HEIGHT[demo] ?? 760,
		demoTitle,
	};
}

/** getStaticPaths for the figure pages and their PNGs: one entry per figure. */
export async function figureStaticPaths(lang: Lang) {
	return (await getShareLessons(lang)).flatMap((lesson) =>
		lesson.figures.map((figure) => ({ params: { slug: lesson.slug, fig: figure.id }, props: { lesson, figure } })),
	);
}
