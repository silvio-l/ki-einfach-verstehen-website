// /community-redirects.json -- build artifact listing every redirect stub
// (from → to, site-relative) for a later Cloudflare Bulk Redirects sync
// (docs/community/spec.md §7.4, "real 301s"). No API call happens here; a
// sync script reads this file from dist/.
import type { APIRoute } from 'astro';
import { getCommunityRedirects } from '../lib/community-content';

export const GET: APIRoute = async () =>
	new Response(JSON.stringify(await getCommunityRedirects(), null, 2), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
