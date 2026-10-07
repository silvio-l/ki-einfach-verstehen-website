<!-- Generated from src/content/bausteine/en/transformer-blocks-and-attention.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Transformer Blocks and Attention: How Context Gets Mixed In

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Transformer Blocks and Attention: How Context Gets Mixed In](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Transformer Blocks and Attention: How Context Gets Mixed In”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/

How a language model mixes earlier words into every token, why it may not look ahead while doing so, and how many such blocks work in a row.

Two sentences: “I pay money into the bank” and “I sit on the bank in the park.” In the previous lesson, each token got its profile from the model’s lookup table. For “bank,” it is the same list of numbers in both sentences. Yet a chatbot translating both into German needs two words: one for the money bank, one for the grassy one. How should it know which, when “bank” looks the same both times?

![Building with columns and a gable](../../public/bausteine/transformerbloecke-und-attention/bank.svg)

*A bank for money or a bank to sit on: the word alone does not decide it.*

The answer lies in the largest part of a language model: many identically built blocks, each with its own numbers. This architecture is called a **[transformer](https://ki-einfach-verstehen.de/en/glossary/transformer/)**, introduced in 2017. This lesson shows how they bring each token information from the others. Here, every word is one token.

## One profile, two meanings

Reading the park sentence, you do not think of money, because you read the rest of it along. A profile cannot do that: every “bank” gets the same one from the table, whatever comes before or after. The seat profile from the previous lesson only says where the word stands, not which bank it is.

A language model reshapes each profile step by step. Remember the mixing desk from this topic area’s first lesson? Your text ran through many computing stages as a signal, and the numbers passed from stage to stage were intermediate values, the meters in the picture. These computing stages are the blocks; model specs usually call them layers. The open model Qwen3-8B from that lesson has 36, holding by far the largest part of its parameters. In every block, something from the other tokens gets mixed into a token’s vector.

In this lesson, the intermediate values of a single token are called its **state**. At the input, the state is the profile; after each block, a new version of it. Measurements show it: across sentences, a word’s states differ more, the later the block; in GPT-2, after the last block, the sentence shapes them almost entirely. But how does the information of the other words get in?

## The spotlight: mixing in context, share by share

For the token whose turn it is, a spotlight switches on. Its light spreads over the tokens before it and the token itself, some brightly, others faintly. **What is brightly lit flows strongly into the new state**, what lies in half-darkness only a little. In reality, the model computes all positions at once; here, one is picked out. This method is called **[attention](https://ki-einfach-verstehen.de/en/glossary/attention/)**.

![A stage with six light cards in a row; above it hangs a single spotlight whose wide beam spreads unevenly: the second card is in strong amber light, the fifth in weaker amber light, three cards get only pale light, and the card on the far right stays in shadow](../../public/bausteine/transformerbloecke-und-attention/scheinwerfer.webp)

*The light falls on the cards with different brightness. What is brightly lit flows in strongly.*

An example with made-up numbers shows how; feel free to calculate along. Suppose each vector had only two places, “place to sit” and “money”; real vectors have thousands of unnamed places. At the start, the state of “bank” is (1 | 1), undecided. The spotlight looks for clues about a place to sit; how it “knows” that comes in the next section. Think for a moment: which word in the park sentence will it light most brightly?

The brightest is “sit” with 50 percent. “on” and “bank” itself get 18 each, “I” and “the” 7 each. Together, that is exactly 100 percent. You know this rule from the lesson on [probability and softmax](./probability-and-softmax.md), where scores turned into the shares 72, 27 and 1 percent. The model indeed uses [softmax](https://ki-einfach-verstehen.de/en/glossary/softmax/) here too. Here, a “share” always means such a percentage, not the parameters the foundations also called weights.

So what does “flow in strongly” mean? Each word passes on two numbers, one per place. This is not simply its state; the next section shows what it is.

| Word | Share | passes on: place to sit | passes on: money |
| :--- | ---: | ---: | ---: |
| I | 7% | 0 | 0 |
| sit | 50% | 2 | 0 |
| on | 18% | 0 | 0 |
| the | 7% | 0 | 0 |
| bank | 18% | 1 | 1 |

Each contribution is multiplied by its share, then all are added up. For place to sit, 0.5 · 2 + 0.18 · 1 gives about 1.2; for money, 0.18 · 1 gives only about 0.2. A calculation like this is called a **weighted sum**, weighted here by the shares. The mix (1.2 | 0.2) is added to the old state instead of replacing it, keeping what “bank” was: (1 | 1) plus (1.2 | 0.2) gives (2.2 | 1.2). The state now points clearly towards a place to sit.

In the money sentence, this spotlight finds no place-to-sit clues; most of its light falls on “bank” itself. A second spotlight, looking for money clues, lights “money” with 61, “pay” with 22 and “bank” with 8 percent. “money” passes on (0 | 2), “pay” (0 | 1), “bank” (1 | 1) as before. For money, 0.61 · 2 + 0.22 · 1 + 0.08 · 1 gives about 1.5, for place to sit only about 0.1. Added to the old state: (1.1 | 2.5), towards the financial institution.

![Two bar charts. At the top, the sentence I sit on the bank in the park, the spotlight looks for a place to sit: sit gets the largest share with 50 percent, on and bank 18 each, I and the 7 each; in, the and park only come later and get 0. At the bottom, the sentence I pay money into the bank, the spotlight looks for money: money gets 61 percent, pay 22, bank 8, I, into and the 3 each](../../public/bausteine/transformerbloecke-und-attention/spotlight-weights.svg)

*The same word, two sentences, two spotlights (made-up numbers). Words that only come after “bank” get no share.*

The picture has a limit: nobody aims the spotlights, and the model does not “pay attention” like a human. The shares are calculated.

## Query, key and value: where the shares come from

How does the spotlight know that “sit” fits better than “the”? Picture an archive. “bank” brings a search slip: “Any place-to-sit clues here?” Each word before it is a folder with a label on its spine and contents inside. **The slip is compared with the labels; the contents get taken.** With label and contents separate, a folder can fit well and still hold little. Here the picture ends: in an archive, you pull one folder; attention takes something from each, by fit.

The model calls them **query** (search slip), **key** (label) and **value** (contents). All three are vectors calculated from a token’s state: the query for the token whose turn it is, key and value for every visible token. The numbers each word passed on in the example were its values.

To compare, multiply query and key place by place and add up. That gives a [score](https://ki-einfach-verstehen.de/en/glossary/score/), a number for how well the two fit. The query of “bank” looks for a place to sit: (1 | 0). With the key of “sit,” (2 | 0), that gives 1 · 2 + 0 · 0 = 2. The keys of “on,” (1 | 0), and “bank,” (1 | 1), give 1 each; “I” and “the,” with keys (0 | 0), give 0.

Softmax turns the scores into the shares from before. Remember its rule? A score of 0 becomes 1, and every point more multiplies by about 2.72. So “sit” comes to 7.4, “on” and “bank” to 2.72 each, “I” and “the” to 1 each. Together that is about 14.8, and 7.4 is half of it: 50 percent. “on” shows why key and value are separate: its key fits a little, but its value is (0 | 0), so it brings nothing.

![Animation: the query of bank is compared with the keys, softmax turns the scores into shares, the values are mixed, and the old state plus the mix gives the new state of bank](../../public/bausteine/transformerbloecke-und-attention/query-key-value-en.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

*One pass for “bank”: compare the query with the keys, softmax turns the scores into shares, the values are mixed and added to the old state (made-up numbers).*

So there are four steps: compare the query with all visible keys, form shares with softmax, mix the values by share, add the mix to the state.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

Where do query, key and value come from? Recall the spam filter from the foundations? It added up the weights of the words that occurred in an email. The query works similarly, except that each number of the state is first multiplied by its weight, here called a factor, and then everything is added up. For the place-to-sit position, the factors are 0.5 and 0.5, so 0.5 · 1 + 0.5 · 1 = 1; for the money position, both are 0. That is how (1 | 1) becomes the query (1 | 0).

The factors sit in a table, a [matrix](https://ki-einfach-verstehen.de/en/glossary/matrix/), one each for query, key and value. Unlike the lookup table from the previous lesson, no ID picks a row here; all numbers of the matrix are calculated with the state. On the mixing desk, they are faders, so [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/): set by training, the same for every chat message. Query, key and value are meters, new for every text. Nobody told the model that “sit” fits “bank”; such fits arise because they helped predict the next token.

In models like Qwen3-8B, this is also where the seat comes in, as the previous lesson announced: before the comparison, query and key are rotated depending on their position, like a clock hand: the further back, the further. The comparison then counts not the position itself but the difference between the rotations, that is, the distance (technical term RoPE).

One more thing stands out: “park”, the best clue that this bank is for sitting, got no share. Why?

## No looking ahead: the causal mask

“park” comes after “bank.” Models that write from left to right, like chatbots, have a fixed rule: **each position sees only itself and those before it**, never those after. For “bank,” “park” is invisible, although it is already there.

![Crossed-out eye](../../public/bausteine/transformerbloecke-und-attention/nicht-nach-vorne.svg)

*What comes after the current token stays invisible.*

The reason lies in training. A language model learns to predict the next token at every point: the position of “bank” should predict “in.” If it could see “in”, it could copy instead of predicting. When answering, later tokens do not exist yet anyway.

The rule is implemented with a **[causal mask](https://ki-einfach-verstehen.de/en/glossary/causal-mask/)**. Before softmax runs, it sets the score of every later position to minus infinity. By the softmax rule, every point less divides by 2.72, and infinitely many points less leave nothing over. With ordinary scores, something always remains, as in the lesson on softmax. Here the share is *exactly* 0, not merely almost 0. For a whole sentence, this forms a triangle: the first word sees only itself, the second two words, and so on up to the last, which sees all.

![Grid of eight by eight squares with the words I, sit, on, the, bank, in, the, park as rows and columns. On and below the diagonal it says yes, above it minus infinity. In the highlighted row bank, I, sit, on, the and bank are allowed, in, the and park are blocked](../../public/bausteine/transformerbloecke-und-attention/causal-mask-en.svg)

*The causal mask for “I sit on the bank in the park”: each row shows what a position may look at. The row of “bank” is highlighted.*

In turn, “park” may look at everything, including back at “bank”. So is the translation stuck? No. The model predicts the next word from the state of the last position; the next lesson shows how. And that position sees the whole sentence, with “park” and “bank” in it. Rearrange the sentence to “In the park, I sit on the bank”, and even “bank” itself sees “park”.

<details>
<summary>One level deeper: the attention formula</summary>

The 2017 transformer paper fits the calculation on one line. With the mask:

`Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k + M) · V`

Q, K and V are matrices with one row per token. The superscript T flips the key table: rows become columns. So every query meets every key, and Q·Kᵀ delivers all scores at once. M contains 0 for allowed and −∞ for blocked pairs. d_k is the number of places in a key: 2 in the worked example, 128 in Qwen3-8B.

New is the division by √d_k: the score of “sit” would be 2 / √2, about 1.41. The authors suspect that scores with many places get very large. With random numbers and 128 places, they spread by about ±11; divided by √128, by only ±1. Large gaps make softmax give almost everything to one candidate: 8, 16 and 24 give almost 100 percent to the largest. Then small fader adjustments barely change the result, and training gets hardly any signal which way to adjust.

</details>

## Many spotlights, many blocks

The worked example already had two spotlights, for place-to-sit clues and for money clues. Why not one for both? Its light always adds up to 100 percent. To light both kinds at once, it would have to split the light, and each clue would arrive half as clearly. So a block has several spotlights, called **heads**, each with its own matrices and query. All heads of a block compute at the same time. Their mixes are concatenated, brought back to the length of the state with another learned matrix, and only then added. So the (2.2 | 1.2) above showed just one head’s contribution. Qwen3-8B has 32 heads per block. Unlike in the example, nobody decides what a head looks for.

Some heads can be interpreted: an **induction head** looks for what followed the current token last time. If “Ms Kowalczyk” appeared earlier in the chat and “Ms” comes up again, it highlights “Kowalczyk”. For large models, the evidence is only circumstantial; many heads show no nameable pattern.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

Attention is only the first part of a block. Then comes **further processing** (technical term: feed-forward network). There, each token gets a large calculation with many faders, without looking at the others. Its result is also added to the state. Attention plus further processing form a **[transformer block](https://ki-einfach-verstehen.de/en/glossary/transformer-block/)**.

![From top to bottom: profiles of all tokens, then block 1 with the parts attention, mixes between positions, and further processing, each position on its own; below it block 2, same design with its own numbers, an ellipsis, block 36 in Qwen3-8B, and at the bottom states with context mixed in](../../public/bausteine/transformerbloecke-und-attention/block-stack.svg)

*Each block first mixes between the positions and then processes each position on its own. Qwen3-8B has 36 such blocks in a row.*

**Context only enters through attention.** Yet most parameters sit in the further processing, about two thirds in Qwen3-8B (recalculated from the published values). Much of the knowledge from this topic area’s first lesson also seems to sit there, such as Paris being the capital of France. A transformer stacks one to several dozen such blocks, depending on the model.

After the last block, every state holds much context. Do the spotlights reveal why the chatbot answers as it does?

## What the spotlight does not reveal

Some programs show a head’s light as a colored table: this is where the model “looked”. Research is more cautious than that glimpse suggests.

A widely cited 2019 study also measured a word’s importance another way: leave the word out and see how much the prediction changes. This often barely agreed with the shares. And very different distributions of light led to the same prediction. But it studied older models, not transformers, and others countered that it depends on what counts as an explanation.

Transformers add more. First, information mixes more and more across blocks. After a few blocks, the state of “sit” is no longer just “sit”, and a share in the tenth block points at a mix. Second, the value counts as well as the share: a lit token with a tiny value brings little, like “on” in the worked example: 18 percent of the light, but value (0 | 0).

Third, a striking amount of light lands on a text’s first tokens, such as the special token for the start of the text, like `<|begin_of_text|>`, even when they mean nothing. Researchers call them **attention sinks**. Their explanation: the shares always have to add up to 100 percent. If a head finds nothing fitting, the light must still go somewhere, and because of the causal mask, the first token is visible to every position.

Here the spotlight picture ends: it shows well how information gets mixed, but **does not reliably explain why an answer comes about**.

That answers the opening question: “bank” starts with the same profile. In each block, attention mixes in the values of earlier tokens by calculated shares, never later ones. In the park sentence, “sit” pulls the state towards a place to sit; in the money sentence, “money” pulls it towards the financial institution. The next lesson shows how the last position’s state becomes a score list over the whole vocabulary.

---

Source: https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/

← Previous: [Embeddings: How a Number Becomes a Meaningful Vector](./embeddings.md) · [All lessons](../../README.md#contents) · Next: [Output Head: From the Last State to a Prediction](./output-head.md) →
