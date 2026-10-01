---
title: 'Sampling'
description: 'Choosing the next text piece by weighted chance: each piece comes up roughly as often as its probability says.'
translationKey: sampling
---

With sampling, a language model chooses the next text piece at random, but weighted by the [probabilities](/en/glossary/probability): over many attempts, a piece with 72 percent comes up roughly 72 times in 100, one with 1 percent roughly once. You can picture it as a prize wheel whose segments are as large as the probabilities.

The alternative is to always take the most likely piece (greedy decoding). In longer texts, this often leads to bland text and repetition. Sampling brings variety and explains why a chatbot can answer the same question differently. How strongly chance has an effect is controlled by the [temperature](/en/glossary/temperature).

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
