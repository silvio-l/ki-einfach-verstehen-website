<!-- Generated from src/content/bausteine/en/transformer-blocks-and-attention.mdx by scripts/export-lessons.mjs -- do not edit by hand. -->

# Transformer Blocks and Attention: How Context Gets Mixed In

> Reading copy for GitHub. The full version with interactive demos, animations and recall moments is on the website: **[Transformer Blocks and Attention: How Context Gets Mixed In](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)**
>
> Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en) · Credit it as: KI einfach verstehen, “Transformer Blocks and Attention: How Context Gets Mixed In”, CC BY 4.0, https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/

How a language model mixes the information of earlier words into each token, why it may not look ahead while doing so, and how many such blocks work in a row.

![Building with columns on the left and a park bench on the right](../../public/bausteine/transformerbloecke-und-attention/bank-en.svg)

*“bank” can mean a bank for money or a bench to sit on: the word alone does not show which.*

Take “I pay money into the bank” and “I sit on the bank in the park.” Each token (each piece of text) has its **[embedding](https://ki-einfach-verstehen.de/en/glossary/embedding/)** from the previous lesson, a long list of numbers from the lookup table, the same for “bank” in both. Translating both into French, a chatbot must write “banque” (money) once and “banc” (bench) once. How can it tell?

The answer lies in many identically built blocks, each with its own numbers: the **[transformer](https://ki-einfach-verstehen.de/en/glossary/transformer/)** architecture, introduced in 2017. In them, each token gets information from other tokens.

## One embedding, two meanings

Reading “I sit on the bank,” you do not think of money, because you read the sentence around it. An embedding cannot.

A language model computes new numbers from each embedding, step by step; the table itself stays unchanged. As on the mixing desk, the numbers run through many stages, called blocks (often layers in model descriptions). The freely available Qwen3-8B, a larger sibling of the familiar Qwen3-0.6B-Base, has 36, holding most of its parameters.

A token's intermediate values are its **state**. It starts as the embedding (in GPT-2 plus the seat, see below), and each block updates it. Measurements on older, freely available models such as GPT-2 show that the same word's states usually differ more between sentences in later blocks. In GPT-2, the last block's states are shaped almost entirely by the sentence.

## The seat in the sentence

The embedding still lacks something simpler: where the token stands. “Dog bites man” and “Man bites dog” have the same three words and fetch the same three embeddings. Only the order differs, and it decides who gets bitten.

The blocks mix in words by adding up their contributions at different strengths. But a sum ignores order: 2 + 3 equals 3 + 2. Without position information, a token therefore learns mainly which words it sees and can infer their order only roughly at best. The 2017 researchers added position information separately because their model does not process words one by one.

GPT-2 uses a second table, one row for each of the 1,024 positions in the [context window](https://ki-einfach-verstehen.de/en/glossary/context-window/) (the most tokens handled at once). Each row is an embedding for one **seat**: seat 1, seat 2 and so on. These also start random and are learned.

Both have the same length and are added number by number. In a made-up example with one number, “dog” has 0.2 and seat 1 has 0.1, so 0.3 goes into the blocks. In seat 3, as in “Man bites dog,” the seat has −0.1, so only 0.1 goes in. **The same dog gives a different sum in another seat.** Its technical name is **[position embedding](https://ki-einfach-verstehen.de/en/glossary/position-embedding/)**.

![For dog, bites and man, each a token embedding plus seat 1, 2 or 3, and below it the sum as input (made-up numbers)](../../public/bausteine/embeddings/seat.svg)

*Token embedding plus seat embedding gives what goes into the blocks. In “Man bites dog,” the dog sits in seat 3, and its sum comes out differently.*

Is the token lost in the sum? With one number, yes: 0.3 can also come from 0.4 plus −0.1. With 768 numbers, hardly. A test on the smallest GPT-2 used 3,000 random pairs of token and seat. In 2,994 of them (99.8 percent), no token embedding pointed closer to the sum's direction than the correct token's.

Qwen3-8B has no such table. It handles position only inside the blocks: when two tokens are compared, their distance counts too. In GPT-2, the sum is the first state: the token knows where it stands, not which bank is meant. How do the other words get in?

## The spotlight: mixing in context, share by share

![Stage with six cards under a spotlight: the second is in strong light, the fifth in weaker light, the right one in shadow](../../public/bausteine/transformerbloecke-und-attention/scheinwerfer.webp)

*Schematic rather than the example sentence: the tokens receive different amounts of light, and the brighter ones contribute more strongly.*

For the token whose turn it is, several spotlights switch on. Their light falls on the tokens before it and on the token itself. **What is brightly lit flows strongly into the new state**, while tokens in dimmer light contribute only a little. The model actually computes all positions at the same time; here, one is picked out. This method is called **[attention](https://ki-einfach-verstehen.de/en/glossary/attention/)**. The spotlights are not aimed by hand: the model itself works out how much light each token receives.

Suppose vectors had only two places, one for “seating” and one for “money” (made-up numbers). Real vectors have thousands of unnamed places. “bank” starts undecided at (1 | 1). The spotlight brightens hints of seating. Which word of the park sentence will it light up most?

The brightest is “sit” with 50 percent; “on” and “bank” itself get 18 each, “I” and “the” 7 each, exactly 100 percent together. You know the rule from the lesson on [probability and softmax](./probability-and-softmax.md): there, [softmax](https://ki-einfach-verstehen.de/en/glossary/softmax/) turned the scores 3, 2 and −1 into the probabilities 72, 27 and 1 percent. Every block does the same, but first divides the scores by a fixed number so they do not grow too large with long vectors; the example skips this. Here, the percentages are shares of light, not probabilities.

Each word contributes two numbers, one per place:

| Word | Share | contributes: seating | contributes: money |
| :--- | ---: | ---: | ---: |
| I | 7 % | 0 | 0 |
| sit | 50 % | 2 | 0 |
| on | 18 % | 0 | 0 |
| the | 7 % | 0 | 0 |
| bank | 18 % | 1 | 1 |

Each contribution is multiplied by its share and added up: for seating 0.5 · 2 + 0.18 · 1 ≈ 1.2, for money 0.18 · 1 ≈ 0.2. This is a **weighted sum**. It is added to the old state rather than replacing it, so the state keeps what “bank” was: (1 | 1) plus (1.2 | 0.2) gives (2.2 | 1.2), clearly toward seating.

In the money sentence, both spotlights run; the money one is shown. Before softmax (made-up numbers), “money” scores 3, “pay” 2 and “bank” 1, the other words 0. “money” gets 61 percent and passes on (0 | 2), “pay” 22 percent and (0 | 1), “bank” 8 percent and (1 | 1); “I,” “into” and “the” share the other 9 percent and pass on nothing.

The mix is (0.08 | 1.5): 0.61 · 2 + 0.22 + 0.08 ≈ 1.5 for money, only the 0.08 from “bank” for seating. Added to (1 | 1), this spotlight alone gives (1.1 | 2.5), toward the financial institution.

![Shares for bank: in the park sentence sit gets 50 %, in the money sentence money gets 61 %; words after bank get 0](../../public/bausteine/transformerbloecke-und-attention/spotlight-weights.svg)

*The same word, two sentences, two spotlights (made-up numbers). Words that only come after “bank” get no share.*

## Query, key and value: where the shares come from

How does the spotlight know that “sit” fits better than “the”? As in an archive search, “bank” brings a search slip: “Any hints of seating here?” Each earlier word is a folder: tag outside, contents inside. **The slip is compared with the tags; the better a tag fits, the more of its folder's contents is taken along.**

In the model, the three parts are called **query** (search slip), **key** (the tag) and **value** (contents). All three are vectors computed from a state: the query belongs to the current token, a key and a value to each visible token. What each word contributed in the example were its values.

The model multiplies query and key number by number and adds the results. This gives a [score](https://ki-einfach-verstehen.de/en/glossary/score/), here for how well they fit, not for a next token. The query of “bank” seeks seating: (1 | 0). With the key of “sit,” (2 | 0), that gives 1 · 2 + 0 · 0 = 2. The keys of “on,” (1 | 0), and “bank,” (1 | 1), each give 1; those of “I” and “the,” (0 | 0), give 0.

Softmax turns the scores into the shares from before. As in the softmax lesson, a score of 0 gets strength 1, and each point more multiplies it by about 2.72. “sit” (score 2) reaches 2.72 · 2.72 ≈ 7.4, “on” and “bank” (score 1) 2.72 each, “I” and “the” (score 0) 1 each. That totals about 14.8, and 7.4 of it is 50 percent. Keys and values serve different purposes: a word can be found through one cue yet contribute something else. “on” matches a little through its key but contributes nothing through its value (0 | 0).

![Animation: the query of bank meets the keys, softmax turns them into shares, the values are mixed and added to the old state](../../public/bausteine/transformerbloecke-und-attention/query-key-value-en.static.svg)

[▶ watch the animation on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

*One pass for “bank”: compare the query with the keys, softmax turns the scores into shares, the values are mixed and added to the old state (made-up numbers).*

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

Where do query, key and value come from? Again from weighted sums: each state number is multiplied by a factor and summed. For the seating place of the query of “bank,” the factors are 0.5 and 0.5; with the state (1 | 1) that gives 0.5 · 1 + 0.5 · 1 = 1. For the money place, both are 0.

The factors sit in a table, a [matrix](https://ki-einfach-verstehen.de/en/glossary/matrix/), one each for query, key and value. On the mixing desk, their numbers are knobs, [parameters](https://ki-einfach-verstehen.de/en/glossary/parameters/): set by training and the same for every chat message. Query, key and value are displays, new for every text. The example's factors are made up; in the real model, nobody decided that “sit” fits “bank.”

And “park,” the best hint of a bench, got no share at all. Why?

## No looking ahead: the causal mask

“Park” comes after “bank.” Language models that write from left to right, like chatbots, follow a fixed rule: **each position sees only itself and the positions before it**, never those after. For “bank,” “park” is invisible, even though it stands there.

![Crossed-out eye](../../public/bausteine/transformerbloecke-und-attention/nicht-nach-vorne.svg)

*What comes after the current token stays invisible.*

The reason lies in training: the whole sentence goes in at once, and at each position the model should predict exactly the next token. The position of “bank” should predict “in.” If it could already see “in,” it could just copy.

A **[causal mask](https://ki-einfach-verstehen.de/en/glossary/causal-mask/)** enforces this rule: before softmax, it sets every later position's score to minus infinity. The share there is *exactly* 0. For a whole sentence this gives a triangle: the first word sees only itself, the last sees all.

![Eight by eight grid: yes on and below the diagonal, minus infinity above it; bank may look at I through bank, not at in, the and park](../../public/bausteine/transformerbloecke-und-attention/causal-mask-en.svg)

*The causal mask for “I sit on the bank in the park”: each row shows what a position may look at. The row of “bank” is highlighted.*

“Park” may look at everything, including “bank.” The next word is predicted from the last position's state, which sees the whole sentence. If “park” comes first, as in “In the park I sit on the bank,” even “bank” sees “park.”

## Many spotlights, many blocks

The example had two spotlights, for seating and for money. Why not one? Its light always adds up to 100 percent over all visible tokens. To light both kinds of hints at once, it must split its light, and the other tokens get some too. So a block has several spotlights, called **heads**, each with its own query matrix. They compute at the same time; their mixes are concatenated, combined by another learned matrix and added to the state. Qwen3-8B has 32 heads per block; the smaller Qwen3-0.6B-Base in the demo below has 16.

Some heads can be interpreted. An **induction head** looks for what followed the last occurrence of the current token: if “Mrs. Kowalczyk” appeared earlier in the chat and “Mrs.” comes again, it highlights “Kowalczyk.” Large models show only hints of this; many heads have no nameable pattern.

> **Interactive demo:** [try it on the website](https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/)

Attention is only the first part of a block. Next comes the **further processing** (a feed-forward network, as in the lesson on [layers](./layers.md)). In the 2017 transformer paper, this stage is a ReLU, which sets negative values to zero; each token is processed on its own. Its result is also added to the state. Attention plus further processing form a **[transformer block](https://ki-einfach-verstehen.de/en/glossary/transformer-block/)**.

<details>
<summary>One level deeper: which step does Qwen3-8B, an open language model, use?</summary>

Qwen3-8B's public configuration file lists `silu` under `hidden_act`. The further processing, however, uses a design called SwiGLU: one computation passes through `silu`, another remains linear, and their product continues. The `silu` curve is rounded: large negative inputs approach zero, large positive inputs remain almost unchanged, with no sharp corner between them.

In the model code, the output of `gate_proj` goes through this step, is multiplied by the output of `up_proj` and is then sent through `down_proj`.

The same file lists `num_hidden_layers` as 36: the large blocks of this lesson. In the 2017 transformer, each head also had its own key and value matrices. Here, to save memory, the 32 heads form groups of four; each group shares the same keys and values, only the queries differ.

</details>

![Embeddings of all tokens run through block 1 (attention, then further processing), blocks 2 to 36, and come out as states with context](../../public/bausteine/transformerbloecke-und-attention/block-stack.svg)

*Each block first mixes between the positions and then processes each position on its own. Qwen3-8B has 36 such blocks in a row.*

**Context comes in only through attention.** Yet in large models, most parameters sit in the further processing; in Qwen3-8B about two thirds, calculated from the published values. Knowledge probably sits there too; how it is stored is only partly understood. Block counts vary: the smallest GPT-2 has 12, Qwen3-8B 36, the large GPT-3 96.

Do the spotlights show why the chatbot answers as it does?

## What the spotlight does not reveal

Some tools display a head's light as a colored table: here the model “looked.” Research is more cautious.

You can test a word's importance by leaving it out. A widely cited 2019 study did this: how much the prediction changed often matched the shares poorly. But it examined models of an older design without transformer blocks, and others argued that it depends on what counts as an explanation.

Across blocks, information mixes ever more: after a few blocks, the state of “sit” is no longer just “sit,” and light on “sit” in block 20 hits a mixture of many words. Besides the share, the value counts: a lit token with a tiny value adds little, like “on” in the example.

Light also lands strikingly often on a text's first token, even when it contributes little. Researchers call this **attention sinks**. The demo puts `<|endoftext|>`, which separates texts in Qwen, before its sentence, so it becomes the first token; Qwen itself adds no fixed start token. A suspected reason: the shares must add up to 100 percent; if a head finds nothing fitting, the light must go somewhere, and the first token is visible to every later position. Llama-2, a large open model with 70 billion parameters, shows it too.

This is where the spotlight picture ends: it shows well how information is mixed, but **it does not reliably explain why an answer comes out**.

“Bank” starts with the same token embedding; in GPT-2 a different seat is added. In each block, attention mixes in the values of the token itself and earlier tokens by their shares, never of later ones. Both spotlights run in both sentences; in the worked example “sit” pulls harder toward seating, “money” toward the financial institution. How the state becomes a score list over the vocabulary is the next lesson's topic.

---

Source: https://ki-einfach-verstehen.de/en/lessons/transformer-blocks-and-attention/

← Previous: [Embeddings: How a Number Becomes a Learned Vector](./embeddings.md) · [All lessons](../../README.md#contents) · Next: [Output Head: From the Last State to a Prediction](./output-head.md) →
