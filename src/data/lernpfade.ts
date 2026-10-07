// Curated Lernpfade (ADR-0002, CONTEXT.md "Lernpfad"): an ordered walk
// through Bausteine that already exist on their own. Pure navigation layer --
// a path owns its title, framing and ordering, never lesson content. Adding a
// path = adding one entry to LERNPFADE; pages, nav, Baustein hints and the
// Lernnachweis pick it up automatically.
//
// Steps reference Bausteine by translationKey (language-independent, also
// the localStorage progress key). Resolution fails the build if a step is not
// published in a language: a Lernpfad must never point at missing content.
//
// `goal` per step is the learning goal shown on the path page and on the
// Lernnachweis. It is condensed from that Baustein's own description and
// section structure -- keep it in sync when a Baustein is substantially
// rewritten, and never promise more than the Baustein actually covers.
import { getPublished, readingMinutes } from './published';

type Lang = 'de' | 'en';
type Localized<T = string> = Record<Lang, T>;

export const LERNPFAD_ROUTE_SEGMENT = { de: 'lernpfad', en: 'learning-path' } as const;
export const LERNNACHWEIS_SEGMENT = { de: 'lernnachweis', en: 'learning-record' } as const;

interface LernpfadDefinition {
	/** Language-independent key, used for events and fire-once bookkeeping. */
	key: string;
	slug: Localized;
	title: Localized;
	description: Localized;
	/** Who the path is written for (one sentence). */
	audience: Localized;
	/** Honest scope limits: what someone should NOT expect from this path. */
	notCovered: Localized<string[]>;
	steps: { tk: string; goal: Localized }[];
}

const LERNPFADE: LernpfadDefinition[] = [
	{
		key: 'ki-grundkompetenz',
		slug: { de: 'ki-grundkompetenz', en: 'ai-literacy-basics' },
		title: { de: 'KI-Grundkompetenz', en: 'AI literacy basics' },
		description: {
			de: 'Der Einstieg in die technischen Grundlagen: woraus ein KI-Modell besteht, wie Sprache zu Zahlen wird und warum Training teurer ist als Benutzen.',
			en: 'The way into the technical foundations: what an AI model is made of, how language becomes numbers, and why training costs more than using it.',
		},
		audience: {
			de: 'Für alle, die KI im Beruf oder Alltag nutzen und verstehen wollen, was dabei technisch passiert. Vorwissen brauchst du keines.',
			en: 'For anyone who uses AI at work or in everyday life and wants to understand what happens technically. No prior knowledge needed.',
		},
		notCovered: {
			de: [
				'Rechtsfragen, etwa Pflichten aus der KI-Verordnung, Datenschutz oder Urheberrecht',
				'Risiken und Grenzen bestimmter KI-Systeme in deinem Arbeitsumfeld',
				'die Bedienung konkreter Werkzeuge und das Formulieren von Prompts',
			],
			en: [
				'legal questions such as obligations under the EU AI Act, data protection, or copyright',
				'risks and limits of specific AI systems in your own work context',
				'how to operate particular tools or write prompts',
			],
		},
		steps: [
			{
				tk: 'programm-algorithmus-modell',
				goal: {
					de: 'Programm, Algorithmus und KI-Modell unterscheiden und erklären, warum ein Modell nicht aus aufgeschriebenen Regeln besteht, sondern aus Zahlen, die beim Training eingestellt werden.',
					en: 'Tell program, algorithm and AI model apart, and explain why a model is not made of written-down rules but of numbers that are set during training.',
				},
			},
			{
				tk: 'input-und-output',
				goal: {
					de: 'Beschreiben, was ein KI-Modell als Input bekommt, warum sein Output meist eine Liste von Bewertungen ist und wie daraus Stück für Stück eine Antwort entsteht.',
					en: 'Describe what an AI model receives as input, why its output is usually a list of ratings, and how an answer is built from it piece by piece.',
				},
			},
			{
				tk: 'tokenizer-ids-vokabular',
				goal: {
					de: 'Erklären, wie ein Tokenizer Text in wiederverwendbare Stücke zerlegt, sie über ein festes Vokabular nummeriert und so den Zahlen-Input eines Sprachmodells erzeugt.',
					en: 'Explain how a tokenizer splits text into reusable pieces, numbers them through a fixed vocabulary, and so produces the numerical input of a language model.',
				},
			},
			{
				tk: 'skalar-vektor-matrix-tensor',
				goal: {
					de: 'Skalar, Vektor, Matrix und Tensor einordnen und erklären, warum eine Chatnachricht oder ein Foto für ein Modell ein Zahlenblock ist.',
					en: 'Place scalar, vector, matrix and tensor, and explain why a chat message or a photo is a block of numbers to a model.',
				},
			},
			{
				tk: 'wahrscheinlichkeit-und-softmax',
				goal: {
					de: 'Erklären, wie ein Sprachmodell aus Scores Wahrscheinlichkeiten macht, warum es nicht immer das Naheliegende wählt und was die Temperatur daran ändert.',
					en: 'Explain how a language model turns scores into probabilities, why it does not always pick the obvious option, and what temperature changes about that.',
				},
			},
			{
				tk: 'parameter-training-inferenz-hardware',
				goal: {
					de: 'Beschreiben, was in einem fertigen Modell steckt, was vor dem Training festgelegt wird, warum Training teurer ist als Inferenz und welche Hardware ein Modell braucht.',
					en: 'Describe what is inside a finished model, what is fixed before training, why training costs more than inference, and what hardware a model needs.',
				},
			},
		],
	},
];

