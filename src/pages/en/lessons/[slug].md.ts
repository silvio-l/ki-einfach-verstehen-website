// English counterpart of ../../de/bausteine/[slug].md.ts -- see that file
// for the rationale. Route segment is `lessons`, matching
// ContentEntryLayout.astro's ROUTE_SEGMENTS mapping for the `en` locale.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { bausteinToMarkdown } from '../../../lib/baustein-markdown';

export const getStaticPaths = (async () => {
	const entries = await getCollection('bausteine', (entry) => entry.id.startsWith('en/'));
	return entries.map((entry) => ({
		params: { slug: entry.id.slice('en/'.length) },
		props: { entry },
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site, params }) => {
	const { entry } = props as { entry: CollectionEntry<'bausteine'> };
	const siteUrl = site ? site.href.replace(/\/$/, '') : '';
	const pageUrl = `${siteUrl}/en/lessons/${params.slug}/`;
	const markdown = bausteinToMarkdown(entry, { lang: 'en', siteUrl, pageUrl });
	return new Response(markdown, {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
};
