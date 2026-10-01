// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeContentImages from './scripts/rehype-content-images.mjs';

// https://astro.build/config
export default defineConfig({
  // Custom domain served via the GitHub Pages mirror (see
  // .github/workflows/mirror-website.yml + public/CNAME) -- required for
  // correct canonical/hreflang URLs.
  site: 'https://ki-einfach-verstehen.de',
  // Lets Bausteine embed real Astro components (motion/interactive
  // graphics, docs/content-plan/grafiken.md "Technischer Weg") -- the
  // bausteine collection already globs **/*.{md,mdx}, this is what
  // actually makes .mdx files renderable. Existing .md content is
  // unaffected.
  integrations: [
    mdx(),
    // Exclude the bare root ("/") -- it's a noindex redirect stub to /de/,
    // not an indexable canonical page, and shouldn't ship in the sitemap.
    // The other noindex pages (planned-Baustein stubs) are pruned after the
    // build by scripts/sitemap-finalize.mjs, which also adds hreflang
    // alternates -- see `pnpm build`.
    sitemap({ filter: (page) => page !== 'https://ki-einfach-verstehen.de/' }),
  ],
  // Content images: lazy loading + PNG -> WebP delivery (scripts/rehype-content-images.mjs).
  markdown: { rehypePlugins: [rehypeContentImages] },
  build: {
    // GitHub Pages caps Cache-Control at max-age=600, so a separate
    // stylesheet buys almost no caching but costs one render-blocking round
    // trip before first paint (Lighthouse: ~450 ms on slow 4G). Inlining the
    // ~18 KB (gzipped ~5 KB) into every page removes that hop.
    inlineStylesheets: 'always',
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
