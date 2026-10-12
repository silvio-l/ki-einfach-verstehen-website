---
title: 'Step'
description: 'One round of training: a batch of examples, a comparison with the right answers, every parameter adjusted once.'
translationKey: schritt
---

A step is one round of training. The model runs a batch of examples forward, the loss measures how far off it was, and the [training algorithm](/en/glossary/training-algorithm) then adjusts every [parameter](/en/glossary/parameters) once by a small amount. How large that amount is depends on the [learning rate](/en/glossary/learning-rate).

**An example:** GPT-3 was trained on 300 billion [tokens](/en/glossary/token), and each batch held 3.2 million tokens. Dividing one by the other gives just under 94,000 steps. Because the batch was smaller at the start and only grew later, there were in fact a few more.

**Not to be confused with the size of the correction:** As a unit of counting, a step means the whole round, not the distance a single parameter moves. Step counts can also only be compared when the batches are the same size. A team with batches four times as large processes four times as much text in the same number of steps. What a training run has really seen is counted by the [token budget](/en/glossary/token-budget).

**Where you'll come across it:** In technical reports on language models, often together with a learning-rate schedule that runs over a fixed number of steps. For the largest Llama 3.1 model it was 1.2 million. Training programs show a running count, usually labelled “step”.

Introduced in [Batch, Epoch, Step, Token Budget: How Training Progress Is Measured](/en/lessons/batch-epoch-step-token-budget).
