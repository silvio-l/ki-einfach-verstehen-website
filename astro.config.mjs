// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

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
    sitemap({ filter: (page) => page !== 'https://ki-einfach-verstehen.de/' }),
  ],
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
