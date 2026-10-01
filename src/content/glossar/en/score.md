---
title: 'Score'
description: 'A numeric value a language model assigns to a candidate next piece of text — not yet a probability, and not yet a decision.'
translationKey: score
---

A score is a numeric value a language model assigns to one possible next piece of text, called a **candidate**. A high score means that this candidate fits well at this position from the model's point of view. A low or negative score means it fits poorly.

A score is neither a probability nor a decision. It only shows how one candidate compares to all the others. A later selection step then chooses one concrete piece of text. A language model's [output](/en/glossary/output) is exactly such a list of scores, one per candidate in the vocabulary. The scores are only turned into probabilities by [softmax](/en/glossary/softmax); in technical language, they are also called **logits** before this step.

Explained in more depth in [Input and Output: How a Function "Thinks"](/en/lessons/input-and-output).
