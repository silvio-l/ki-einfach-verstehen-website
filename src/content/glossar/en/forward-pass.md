---
title: 'Forward Pass'
description: 'The path the numbers take through a model from the input to the prediction: the same when answering as in training, where it covers all positions at once.'
translationKey: forward-pass
---

A forward pass is the path the numbers take through a [model](/en/glossary/model): from the [input](/en/glossary/input) through all [layers](/en/glossary/layer) to the prediction. The [parameters](/en/glossary/parameters) stay as they are; the model only computes.

In a language model, this is the same path as when it answers. At every position, the [output head](/en/glossary/output-head) delivers scores for the next token; [softmax](/en/glossary/softmax) turns them into percentages. In training, the whole text is already fixed, so a single forward pass computes the predictions for all positions at once. The [causal mask](/en/glossary/causal-mask) makes sure that no position looks at later words while doing so.

**An example:** For “The dog chased the cat,” treated as one token per word for simplicity, one forward pass delivers four predictions at once: after “The” for “dog,” after “The dog” for “chased,” and so on. Each gets penalty points, and their average is the [loss](/en/glossary/loss).

**Not to be confused with the whole of training:** The forward pass only measures; it changes nothing. Only the way back, backpropagation, works out how much each parameter contributed to the loss, and after that the [training algorithm](/en/glossary/training-algorithm) makes its adjustments. The way back takes about twice as much computing as the forward pass.

**Where you come across the term:** Technical texts about training and computing costs often speak of the “forward and backward pass.” During inference, that is, when answering, there is only the forward pass, once for every new token.

Introduced in [Forward Pass and Loss: How the Model Measures Its Own Error](/en/lessons/forward-pass-and-loss).
