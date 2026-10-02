// /community-manifest.json -- the Baustein manifest the community board
// syncs every 15 minutes (docs/community/spec.md §7.1/§7.2, ADR-0022).
// Built from the content collections at build time; the forum validates it
// strictly, and src/lib/community-manifest.js fails the build on anything
// the forum would reject.
import type { APIRoute } from 'astro';
import { getCommunityManifest } from '../lib/community-content';

export const GET: APIRoute = async () =>
	new Response(JSON.stringify(await getCommunityManifest(), null, 2), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
