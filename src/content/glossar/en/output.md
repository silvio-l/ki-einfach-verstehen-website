---
title: 'Output'
description: "The result of a computational step — for a language model, not a finished answer but a list of scores for the next piece of text."
translationKey: output
---

The output is the result a [function](/en/glossary/function) computes from an [input](/en/glossary/input).

For a language model, the immediate output isn't a finished word, let alone a finished sentence — it's a list of [scores](/en/glossary/score), a numeric value for every single piece of text that could plausibly come next, across the entire [vocabulary](/en/glossary/vocabulary). A following selection step uses those scores to choose one concrete piece, either always taking the highest score or allowing some controlled randomness.

Explained in more depth in [Input and Output: How a Function "Thinks"](/en/lessons/input-and-output).
