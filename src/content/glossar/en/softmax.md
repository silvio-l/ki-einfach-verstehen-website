---
title: 'Softmax'
description: 'The calculation a model uses to turn a list of scores into probabilities that add up to 100 percent.'
translationKey: softmax
---

Softmax turns a list of [scores](/en/glossary/score) into a [probability distribution](/en/glossary/probability). To do this, every score is turned into a positive number, with each extra point ahead making that number about 2.7 times as large. Then each of these numbers is divided by their sum. This turns the scores 3.0, 2.0 and −1.0 into about 72, 27 and 1 percent.

The order of the scores is preserved, and only their differences count: if the same amount is added to all scores, nothing changes. No candidate drops all the way to zero. Language models apply softmax to all scores of the vocabulary for every next text piece, image recognition to the scores of its classes.

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
