---
title: 'Learning rate'
description: 'A hyperparameter that sets how strongly the training algorithm adjusts the parameters at each step.'
translationKey: lernrate
---

The learning rate sets how strongly a [training algorithm](/en/glossary/training-algorithm) adjusts the [parameters](/en/glossary/parameters) at each step. It is a [hyperparameter](/en/glossary/hyperparameter): people choose it, training does not learn it.

If the learning rate is too large, every correction overshoots, and training never settles down. If it is too small, training makes very slow progress. For the largest GPT-3 it was at most 0.00006.

Introduced in [Parameters, Training vs. Inference, Hardware: How a Model Runs](/en/lessons/parameters-training-inference-hardware).
