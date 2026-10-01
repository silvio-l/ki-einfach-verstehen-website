---
title: 'Temperature'
description: 'A setting by which the scores are divided before softmax: low values make the selection more predictable, high values more varied.'
translationKey: temperatur
---

Temperature is a setting for choosing the next text piece. Before [softmax](/en/glossary/softmax), all [scores](/en/glossary/score) are divided by it. A temperature below 1 increases the differences between the scores, and the most likely piece gets even more. A temperature above 1 reduces them, and less likely pieces come up more often during [sampling](/en/glossary/sampling). At temperature 0, the most likely piece is always chosen.

Temperature is not one of the model's [parameters](/en/glossary/parameters) and is not trained. It changes neither the model nor its scores, only how much their differences count during selection. A high temperature therefore does not make a model smarter.

Introduced in [Probability and Softmax: How a Model Decides](/en/lessons/probability-and-softmax).
