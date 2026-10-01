---
title: 'Softmax'
description: 'The calculation a model uses to turn a list of scores into probabilities that add up to 100 percent.'
translationKey: softmax
---

Softmax turns a list of [scores](/en/glossary/score) into a [probability distribution](/en/glossary/probability). To do this, every score is turned into a positive number, with each extra point ahead making that number about 2.7 times as large. Then each of these numbers is divided by their sum. This turns the scores 3.0, 2.0 and −1.0 into about 72, 27 and 1 percent.

The order of the scores is preserved, and only their differences count: if the same amount is added to all scores, nothing changes. No candidate drops all the way to zero. Language models apply softmax to all scores of the vocabulary for every next text piece, image recognition to the scores of its classes.

**An example:** Image recognition first calculates a score per class, such as “cat 6.2”, yet shows you a share like “cat 93%” (made-up numbers). Softmax usually sits in between.

**Not to be confused with plain percentages:** Quiz points can simply be divided by the total. Scores cannot: 3.0, 2.0 and −1.0 would give 75, 50 and −25 percent, and a negative share is useless. The name comes from the rule “take the largest”: softmax is a soft version of it, in which the other candidates keep something.

**Where you'll come across it:** In technical texts about AI models, often together with the word **logits** for the scores before it. In apps you only see the result: wherever an AI shows you percentages, it has already converted the scores. [Temperature](/en/glossary/temperature) also acts here: it divides the scores before softmax.

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
