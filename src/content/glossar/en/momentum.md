---
title: 'Momentum'
description: 'A moving average of earlier slopes that the optimizer follows instead of each single gradient, so back-and-forth cancels out.'
translationKey: momentum
---

Momentum is a moving average of a [parameter](/en/glossary/parameters)’s earlier slopes. The [optimizer](/en/glossary/optimizer) follows this average instead of every single gradient. With every [batch](/en/glossary/batch) (a group of training examples), the new momentum consists mostly of the old one and a small share of the new slope. Whatever points back and forth almost cancels out. Whatever keeps pointing the same way adds up. How much of the old momentum stays is a [hyperparameter](/en/glossary/hyperparameter).

**An example:** A made-up [parameter](/en/glossary/parameters) gets the slopes +8 and −8 in turn, a second one 1 every time. The optimizer keeps 90 percent of the old momentum and adds 10 percent of the new slope. After twenty batches the first parameter’s momentum still swings between about −0.4 and +0.5, while the second one’s is at almost 0.9.

**Not to be confused with momentum in physics:** Nothing rolls here. Momentum is a stored number per parameter, bookkeeping of the training run and not part of the finished model. More momentum isn’t always better either: if the optimizer keeps almost all of it, it reacts sluggishly to new slopes.

**Where you'll come across it:** In reports on training large models, often hidden as the first setting of Adam or AdamW. For GPT-3, according to the research paper, this share was 90 percent. In machine learning textbooks, momentum usually comes right after the plain rule “step equals slope times learning rate”.

Introduced in [Optimization: What Actually Changes the Weights](/en/lessons/optimization-of-the-weights).
