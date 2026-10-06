<!-- Generated from src/content/bausteine/en/output-head.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Output Head: From the Last State to a Prediction

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Output Head: From the Last State to a Prediction](https://ki-einfach-verstehen.de/en/lessons/output-head/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Output Head: From the Last State to a Prediction”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/output-head/

How a language model computes a score for every token from its last state, why only the last position counts, and how this builds an answer piece by piece.

The previous lesson ended with a state at every position: a list of numbers into which the blocks mixed context, layer by layer. In the small language model Qwen3-0.6B, it has 1,024 numbers. But a chat window shows words, not lists of numbers.

In the first lesson of this topic area, exactly this model predicted “Paris” with 48.8 percent after “Die Hauptstadt von Frankreich ist” (German for “The capital of France is”), without looking up an entry anywhere. You already know that no word comes out directly. Still open: which calculation leads to 48.8, and why the same model once wrote “Zürich” after exactly this opening.

## What comes out is a scoreboard, not a word

At the end, the model delivers the score list the previous lesson announced. It resembles the scoreboard from the lesson on [probability and softmax](./probability-and-softmax.md): one row per candidate, a score in each row. But instead of three rows, it has one for every entry in the [vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/), plus a few reserve rows. For Qwen3-0.6B, that makes 151,936 in total. Each one gets a [score](https://ki-einfach-verstehen.de/en/glossary/score/), even the row for a comma, “bicycle” or a Chinese character.

![A very tall wooden scoreboard with many narrow rows that extend beyond the edge of the image; each row has a blank name plate and a score plate of varying length, one turquoise plate sticks out the farthest and is lit by a small brass lamp, a few plates nearby are amber](../../public/bausteine/output-head/punktetafel.webp)

*The scoreboard at the end of the model: one row for every entry in the vocabulary, each with its own score. One row is ahead.*

For this topic area, Qwen3-0.6B was run on an ordinary computer, in the free base version without chat training. The numbers come from a single run. After “Die Hauptstadt von Frankreich ist”, “Paris” has the highest score, 20.6. Second, at 19.2, is a blank line “____” as in worksheets and quizzes. The model apparently saw many such texts in training. “Bern” is only fifth, with 17.2. Softmax turns these into percentages: “Paris” 48.8, the blank line 11.3, “Bern” 1.5. That is the number from the first lesson.

![Table after Die Hauptstadt von Frankreich ist, model Qwen3-0.6B-Base: rank 1 Paris, score 20.6, after softmax 48.8%; ranks 2 to 4 blank lines with scores 19.2, 17.9 and 17.8 and 11.3%, 3.1% and 3.0%; rank 5 Bern, score 17.2, 1.5%; below: and 151,931 more rows](../../public/bausteine/output-head/paris-board.svg)

*The top of the real board: softmax turns small gaps between the scores into large differences in the percentages.*

The lesson on [input and output](./input-and-output.md) showed the model rates every vocabulary entry each round and a separate step picks one. New here is what the real list looks like. Often, the chosen piece is not even a whole word. After “Der Hund jagt die” (“The dog chases the”), the same model put word beginnings in the lead, such as “T”, “F” and “Kat” (the start of “Katze”, cat), each with only a few percent. What gets chosen is a [token](https://ki-einfach-verstehen.de/en/glossary/token/).

Scores can also be negative. The same experiment ran GPT-2, an older, almost English-only model, in its smallest version with about 124 million parameters. After “The dog chased the”, all 50,257 of its scores were negative. The highest belonged to “dog”, with −86.4. Softmax still makes a valid distribution of it, with just under 20 percent for “dog”. As in the lesson on softmax, only the gaps between scores count, not their level: in a card game where everyone is in the red, whoever is least in the red leads.

But where do the 20.6 points for “Paris” come from?

## Where the points come from: one row per token

The part of the model that fills the board is called the **[output head](https://ki-einfach-verstehen.de/en/glossary/output-head/)**. It is not a large network of its own, just a single layer of calculation. It has one row per vocabulary entry, with as many numbers as the state. A token's score measures how well the state matches its row.

Suppose a model had states with only three numbers and a vocabulary of four tokens: “cat”, “pigeon”, “duck” and “cloud”. After “The dog chases the”, the last position holds the state (1.0 | 0.5 | −1.0). The row for “cat” reads (2.0 | 1.0 | −1.5).

The output head multiplies position by position, first number times first number and so on, then adds everything up. 1.0 times 2.0 makes 2.0. 0.5 times 1.0 makes 0.5. −1.0 times −1.5 makes plus 1.5, because minus times minus is plus. Together that is 4.0, the score of “cat”. The previous lesson used this calculation to compare a token's query with every key.

“pigeon” has (1.0 | 1.0 | −1.0), giving 1.0 + 0.5 + 1.0 = 2.5. “duck” has (0.5 | 0 | −1.0) and comes to 1.5. “cloud” has (−1.0 | 0 | 0). What score does it get? Work it out quickly before you read on.

It is −1.0: at the first position, the state is positive and the row negative, which gives a deduction. Hence the rule behind every score: if state and row have the same sign at a position, there are points; with opposite signs, a deduction. The further a number is from zero, whether plus or minus, the more it counts. So a high score means state and row agree.

![At the top the state with the numbers 1.0, 0.5 and −1.0 for the last position after The dog chases the; below it four rows with three numbers each, next to them the calculation and the score: cat 2.0, 1.0, −1.5 gives 2.0 + 0.5 + 1.5 = 4.0; pigeon 1.0, 1.0, −1.0 gives 2.5; duck 0.5, 0, −1.0 gives 1.5; cloud −1.0, 0, 0 gives −1.0](../../public/bausteine/output-head/state-meets-rows.svg)

*The output head in miniature: the state is multiplied with every row position by position, and the results are added up (made-up numbers).*

Real models do the same, just bigger. In Qwen3-0.6B, every row has 1,024 numbers, and there are 151,936 rows. That makes about 156 million numbers, all of them [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/) set during training. Every round, that means 151,936 comparisons.

Here the scoreboard picture breaks down. On a scoreboard, a referee awards points according to rules you can look up. The output head's rows have no labeled positions. Nobody decided that the first number means “animal”; training set them all.

<details>
<summary>One level deeper: the output head as a single matrix calculation</summary>

Stacked, the rows form a [matrix](https://ki-einfach-verstehen.de/en/glossary/matrix/). In GPT-2, it has the shape 50,257 × 768: one row per token, 768 numbers per row, like the state. All 50,257 comparisons then become one multiplication of the state with the matrix:

`Scores = h · Wᵀ`

Here, h is the state and W the matrix. The superscript T means the matrix is flipped so its rows meet the positions of the state. Out comes a vector with 50,257 scores. Recalculated for GPT-2, this matches the model's scores up to rounding differences below 0.0002.

Two fine points. Directly before the output head, GPT-2 has one last balancing step, a so-called normalization, which many models have in some form. “Last state” means the state after this step. And technically, the scores are called logits. Some sources include softmax in the output head; here it means only the layer that delivers the scores.

</details>

The output head's rows recall something from the very start of the path.

## The same table at the input and the output

At the model's input, every token ID fetches its profile from a large table with one row per vocabulary entry, each as long as a state. The output head's table looks the same. Could it be the same one?

The lesson on tokenization in the model said a second table usually sits at the output. With large models that is often the case, but with small ones, sharing is common. Experts call this weight tying. The table then serves twice: at the front to fetch an ID's numbers, at the back to compare the last state with every row. A high score for “Paris” then means: the last state resembles the profile of “Paris”.

![Two arrows pointing in opposite directions](../../public/bausteine/output-head/hin-und-zurueck.svg)

*Weight tying: the same table translates tokens into numbers at the input and compares numbers with tokens at the output.*

A model's configuration file says whether it shares the table. For Qwen3-0.6B, the entry reads “tie_word_embeddings: true”; for the larger Qwen3-8B, “false”: it has a second table at the output. GPT-2 shares the table, as does Meta's Llama 3.2 1B. Researchers showed in 2016 that sharing can even make language models slightly better. Above all, it saves space.

How much? The Qwen3-0.6B table has 151,936 rows of 1,024 numbers each, the roughly 156 million from before. Without sharing, they would come a second time at the output. Shared, the one table makes up 26 percent of all parameters, 31 in GPT-2 and 21 percent in Llama 3.2 1B. Of the four models compared here, the three small ones share the table; the large one does not. That is not a fixed rule, but it fits the calculation: where the table is a large part of the model, sharing saves the most. And small models are often meant to run on a laptop or phone, where every gigabyte counts.

So far, there was a single state. But the model has one at every position.

## Which position counts

For Qwen3-0.6B, “Die Hauptstadt von Frankreich ist” consists of seven tokens: “Die”, “Haupt”, “stadt”, “von”, “Frank”, “reich” and “ist”. After the last block, each has its state. Which of the seven goes into the output head?

During generation, only one: the state of the last position, here “ist” (“is”). The other six would predict tokens that are already in the text. So libraries such as Hugging Face Transformers can compute only the last position's scores, saving a lot of memory.

Does the model then only look at the last word? It might seem so. But the blocks have mixed information from all earlier positions into this state, as the previous lesson described. The word “ist” alone points to no capital. Only the mixed-in context makes its state match the row for “Paris” well.

Training is different. A piece of training text runs through the model, and every position delivers its own board. How many predictions are in a single pass with “The dog chases the cat”, if every word is one token? Think it over.

Five positions deliver a board each, four of which can be checked directly: the position “The” should predict “dog”, “dog” the word “chases”, “chases” the word “the”, and “the” the word “cat”. For “cat”, the next token is no longer in the text. Every position gets the real text before it, not the model's own guess. This method is called teacher forcing. Because no prediction has to wait for another, they all run at the same time.

![At the top, Generating: the tokens The, dog, chases, the; only the last the is highlighted and leads via the output head to a question mark, the other states are computed but do not go into the output head. At the bottom, Training: each of the four tokens has an arrow to its target, The to dog, dog to chases, chases to the, the to cat; each target is the real next token from the training text](../../public/bausteine/output-head/positions.svg)

*During generation, only the last position delivers a board. In training, every position predicts its next token, all at the same time.*

This explains a difference you know from chatbots. In training, every sentence provides many exercises at once. Answers, by contrast, come piece by piece, because during generation the real next text does not exist yet: each token must be chosen before the next can be computed.

## One full round, from text to the next token

Now for the whole path in one go. The text is split into tokens, each with its ID. Every ID fetches its profile from the table. The blocks mix context into the states, layer by layer. The state of the last position goes into the output head, and out comes the board with 151,936 scores. Softmax turns them into percentages. A selection step picks a token, and it is appended. Then the next round starts with one more token.

![Animation: one round through the model from Die Hauptstadt von Frankreich ist to the appended token Paris](../../public/bausteine/output-head/one-round.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/output-head/)

*One complete round through the model: from the text via tokens, profiles, blocks and the last state to the board, the selection and the appended token.*

The selection step decides what becomes of the board. If the model always takes the most likely token (greedy decoding), “Paris” follows every time. If instead the wheel from the lesson on softmax is spun ([sampling](https://ki-einfach-verstehen.de/en/glossary/sampling/)), the result is open. In the experiment, “Zürich” came out the first time. The city had a narrow but not empty slice of the wheel. The second time, the model wrote a colon and then the sentence again: “Die Hauptstadt von Frankreich ist Paris.” The third time, “Paris” came right away. The same happens when you tap “Regenerate” in a chatbot: the first board stays the same, only the draw is new; from the first token that differs, every later board differs too.

Once appended, a token stays, and every further round builds on it. The output head did not miscalculate anything.

Always taking the most likely token has its own weakness. In this lesson's experiment, GPT-2 continued “Der Hund jagt die” this way with “Welt des Welt des Welt des Welt des” (“world of the world of the …”). That is the repetition loop from the lesson on softmax, here in a real model. GPT-2 barely knows German, which makes it especially drastic.

<details>
<summary>One level deeper: does everything have to be recomputed every round?</summary>

As described, the whole text runs through the model again every round, though only one token was added. The previous lesson names the way out in its deep dive, the KV cache: the keys and values of earlier tokens are kept, because later tokens do not change them. Each round, only the new token then goes through the blocks.

A rough measurement for this lesson, with GPT-2 on an ordinary computer: generating 200 tokens took about 3.6 seconds with the cache and about 14 without, roughly four times as long. The cache is not free: it grows with every token and can fill much of the memory for very long texts.

</details>

## When the loop ends and what you can adjust

When does the loop stop? The end token from the lesson on tokenization in the model, still called a stop marker in the basics, has its own row in the output head and gets a score every round like all others. In GPT-2, it is the last entry. So the model ends its answer by choosing exactly this token. The length limit, by contrast, is a setting outside the model. You may know this: a long answer stops mid-sentence, and the app offers to continue. Then the end token was not chosen; the limit was reached.

The providers' programming interfaces state which case occurred. At Anthropic, it says “end_turn” when the model finished its answer itself; otherwise it reports where the answer stopped instead, for example at a stop sequence you defined yourself or at the maximum number of tokens. At OpenAI, an answer cut off at the limit counts as incomplete.

![Two sliders](../../public/bausteine/output-head/regler.svg)

*What can be adjusted from outside mainly affects the selection step, not the output head.*

From outside, you can adjust little but the selection step. You know temperature from the lesson on softmax; top-k and top-p (in its deep dive) keep only the most likely tokens before the spin. Some providers, though, take these controls away for some models (as of October 2026). For OpenAI's GPT-6 models, temperature and top-p must be removed from the request once the model is to reason before answering. For models after Claude Opus 4.6, Anthropic accepts only 1.0 as temperature, rejects top-k and accepts top-p only at values of 0.99 or higher, which leaves it with practically no effect. There is still a draw; the provider just decides how.

That answers the opening question: the model does not write a word; it fills a board. The output head compares the last state with one row per token, often the same profiles as at the input; the agreement becomes the score. Softmax turns this into percentages such as the 48.8 for “Paris”. A selection step takes the most likely token or draws, and sometimes draws “Zürich”.

With this round, the path through the model is complete, from the text via tokens, profiles and blocks to the board. But every number on this path was simply there: the profiles, the weights in the blocks, the rows of the output head. Training set them, using exactly this lesson's prediction: at every position, the model predicts the next token, which is compared with the real one. The next topic area, “How learning works”, shows how this comparison makes a better model.

---

Source: https://ki-einfach-verstehen.de/en/lessons/output-head/

← Previous: [Transformer Blocks and Attention: How Context Gets Mixed In](./transformer-blocks-and-attention.md) · [All lessons](../../README.md#contents)
