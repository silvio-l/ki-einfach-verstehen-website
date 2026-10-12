---
title: 'Loss (Cross-Entropy)'
description: 'The one number that measures how far a model’s predictions are off during training; for language models it is the average of the penalty points.'
translationKey: loss
---

The loss is the one number that measures, during training, how far a model’s predictions are from the [label](/en/glossary/label). The [training algorithm](/en/glossary/training-algorithm) tries to make this number smaller.

In language models, the rule is called **cross-entropy**. At every position, all that counts is how much [probability](/en/glossary/probability) the model gave the token that actually follows in the text. This becomes penalty points: 0 at 100 percent, about 0.7 at 50 percent, and every further halving costs about 0.7 more again. The loss is the average of these penalty points over all positions.

**An example:** If a model gives the token “Paris” 47.5 percent and “Paris” follows in the text, this position costs 0.74 penalty points, even though “Paris” was the best choice. A model with 151,936 tokens in its [vocabulary](/en/glossary/vocabulary) that has learned nothing yet and treats all of them alike starts at about 11.9.

**Not to be confused with a percentage:** A loss of 0.5 does not mean “half wrong.” The number has no upper limit and only reaches 0 if the model gives every correct token 100 percent. Loss values are directly comparable only with the same [tokenizer](/en/glossary/tokenizer) and the same text. And the loss measures agreement with the training text, not truth.

**Where you come across the term:** In reports on new models, curves show how the loss falls during training. Where it says “training loss” or “validation loss,” the same measure is meant, once on the training text and once on held-back text, each with its own value.

Explained in more detail in [Forward Pass and Loss: How the Model Measures Its Own Error](/en/lessons/forward-pass-and-loss).
