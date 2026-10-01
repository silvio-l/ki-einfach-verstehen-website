---
title: 'Probability'
description: 'A number between 0 and 100 percent that states how often something happens if the same situation repeats very many times.'
translationKey: wahrscheinlichkeit
---

A probability states how often something happens if the same situation repeats very many times. A chance of rain of 80 percent means: on 8 out of 10 days with such a weather situation, there was precipitation. Every probability lies between 0 and 100 percent.

A **probability distribution**, or distribution for short, is a list with one probability for each possibility; all of them together add up to exactly 100 percent. For every next position, a language model calculates one such distribution over all possible text pieces by converting its [scores](/en/glossary/score) with [softmax](/en/glossary/softmax). The percentages describe which continuation is plausible, not whether an answer is correct.

**An example:** After “The cat”, softmax turns three made-up scores into “sat” 72 percent, “slept” 27 percent and “flew” 1 percent. With [sampling](/en/glossary/sampling), “sat” comes up roughly 72 times in 100 attempts.

**Not to be confused with confidence:** 72 percent does not mean the model is 72 percent sure that “sat” is correct. The value roughly reflects what came next in similar texts during training. Whether a model's percentages match its hit rate must be checked separately, and often they do not. A score is not yet a probability either: it can be negative and has no fixed sum.

**Where you'll come across it:** In the chance of rain in your weather app, in image recognition that reports something like “cat 93%”, and in the word suggestions on your phone keyboard. Google describes its Gboard keyboard this way: the middle suggestion is the word a language model rates most likely.

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
