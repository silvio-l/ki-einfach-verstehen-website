// Standalone interactive explainers ("Explorables"): one guided, hands-on
// page per idea, EN-first with a DE counterpart. Listed on /en/explore/ and
// /de/entdecken/; each page renders its own component.
export interface ExplorableMeta {
	key: string;
	og: { en: string; de: string };
	en: { href: string; title: string; pageTitle: string; description: string; ogAlt: string; teaches: string[] };
	de: { href: string; title: string; pageTitle: string; description: string; ogAlt: string; teaches: string[] };
}

export const EXPLORABLES: ExplorableMeta[] = [
	{
		key: 'strawberry',
		og: { en: '/explore/og-strawberry-en.png', de: '/explore/og-strawberry-de.png' },
		en: {
			href: '/en/explore/strawberry/',
			title: 'How many r’s are in “strawberry”?',
			pageTitle: 'How many r’s in “strawberry”? What a language model sees',
			description:
				'An interactive explainer: see the real GPT-4o tokenizer turn “strawberry” into numbers, try your own text, and find out why letter counting has been so hard for language models.',
			ogAlt: 'The word strawberry split into the tokens st, raw and berry with their token IDs 302, 1618 and 19772',
			teaches: ['tokenizer', 'token', 'token ID', 'vocabulary', 'byte pair encoding'],
		},
		de: {
			href: '/de/entdecken/strawberry/',
			title: 'Wie viele r stecken in „strawberry“?',
			pageTitle: 'Wie viele r hat „strawberry“? Was ein Sprachmodell sieht',
			description:
				'Sieh zu, wie der echte Tokenizer von GPT-4o „strawberry“ in Zahlen verwandelt, und finde heraus, warum Sprachmodelle beim Buchstabenzählen stolperten.',
			ogAlt: 'Das Wort strawberry, zerlegt in die Tokens st, raw und berry mit den Token-IDs 302, 1618 und 19772',
			teaches: ['Tokenizer', 'Token', 'Token-ID', 'Vokabular', 'Byte Pair Encoding'],
		},
	},
];
