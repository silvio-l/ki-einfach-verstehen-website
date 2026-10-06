---
title: 'Output Head'
description: 'The last computing layer of a language model: it turns the last state into a score for every entry in the vocabulary.'
translationKey: output-head
---

The output head is the last computing layer of a [language model](/en/glossary/language-model). It turns the state of the last position into a list with one [score](/en/glossary/score) for every entry in the [vocabulary](/en/glossary/vocabulary). For this, it has one row per token. A token's score comes about by multiplying the state with that token's row position by position and adding everything up. The better state and row agree, the higher the score.

**An example:** With made-up numbers: the state is (1.0 | 0.5 | −1.0), and the row for “cat” is (2.0 | 1.0 | −1.5). That gives 2.0 + 0.5 + 1.5 = 4.0. In Qwen3-0.6B, every row has 1,024 numbers, and there are 151,936 rows.

**Not to be confused with the selection step:** The output head does not write a word. It only delivers the scores. Only [softmax](/en/glossary/softmax) turns them into percentages, and only a separate selection step picks exactly one token, for example by [sampling](/en/glossary/sampling). In many small models, the output head's table is the same as the table at the input, from which every [token ID](/en/glossary/token-id) fetches its numbers.

**Where you'll come across it:** In technical descriptions of language models, often as “language modeling head” or, in program code, as “lm_head”. Its output, the scores before softmax, is usually called logits there.

Introduced in [Output Head: From the Last State to a Prediction](/en/lessons/output-head).
