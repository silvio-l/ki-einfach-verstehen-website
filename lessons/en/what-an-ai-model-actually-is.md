<!-- Generated from src/content/bausteine/en/what-an-ai-model-actually-is.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# What an AI Model Actually Is

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[What an AI Model Actually Is](https://ki-einfach-verstehen.de/en/lessons/what-an-ai-model-actually-is/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “What an AI Model Actually Is”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/what-an-ai-model-actually-is/

Why an AI model is not a database full of facts, how knowledge is spread across its numbers, and why that produces both clever answers and made-up facts.

The foundations left a question open: a model’s billions of numbers contain no written-out fact. So how does a chatbot know that Paris is the capital of France?

For this lesson, a small, openly available **[language model](https://ki-einfach-verstehen.de/en/glossary/language-model/)** got the German for “The capital of France is.” It is called Qwen3-0.6B-Base. “0.6B” means 0.6 billion parameters, like Llama’s “8B” in the foundations; “Base” means no post-training into a chatbot. The leading next **[token](https://ki-einfach-verstehen.de/en/glossary/token/)** was “Paris,” at just under half. The other way around, after the German for “Paris is the capital of,” “Deutschland” (Germany) led, at just under 30 percent. The percentages say which text piece fits next, not whether a statement is true.

A table row “France | Paris” reads from either side. The small model reached the fact in only one direction. The first of three cases below explains why. But first: what happens inside the model when it answers?

## Where does it say that Paris is the capital?

A correct answer looks like a lookup, as if the model found a row with this fact somewhere inside. That is how a database works.

A real **[model file](./parameters-training-inference-hardware.md)** says otherwise. You know it from the foundations: a small blueprint, the **[architecture](https://ki-einfach-verstehen.de/en/glossary/architecture/)**, and a vast set of numbers, the **[parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/)**. In Qwen3-8B, a bigger model of the same family, they sit in a few hundred blocks of numbers, like the tables in the lesson on vectors and matrices. Their names describe computing steps that later lessons explain. None is called “countries” or “capitals.”

From the foundations you know the mixing desk: each fader is a parameter, its position the value. Training set the faders; while answering, they stay put. So what is stored is settings, not sentences. New here is the path through the desk: a signal enters on the left, leaves on the right, and the meters show what passes through.

![A wide mixing desk without labels. A cable leads in on the left, and on the right a cable leads out to a loudspeaker. The faders sit fixed at different heights; above them runs a strip of level meters whose bars light up to different heights](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/pult-signalweg.webp)

*The faders stay where they are. The meters change with the signal passing through.*

In the model, the signal is your text as numbers. Recall the spam filter: for “Free: your prize is waiting,” it added up the weights 2 and 3 and got 5. That 5 was stored nowhere; it arose for exactly this email. At every computing stage, a language model forms a great many such sums from the incoming numbers and its fixed parameters, and passes them on to the next; a mini model shows how shortly. These passed-on numbers, the intermediate results from the lesson on parameters, are called **intermediate values** here. Like the meters, they arise anew for every text.

The last intermediate values become the **[score](https://ki-einfach-verstehen.de/en/glossary/score/)** list from the foundations, one score for every text piece the model knows. Softmax divides it into shares, as on the prize wheel: the percentages from the start.

That is as far as the picture goes: on a real desk, each meter belongs to one channel, such as a microphone. An intermediate value belongs neither to a single parameter nor to a topic. Even the 5 depended on two weights; in a large model, each intermediate value depends on very many.

![On the left a table with the columns country and capital; the row France, Paris is highlighted. On the right the sentence start runs past fixed faders that stand for the parameters; this produces a dashed box with schematic bars for the intermediate values, and from that a score list with Paris on top](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/database-or-model.svg)

*A database looks up the matching row. In the model, your input and the fixed parameters produce intermediate values, which finally become the score list. The intermediate values are schematic.*

The reversed question gave the same parameters a different input, so a different score list came out. But how can fixed numbers contain knowledge about Paris?

![On the left two German inputs: Die Hauptstadt von Frankreich ist (The capital of France is), and Paris ist die Hauptstadt von (Paris is the capital of). Both run through the same block of fixed faders, labeled the same, fixed. After that, one dashed box each with bars of different heights for the intermediate values. On the right the score lists in percent: on top Paris 47.5, below Deutschland 28.9 and Frank, the start of Frankreich, 9.4](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/two-runs.svg)

*The same fact, asked twice in German, one run of Qwen3-0.6B-Base each: the parameters are the same, the intermediate values and the score list are not. The bars of the intermediate values are schematic. The larger Qwen3-4B-Base continues the reversed sentence with “Frank…” at 61.7 percent.*

## No parameter is called “Paris”

In training, the parameters were nudged step by step. What the model learned about Paris lives in these settings, but in no single parameter.

A made-up mini model with two stages and ten faders shows how. Each stage computes like the apple model from the lesson on parameters (fader times kilos), just with more numbers: each fader times its incoming number, all added up. Sentence A, “The capital of France is,” comes in as three made-up numbers: 2, 1 and 1. Stage 1 has faders 1 to 6, three per meter. For meter 1 they sit at 2, −1 and 1: 2·2 − 1·1 + 1·1 = 4. Meter 2 uses −1, 2 and 1 and comes to 1. Stage 2, with faders 7 to 10, gives the scores: Paris 2·4 + 1·1 = 9, France 1·4 + 2·1 = 6. Paris leads.

Sentence B, “Paris is the capital of,” comes in as 1, 2 and 1. The same faders give the meters 1 and 4, then Paris 6 and France 9. Now France leads. No fader stores the fact. It only shows up when an input runs through.

![Two rows, sentence A and sentence B. Sentence A: input 2, 1, 1, meters 4 and 1, scores Paris 9 and France 6. Sentence B: input 1, 2, 1, meters 1 and 4, scores Paris 6 and France 9. In the middle a box with ten fixed faders for both rows. Below: fader 9 at 3, then sentence A France 14, sentence B France 11](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/toy-model.svg)

*A made-up mini model: the same ten faders, two sentence starts. Meters and scores arise anew for each sentence start. With fader 9 at 3 instead of 1, the scores of both sentences change.*

Suppose fader 9, which feeds meter 1 into the France score, sits at 3 instead of 1. Then France reaches 3·4 + 2·1 = 14 for sentence A and overtakes Paris. For sentence B it rises from 9 to 11. In a real model, the same parameters take part in every question. Changing them to fix one answer changes others as well. That is why a fact can’t be corrected like a table row.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/what-an-ai-model-actually-is/)

Where the Paris fact sits among a real model’s millions to billions of faders, nobody can yet fully show. The intermediate values, though, can be studied.

A team at the AI company Anthropic, which makes the chatbot Claude, did this with a small language model. A single intermediate value, a single meter in the picture, fired for academic citations, English dialogue, a browser’s requests for web pages, and Korean text. So an intermediate value is not a drawer for one concept.

![On the left four triggers, academic citations, English dialogue, web page requests and Korean text, all pointing to the same single intermediate value. On the right a row of schematic bars of different heights; a bracket under all the bars marks their combination as a feature](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/number-and-feature.svg)

*A single intermediate value responds to very different things. A feature shows up as a particular combination of values across many intermediate values.*

In a version of Claude, the team instead found millions of recurring combinations across many intermediate values, for instance for famous people and cities. They are called **features**. A feature is like a chord: a single note occurs in many chords and alone doesn’t reveal which is sounding. Only the notes together make C major. Unlike chords, though, nobody defined the features. They arose in training and first have to be extracted.

So keep three quantities apart: parameters, stored and fixed (the faders); intermediate values, new for every text (the meters); features, combinations within them (the chords). A fact like “Paris is the capital of France” is none of these; it only shows up in the answer.

![Three rows. Parameters: stored, fixed while answering, like the faders. Intermediate values: computed anew for every text, like the meters. Features: combinations within the intermediate values, like chords. Below: the fact is none of these, it only shows up in the answer](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/three-quantities.svg)

*Three quantities worth keeping apart. The fact is none of them: it only shows up in the answer.*

<details>
<summary>One level deeper: how features share the intermediate values</summary>

Different features use the same intermediate values. For 82 percent of the features examined in Claude 3 Sonnet, no single intermediate value was strongly linked to the feature. When several features are active at once, their contributions overlap. The technical term is **superposition**. That way, more features fit in than there are intermediate values, just as a few keys make a great many chords.

An experiment with the Golden Gate Bridge showed that features steer the answer. During the computation, the team held the bridge feature at ten times its natural maximum, leaving the parameters unchanged. The model then described itself as the Golden Gate Bridge. Where a fact sits, the experiment doesn’t show.

</details>

## Three questions where a table behaves differently

This is about the language model itself. Some chatbots first search the internet and pass the hits to the model as extra input, like the conversation so far in the foundations. Alone, the model just continues your input, which differs from a table in three ways.

The first case is the reversed question, where “Deutschland” led in the small model. In the larger Qwen3-4B-Base, with 4 billion parameters, “Frank…” led, the start of “Frankreich,” at just over 60 percent. So the fact can be learned in both directions. The small model probably lacked size; in German texts “Hauptstadt von” is often followed by “Deutschland.”

Still, **direction** matters. In training, the input is always the beginning of a text and the label the piece that follows, as with “The cat sat” and “on.” What almost only ever follows a name is learned only from that name. For facts almost always written the same way round, even large models show a clear direction effect. GPT-4, a model behind ChatGPT, answered questions like “Who is Tom Cruise’s mother?” (Mary Lee Pfeiffer) correctly almost four times in five in 2023; reversed ones like “Who is Mary Lee Pfeiffer’s son?” only one time in three. If the fact is already in your question, as in “Paris is the capital of France. What is Paris the capital of?”, the reversal usually works.

The second case: not every fact is held equally firmly. In a table, every row is equally easy to find. A model answers more reliably the more matching texts it saw in training, and larger models retain more. Both models got the German for “The physicist Albert Einstein was born on” and took, piece by piece, the piece ahead. The small one wrote “August 14, 1879, in Zurich,” the larger one “March 14, 1879, in Ulm,” which is correct.

The third case asks about something that doesn’t exist: the physicist Bernhard Quelling, made up for this lesson. A database reports: no match. What do you think a language model writes? Both models promptly named a date of birth, the small one “August 13, 1920, in the city of Berlin.” The computation yields a score list, and some text piece is always ahead. “I don’t know” would be just one possible continuation; after this sentence start, a date fits better. A model with only basic training has hardly learned to pick the stop marker from the foundations here or to admit not knowing. Only post-training teaches that.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/what-an-ai-model-actually-is/)

So: direction matters, frequency matters, and gaps are filled plausibly. A chatbot’s “I don’t know” is learned behavior too, not a search result. A new run gives in principle the same percentages; a differently worded sentence gives others.

## Answers that were never written down

Computing instead of looking up is also a model’s greatest strength: what it learned can be combined. In an Anthropic experiment, a model was asked for the capital of the US state that contains Dallas. That is Texas, whose capital is not Dallas but Austin. First, triggered by “Dallas,” a feature for Texas fired. Together with the question about a capital, it led to the answer Austin.

![Animation: the question about the capital of Dallas’ state is answered in two steps via Texas to Austin; after Texas is swapped for California, the answer is Sacramento](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/two-steps.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/what-an-ai-model-actually-is/)

*Two learned facts are linked: Dallas is in Texas, the capital of Texas is Austin.*

Combining, or retrieving a memorized answer? Mid-computation, the researchers replaced the feature for Texas with one for California, by changing intermediate values, not parameters. The model then answered “Sacramento,” the capital of California. So the second step really depended on the first.

It also works across languages: asked for the opposite of “small” in English, French or Chinese, the model activated the same “small” and “opposite” features. So a chatbot can likely explain to you in one language what it knows almost only from texts in another.

Does a model then never reproduce anything word for word? It does. From GPT-2, an older, openly available model, hundreds of passages were extracted verbatim. They included names, phone numbers and email addresses, some from one training document. Even so, nothing is looked up; the model file holds only parameters. A number only comes out when the matching text start goes in and exactly this continuation leads, piece by piece.

## Why the model would rather guess than stay silent

In 2023, two New York lawyers filed a brief in federal court citing six decisions. None of them existed. ChatGPT had generated them, with docket numbers and quotations resembling real rulings. From a great many texts, the model had learned what rulings and docket numbers look like. The form came out even without the facts.

Such fluent, plausible-sounding statements that aren’t true are called **[hallucinations](https://ki-einfach-verstehen.de/en/glossary/hallucination/)**. They are not a rare bug but have three interlocking causes.

![A stack of thick court files tied with string on a wooden table, next to a judge’s gavel](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/akten.webp)

*Six rulings that looked real and were never handed down.*

The first lies in basic training. A language model must deliver a next piece at every position of a text, even where its **[training data](https://ki-einfach-verstehen.de/en/glossary/training-data/)** offers next to nothing. So a continuation always comes out. The second lies in evaluation. In tests with large sets of questions, a correct answer often earns one point, a wrong one zero, and “I don’t know” zero as well. It is like a multiple-choice test without penalties: if you don’t know, you tick a box anyway. Post-training tunes chatbots toward good test results, so they learn that a guess pays. The picture has a limit: a model doesn’t consciously decide to guess. It was set up so that guessing pays off.

The third cause is a misfire within what was learned. In post-training, a chatbot does learn to say “I don’t know.” Inside Claude, you can see how: asked about people, Claude answers “I can’t answer that” unless something else fires. A feature for “known person” switches this answer off when the model knows the person. Sometimes, though, a name only seems familiar, and the feature fires anyway. Then the answer is unlocked, and the model writes on with whatever sounds plausible.

Facts that follow from no rule, such as birthdays, are especially vulnerable. A fact seen only once in training is usually not retained reliably, even if some such passages stick, like the phone numbers from GPT-2. That holds even with error-free training data. So check rare facts against a source: rulings, quotations, figures, dates of birth and death.

<details>
<summary>One level deeper: why guessing pays off mathematically</summary>

In 2025, researchers from OpenAI and Georgia Tech worked out why hallucinations are so persistent. Suppose a model is to name the birthday of someone it knows nothing about. A guessed date is right once in 365 cases, earning about 0.003 points on average. “I don’t know” earns a certain 0. Guessing wins narrowly.

Under simplified assumptions, the paper also derives a lower bound for basic-training errors, even with error-free data, that grows with the share of facts that appear only once in training.

As a way out, the authors propose that a wrong answer should cost more in tests than an honest “I don’t know.” Then guessing no longer pays.

</details>

## Not every AI model is a language model

“AI model,” though, is an umbrella term. You know the **[spam filter](https://ki-einfach-verstehen.de/en/glossary/spam-filter/)** and image recognition, technically an **[image classifier](https://ki-einfach-verstehen.de/en/glossary/image-classifier/)**, from the foundations: an email or a photo goes in, a verdict comes out, such as “spam” or “cat.”

Many image generators, such as Stable Diffusion, work differently. They are **[diffusion models](https://ki-einfach-verstehen.de/en/glossary/diffusion-model/)**: they start with pure noise, like the snow on an old TV, and make the whole image clearer in many steps, steered by your text. A language model, by contrast, appends piece after piece at the end. Finally, **[multimodal models](https://ki-einfach-verstehen.de/en/glossary/multimodal-model/)** process several kinds of input, such as text and a photo, and answer with text.

![Four cards: classification, an email or a photo in, a verdict out. Image generator, text in, image out, from noise in many steps. Language model, text in, next text piece out. Multimodal model, text and image in, text out](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/kinds-of-models.svg)

*Four kinds of AI models, distinguished by input and output. What they share is a blueprint and trained parameters.*

All consist of a blueprint and trained parameters. What goes in, what comes out and how they compute differ.

This topic follows the path through a language model, because most large language models today share one basic pattern: they predict the next token, seeing only the text before it. Chatbots that understand photos also work this way at their core. The path has four stations, one per lesson: your text becomes tokens. Each token gets a list of numbers, like a page in the reference book from the lesson on vectors and matrices. Many computing stages mix in the context. Experts call them blocks, not to be confused with the blocks of numbers. At the exit, the output head turns this into the score list.

![Four cards from left to right, connected by arrows; above them on the left: in, your chat message, on the right: out, one next token. Lesson 2, tokens: text becomes a token sequence. Lesson 3, embeddings: each token gets a list of numbers. Lesson 4, blocks: the context of the sentence is mixed in. Lesson 5, output head, the exit: score list for the next token](../../public/bausteine/was-ein-ki-modell-eigentlich-ist/way-through-the-model.svg)

*The path through the model in four stations. Each gets its own lesson in this topic.*

So a chatbot knows that Paris is France’s capital because training set its parameters so that “Paris” comes out on top for this question. No single parameter contains the fact. The chatbot looks nothing up; it computes a continuation from your input. That is why it can recombine what it learned, and why it fluently fills gaps with inventions.

On to the first station: your chat message becomes one long sequence of tokens that also records who said what. The next lesson shows how it comes about and how long it can be.

---

Source: https://ki-einfach-verstehen.de/en/lessons/what-an-ai-model-actually-is/

← Previous: [Parameters, Training vs. Inference, Hardware: How a Model Runs](./parameters-training-inference-hardware.md) · [All lessons](../../README.md#contents) · Next: [Tokenization Inside the Model: How Your Chat Becomes a Token Sequence](./tokenization-inside-the-model.md) →
