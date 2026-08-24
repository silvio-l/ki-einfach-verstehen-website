// Serves the clean-Markdown version of a Baustein at `/de/bausteine/<slug>.md`
// -- the target for the "copy as Markdown" / "save as Markdown" actions in
// BausteinActions.astro. Static output (this site builds fully static, see
// astro.config.mjs), so this prerenders to a real .md file per Baustein.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { bausteinToMarkdown } from '../../../lib/baustein-markdown';

export const getStaticPaths = (async () => {
	const entries = await getCollection('bausteine', (entry) => entry.id.startsWith('de/'));
	return entries.map((entry) => ({
		params: { slug: entry.id.slice('de/'.length) },
		props: { entry },
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site, params }) => {
	const { entry } = props as { entry: CollectionEntry<'bausteine'> };
	const siteUrl = site ? site.href.replace(/\/$/, '') : '';
	const pageUrl = `${siteUrl}/de/bausteine/${params.slug}/`;
	const markdown = bausteinToMarkdown(entry, { lang: 'de', siteUrl, pageUrl });
	return new Response(markdown, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
