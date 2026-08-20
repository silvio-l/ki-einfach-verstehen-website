---
title: 'Score'
description: 'A numeric value a language model assigns to a candidate next piece of text — not yet a probability, and not yet a decision.'
translationKey: score
---

A score is a numeric value a language model assigns to one single candidate piece of text that could come next. A high score means: from the model's point of view, this candidate fits well at this position. A low or negative score means: it fits poorly.

A score is neither a probability nor a decision. It only says how one candidate compares to all the others — not how a later selection step eventually turns that into one concrete piece of text. A language model's [output](/en/glossary/output) is exactly such a list of scores, one per candidate in the vocabulary.

Explained in more depth in [Input and Output: How a Function "Thinks"](/en/lessons/input-and-output).
