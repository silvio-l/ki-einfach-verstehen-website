---
title: 'Sampling'
description: 'Choosing the next text piece by weighted chance: each piece comes up roughly as often as its probability says.'
translationKey: sampling
---

With sampling, a language model chooses the next text piece at random, but weighted by the [probabilities](/en/glossary/probability): over many attempts, a piece with 72 percent comes up roughly 72 times in 100, one with 1 percent roughly once. You can picture it as a prize wheel whose segments are as large as the probabilities.

The alternative is to always take the most likely piece (greedy decoding). In longer texts, this often leads to bland text and repetition. Sampling brings variety and explains why a chatbot can answer the same question differently. How strongly chance has an effect is controlled by the [temperature](/en/glossary/temperature).

**An example:** With “sat” at 72, “slept” at 27 and “flew” at 1 percent, 100 spins land on “sat” roughly 72 times, on “slept” 27 times and on “flew” once. Each further text piece gets a new wheel. If the pointer stops somewhere else early on, all following rounds build on that.

**Not to be confused with rolling a die:** Chance here does not mean every piece comes up equally often. The wheel's segments differ in size, so sampled answers usually still make sense. The English word means taking a sample; it has nothing to do with sampling in music.

**Where you'll come across it:** In the button that regenerates an answer in chat apps, even if it is not called that: all the wheels get spun again. Settings and technical texts pair it with temperature and with methods like top-k or top-p, which remove clearly unsuitable pieces first.

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
