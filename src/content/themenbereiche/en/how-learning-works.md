---
title: 'How Learning Works'
description: "Why a model gets better: you'll see how loss, backpropagation, and gradients work together — and what actually changes the weights."
translationKey: wie-lernen-funktioniert
routeSlug: how-learning-works
order: 3
bausteine:
  - order: 1
    title: 'Text Becomes Many Practice Problems'
  - order: 2
    title: 'Forward Pass and Loss: How the Model Measures Its Own Error'
  - order: 3
    title: 'Backpropagation and Gradients: How the Model Knows What to Change'
  - order: 4
    title: 'Optimization: What Actually Changes the Weights'
  - order: 5
    title: 'Batch, Epoch, Step, Token Budget: How to Measure Training Progress'
---

This topic is about the process that turns an unpracticed computational structure into a useful model. You will trace how training tasks are created, how errors become measurable, and how many small parameter updates gradually improve behavior.

The sequence makes an otherwise hidden cycle tangible: predict, measure the error, calculate each weight's influence, and adjust the weights deliberately.
