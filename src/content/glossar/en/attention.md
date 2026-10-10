---
title: 'Attention'
description: 'The method a language model uses to mix weighted information from earlier tokens into the state of a token.'
translationKey: attention
---

Attention mixes information from other [tokens](/en/glossary/token) into the state of a token. To do this, the current token asks a question, its query, and compares it with the key, a label on every visible token. Each comparison gives a [score](/en/glossary/score), and [softmax](/en/glossary/softmax) turns the scores into weights that add up to 1. The values, the contents of the tokens, are then mixed with these weights, and the mix is added to the state. A block runs several such calculations side by side, the heads.

Which query, key and value come out of a state is set by learned [parameters](/en/glossary/parameters). In language models, the [causal mask](/en/glossary/causal-mask) makes sure that only earlier tokens and the token itself are visible.

**An example:** A thought example without real values: in “I sit on the bank”, “sit” would get a high weight for “bank”; in “I pay money into the bank”, it would be “money”. That is how the same starting vector for “bank” moves in a different direction depending on the sentence.

**Not to be confused with human attention:** The model does not deliberately focus on anything. The weights are calculated. Nor do they reliably show why a model gives a particular answer; a striking amount of weight, for example, often lands on the first tokens of a text.

**Where you'll come across it:** In descriptions of language models, often as “self-attention” or “multi-head attention”, and in tools that show attention weights as coloured tables.

Introduced in [Transformer Blocks and Attention: How Context Gets Mixed In](/en/lessons/transformer-blocks-and-attention).
