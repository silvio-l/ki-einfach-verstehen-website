---
title: 'Vocabulary'
description: 'The fixed list of every piece of text a language model knows and assembles every output from.'
translationKey: vokabular
---

A language model's vocabulary is the fixed, predetermined list of every piece of text the model knows at all. A realistic model doesn't have a five-entry vocabulary — it typically has tens of thousands of entries — but no matter the size, it stays a fixed, closed list.

A [tokenizer](/en/glossary/tokenizer) divides text into entries from this vocabulary and returns their [token IDs](/en/glossary/token-id). For the [output](/en/glossary/output), the model compares every possible next piece, so each vocabulary entry receives a [score](/en/glossary/score). A later step selects one of them; the others do not appear in the text.

The segmentation is explained in [Tokenizers: How Language Becomes Numbers](/en/lessons/tokenizer-ids-vocabulary). The following computation step is explained in [Input and Output: How a Function "Thinks"](/en/lessons/input-and-output).
