---
title: 'Token budget'
description: 'The total number of tokens a training run processes, repetitions included: the figure that makes training runs easiest to compare.'
translationKey: tokenbudget
---

The token budget is the total number of [tokens](/en/glossary/token) a training run processes, repetitions included. It is a [hyperparameter](/en/glossary/hyperparameter): people set it before training begins. Together with the number of [parameters](/en/glossary/parameters), it roughly determines how much computing time a training run costs.

**An example:** GPT-3 was trained on 300 billion tokens in 2020, the largest Llama 3.1 model on 15.6 trillion in 2024. A DeepMind study found in 2022 that, for a fixed amount of computing time, about 20 tokens per parameter work best. For a model with 8 billion parameters that would be about 160 billion tokens. Llama 3 8B got over 15 trillion and, according to Meta, was still improving.

**Not to be confused with the size of the training data:** How much text is available does not say how much training reads. Some sources come up several times, others not even once all the way through. The token budget counts what was actually processed, whether for the first or the third time.

**Where you'll come across it:** In technical reports and announcements of new models, usually as “trained on … tokens”. It is the figure that makes training runs easiest to compare, because unlike the number of [steps](/en/glossary/step) it does not depend on the size of the batches.

Introduced in [Batch, Epoch, Step, Token Budget: How Training Progress Is Measured](/en/lessons/batch-epoch-step-token-budget).
