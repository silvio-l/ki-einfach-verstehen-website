<!-- Generated from src/content/bausteine/en/transformer-blocks-and-attention.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Transformer Blocks and Attention: How Context Gets Mixed In

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Transformer Blocks and Attention: How Context Gets Mixed In](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Transformer Blocks and Attention: How Context Gets Mixed In”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/

How a language model mixes earlier words into every token, why it may not look ahead while doing so, and how many such blocks work in a row.

Two sentences: “I pay money into the bank” and “I sit on the bank in the park.” In the previous lesson, each token got its profile, a long list of numbers from the model’s lookup table. For “bank,” it is the same list in both. Yet a chatbot translating them into German must use “Bank” for one and “Ufer,” the grassy bank you sit on, for the other. How should it know, when “bank” looks the same both times?

![Building with columns and a gable](../../public/bausteine/transformerbloecke-und-attention/bank.svg)

*A bank for money or a bank to sit on: the word alone does not decide it.*

The answer lies in many identically built blocks, each with its own numbers. This architecture, introduced in 2017, is called a **[transformer](https://ki-einfach-verstehen.de/en/glossary/transformer/)**. In these blocks, each token gets information from the others. For simplicity, each word here is one token.

## One profile, two meanings

Reading “I sit on the bank,” you do not think of money, because you read the sentence around it. A profile cannot: every “bank” gets the same one, whatever comes before or after.

A language model solves this by computing new numbers from each profile, step by step; the table itself stays unchanged. Remember the mixing desk from this topic area’s first lesson? Your text ran through many computing stages. The numbers in between were intermediate values, shown as meters in the mixing-desk picture. These stages are the blocks, called layers in model specs. The openly available Qwen3-8B, a larger sibling of Qwen3-0.6B-Base from that lesson, has 36; they hold most of its parameters by far.

Here, a single token’s intermediate values are called its **state**. It starts as the profile; each block makes a new version. Measurements show that a word’s states differ more across sentences in later blocks. In GPT-2 (an older, freely available model), after the last block, the sentence shapes them almost entirely.

## The seat in the sentence

Before any context, the profile lacks something simpler: where the token stands. “Dog bites man” and “man bites dog” consist of the same three words. The model fetches the same three profiles for both. Only the order differs, and it decides who gets bitten. If you ask a chatbot who gets bitten, it must distinguish the two.

You might think the model already knows the order, since the profiles are listed in sequence. But every block treats every state alike, and when it mixes in the other words, it only adds up how much comes from each. In a sum, order does not matter: 2 + 3 equals 3 + 2. Within one block, a token thus learns which words it sees, but not their order or distance. That is why the 2017 researchers wrote that position should be supplied separately.

GPT-2 solves this with a second table. It has one row per position in the [context window](https://ki-einfach-verstehen.de/en/glossary/context-window/) (the maximum number of tokens the model processes at once), 1,024 in GPT-2. Each row is a profile for a **seat**: one for seat 1, one for seat 2, and so on. They, too, start random and are learned in training.

Both profiles have the same length, so they are added number by number. Suppose the profile of “dog” starts with 0.2 and that of seat 1 with 0.1. Then 0.3 goes into the blocks. If the dog sits in seat 3 (“man bites dog”), whose profile starts with −0.1, 0.1 goes in. **The same dog in a different seat gives a different sum.** The technical term for the seat profile is **[position embedding](https://ki-einfach-verstehen.de/en/glossary/position-embedding/)**.

![Three columns for dog, bites, and man: each with a token profile of four made-up numbers, below it plus seat 1, 2, or 3, below that equals the sum as input](../../public/bausteine/embeddings/seat.svg)

*Token profile plus seat profile gives what goes into the blocks. In “man bites dog,” the dog sits in seat 3, and its sum comes out differently.*

Does this lose track of which token it was? With one number, yes, since 0.3 could also be 0.3 plus 0. With 768 numbers, hardly. Calculations for this lesson checked which GPT-2 token profile is most similar to such a sum, meaning it points most nearly in the same direction. In over 99 of 100 cases, it is the right token’s.

Qwen3-8B has no such table. It brings in the seat only inside the blocks, where tokens are compared. In GPT-2, the sum is the token’s first state: it now knows where it stands, but not which bank is meant. How does information from the other words get in?

## The spotlight: mixing in context, share by share

For the token whose turn it is, several spotlights switch on; for now, follow just one. Its light spreads over the tokens before it and the token itself: some places are lit brightly, others faintly. **What is brightly lit flows strongly into the new state**; what lies in half-darkness contributes only a little. The model computes all positions at once; here, one is picked out. This method is called **[attention](https://ki-einfach-verstehen.de/en/glossary/attention/)**. Nobody aims the spotlight: the model calculates how bright each place gets.

![A stage with six light cards in a row; above it hangs a single spotlight whose wide beam spreads unevenly: the second card is in strong amber light, the fifth in weaker amber light, three cards get only pale light, and the card on the far right stays in shadow](../../public/bausteine/transformerbloecke-und-attention/scheinwerfer.webp)

*The light falls on the tokens with different brightness. What is brightly lit flows in strongly.*

Suppose each vector had only two places, one for “place to sit” and one for “money” (made-up numbers). The state of “bank” starts as (1 | 1), undecided. In this example, the spotlight lights up place-to-sit clues. Think for a moment: which word in the park sentence will it light most brightly?

The brightest is “sit” with 50 percent. “on” and “bank” itself get 18 percent each, “I” and “the” 7 each. Together, exactly 100 percent. You know the rule from the lesson on [probability and softmax](./probability-and-softmax.md): there, at the model’s output, [softmax](https://ki-einfach-verstehen.de/en/glossary/softmax/) turned scores into the probabilities 72, 27 and 1 percent. But these percentages are not probabilities for a next token; they are shares of the light.

Each word passes on two numbers, one per place:

| Word | Share | passes on: place to sit | passes on: money |
| :--- | ---: | ---: | ---: |
| I | 7% | 0 | 0 |
| sit | 50% | 2 | 0 |
| on | 18% | 0 | 0 |
| the | 7% | 0 | 0 |
| bank | 18% | 1 | 1 |

Each contribution is multiplied by its share, then all are added up. For place to sit, 0.5 · 2 + 0.18 · 1 gives about 1.2; for money, 0.18 · 1 gives only about 0.2. A calculation like this is called a **weighted sum**, weighted here by the shares. The mix (1.2 | 0.2) is added to the old state instead of replacing it, keeping what “bank” was: (1 | 1) plus (1.2 | 0.2) gives (2.2 | 1.2). The state now points clearly toward a place to sit.

In the money sentence, the same spotlight shines but finds no place-to-sit clues. Alongside it, a second spotlight looks for money clues in both sentences. In the money sentence, it gives “money” 61 percent, and the state ends up at (1.1 | 2.5), toward the financial institution.

![Two bar charts. At the top, the sentence I sit on the bank in the park, the spotlight looks for a place to sit: sit gets the largest share with 50 percent, on and bank 18 each, I and the 7 each; in, the and park only come later and get 0. At the bottom, the sentence I pay money into the bank, the spotlight looks for money: money gets 61 percent, pay 22, bank 8, I, into and the 3 each](../../public/bausteine/transformerbloecke-und-attention/spotlight-weights.svg)

*The same word, two sentences, two spotlights (made-up numbers). Words that only come after “bank” get no share.*

## Query, key and value: where the shares come from

How does the spotlight know that “sit” fits better than “the”? As in an archive search, “bank” comes with a search slip: “Any place-to-sit clues here?” Each word before it is a folder with a label on its spine and contents inside. **The slip is compared with the labels; the contents get taken.** Here the picture ends: in an archive, you pull out one folder. Attention takes something from each, by how well it fits.

The model calls them **query** (search slip), **key** (label) and **value** (contents). All three are vectors calculated from a token’s state: the query for the token whose turn it is, key and value for every visible token. The numbers each word passed on in the example were its values.

The model multiplies query and key place by place, then adds the results. That gives a [score](https://ki-einfach-verstehen.de/en/glossary/score/), here not for a next token, but for how well query and key fit. The query of “bank” looks for a place to sit: (1 | 0). With the key of “sit,” (2 | 0), that gives 1 · 2 + 0 · 0 = 2. The keys of “on,” (1 | 0), and “bank,” (1 | 1), give 1 each; the keys (0 | 0) of “I” and “the” give 0.

Softmax turns the scores into the shares from before. Remember the rule? A score of 0 gets the strength 1, and every point more multiplies it by about 2.7. This gives “sit” a strength of 7.4, “on” and “bank” 2.7 each, and “I” and “the” 1 each. Together about 14.8, and 7.4 divided by 14.8 is half: 50 percent. Key and value have different jobs. What makes a word match need not be what it contributes. The key of “on” fits a little, but its value (0 | 0) brings nothing.

![Animation: the query of bank is compared with the keys, softmax turns the scores into shares, the values are mixed, and the old state plus the mix gives the new state of bank](../../public/bausteine/transformerbloecke-und-attention/query-key-value-en.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

*One pass for “bank”: compare the query with the keys, softmax turns the scores into shares, the values are mixed and added to the old state (made-up numbers).*

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

Where do query, key and value come from? Again from a weighted sum: each number of the state is multiplied by a factor, then all are added up. For the place-to-sit number in the query of “bank,” the factors are 0.5 and 0.5, so with the state (1 | 1), 0.5 · 1 + 0.5 · 1 = 1; for its money number, both are 0.

The factors sit in a table, a [matrix](https://ki-einfach-verstehen.de/en/glossary/matrix/), one each for query, key and value. Unlike in the previous lesson’s lookup table, no ID picks a row. The calculation combines all the matrix’s numbers with the state. On the mixing desk, they are faders, that is, [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/): set by training, the same for every chat message. Query, key and value, by contrast, are meters, new for every text. In the example, the factors are made up. In a real model, nobody specified that “sit” fits “bank,” and no place has a name.

And “park,” the best clue for a place to sit, got no share at all. Why?

## No looking ahead: the causal mask

“park” comes after “bank.” Language models that write from left to right, like chatbots, have a fixed rule: **each position sees only itself and the positions before it**, never those after. For “bank,” “park” is invisible, although it is there.

![Crossed-out eye](../../public/bausteine/transformerbloecke-und-attention/nicht-nach-vorne.svg)

*What comes after the current token stays invisible.*

The reason lies in training. There, the whole sentence goes in at once. At every position, the model should predict the next token: the position of “bank” should predict “in.” If it could already see “in,” it would not need to predict; it could copy.

A **[causal mask](https://ki-einfach-verstehen.de/en/glossary/causal-mask/)** enforces the rule: before softmax, it sets every later position’s score to minus infinity. For every point lower, the softmax rule divides the strength by about 2.7. With infinitely many points lower, nothing is left. Ordinary scores always leave a remainder, but here the share is *exactly* 0. For a whole sentence, this gives a triangle: the first word sees only itself, the second two words, and so on to the last, which sees all.

![Grid of eight by eight squares with the words I, sit, on, the, bank, in, the, park as rows and columns. On and below the diagonal it says yes, above it minus infinity. In the highlighted row bank, I, sit, on, the and bank are allowed, in, the and park are blocked](../../public/bausteine/transformerbloecke-und-attention/causal-mask-en.svg)

*The causal mask for “I sit on the bank in the park”: each row shows what a position may look at. The row of “bank” is highlighted.*

“park,” by contrast, may look at everything, including back at “bank.” For the translation, that is still enough: the model predicts the next word from the last position’s state, and that position sees the whole sentence, “park” and “bank” included. If “park” comes first, as in “In the park, I sit on the bank,” even “bank” sees “park.”

## Many spotlights, many blocks

The example already had two spotlights, for place-to-sit and for money clues. Why not one for both? Its light always adds up to 100 percent. To light both kinds of clues at once, it would have to split the light, and each would arrive only half as clearly. So a block has several spotlights, called **heads**, each with its own query matrix and so its own query. A block’s heads compute at the same time, in every sentence. Their mixes are joined end to end, combined with another learned matrix, then added. Qwen3-8B has 32 heads per block.

Some heads can be interpreted. An **induction head** looks for what followed the last occurrence of the current token: if “Ms. Kowalczyk” appeared earlier in the chat and “Ms.” comes up again, it highlights “Kowalczyk.” For large models, the evidence is only circumstantial; many heads show no nameable pattern.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

Attention is only the first part of a block. Then comes **further processing** (feed-forward network), built from layers with a kink, as in the lesson on [neural networks](./neural-networks.md). There, each token gets a large calculation of its own, ignoring the others. Its result is also added to the state. Attention plus further processing together form a **[transformer block](https://ki-einfach-verstehen.de/en/glossary/transformer-block/)**.

![From top to bottom: profiles of all tokens, then block 1 with the parts attention, mixes between positions, and further processing, each position on its own; below it block 2, same design with its own numbers, an ellipsis, block 36 in Qwen3-8B, and at the bottom states with context mixed in](../../public/bausteine/transformerbloecke-und-attention/block-stack.svg)

*Each block first mixes between the positions and then processes each position on its own. Qwen3-8B has 36 such blocks in a row.*

**Context only enters through attention.** Yet in large models, most parameters sit in the further processing, about two thirds in Qwen3-8B, recalculated from the published values. Much knowledge seems to sit there too, such as Paris being France’s capital.

After the last block, every state holds much context. Do the spotlights reveal why the chatbot answers as it does?

## What the spotlight does not reveal

Some programs show a head’s light as a colored table: here the model “looked.” That seems like a glimpse into its thinking; research is more cautious.

A word’s importance can be tested by leaving it out. A widely cited 2019 study did that: how much the prediction changed often barely matched the shares. But it studied models of an older design without transformer blocks, and others countered that it depends on what counts as an explanation.

In transformers, information gets mixed more and more across the blocks. After a few blocks, the state of “sit” is no longer just “sit.” So light on “sit” in block 20 lights up a mix of many words. Along with the share, the value counts: a lit token with a tiny value brings little, like “on” in the example.

A striking amount of light also lands on a text’s first tokens, for example on a special start-of-text token such as `<|begin_of_text|>`, even when they mean nothing. Researchers call them **attention sinks**. Their explanation: the shares must always add up to 100 percent. If a head finds nothing that fits, the light must still go somewhere, and because of the causal mask, every position sees the first token.

Here the spotlight picture ends: it shows well how information gets mixed, but **does not reliably explain why an answer comes about**.

“bank” starts with the same profile. In every block, attention mixes in the values of earlier tokens by calculated shares, never of later ones. In the park sentence, “sit” pulls the state toward a place to sit; in the money sentence, “money” pulls it toward the financial institution. The next lesson shows how the last position’s state becomes a score list over the whole vocabulary.

---

Source: https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/

← Previous: [Embeddings: How a Number Becomes a Learned Vector](./embeddings.md) · [All lessons](../../README.md#contents) · Next: [Output Head: From the Last State to a Prediction](./output-head.md) →
