---
title: 'Softmax'
description: 'The calculation a model uses to turn a list of scores into probabilities that add up to 100 percent.'
translationKey: softmax
---

Softmax turns a list of [scores](/en/glossary/score) into a [probability distribution](/en/glossary/probability). Each score becomes a positive number; each extra point ahead makes it about 2.7 times as large. Then each number is divided by the sum of all. This turns the scores 3.0, 2.0 and −1.0 into about 72, 27 and 1 percent. Picture a prize wheel whose segments match these percentages.

The order is preserved, and only the differences count: adding the same amount to all scores changes nothing. No candidate drops all the way to zero. Language models apply softmax to all vocabulary scores for every next text piece, image recognition to its class scores.

**An example:** Image recognition scores each class, such as “cat 6.2” next to “dog 2.9”, “fox 1.4” and “car −3.0”, yet shows a share like “cat 96%” (made-up numbers). Softmax usually sits in between.

**Not to be confused with plain percentages:** quiz points are simply divided by the total. Scores cannot: 3.0, 2.0 and −1.0 would give 75, 50 and −25 percent, and a negative share is useless. The name comes from the rule “take the largest”: softmax is its soft version, where other candidates keep something. The picture’s limit: a real wheel has one segment per vocabulary entry, most of them hair-thin.

**Where you'll come across it:** In technical texts about AI models, often with the word **logits** for the scores before it. In apps you only see the result: a percentage on screen means the scores are already converted. [Temperature](/en/glossary/temperature) also acts here, dividing the scores before softmax.

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
