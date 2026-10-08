<!-- Generated from src/content/bausteine/en/embeddings.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Embeddings: How a Number Becomes a Learned Vector

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Embeddings: How a Number Becomes a Learned Vector](https://ki-einfach-verstehen.de/en/lessons/embeddings/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Embeddings: How a Number Becomes a Learned Vector”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/embeddings/

Why a token ID tells the model nothing about similarity, how training turns random numbers into similar profiles for tokens used in similar ways, and what a large vocabulary costs.

![Barcode symbol](../../public/bausteine/embeddings/barcode.svg)

*A barcode tells the checkout which item it is, but nothing about what the item has in common with others.*

At the supermarket checkout, the barcode reveals exactly one thing: which item it is. No barcode says that apples and peaches are both fruit. The same goes for a [language model](https://ki-einfach-verstehen.de/en/glossary/language-model/) and your chat message. From the previous lesson, you know that your message is a sequence of [token IDs](https://ki-einfach-verstehen.de/en/glossary/token-id/), each saying only which piece of text is meant.

The smallest version of the freely available model GPT-2 has an English vocabulary. Whenever GPT-2 is mentioned here, it means this version. Mid-sentence, with a space in front, “apple” has the number 17180, “laptop” 13224, and “peach” 47565. By number, the laptop is much closer to the apple than the peach is. Does the model therefore treat apple and laptop as related?

## What a number lacks

A token ID is the number on an index card, as in the lesson on [token IDs](./token-ids-and-vocabulary.md). It says which piece of text is meant and means nothing in itself. The tokenizer assigned the numbers while building its vocabulary, without regard to meaning. So neighboring numbers do not stand for similar pieces.

The tokenizer’s card holds only the piece of text. The model uses the same number as a page number in its own thick reference book. You know this from the lesson on [scalar, vector, matrix, and tensor](./scalar-vector-matrix-tensor.md). In GPT-2, every page holds 768 numbers. In the computer, each page is a row of a large table. So the model looks up the token’s numbers, not a fact like “France | Paris.”

Here, this row is called the token’s **profile**: a fixed sequence of numbers belonging to this token alone. In the lesson on scalar and vector, the word meant the shape of a block of numbers.

**Unlike numbers, profiles can be compared.** In a made-up example, the profile has only two places, labeled “grows on trees” and “has a battery.” The apple has (0.9 | 0.1), the peach (0.8 | 0.2), the laptop (0.1 | 0.9). Real profiles have 768 places, and none has a name.

![A pair of axes: to the right the place grows on trees, upward the place has a battery. Three arrows start at the origin: flat to the right to apple at 0.9 and 0.1 and just above it to peach at 0.8 and 0.2, steeply upward to laptop at 0.1 and 0.9](../../public/bausteine/embeddings/profile-sketch.svg)

*A made-up example: each profile of two numbers becomes an arrow from the origin. The arrows of apple and peach point almost the same way, the laptop’s in a quite different one.*

Plot the first number to the right and the second upward, and each profile becomes an arrow from the origin. The arrows are compared by direction, even with 768 places that nobody can draw. If two profiles point in a similar direction, they are called **neighbors**.

## How random numbers become profiles

Who entered these numbers? Nobody. Before training, the table holds random numbers, usually small values scattered around zero, and every token starts with a different profile. At this point, “apple” shares as little with “peach” as with “laptop”.

Training then works as in the lesson on [parameters, training, and inference](./parameters-training-inference-hardware.md): the model predicts the next token, and its [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/), the faders on the mixing desk, are adjusted a little so the prediction fits better. The numbers in the table are such faders too. So whenever a token occurs in a training sentence, its row is adjusted as well.

Suppose a small model has one row each for “apple” and “peach.” Its training texts contain sentences like “The apple is ripe.” and “The peach is ripe.” After “apple,” the model should predict “is,” so the row “apple” is shifted until “is” fits better. The same follows “peach.” “Laptop,” by contrast, appears in sentences like “The laptop has a battery.”

Why do the two rows become similar? After the table, every token goes through the same computation with the same faders. In a made-up toy model, each profile has a single number. The computation after it is “times 2,” giving the [score](https://ki-einfach-verstehen.de/en/glossary/score/) for “is” as the next token. For this example, the score should be exactly 10; too much is as wrong as too little. Real scores only count relative to the others.

The row “apple” starts at 3, which gives 6, too little. So the 3 is nudged step by step toward 5. The row “peach” holds an 8, which gives 16, too much. It also moves toward 5. Both end up at 5, because the same computation should deliver the same result. After “laptop,” by contrast, comes “has.” There the score for “is” should be low, so the number in the row “laptop” moves down, away from 5. In real models, the computation after the table is much longer, and its faders are adjusted in training too. In those models too, **tokens followed by similar things are adjusted alike.** With many numbers per row, their arrows point in similar directions.

![Animation: training sentences with apple and peach adjust both rows alike](../../public/bausteine/embeddings/training-push.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/embeddings/)

*A made-up example: because the same thing follows “apple” and “peach,” both rows are adjusted alike during training.*

Linguists had this idea as early as the 1950s: words that occur in similar contexts tend to have similar meanings. It is called the **distributional hypothesis**. The linguist J. R. Firth summed it up in 1957: “You shall know a word by the company it keeps.”

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/embeddings/)

Today’s chatbot models learn their table the same way, only with billions of sentences instead of a handful.

## Similar use, similar profile

You can check this on GPT-2, whose table is freely available. For this lesson, the similarity of the directions of two profiles was measured. The same direction gives 1, a right angle 0. In the sketch, apple and peach reach almost 1, apple and laptop about 0.2.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/embeddings/)

This solves the opening puzzle: in GPT-2, “apple” and “peach” reach 0.53, “apple” and “laptop” only 0.36. Two random tokens average 0.27, GPT-2’s value for “nothing special in common.” So the laptop lies a little above chance, the peach far above it, although its number is much farther away. Among whole words, the nearest neighbors of “apple” are “apples” and “Apple,” followed by “cider,” “peach,” “lemon,” and “fruit.” Nobody told the model they belong together; they appeared in similar sentences.

![Two lists with bars: on the left the neighbors of apple (apples, Apple, cider, peach, lemon, fruit), on the right those of Apple (iPhone, apple, iOS, Microsoft, iPad, Macintosh), all values between 0.51 and 0.70, well above the random value of 0.27](../../public/bausteine/embeddings/neighbours.svg)

*The nearest neighbors of “apple” and “Apple” in GPT-2’s table (a selection, recomputed for this lesson). The bars show how similar the directions of the profiles are; 1 would mean pointing the same way. The vertical line marks 0.27, what two random tokens reach on average.*

For GPT-2, the capitalized “Apple” is a separate token with its own profile. Its neighbors are “iPhone,” “apple,” “iOS,” “Microsoft,” “iPad,” and “Macintosh.” Microsoft is neither an apple nor a phone; the name just occurs in similar texts. So similar profiles stand for **similar use in text**. No profile contains a definition.

<details>
<summary>One level deeper: how do you measure whether two profiles are similar?</summary>

Usually with **cosine similarity**: 1 means the same direction, 0 a right angle, −1 opposite. Multiply the numbers in the same place, add up the products, and divide by the lengths of the two arrows (the square root of the sum of the squares). As a formula: cos(v, w) = (v · w) / (|v| · |w|). With the sketch: apple and peach give 0.9 · 0.8 + 0.1 · 0.2 = 0.74, divided by √0.82 · √0.68 ≈ 0.75, so cos ≈ 0.99.

In GPT-2, apple and peach reach 0.533, apple and laptop 0.357; 20,000 random pairs average 0.27, and 95 out of 100 were below 0.35. Why is chance not at 0? All profiles point a little in one shared direction: every row has a positive cosine with the average of all rows. Subtract this average, and random pairs average 0. What matters, then, is the distance from the random value.

</details>

## Embedding and embedding matrix

![Three blank cards with patterns of vertical lines in teal and amber; the two on the left lie close together and have almost the same pattern, the one on the right lies a little apart and has a different one](../../public/bausteine/embeddings/steckbriefe.webp)

*Profiles without labels: tokens used in similar ways carry similar patterns of numbers; a token used differently carries a different one.*

The first 8 of 768 numbers for “apple” in GPT-2 are (0.119 | −0.175 | 0.129 | 0.063 | 0.045 | 0.046 | −0.323 | 0.079). What does the seventh number mean? Nobody can say. The profile analogy has a limit here: a profile on paper has fields like height or eye color that someone filled in. In GPT-2, no field has a name, and textbooks note that the individual numbers have no clear meaning. **What a profile expresses lies in all its numbers together.**

In technical terms, a token’s profile is called its **[embedding](https://ki-einfach-verstehen.de/en/glossary/embedding/)**. Because it is an ordered list of numbers, it is a [vector](https://ki-einfach-verstehen.de/en/glossary/vector/). The whole table with one row per token of the [vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/) is called the **[embedding matrix](https://ki-einfach-verstehen.de/en/glossary/embedding-matrix/)**.

In GPT-2, the embedding matrix has one row for each of the more than 50,000 vocabulary entries. At 768 numbers per row, that makes almost 39 million numbers, about a third of the 124 million parameters of this smallest GPT-2 version.

## One row per token, not per word

In GPT-2, “apple” is a whole token, because its vocabulary comes from English texts. German words often split into pieces in GPT-2. “Katze” (cat), with a space in front, becomes “␣Kat” and “ze”; the symbol ␣ stands for the space that belongs to the piece. “Apfel” (apple) becomes “␣Ap,” “f,” and “el.”

So GPT-2’s embedding matrix has no row for “Apfel,” only rows for the three pieces. The profile of “␣Ap” has to fit every word the tokenizer starts with this piece, including “Apotheke” (pharmacy). That the three pieces together mean the fruit only emerges in the computing stages after the table.

Why not simply take a larger vocabulary? In the lesson on token IDs, a made-up mini vocabulary had five entries: “The,” “␣cat,” “s,” “␣sit,” and “.”. With it, “The cats sit.” becomes five tokens; with “␣cats” as a sixth entry, four. In return, the embedding matrix gets a sixth row.

![Two cards. On the left a vocabulary with 5 entries: The, space-cat, s, space-sit, period; The cats sit becomes 5 tokens; the embedding matrix has 5 rows. On the right a vocabulary with 6 entries, additionally space-cats; the sentence becomes 4 tokens; the embedding matrix has 6 rows, the new row highlighted](../../public/bausteine/embeddings/toy-vocabulary.svg)

*A made-up mini vocabulary: with the sixth entry “␣cats,” the sentence gets one token shorter, but the embedding matrix gets one more row.*

The new row always costs space in the table. It saves a token only when “cats” occurs in the text: one fewer position in the [context window](https://ki-einfach-verstehen.de/en/glossary/context-window/) and one fewer round when answering. In a sentence about dogs, it saves nothing.

## How big should the vocabulary be?

Three tokenizers from OpenAI have different vocabulary sizes. GPT-2’s has more than 50,000 entries, GPT-4’s (a model behind ChatGPT) about 100,000, and its successor GPT-4o’s about 200,000. The largest has about four times as many entries as the smallest. Does a sentence then get four times shorter?

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/embeddings/)

“The cat is sitting on the windowsill.” needs 9 tokens with all three: for its words, the larger vocabularies bring no new entries. The same sentence in German, “Die Katze sitzt auf dem Fensterbrett.”, becomes 14, 12, and 9 tokens. The largest vocabulary holds “␣Katze” whole; GPT-2 has to split it. **An entry only saves where its piece of text occurs.**

The costs grow with every entry. Suppose GPT-2 had GPT-4o’s vocabulary, still with 768 numbers per row. Its embedding matrix would be about four times as large. It would have more numbers than the rest of the model, the computing stages after it. A second price comes from training. Training makes targeted adjustments to a row mainly when its token occurs in the text. The larger the vocabulary, the more entries are so rare that their rows get little practice. Researchers found such undertrained entries in widely used models, where they can trigger strange behavior.

The best size therefore depends on the model, according to a 2024 study. A large model trained on a great deal of text sees even rare entries often enough; for a small one, even a medium-sized vocabulary can be too large. Every entry also needs stored numbers at the output to compute its score, as the lesson on the [output head](./output-head.md) shows.

## A bank is a bank, for now

![Symbol of a bank building with columns](../../public/bausteine/transformerbloecke-und-attention/bank.svg)

*A bank to sit on or a bank for your money: at the model’s input, it is the same profile.*

“I sit on the bank in the park.” “I pay money into the bank.” At the model’s input, it is the same token: same number, *the same* row in the embedding matrix. The row itself says nothing about parks or money.

Even so, a chatbot usually understands “bank” correctly. **So the profile from the table is only the starting point.**

The profile does not reveal where “bank” stands in the sentence either: for the same token ID, the model looks up the same row, whether the token comes at the start of the sentence or at the end. How the blocks mix in the rest of the sentence, and how they keep track of the order, is the topic of the next lesson.

---

Source: https://ki-einfach-verstehen.de/en/lessons/embeddings/

← Previous: [Tokenization Inside the Model: How Your Chat Becomes a Token Sequence](./tokenization-inside-the-model.md) · [All lessons](../../README.md#contents) · Next: [Transformer Blocks and Attention: How Context Gets Mixed In](./transformer-blocks-and-attention.md) →
