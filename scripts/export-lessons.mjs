#!/usr/bin/env node
// Generates the GitHub-readable side of the public repo from the content
// collections:
//   - lessons/<lang>/<slug>.md: every published Baustein as plain Markdown
//     (same conversion as the site's `[slug].md` endpoints, see
//     src/lib/lesson-markdown.mjs), with a header pointing to the
//     interactive website version and the licence line;
//   - the table of contents between the `lessons-toc` markers in README.md
//     (English) and README.de.md (German).
//
// The output is committed: the public mirror is a `git subtree split` of
// packages/website, so only committed files reach GitHub. Run
// `pnpm gen:lessons` after changing a Baustein or Themenbereich;
// `pnpm lint` runs this script with --check and fails when the committed
// files are stale. It reads the content files directly (no Astro build
// needed), so the check stays fast and runs anywhere `pnpm lint` runs.
//
//   node scripts/export-lessons.mjs          write lessons/** and README TOCs
//   node scripts/export-lessons.mjs --check  exit 1 if anything is out of date

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { deliveredAsset, lessonDocument } from '../src/lib/lesson-markdown.mjs';

export const SITE_URL = 'https://ki-einfach-verstehen.de';
export const LANGS = ['de', 'en'];
const SEGMENT = {
	bausteine: { de: 'bausteine', en: 'lessons' },
	themenbereich: { de: 'themenbereich', en: 'topic' },
	glossar: { de: 'glossar', en: 'glossary' },
};
const README = { de: 'README.de.md', en: 'README.md' };
export const TOC_START = '<!-- lessons-toc:start -->';
export const TOC_END = '<!-- lessons-toc:end -->';
const CC_BY = {
	de: 'https://creativecommons.org/licenses/by/4.0/deed.de',
	en: 'https://creativecommons.org/licenses/by/4.0/deed.en',
};

const COPY = {
	de: {
		readingCopy: (title, url) =>
			`> Lesefassung für GitHub. Die vollständige Fassung mit interaktiven Demos, Animationen und Abrufmoment findest du auf der Website: **[${title}](${url})**`,
		license: (title, url) =>
			`> Lizenz: [CC BY 4.0](${CC_BY.de}) · Nenne die Quelle so: KI einfach verstehen, „${title}“, CC BY 4.0, ${url}`,
		next: 'Weiter',
		prev: 'Zurück',
		contents: 'Alle Bausteine',
		contentsAnchor: '#inhalt',
		website: 'Website',
		markdown: 'Markdown',
		planned: 'in Vorbereitung',
		glossary: (url) => `Alle Fachbegriffe kurz erklärt: **[Glossar](${url})**`,
	},
	en: {
		readingCopy: (title, url) =>
			`> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[${title}](${url})**`,
		license: (title, url) =>
			`> Licence: [CC BY 4.0](${CC_BY.en}) · Credit it as: KI einfach verstehen, “${title}”, CC BY 4.0, ${url}`,
		next: 'Next',
		prev: 'Previous',
		contents: 'All lessons',
		contentsAnchor: '#contents',
		website: 'Website',
		markdown: 'Markdown',
		planned: 'in preparation',
		glossary: (url) => `Every technical term in a sentence or two: **[Glossary](${url})**`,
	},
};

/** Frontmatter (parsed YAML) and body of a Markdown/MDX file. */
export function splitFrontmatter(source, file = '') {
	const match = /^---\n([\s\S]*?)\n---\n?/.exec(source);
	if (!match) throw new Error(`${file}: missing frontmatter`);
	return { data: parseYaml(match[1]) ?? {}, body: source.slice(match[0].length) };
}

function readCollection(contentRoot, collection, lang) {
	const dir = join(contentRoot, collection, lang);
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((f) => ['.md', '.mdx'].includes(extname(f)))
		.sort()
		.map((file) => {
			const path = join(dir, file);
			const { data, body } = splitFrontmatter(readFileSync(path, 'utf8'), path);
			return { slug: file.slice(0, -extname(file).length), file, data, body };
		});
}

/**
 * Roadmap per language: Themenbereiche in order, each with its planned
 * Bausteine joined to the published entry (same join as src/data/published.ts:
 * themenbereich key + order).
 */
export function loadCourse(websiteRoot) {
	const contentRoot = join(websiteRoot, 'src/content');
	const course = {};
	for (const lang of LANGS) {
		const entries = readCollection(contentRoot, 'bausteine', lang);
		const topics = readCollection(contentRoot, 'themenbereiche', lang)
			.map(({ data }) => data)
			.sort((a, b) => a.order - b.order)
			.map((tb) => ({
				key: tb.translationKey,
				title: tb.title,
				description: tb.description,
				href: `${SITE_URL}/${lang}/${SEGMENT.themenbereich[lang]}/${tb.routeSlug}/`,
				bausteine: [...tb.bausteine]
					.sort((a, b) => a.order - b.order)
					.map((planned) => {
						const entry = entries.find((e) => e.data.themenbereich === tb.translationKey && e.data.order === planned.order);
						if (!entry) return { title: planned.title, published: false };
						return {
							published: true,
							slug: entry.slug,
							file: entry.file,
							title: entry.data.title,
							description: entry.data.description,
							body: entry.body,
							href: `${SITE_URL}/${lang}/${SEGMENT.bausteine[lang]}/${entry.slug}/`,
						};
					}),
			}));
		course[lang] = topics;
	}
	return course;
}

const publishedOf = (topics) => topics.flatMap((tb) => tb.bausteine.filter((b) => b.published));