export interface LernpfadStep {
	/** 1-based position in the path. */
	position: number;
	tk: string;
	title: string;
	description: string;
	href: string;
	minutes: number;
	questionIds: string[];
	goal: string;
}

export interface Lernpfad {
	key: string;
	slug: string;
	title: string;
	description: string;
	audience: string;
	notCovered: string[];
	href: string;
	nachweisHref: string;
	/** Same path in the other language (a real translation, same key). */
	otherLangHref: string;
	otherLangNachweisHref: string;
	steps: LernpfadStep[];
	/** Sum of the steps' derived reading times (readingMinutes, 200 words/min). */
	totalMinutes: number;
	questionCount: number;
}

const otherOf = (lang: Lang): Lang => (lang === 'de' ? 'en' : 'de');

export function getLernpfadIndexHref(lang: Lang): string {
	return `/${lang}/${LERNPFAD_ROUTE_SEGMENT[lang]}/`;
}

const pathHref = (def: LernpfadDefinition, lang: Lang) => `/${lang}/${LERNPFAD_ROUTE_SEGMENT[lang]}/${def.slug[lang]}/`;

export async function getLernpfade(lang: Lang): Promise<Lernpfad[]> {
	const published = await getPublished(lang);
	const other = otherOf(lang);
	return LERNPFADE.map((def) => {
		const steps = def.steps.map((step, i) => {
			const baustein = published.find((p) => p.tk === step.tk);
			if (!baustein) {
				throw new Error(`Lernpfad "${def.key}": step "${step.tk}" is not a published Baustein in "${lang}".`);
			}
			return {
				position: i + 1,
				tk: step.tk,
				title: baustein.title,
				description: baustein.description,
				href: baustein.href,
				minutes: readingMinutes(baustein.body),
				questionIds: baustein.quiz.map((q) => q.id),
				goal: step.goal[lang],
			};
		});
		const href = pathHref(def, lang);
		const otherHref = pathHref(def, other);
		return {
			key: def.key,
			slug: def.slug[lang],
			title: def.title[lang],
			description: def.description[lang],
			audience: def.audience[lang],
			notCovered: def.notCovered[lang],
			href,
			nachweisHref: `${href}${LERNNACHWEIS_SEGMENT[lang]}/`,
			otherLangHref: otherHref,
			otherLangNachweisHref: `${otherHref}${LERNNACHWEIS_SEGMENT[other]}/`,
			steps,
			totalMinutes: steps.reduce((n, s) => n + s.minutes, 0),
			questionCount: steps.reduce((n, s) => n + s.questionIds.length, 0),
		};
	});
}

/** Every Lernpfad a Baustein belongs to, with its step -- for the hint on Baustein pages. */
export async function getLernpfadeForBaustein(lang: Lang, tk: string): Promise<{ path: Lernpfad; step: LernpfadStep }[]> {
	const paths = await getLernpfade(lang);
	return paths.flatMap((path) => {
		const step = path.steps.find((s) => s.tk === tk);
		return step ? [{ path, step }] : [];
	});
}
