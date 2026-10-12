---
title: 'Learning rate schedule'
description: 'The course of the learning rate over a training run, fixed in advance: usually a short ramp up, the warm-up, then a long decline.'
translationKey: lernraten-plan
---

A learning rate schedule sets how the [learning rate](/en/glossary/learning-rate) changes over a training run. For large language models it usually starts close to zero and is ramped up quickly; this is called warm-up. After that it falls slowly for a long time. At the start the parameters are random, and methods like [Adam](/en/glossary/optimizer) know the usual size of the slopes from only a few [batches](/en/glossary/batch) (groups of training examples), so big steps easily go wrong. At the end, big steps would keep pushing the model out of the valley, that is, away from the point of lowest [loss](/en/glossary/loss), because the slopes keep wobbling from batch to batch. The schedule is chosen before training and is a [hyperparameter](/en/glossary/hyperparameter).

**An example:** For the largest Llama 3.1 model, according to Meta, the learning rate rose for 8,000 steps and then fell slowly over 1.2 million steps to a hundredth. At the very end it went to zero.

**Not to be confused with a learning rate that adjusts itself:** The schedule follows the step count, not how well training is going at the moment. Adam’s per-parameter step sizes come on top and do not replace the schedule. A high learning rate doesn’t mean fast learning either: toward the end it makes the model jump across the valley.

**Where you'll come across it:** In research papers on large models, often with terms like “warmup” for the ramp up and “cosine decay” for the curve down. GPT-3 was trained this way too: ramped up first, then lowered.

Introduced in [Optimization: What Actually Changes the Weights](/en/lessons/optimization-of-the-weights).
