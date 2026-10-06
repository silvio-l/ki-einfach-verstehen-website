// Clean, standalone Markdown for a Baustein -- the target of the "copy/save
// as Markdown" actions (BausteinActions.astro) and the `[slug].md`
// endpoints. The conversion rules live in lesson-markdown.mjs, shared with
// scripts/export-lessons.mjs (the lessons/** copies in the public repo).
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { CollectionEntry } from 'astro:content';
import { deliveredAsset, lessonDocument } from './lesson-markdown.mjs';

const publicDir = path.resolve('public');
const inPublic = (p: string) => existsSync(path.join(publicDir, p));

export function bausteinToMarkdown(
	entry: CollectionEntry<'bausteine'>,
	opts: { lang: 'de' | 'en'; siteUrl: string; pageUrl: string },
): string {
	return lessonDocument(
		{ title: entry.data.title, description: entry.data.description, body: entry.body ?? '' },
		{ ...opts, imageSrc: (p) => `${opts.siteUrl}${deliveredAsset(p, inPublic)}` },
	);
}
