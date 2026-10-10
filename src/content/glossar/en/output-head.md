---
title: 'Output Head'
description: 'The last computing layer of a language model: it turns the last state into a score for every entry in the vocabulary.'
translationKey: output-head
---

The output head is the last computing layer of a [language model](/en/glossary/language-model). It turns the state of the last position into one [score](/en/glossary/score) for every entry in the [vocabulary](/en/glossary/vocabulary), using one row per token. You can picture it as the score sheet of a quiz night: every row gets as many points as the state points in its direction. A token's score is the sum of the state multiplied, position by position, with that token's row. The more state and row point the same way, the higher the score. Unlike a score sheet, no published rules set these points: the rows are learned numbers without labelled slots. Scores can even all be negative; only their differences count.

**An example:** With made-up numbers: the state is (1.0 | 0.5 | −1.0), and the row for “cat” is (2.0 | 1.0 | −1.5). That gives 2.0 + 0.5 + 1.5 = 4.0. In Qwen3-0.6B, every row has 1,024 numbers, and there are 151,936 rows.

**Not to be confused with the selection step:** The output head writes no word; it only delivers scores. Only [softmax](/en/glossary/softmax) turns them into percentages, and only a separate selection step picks exactly one token, for example by [sampling](/en/glossary/sampling). In some models, such as GPT-2, it is the input table that every [token ID](/en/glossary/token-id) fetches its numbers from; in others, such as Qwen3-8B, it is separate.

**Where you'll come across it:** In technical descriptions of language models, often as “language modeling head” or, in program code, as “lm_head”. Its output, the scores before softmax, is usually called logits there.

Introduced in [Output Head: From the Last State to a Prediction](/en/lessons/output-head).