/** lessons/<lang>/<slug>.md contents, keyed by path relative to the website root. */
export function renderLessons(course, websiteRoot) {
	const inPublic = (p) => existsSync(join(websiteRoot, 'public', p));
	const files = new Map();
	for (const lang of LANGS) {
		const t = COPY[lang];
		const published = publishedOf(course[lang]);
		const slugs = new Set(published.map((b) => b.slug));
		const lessonPath = new RegExp(`^/${lang}/${SEGMENT.bausteine[lang]}/([a-z0-9-]+)/?(#.*)?$`);
		// Links to other lessons stay inside the repo; everything else points to the site.
		const linkHref = (p) => {
			const m = lessonPath.exec(p);
			if (m && slugs.has(m[1])) return `./${m[1]}.md${m[2] ?? ''}`;
			const [pathname, hash = ''] = p.split('#');
			const isPage = !/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('/');
			return `${SITE_URL}${pathname}${isPage ? '/' : ''}${hash ? `#${hash}` : ''}`;
		};
		published.forEach((b, i) => {
			const header = [t.readingCopy(b.title, b.href), '>', t.license(b.title, b.href)].join('\n');
			const doc = lessonDocument(b, {
				lang,
				siteUrl: SITE_URL,
				pageUrl: b.href,
				header,
				imageSrc: (p) => `../../public${deliveredAsset(p, inPublic)}`,
				linkHref,
			});
			const prev = published[i - 1];
			const next = published[i + 1];
			const nav = [
				prev ? `← ${t.prev}: [${prev.title}](./${prev.slug}.md)` : null,
				`[${t.contents}](../../${README[lang]}${t.contentsAnchor})`,
				next ? `${t.next}: [${next.title}](./${next.slug}.md) →` : null,
			]
				.filter(Boolean)
				.join(' · ');
			const source = `src/content/bausteine/${lang}/${b.file}`;
			const banner = `<!-- Generated from ${source} by scripts/export-lessons.mjs -- do not edit by hand. -->\n\n`;
			files.set(`lessons/${lang}/${b.slug}.md`, `${banner}${doc}\n${nav}\n`);
		});
	}
	return files;
}

/** Markdown table of contents for one language (goes between the README markers). */
export function renderToc(course, lang) {
	const t = COPY[lang];
	const lines = [];
	course[lang].forEach((tb, i) => {
		lines.push(`### ${i + 1}. [${tb.title}](${tb.href})`, '', tb.description, '');
		tb.bausteine.forEach((b, j) => {
			lines.push(
				b.published
					? `${j + 1}. **${b.title}**  \n   ${b.description}  \n   [${t.website}](${b.href}) · [${t.markdown}](lessons/${lang}/${b.slug}.md)`
					: `${j + 1}. ${b.title} *(${t.planned})*`,
			);
		});
		lines.push('');
	});
	lines.push(t.glossary(`${SITE_URL}/${lang}/${SEGMENT.glossar[lang]}/`));
	return lines.join('\n');
}

/** README text with the generated TOC between the markers. */
export function withToc(readme, toc, file = 'README') {
	const start = readme.indexOf(TOC_START);
	const end = readme.indexOf(TOC_END);
	if (start < 0 || end < start) throw new Error(`${file}: missing ${TOC_START} … ${TOC_END} markers`);
	return `${readme.slice(0, start + TOC_START.length)}\n${toc}\n${readme.slice(end)}`;
}

/** Every generated file (path relative to the website root → expected content). */
export function expectedFiles(websiteRoot) {
	const course = loadCourse(websiteRoot);
	const files = renderLessons(course, websiteRoot);
	for (const lang of LANGS) {
		const path = join(websiteRoot, README[lang]);
		files.set(README[lang], withToc(readFileSync(path, 'utf8'), renderToc(course, lang), README[lang]));
	}
	return files;
}

function staleLessonFiles(websiteRoot, expected) {
	const stale = [];
	for (const lang of LANGS) {
		const dir = join(websiteRoot, 'lessons', lang);
		if (!existsSync(dir)) continue;
		for (const f of readdirSync(dir)) {
			const rel = `lessons/${lang}/${f}`;
			if (!expected.has(rel)) stale.push(rel);
		}
	}
	return stale;
}

function main() {
	const websiteRoot = fileURLToPath(new URL('..', import.meta.url));
	const check = process.argv.includes('--check');
	const expected = expectedFiles(websiteRoot);
	const stale = staleLessonFiles(websiteRoot, expected);

	if (check) {
		const outdated = [...expected]
			.filter(([rel, content]) => {
				const path = join(websiteRoot, rel);
				return !existsSync(path) || readFileSync(path, 'utf8') !== content;
			})
			.map(([rel]) => rel);
		const problems = [...outdated, ...stale.map((s) => `${s} (no longer generated)`)];
		if (problems.length) {
			console.error('Generated lesson files are out of date:');
			for (const p of problems) console.error(`  ${p}`);
			console.error('Run `pnpm --filter @ki-einfach-verstehen/website gen:lessons` and commit the result.');
			process.exit(1);
		}
		console.log(`Lesson exports up to date (${expected.size} files).`);
		return;
	}

	for (const rel of stale) rmSync(join(websiteRoot, rel));
	for (const [rel, content] of expected) {
		const path = join(websiteRoot, rel);
		mkdirSync(join(path, '..'), { recursive: true });
		writeFileSync(path, content);
	}
	console.log(`Wrote ${expected.size} files${stale.length ? `, removed ${stale.length} stale` : ''} (${relative(process.cwd(), websiteRoot) || '.'}).`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
