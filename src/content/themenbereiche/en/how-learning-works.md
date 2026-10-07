---
title: 'How Learning Works'
description: 'How does an AI learn? It measures its error, traces improvements backwards through its computation and changes its weights step by step.'
translationKey: wie-lernen-funktioniert
routeSlug: how-learning-works
order: 3
bausteine:
  - order: 1
    title: 'Text Becomes Many Practice Problems'
    slug: text-becomes-many-practice-problems
  - order: 2
    title: 'Forward Pass and Loss: How the Model Measures Its Own Error'
    slug: forward-pass-and-loss
  - order: 3
    title: 'Backpropagation and Gradients: How the Model Knows What to Change'
    slug: backpropagation-and-gradients
  - order: 4
    title: 'Optimization: What Actually Changes the Weights'
    slug: optimization-of-the-weights
  - order: 5
    title: 'Batch, Epoch, Step, Token Budget: How to Measure Training Progress'
    slug: batch-epoch-step-token-budget
---

This topic is about the process that turns an unpracticed computational structure into a useful model. You will trace how training tasks are created, how errors become measurable, and how many small parameter updates gradually improve behavior.

The sequence makes an otherwise hidden cycle tangible: predict, measure the error, calculate each weight's influence, and adjust the weights deliberately.
