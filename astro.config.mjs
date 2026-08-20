// @ts-check
import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Lets Bausteine embed real Astro components (motion/interactive
  // graphics, docs/content-plan/grafiken.md "Technischer Weg") -- the
  // bausteine collection already globs **/*.{md,mdx}, this is what
  // actually makes .mdx files renderable. Existing .md content is
  // unaffected.
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
