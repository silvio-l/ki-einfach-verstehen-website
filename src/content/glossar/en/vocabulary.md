---
title: 'Vocabulary'
description: 'The fixed list of every piece of text a language model knows and assembles every answer from.'
translationKey: vokabular
---

A language model's vocabulary is the fixed, predetermined list of every piece of text the model knows at all. Real vocabularies have tens of thousands of entries or more; the older model GPT-2, for instance, has 50,257. No matter the size, it stays a fixed, closed list.

A [tokenizer](/en/glossary/tokenizer) divides text into entries from this vocabulary and returns their [token IDs](/en/glossary/token-id). For the [output](/en/glossary/output), every vocabulary entry receives a [score](/en/glossary/score) at each step.

**An example:** Picture the vocabulary as a card index. Each card holds a piece of text and an ID number, such as "The" with 417 or " cat" (with a leading space) with 82 (made-up numbers). If there's no card for " cats", the tokenizer builds the word from " cat" and "s".

**Not to be confused with a dictionary:** The vocabulary holds no meanings, and it doesn't contain every word of a language either. Many entries are word parts, punctuation marks or words with a leading space. A single entry is called a [token](/en/glossary/token); the vocabulary is the whole list.

**Where you'll come across it:** A new chatbot model often brings its own tokenizer and vocabulary, so the same sentence gets different token IDs. You notice the vocabulary when a provider charges per token or a text fills up the [context window](/en/glossary/context-window): whatever the vocabulary covers less compactly, such as long strings of digits or unusual product codes, breaks into more tokens.

The segmentation is explained in [Tokenizers: How Language Becomes Numbers](/en/lessons/tokenizer-ids-vocabulary). The following computation step is explained in [Input and Output: What a Function Does](/en/lessons/input-and-output).
