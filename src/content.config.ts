import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

// One entry per language variant, e.g. `de/programm-algorithmus-modell.md` and
// `en/program-algorithm-model.md`. `translationKey` links the two variants of
// the same Baustein across languages (their slugs differ per language, see
// CONTEXT.md "Baustein"); `themenbereich` uses the same language-independent
// key so both variants point at the same Themenbereich once that collection
// exists.
// `quellen`: structured source list backing the Baustein's factual/empirical
// claims (docs/content-plan/prinzipien.md, "Quellen-Pflicht"). Optional at
// the schema level -- not every Baustein makes claims that need external
// sourcing -- but enforced where it matters by scripts/lint-baustein.mjs
// (required fields, no question-style claims, optional reachability check)
// and the source-fidelity review in docs/content-plan/qualitaetspruefung.md,
// not here, so a missing/incomplete list fails the content lint, not the
// Astro build.
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
		// Date of the last substantive revision, set by hand (never for typo
		// fixes). Published in /community-manifest.json so the forum can flag
		// questions asked before the Baustein changed (ADR-0022, spec §7.2).
		ueberarbeitet: z.coerce.date().optional(),
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

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

// Bausteine that no longer exist (ADR-0022, spec §7.1/§7.4). One JSON object
// keyed by the retired translationKey:
//   { "<key>": { "retiredOn": "2026-09-30", "successors": ["<key>"],
//                "oldSlugs": { "de": ["<slug>"], "en": ["<slug>"] } } }
// Feeds the manifest (status "retired" + successors, so the forum can move
// the threads) and the redirect stubs (every old slug forwards to the first
// successor). Successor keys must be published Bausteine -- checked by
// src/lib/community-manifest.js, which fails the build otherwise.
const retiredBausteine = defineCollection({
	loader: file('./src/content/community/retired-bausteine.json'),
	schema: z.object({
		retiredOn: z.coerce.date(),
		successors: z.array(slug).default([]),
		oldSlugs: z
			.object({ de: z.array(slug).default([]), en: z.array(slug).default([]) })
			.default({ de: [], en: [] }),
	}),
});

// Moved pages (spec §7.4): old path → new path, keyed by the old path:
//   { "/de/bausteine/alter-slug/": { "to": "/de/bausteine/neuer-slug/" } }
// Each entry becomes a static redirect stub (src/pages/[...redirect].astro).
// The target must be a real page and the source must not be one -- checked
// by src/lib/community-redirects.js, which fails the build otherwise.
const redirects = defineCollection({
	loader: file('./src/content/community/redirects.json'),
	schema: z.object({ to: z.string() }),
});

export const collections = { bausteine, glossar, themenbereiche, 'retired-bausteine': retiredBausteine, redirects };
