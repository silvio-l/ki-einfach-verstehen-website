---
title: 'Vocabulary'
description: 'The fixed list of every piece of text a language model knows and assembles every output from.'
translationKey: vokabular
---

A language model's vocabulary is the fixed, predetermined list of every piece of text the model knows at all. A realistic model doesn't have a five-entry vocabulary — it typically has tens of thousands of entries — but no matter the size, it stays a fixed, closed list.

Exactly how a sentence like "The cat sits" gets cut into individual pieces of text from this vocabulary is the topic of a dedicated lesson further along. For the [output](/en/glossary/output), the observation for now is enough: at every single computation step, every single piece of text in the vocabulary gets a [score](/en/glossary/score) — including the ones that don't end up winning.

Explained in more depth in [Input and Output: How a Function "Thinks"](/en/lessons/input-and-output).
