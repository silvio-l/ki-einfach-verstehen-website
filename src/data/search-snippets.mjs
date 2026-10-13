// Shorter title and description for search results, where a Baustein's,
// glossary entry's or learning path's own text is too long for one
// (scripts/check-search-snippets.mjs: title up to 65 characters including
// the brand suffix, description 70 to 160). Only <title>, meta description
// and the social preview use them; the page itself keeps its full title and
// lede, and so does the book.
// They live here, not in the frontmatter, because every edit of a Baustein
// or glossary file invalidates its review report (sha256,
// scripts/check-review-reports.mjs) -- a snippet is a condensed form of the
// reviewed text and adds no claim of its own.
// Key: `<collection>/<entry id>`, e.g. `bausteine/de/embeddings`.
// Plain JS (not .ts) so node --test can cover it without a build step.

/** @type {Record<string, { title?: string, description?: string }>} */
export const SEARCH_SNIPPETS = {
	'bausteine/de/aus-text-werden-uebungsaufgaben': {
		description: "Warum für das Training eines Sprachmodells niemand Lösungen aufschreibt, wie aus Texten Folgen fester Länge werden und welcher Text hineinkommt.",
	},
	'bausteine/de/backpropagation-und-gradienten': {
		title: "Backpropagation: Wie das Modell weiß, was es ändern muss",
		description: "Wie das Training aus einer Fehlerzahl für jeden Regler Richtung und Stärke ausrechnet, warum ein Rückweg genügt und dabei noch kein Regler bewegt wird.",
	},
	'bausteine/de/batch-epoch-step-tokenbudget': {
		title: "Batch, Epoch, Step, Tokenbudget: Trainingsfortschritt messen",
		description: "Wie man Training in Schritten und Tokens zählt, warum GPT-3 manche Quellen nicht einmal halb, andere mehrfach sieht und woran ein Prüftext echtes Lernen zeigt.",
	},
	'bausteine/de/embeddings': {
		description: "Warum eine Token-ID nichts über Ähnlichkeit verrät, wie das Training ähnlich verwendeten Tokens ähnliche Steckbriefe gibt und was ein großes Vokabular kostet.",
	},
	'bausteine/de/forward-pass-und-loss': {
		description: "Wie aus den Prozenten eines Modells für das wirklich folgende Token Strafpunkte werden, wie ein Textstapel einen Mittelwert ergibt und was dieser nicht misst.",
	},
	'bausteine/de/modellgroesse-und-hardware': {
		description: "Wie viel Speicher ein KI-Modell braucht, warum zuerst der Platz entscheidet, wie Quantisierung Modelle verkleinert und warum Training mehr Speicher braucht.",
	},
	'bausteine/de/optimierung-der-gewichte': {
		description: "Wie der Optimierer aus der Backpropagation echte Schritte macht: mit Schwung, eigener Schrittweite je Regler, leisem Zug Richtung null und Lernraten-Plan.",
	},
	'bausteine/de/parameter-training-inferenz-hardware': {
		description: "Was in einer Modelldatei steckt, was Menschen vor dem Training festlegen, wie das Training die Regler bewegt und warum Lernen teurer ist als Benutzen.",
	},
	'bausteine/de/programm-algorithmus-modell': {
		description: "Programm, Algorithmus, Modell: Klassische Software folgt Regeln, die ein Mensch aufschreibt. Ein KI-Modell ist ein fester Rechenweg mit trainierten Zahlen.",
	},
	'bausteine/de/schichten': {
		description: "Wie viele Neuronen eine Schicht bilden, deren Ausgaben die nächste Schicht speisen, was die Untergrenze möglich macht und was „96 Schichten“ meint.",
	},
	'bausteine/de/token-ids-und-vokabular': {
		description: "Was eine Token-ID ist: eine Nummer, die nur im Vokabular ihres Tokenizers gilt. Warum jedes Modell zu seinem Tokenizer passt und die Nummer nichts verrät.",
	},
	'bausteine/de/trainingsdaten-urheberrecht-und-datenschutz': {
		description: "Wessen Texte in ein Training dürfen, wie ein Vorbehalt wirkt und was im Modell bleiben kann. Stand 12.10.2026, keine Rechtsberatung.",
	},
	'bausteine/de/versteht-ki-was-sie-sagt': {
		description: "Die Fachwelt ist uneins, ob Sprachmodelle verstehen. Was die Befunde zeigen, was nicht und warum eine flüssige Antwort weder dafür noch dagegen spricht.",
	},
	'bausteine/de/vom-chatbot-zum-agenten': {
		description: "Ein Modell schreibt nur Text. Wie daraus ein Agent wird, der in einer Schleife Werkzeuge nutzt, wer was tut und warum das Ende eines Laufs nichts beweist.",
	},
	'bausteine/de/vom-textfortsetzer-zum-assistenten': {
		title: "Vom Textfortsetzer zum Assistenten: Was Nachtraining bewirkt",
	},
	'bausteine/de/warum-ki-ueberzeugend-falsch-liegt': {
		title: "Warum KI überzeugend falsch liegt",
	},
	'bausteine/de/warum-vorhersagen-mehr-ist-als-nachplappern': {
		description: "Wie ein Modell, das nur das nächste Token vorhersagt, eine nie dagewesene Mail schreibt: warum dafür Regeln statt Kopien nötig sind und wo es auswendig lernt.",
	},
	'bausteine/de/was-ein-chatbot-im-gespraech-weiss': {
		title: "Was ein Chatbot in einem Gespräch weiß",
		description: "Woher Antworten im Chat kommen: aus trainierten Reglern, dem Kontextfenster, Werkzeugen oder Notizen. Davon hängt ab, wie verlässlich eine Antwort ist.",
	},
	'bausteine/de/wie-ein-modell-nachdenkt': {
		title: "Wie ein Modell „nachdenkt“: Zwischenschritte als Text",
	},
	'bausteine/en/backpropagation-and-gradients': {
		description: "How training turns a single error number into a direction and strength for every fader, why one pass backwards is enough, and why no fader moves yet.",
	},
	'bausteine/en/batch-epoch-step-token-budget': {
		title: "Batch, Epoch, Step, Token Budget: Measuring Training Progress",
		description: "How training is counted in steps and tokens, why GPT-3 sees some sources not even halfway and others several times, and how held-out text shows real learning.",
	},
	'bausteine/en/embeddings': {
		description: "Why a token ID says nothing about similarity, how training gives tokens used in similar ways similar profiles, and what a large vocabulary costs.",
	},
	'bausteine/en/forward-pass-and-loss': {
		description: "How a model’s percentages for the token that really follows become penalty points, how a stack of text averages into one number, and what it does not measure.",
	},
	'bausteine/en/from-chatbot-to-agent': {
		description: "A model only writes text. How it becomes an agent that uses tools in a loop, who does what, and why the end of a run says nothing about the result.",
	},
	'bausteine/en/from-text-predictor-to-assistant': {
		title: "From Text Predictor to Assistant: What Post-Training Does",
	},
	'bausteine/en/layers': {
		description: "How many neurons form a layer whose outputs feed the next one, what the lower limit makes possible, and what a figure like “96 layers” means.",
	},
	'bausteine/en/optimization-of-the-weights': {
		description: "How the optimizer turns backpropagation into real steps: with momentum, a step size for every fader, a gentle pull toward zero and a learning rate schedule.",
	},
	'bausteine/en/parameters-training-inference-hardware': {
		description: "What is inside a model file, what people decide before training, how training uses the error to move each fader, and why learning costs more than using.",
	},
	'bausteine/en/program-algorithm-model': {
		description: "Program, algorithm, model: classic software follows rules a person writes down. An AI model is a fixed calculation plus numbers set during training.",
	},
	'bausteine/en/token-ids-and-vocabulary': {
		description: "What a token ID is: a number that only means something in its tokenizer’s vocabulary. Why each model needs its own tokenizer and the number reveals nothing.",
	},
	'bausteine/en/tokenization-inside-the-model': {
		title: "Tokenization Inside the Model: How a Chat Becomes Tokens",
	},
	'bausteine/en/training-data-copyright-and-privacy': {
		description: "Which texts may be used for training, how a rights reservation works, and what may remain in the model. As of 12 Oct 2026; not legal advice.",
	},
	'bausteine/en/what-a-chatbot-knows-in-a-conversation': {
		title: "What a Chatbot Knows in a Conversation",
		description: "Where a chat answer can come from: weights set by training, the context window, tools or saved memories, and what that means for how far you can rely on it.",
	},
	'bausteine/en/why-ai-is-convincingly-wrong': {
		title: "Why AI Is Convincingly Wrong",
		description: "Why a chatbot would rather give a wrong answer than “I don’t know”, why follow-up questions often talk it out of a right one and why invented sources look real.",
	},
	'bausteine/en/why-prediction-is-more-than-parroting': {
		description: "How a model that only predicts the next token can write an email that never existed: why that needs rules rather than copies, and where it memorizes after all.",
	},
	'glossar/de/agent': {
		description: "Modell und Programm im Zusammenspiel: Das Modell schreibt Werkzeugaufrufe, das Programm führt sie in einer Schleife aus, Ergebnisse kommen als Text zurück.",
	},
	'glossar/de/token': {
		description: "Eine Einheit aus dem festen Vokabular eines Tokenizers, etwa ein ganzes Wort, ein Wortteil, ein Zeichen, ein Satzzeichen oder eine Marke für Struktur.",
	},
	'glossar/en/token': {
		description: "One unit in a tokenizer’s fixed vocabulary, for example a whole word, a word part, a single character, a punctuation mark or a marker for structure.",
	},
	'glossar/en/thinking-tokens': {
		description: "The intermediate steps a model writes as text before its answer. They take up room in the context window and are billed as output, even when hidden.",
	},
	'lernpfad/de/ki-grundkompetenz': {
		description: "Von den Grundlagen bis zum Chatbot: woraus ein KI-Modell besteht, wie es zum Assistenten wird, warum es überzeugend falsch liegt und wie du Antworten prüfst.",
	},
	'lernpfad/en/ai-literacy-basics': {
		description: "From the foundations to everyday chatbots: what an AI model is made of, how it becomes an assistant, why it can be convincingly wrong and how you check it.",
	},
};

/**
 * @param {'bausteine' | 'glossar' | 'lernpfad'} collection
 * @param {string} id entry id incl. language, e.g. `de/embeddings`
 */
export function searchSnippet(collection, id) {
	return SEARCH_SNIPPETS[`${collection}/${id}`] ?? {};
}
