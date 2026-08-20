// Roadmap metadata for the three confirmed Themenbereiche, sourced from
// docs/content-plan/{grundlagen,weg-durchs-modell,wie-lernen-funktioniert}.md
// ("abgestimmt" status — titles/order are decided, not placeholders). Actual
// published Bausteine still come from the `bausteine` content collection;
// this file only supplies the roadmap titles for Bausteine not yet written,
// so the overview can show the full confirmed scope without inventing
// content.

export interface ThemenbereichBaustein {
	order: number;
	title: { de: string; en: string };
}

export interface Themenbereich {
	slug: string;
	title: { de: string; en: string };
	description: { de: string; en: string };
	bausteine: ThemenbereichBaustein[];
}

export const themenbereiche: Themenbereich[] = [
	{
		slug: 'grundlagen',
		title: { de: 'Grundlagen', en: 'Foundations' },
		description: {
			de: 'Die Begriffe, auf denen alles andere aufbaut — du klärst den Unterschied zwischen Programm und Modell und lernst, was hinter Wahrscheinlichkeiten, Vektoren und der Hardware steckt.',
			en: "The concepts everything else builds on — you'll sort out the difference between a program and a model, and learn what's behind probabilities, vectors, and the hardware underneath.",
		},
		bausteine: [
			{ order: 1, title: { de: 'Programm, Algorithmus, Modell — was ist der Unterschied?', en: 'Program, Algorithm, Model — What’s the Difference?' } },
			{ order: 2, title: { de: 'Input und Output: Wie eine Funktion „denkt"', en: 'Input and Output: How a Function "Thinks"' } },
			{ order: 3, title: { de: 'Wie Sprache zu Zahlen wird: Tokenizer, IDs, Vokabular', en: 'How Language Becomes Numbers: Tokenizer, IDs, Vocabulary' } },
			{ order: 4, title: { de: 'Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen', en: 'Scalar, Vector, Matrix, Tensor: The Building Blocks of the Numbers' } },
			{ order: 5, title: { de: 'Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet', en: 'Probability and Softmax: How a Model Decides' } },
			{ order: 6, title: { de: 'Parameter, Training vs. Inferenz, Hardware: Wie ein Modell läuft', en: 'Parameters, Training vs. Inference, Hardware: How a Model Runs' } },
		],
	},
	{
		slug: 'weg-durchs-modell',
		title: { de: 'Der Weg durchs Modell', en: 'Inside the Model' },
		description: {
			de: 'Ein Prompt geht hinein, ein Token kommt heraus — du folgst Schritt für Schritt allem, was dazwischen passiert.',
			en: 'A prompt goes in, a token comes out — you follow everything that happens in between, step by step.',
		},
		bausteine: [
			{ order: 1, title: { de: 'Was ein KI-Modell eigentlich ist', en: 'What an AI Model Actually Is' } },
			{ order: 2, title: { de: 'Tokenisierung im Modell: Sequenzen, Spezialtokens, Kontextfenster', en: 'Tokenization Inside the Model: Sequences, Special Tokens, Context Window' } },
			{ order: 3, title: { de: 'Embeddings: Wie aus einer Nummer ein bedeutungsvoller Vektor wird', en: 'Embeddings: How a Number Becomes a Meaningful Vector' } },
			{ order: 4, title: { de: 'Transformerblöcke und Attention: Wie Kontext eingemischt wird', en: 'Transformer Blocks and Attention: How Context Gets Mixed In' } },
			{ order: 5, title: { de: 'Output Head: Vom letzten Zustand zur Vorhersage', en: 'Output Head: From the Last State to a Prediction' } },
		],
	},
	{
		slug: 'wie-lernen-funktioniert',
		title: { de: 'Wie Lernen funktioniert', en: 'How Learning Works' },
		description: {
			de: 'Warum ein Modell besser wird: Du siehst, wie Loss, Backpropagation und Gradienten zusammenspielen — und wer die Gewichte eigentlich ändert.',
			en: "Why a model gets better: you'll see how loss, backpropagation, and gradients work together — and what actually changes the weights.",
		},
		bausteine: [
			{ order: 1, title: { de: 'Aus Text werden viele Übungsaufgaben', en: 'Text Becomes Many Practice Problems' } },
			{ order: 2, title: { de: 'Forward Pass und Loss: Wie das Modell seinen eigenen Fehler misst', en: 'Forward Pass and Loss: How the Model Measures Its Own Error' } },
			{ order: 3, title: { de: 'Backpropagation und Gradienten: Wie das Modell weiß, was es ändern muss', en: 'Backpropagation and Gradients: How the Model Knows What to Change' } },
			{ order: 4, title: { de: 'Optimierung: Wer die Gewichte tatsächlich ändert', en: 'Optimization: What Actually Changes the Weights' } },
			{ order: 5, title: { de: 'Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst', en: 'Batch, Epoch, Step, Token Budget: How to Measure Training Progress' } },
		],
	},
];
