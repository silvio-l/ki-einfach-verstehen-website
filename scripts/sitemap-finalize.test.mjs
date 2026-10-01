import { test } from 'node:test';
import assert from 'node:assert/strict';
import { finalizeSitemap, readPageInfo } from './sitemap-finalize.mjs';

const urlset = (entries) =>
	`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries
		.map((u) => `<url><loc>${u}</loc></url>`)
		.join('')}</urlset>`;

test('readPageInfo: noindex meta and hreflang links from the head only', () => {
	const html = `<html><head><meta name="robots" content="noindex, follow" />
<link rel="alternate" hreflang="de" href="https://x.de/de/a/" />
<link rel="alternate" hreflang="x-default" href="https://x.de/de/a/" />
</head><body><link rel="alternate" hreflang="en" href="https://x.de/en/b/" /></body></html>`;
	assert.deepEqual(readPageInfo(html), {
		noindex: true,
		alternates: [
			{ hreflang: 'de', href: 'https://x.de/de/a/' },
			{ hreflang: 'x-default', href: 'https://x.de/de/a/' },
		],
	});
	assert.equal(readPageInfo('<html><head></head></html>').noindex, false);
});

test('finalizeSitemap: drops noindex URLs, keeps the rest, injects alternates', () => {
	const xml = urlset(['https://x.de/de/', 'https://x.de/de/bausteine/stub/', 'https://x.de/en/']);
	const info = {
		'https://x.de/de/': { noindex: false, alternates: [{ hreflang: 'de', href: 'https://x.de/de/' }, { hreflang: 'en', href: 'https://x.de/en/' }] },
		'https://x.de/de/bausteine/stub/': { noindex: true, alternates: [] },
	};
	const { xml: out, kept, dropped } = finalizeSitemap(xml, (loc) => info[loc]);
	assert.equal(kept, 2);
	assert.deepEqual(dropped, ['https://x.de/de/bausteine/stub/']);
	assert.ok(!out.includes('/stub/'));
	assert.ok(out.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
	assert.ok(
		out.includes(
			'<url><loc>https://x.de/de/</loc><xhtml:link rel="alternate" hreflang="de" href="https://x.de/de/"/><xhtml:link rel="alternate" hreflang="en" href="https://x.de/en/"/></url>',
		),
	);
	// Unknown page (no HTML on disk): entry passes through untouched.
	assert.ok(out.includes('<url><loc>https://x.de/en/</loc></url>'));
});

test('finalizeSitemap: no alternates means no xhtml namespace is added', () => {
	const { xml: out } = finalizeSitemap(urlset(['https://x.de/de/']), () => ({ noindex: false, alternates: [] }));
	assert.ok(!out.includes('xmlns:xhtml'));
});
