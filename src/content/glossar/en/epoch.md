---
title: 'Epoch'
description: 'One complete pass through a training dataset: every example came up exactly once, so each was seen one time.'
translationKey: epoche
---

An epoch is one complete pass through a dataset, like a workbook you work through once from front to back: every example came up exactly once in training. Two epochs mean the model has seen every example twice, 0.5 epochs that it has only seen half of them.

**An example:** For GPT-3, the largest source, a filtered collection of web pages, only reached 0.44 epochs. It was so large that training did not even get halfway through. The much smaller Wikipedia, by contrast, came up 3.4 times, because it had been given a fixed share of the [training data](/en/glossary/training-data).

**Not to be confused with a step:** A [step](/en/glossary/step) is a single round of correction after one batch of examples; an epoch consists of many such rounds. A second epoch shows the same examples to [parameters](/en/glossary/parameters) that have already changed; how strongly single examples stick is what [overfitting](/en/glossary/overfitting) shows. Too many epochs on too little text lead to [overfitting](/en/glossary/overfitting).

**Where you'll come across it:** In courses on [machine learning](/en/glossary/machine-learning), where small models are often trained for many epochs. For large [language models](/en/glossary/language-model), people usually count the [token budget](/en/glossary/token-budget) instead, because each source comes up a different number of times.

Introduced in [Batch, Epoch, Step, Token Budget: How Training Progress Is Measured](/en/lessons/batch-epoch-step-token-budget).
