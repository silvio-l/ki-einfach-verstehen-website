---
title: 'Vocabulary'
description: 'The fixed list of entries a tokenizer recognizes and a model uses to build its answers.'
translationKey: vokabular
---

A tokenizer's vocabulary is the fixed list of all entries it knows, most of them pieces of text, each called a [token](/en/glossary/token). The model that uses this tokenizer works with exactly these entries. GPT-2, an OpenAI language model, has 50,257 of them. A [tokenizer](/en/glossary/tokenizer) splits text into pieces from this vocabulary and assigns each piece a [token ID](/en/glossary/token-id).

**An example:** The vocabulary is like a building set with all the blocks the tokenizer knows. [Byte pair encoding](/en/glossary/byte-pair-encoding) builds the vocabulary by counting which pieces often appear next to each other in a large collection of text. GPT-2's box starts with 256 individual bytes (small units of computer memory), which together can represent any text. The tokenizer then joins the most frequent neighboring pair and repeats the process until the vocabulary reaches its set size. For example, “e” and “n” could become “en”. This simplified example does not show the order in which the real tokenizer joins pairs.

**Not to be confused with a dictionary:** A vocabulary does not tell you what its entries mean, and it does not contain every word. Many entries are word parts or punctuation. Others are [special tokens](/en/glossary/special-token), entries for structure, such as the end of a message, not for text.

**Where you'll come across it:** You can find the entry count in the technical details for many models, but commercial models often leave it out. When you use a new model with its own tokenizer, the same sentence gets different token IDs and often a different number of tokens. If a provider bills per token, more tokens cost more. More tokens also fill the [context window](/en/glossary/context-window) faster.

See [Tokenizers: How Text Breaks into Tokens](/en/lessons/tokenizer-ids-vocabulary) for more on splitting text, and [Token IDs: What a Number Means](/en/lessons/token-ids-and-vocabulary) for an explanation of the numbers.
