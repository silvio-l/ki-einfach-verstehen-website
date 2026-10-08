---
title: 'Learning rate'
description: 'A hyperparameter that sets how strongly the training algorithm adjusts the parameters at each step.'
translationKey: lernrate
---

The learning rate sets how strongly a [training algorithm](/en/glossary/training-algorithm) adjusts the [parameters](/en/glossary/parameters) at each step. It is a [hyperparameter](/en/glossary/hyperparameter): people choose it, training does not learn it.

If the learning rate is too large, every correction overshoots and training never settles. If it is too small, progress is very slow. For the largest GPT-3 it was at most 0.00006.

**An example:** A [spam filter](/en/glossary/spam-filter) is learning how suspicious the word “prize” is. After every error, the training algorithm adjusts that word’s weight a little. If the learning rate is too large, the weight jumps far up after an ad email and far down after the next harmless email that also says “prize”, say from your library. It never finds the balance point. If it is too small, the filter needs many examples to get the weight right.

**Not to be confused with temperature:** People set both, but at different times. The learning rate applies only during training and leaves its traces in the parameters. [Temperature](/en/glossary/temperature) is set only when the model is used, anew for every request, and leaves the model unchanged. A larger learning rate also doesn’t mean a model learns more. It only sets the size of each correction step.

**Where you'll come across it:** In research papers and technical reports that list a model’s training settings, usually as a very small number. Often there is a whole schedule: for GPT-3, the learning rate was ramped up slowly at first and then gradually lowered. If you train a model yourself, you have to choose it.

Introduced in [Parameters, Training and Inference: How a Model Learns](/en/lessons/parameters-training-inference-hardware).
