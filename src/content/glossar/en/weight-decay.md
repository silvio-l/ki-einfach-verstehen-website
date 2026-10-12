---
title: 'Weight decay'
description: 'A steady pull in training that moves every parameter a tiny bit toward zero at every step, separately from the gradient.'
translationKey: weight-decay
---

Weight decay is a steady pull in training: at every step, the [optimizer](/en/glossary/optimizer) moves every [parameter](/en/glossary/parameters) a tiny bit toward zero, in proportion to its value. A parameter with twice the value moves twice as far. The pull always acts, whatever the gradient says at the moment. Parameters the model needs get slopes that push back. How strong the pull is, is a [hyperparameter](/en/glossary/hyperparameter).

**An example:** One fader is at 2, another at 1. Both get a gradient of zero in every batch. Without weight decay they would stay put. With weight decay both shrink step by step by the same small share of their value, so the first one twice as fast. After very many steps both are close to zero.

**Not to be confused with removing parameters:** Weight decay deletes no parameter; it only makes it smaller when nothing pushes back. Lowering the [learning rate](/en/glossary/learning-rate) is something else too; that is the job of the learning rate schedule. With Adam it matters how the pull is applied: if you add it to the gradient, Adam divides it by the usual size as well, and parameters with large slopes barely feel it. AdamW therefore applies it separately.

**Where you'll come across it:** In the training settings of large models, as a small number next to the optimizer. According to the research paper, GPT-3 used the value 0.1. The W in AdamW stands for this separate weight decay.

Introduced in [Optimization: What Actually Changes the Weights](/en/lessons/optimization-of-the-weights).
