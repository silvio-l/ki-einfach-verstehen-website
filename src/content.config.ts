import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One entry per language variant, e.g. `de/programm-algorithmus-modell.md` and
// `en/program-algorithm-model.md`. `translationKey` links the two variants of
// the same Baustein across languages (their slugs differ per language, see
// CONTEXT.md "Baustein"); `themenbereich` uses the same language-independent
// key so both variants point at the same Themenbereich once that collection
// exists.
const bausteine = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/bausteine' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		themenbereich: z.string(),
		order: z.number().int().positive(),
		translationKey: z.string(),
		videoId: z.string().optional(),
	}),
});

export const collections = { bausteine };
