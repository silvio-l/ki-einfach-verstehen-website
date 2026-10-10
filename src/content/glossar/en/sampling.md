---
title: 'Sampling'
description: 'Choosing the next text piece by weighted chance: each piece comes up roughly as often as its probability says.'
translationKey: sampling
---

With sampling, a language model chooses the next text piece at random, but weighted by the [probabilities](/en/glossary/probability): a piece with 72 percent comes up roughly 72 times in 100, one with 1 percent roughly once. Picture a prize wheel whose segments match the probabilities.

The alternative: always take the most likely piece (greedy decoding). In longer texts, this often gives bland, repetitive text. Sampling brings variety and explains why a chatbot can answer the same question differently. The [temperature](/en/glossary/temperature) controls how strongly chance acts.

**An example:** With made-up numbers, after “The cat”, “sat” has a 72 percent chance, “slept” 27 and “flew” 1 percent: over 100 imagined spins, the pointer lands on “sat” roughly 72 times, on “slept” 27 times and on “flew” once. A real answer spins each wheel only once; each further text piece gets a new one. If the pointer stops elsewhere early on, all later rounds build on that.

**Not to be confused with rolling a die:** Chance here does not mean every piece comes up equally often. The segments differ in size, so sampled answers usually still make sense. “Sampling” here means taking a sample, as in statistics; it has nothing to do with sampling in music.

**Where you'll come across it:** In the regenerate button of chat apps, whatever it is called there: all wheels get spun again. Settings and technical texts pair it with temperature and methods like top-k or top-p, which remove clearly unsuitable pieces first (only in the deeper section of “[Output Head: From the Last State to a Prediction](/en/lessons/output-head)”).

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
