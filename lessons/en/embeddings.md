<!-- Generated from src/content/bausteine/en/embeddings.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Embeddings: How a Number Becomes a Meaningful Vector

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Embeddings: How a Number Becomes a Meaningful Vector](https://ki-einfach-verstehen.de/en/lessons/embeddings/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Embeddings: How a Number Becomes a Meaningful Vector”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/embeddings/

Why a token ID tells the model nothing about meaning, how training turns random numbers into similar profiles for tokens that are used in similar ways, and why the model also needs each token’s place in the sentence.

![Barcode symbol](../../public/bausteine/embeddings/barcode.svg)

*A barcode tells the checkout which item it is, but nothing about what the item has in common with others.*

At the checkout, the scanner beeps and the display shows “Apples, loose”: the barcode told the till which item it is, nothing more. No barcode says that apples and pears are both fruit. A language model is in the same position with your chat message once the [tokenizer](https://ki-einfach-verstehen.de/en/glossary/tokenizer/) has split it. What remains is a sequence of [token IDs](https://ki-einfach-verstehen.de/en/glossary/token-id/), each saying only which piece of text is meant.

This lesson uses the smallest version of the freely available model GPT-2 throughout: about 124 million parameters, with an English vocabulary. In it, “␣apple” has the ID 17180. The ␣ marks the space that belongs to the token, as it does in the middle of a sentence. From here on, this form is always meant, even without the ␣. “␣laptop” has 13224, and “␣pear” 25286. By ID, the laptop is closer to the apple than the pear is. Yet the model treats apple and pear as related. How does it know, if nobody ever told it what fruit is?

## What a number lacks

A token ID works like the item number from the lesson on [tokenizers](./tokenizer-ids-vocabulary.md): it identifies a piece of text and means nothing by itself. Neighboring IDs do not stand for similar pieces.

So the model needs something it can compare and calculate with. You know the first step from the lesson on [scalar, vector, matrix, and tensor](./scalar-vector-matrix-tensor.md). The model uses the ID as a row number in a large table. In GPT-2, each row holds 768 numbers. This row is something like the token’s **profile**: a long, fixed sequence of numbers belonging to this token alone.

Unlike IDs, profiles can be compared. Roughly, similar means: where one has large numbers, so does the other, and where one has small or negative ones, the other does too. Experts picture each profile as a point in a huge space; similar profiles are close together, neighbors.

Why not just assign the IDs cleverly, fruit next to fruit? On a single number line, every ID has only two direct neighbors, left and right. But “apple” should be close to “pear,” “peach,” “lemon,” “cider,” and “Apple” at once. And “Apple” should be close to “iPhone” without the iPhone moving next to the pear. A list of many numbers can resemble a token in many respects at once; a single ID cannot.

That is the first half of the answer to the opening puzzle: the profiles of “apple” and “pear” are noticeably more alike than those of “apple” and “laptop.”

The second half is missing: who entered the numbers?

## How random numbers become profiles

Nobody did. Before training, the table holds random numbers. In OpenAI’s first GPT model, they were small values scattered around zero. In this state, “apple” has no more in common with “pear” than with “laptop.”

Then comes training, as in the lesson on [parameters, training, and inference](./parameters-training-inference-hardware.md). The model predicts the next token and adjusts its [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/) a little, so that the prediction fits better. The table’s numbers are among these parameters, so when a token occurs in a training text, its row is adjusted too.

Suppose a small model has one row each for “apple” and “pear.” Its training texts include “The apple is ripe” and “The pear is ripe.” After “apple,” the model should predict “is ripe,” so the “apple” row is shifted to make this continuation fit better. The same follows “pear,” so the “pear” row changes in a similar way. “Laptop” appears in sentences about batteries and screens, and its row changes quite differently.

Why do the two rows become alike, rather than each fitting in its own way? Everything after the table is one calculation with the same parameters for every token. If that one shared calculation is to turn both rows into the same continuation, the easiest way is for the two rows to become similar to each other.

![Animation: training sentences with apple and pear adjust both rows in similar directions](../../public/bausteine/embeddings/training-push.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/embeddings/)

*A made-up example: because the same thing follows “apple” and “pear,” both rows are adjusted in similar directions during training.*

Over millions of sentences, these steps add up. Linguists had the underlying idea in the 1950s: words that occur in similar contexts tend to have similar meanings. It is called the **distributional hypothesis**. The linguist J. R. Firth summed it up in 1957: “You shall know a word by the company it keeps.”

The models behind today’s chatbots learn their tables this way too. But what happens to a word that occurs in two quite different contexts? Pause and think before reading on.

## Similar use, similar profile

GPT-2 shows whether this holds. For this lesson, its table was searched: which profiles are closest to that of “apple”? At the top are spelling variants such as “apples” and “Apple.” Then come “cider,” “peach,” “lemon,” and “fruit.” Nobody told the model these belong together; they just stood in similar sentences.

The question from the end of the previous section has two answers. If the word is a single token, its one profile has to serve both uses at once; the final section returns to this. With “apple,” the spelling helps. The company is usually capitalized, and “Apple” is a different token with its own profile. Its nearest neighbors are “iPhone,” “apple,” “iOS,” “Microsoft,” “iPad,” and “Macintosh.” Apart from the fruit word, the list holds phones and competitors, not fruit baskets.

![Two lists with bars: on the left the neighbors of apple (apples, Apple, cider, peach, lemon, fruit), on the right those of Apple (iPhone, apple, iOS, Microsoft, iPad, Macintosh), all values between 0.51 and 0.70, well above the random value of 0.27](../../public/bausteine/embeddings/neighbours.svg)

*The nearest neighbors of “apple” and “Apple” in GPT-2’s input table (a selection, recomputed for this lesson). The vertical line shows what two random tokens reach on average.*

The list for “Apple” also shows what a profile is not: a definition. Microsoft is neither an apple nor a phone; it just occurs in similar texts. So similarity at the input means similar use, not the same meaning.

<details>
<summary>One level deeper: how do you measure whether two profiles are similar?</summary>

Usually with **cosine similarity**. Think of each profile as an arrow and ask how much two arrows point the same way: 1 means the same direction, 0 a right angle, −1 opposite directions. Multiply the numbers in the same position and add up all the products. Then divide the result by the lengths of the two arrows.

cos(v, w) = (v · w) / (|v| · |w|)

A toy example with three numbers instead of 768: v = (1, 2, 0) and w = (2, 3, 1). The products give 2 + 6 + 0 = 8. For the length of an arrow, square each number, add them up, and take the square root: √(1 + 4 + 0) = √5 ≈ 2.24 and √(4 + 9 + 1) = √14 ≈ 3.74. Their product is about 8.37. So cos ≈ 8 / 8.37 ≈ 0.96, almost the same direction.

In GPT-2, “apple” and “pear” reach 0.456, “apple” and “laptop” 0.357. For comparison, 20,000 random token pairs averaged 0.27, and 95 out of 100 were below 0.35. So “apple” and “laptop” are barely above chance, “apple” and “pear” clearly above.

</details>

## Embedding and embedding matrix

In technical terms, a token’s profile is called an **[embedding](https://ki-einfach-verstehen.de/en/glossary/embedding/)**. Because it is an ordered list of numbers, it is a [vector](https://ki-einfach-verstehen.de/en/glossary/vector/). The whole table, with one row for every token of the [vocabulary](https://ki-einfach-verstehen.de/en/glossary/vocabulary/), is called the **[embedding matrix](https://ki-einfach-verstehen.de/en/glossary/embedding-matrix/)**.

![Three blank cards with patterns of vertical lines in teal and amber; the two on the left lie close together and have almost the same pattern, the one on the right lies a little apart and has a different one](../../public/bausteine/embeddings/steckbriefe.webp)

*Profiles without labels: tokens used in similar ways carry similar patterns of numbers; a token used differently carries a different one.*

A real profile looks like this, here the first 8 of 768 numbers for “apple” in GPT-2: 0.119 · −0.175 · 0.129 · 0.063 · 0.045 · 0.046 · −0.323 · 0.079. What does the seventh number mean? Nobody can say. Here the picture falls short: a profile on paper has fields such as height or eye color that someone filled in. Here no field has a name, and textbooks note that single numbers have no clear meaning. What an embedding expresses lies in all the numbers together.

In the smallest GPT-2, the embedding matrix has 50,257 rows of 768 numbers, just over 38 million. That is about 31 percent of its roughly 124 million parameters.

In today’s much larger models, the table is bigger still but only a small part, about 6.5 percent in Llama 3.1 8B from 2024. By far the largest part sits in the blocks after it, the subject of the next lesson.

The table has one row for every token, though, not for every word. The Qwen3 tokenizer splits the German words for apple and pear: “Apfel” becomes “Ap” plus “fel” and “Birne” becomes “Bir” plus “ne.” “Laptop” and “Bank,” by contrast, are one token each there. So this table has no “Apfel” row, only rows for the two pieces. The model assembles what “Apfel” means only in later steps. Other tokenizers split differently, but it happens in English too, with rarer words, names, and typos, and in languages such as German all the time.

You may have read that you can calculate with embeddings: king − man + woman gives queen. It only works that neatly with a trick: the input words are excluded from the search. Without it, the calculation on GPT-2’s table lands back on “king.” An embedding records how a token is used; it is no calculator for meanings.

<details>
<summary>One level deeper: does “king − man + woman = queen” hold?</summary>

The example comes from Tomas Mikolov and colleagues (2013), who excluded the input words when searching for “Queen.” A study from 2020 recalculated without this exclusion: accuracy on such analogy tasks fell from 0.71 to 0.21, and most often the starting word came back.

On GPT-2’s table without exclusion, “king” comes first with a cosine of 0.776, followed by “queen” with 0.709. The textbook by Jurafsky and Martin also notes that the method only works well for certain relations, such as country and capital, and even there only with the exclusion. Mikolov’s vectors also came from much simpler models than today’s chatbots.

</details>

## The seat in the sentence

One thing is still missing. “Dog bites man” and “man bites dog” consist of the same three words. If each is one token, the model fetches the same three profiles in both. Only the order differs, and it decides who gets bitten.

You might think the model knows the order anyway, since the profiles stand in sequence. But the steps after them come from the 2017 transformer architecture, which treats every row the same, no matter where it stands, like cards spread face up on a table. If you swap two rows, only the results swap. Its inventors therefore wrote that the tokens’ positions had to be supplied separately.

There is one qualification. In language models such as GPT-2, every token may, in the later steps, look only at the tokens before it, not after it; the next lesson shows how this looking works. This rule itself depends on the order, and from it a token could roughly read off how many predecessors it has. A study from 2022 found that such models, trained entirely without a position signal, still hold their own; the researchers suspect that this is exactly why. A separate signal, however, makes the order directly visible and is still standard today.

GPT-2 solves this with a second table. It has one row for each of the 1,024 possible places in the text. Each row is a profile for a **seat**: one for seat 1, one for seat 2, and so on. These numbers, too, start random and are learned. Because both profiles have the same length, they are added number by number. Suppose the profile of “dog” has 0.2 as its first number and the profile of seat 1 has 0.1; then 0.3 is passed on. If the dog sits in seat 3, as in “man bites dog,” and this seat has −0.1 there, 0.1 is passed on. Same token, different seat, different sum: the further calculation steps receive “dog in seat 1” or “dog in seat 3,” not just “dog.” The technical term for the seat profile is **[position embedding](https://ki-einfach-verstehen.de/en/glossary/position-embedding/)**.

![Three columns for dog, bites, and man: each with a token profile of four made-up numbers, below it plus seat 1, 2, or 3, below that equals the sum as input](../../public/bausteine/embeddings/seat.svg)

*Token profile plus seat profile gives what is passed on into the model. In “man bites dog,” the dog sits in seat 3, and its sum comes out differently.*

If you ask a chatbot whether Anna invited Ben or Ben invited Anna, without a position signal its model would receive the same profiles, only reordered. With the signal, the sums differ, and the later steps can tell who invited whom.

Taken literally, the seat picture only fits models like GPT-2. The original transformer used fixed sine and cosine wave patterns instead of a learned table. Many of today’s models, such as Llama, add nothing at the input. Instead, every block rotates the numbers a little, depending on the seat (technical term RoPE). This happens exactly where tokens look at each other. The next lesson shows how. Common to all variants: the profiles themselves contain no order, so the model receives it separately.

## A bank is a bank, for now

![Symbol of a bank building with columns](../../public/bausteine/transformerbloecke-und-attention/bank.svg)

*A bank by the river or a bank for your money: at the model’s input, it is the same profile.*

“We sat on the river bank.” “I took the money to the bank.” At the model’s input, it is the same token: same ID, same row in the embedding matrix. Only the seat part differs, and it reveals nothing about rivers or money.

This is the limit announced earlier: a token with several meanings must make do with one profile. With “apple,” capitalization helped, but even it does not separate cleanly; “iPhone” turns up among the neighbors of lowercase “apple,” after many fruit words. With “bank,” no spelling helps. River and money sit in the same row.

Even so, a chatbot usually understands “bank” correctly. In the following steps, the model’s blocks or layers, the profiles gradually take in information from the sentence. A study of GPT-2 and related models showed in 2019: in the upper layers, the representation of the same word depends much more strongly on the sentence than at the input. The profile from the table is only the starting point.

With that, the model’s input is complete. What is missing is context: how does each token get information from the other tokens in the sentence, so that “bank” means money one time and a riverside the next? That is the subject of the next lesson.

---

Source: https://ki-einfach-verstehen.de/en/lessons/embeddings/

← Previous: [Tokenization Inside the Model: How Your Chat Becomes a Token Sequence](./tokenization-inside-the-model.md) · [All lessons](../../README.md#contents) · Next: [Transformer Blocks and Attention: How Context Gets Mixed In](./transformer-blocks-and-attention.md) →
