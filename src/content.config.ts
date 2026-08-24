import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One entry per language variant, e.g. `de/programm-algorithmus-modell.md` and
// `en/program-algorithm-model.md`. `translationKey` links the two variants of
// the same Baustein across languages (their slugs differ per language, see
// CONTEXT.md "Baustein"); `themenbereich` uses the same language-independent
// key so both variants point at the same Themenbereich once that collection
// exists.
// `quellen`: structured source list backing the Baustein's factual/empirical
// claims (docs/content-plan/prinzipien.md, "Quellen-Pflicht"). Optional at
// the schema level -- not every Baustein makes claims that need external
// sourcing -- but enforced where it matters by the content pipeline's
// Claim->Evidence structural chain (packages/content-pipeline/src/content_pipeline/models/sources.py,
// docs/content-pipeline/gates-migration.md #82), which replaced the former
// local pre-commit fact-check gates, not here, so a missing/incomplete list
// fails a pipeline run, not the Astro build.
const quellenEntry = z.object({
	claim: z.string(),
	url: z.string().url(),
	geprueft: z.string().date(),
	abschnitt: z.string().optional(),
});

// `quiz`: structured retrieval-quiz questions (docs/content-plan/prinzipien.md,
// Prinzip 6 "Retrieval statt reiner Zusammenfassung", and ADR-0004). Replaces
// a prose "Kurz zum Selbst-Testen" block at the end of a Baustein -- the
// questions render as an actual interactive quiz, not flowing text.
// `richtig` is the zero-based index into `optionen`.
const quizFrage = z.object({
	id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	frage: z.string(),
	optionen: z.array(z.string()).min(2),
	richtig: z.number().int().min(0),
	erklaerung: z.string().optional(),
}).superRefine((frage, ctx) => {
	if (frage.richtig >= frage.optionen.length) {
		ctx.addIssue({
			code: 'custom',
			path: ['richtig'],
			message: 'Correct-answer index must refer to an existing option.',
		});
	}
});

// Accepts both `.md` and `.mdx` -- additive widening for the planned MDX
// migration (Bausteine need to embed real components for motion/interactive
// graphics, see docs/content-plan/grafiken.md). Existing all-`.md` content
// keeps working unchanged; `.mdx` files start being picked up once
// @astrojs/mdx is added and individual Bausteine are converted, one at a
// time, deliberately -- not in this change.
const bausteine = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bausteine' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		themenbereich: z.string(),
		order: z.number().int().positive(),
		translationKey: z.string(),
		videoId: z.string().optional(),
		quellen: z.array(quellenEntry).optional().default([]),
		quiz: z.array(quizFrage).optional().default([]),
	}),
});

// Glossareintrag content lives here, not in packages/content, because the
// public mirror only ever carries packages/website/ (see ADR-0009).
const glossar = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/glossar' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		translationKey: z.string(),
	}),
});

// One localized entry per Themenbereich. The language-independent
// `translationKey` joins both variants and is also the value Bausteine use in
// their `themenbereich` field. Planned lesson titles live here so the complete
// roadmap has one editorial source even before every lesson is published.
const themenbereiche = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/themenbereiche' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		translationKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		routeSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
		order: z.number().int().positive(),
		bausteine: z.array(z.object({
			order: z.number().int().positive(),
			title: z.string(),
			// Reserved for a not-yet-written Baustein: the permanent slug it will
			// publish under (ADR-0002 -- Baustein URLs are a stable commitment
			// from first appearance, not just from first publish), so the
			// "in Vorbereitung" state can already link to a real stub page
			// instead of being inert text. Omitted for already-published
			// Bausteine, whose slug lives in the content-collection filename.
			slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
		})).min(1),
	}),
});

export const collections = { bausteine, glossar, themenbereiche };
