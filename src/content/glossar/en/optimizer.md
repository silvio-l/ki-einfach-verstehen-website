---
title: 'Optimizer'
description: 'The fixed calculation rule in training that turns the gradient into a step for every parameter and actually changes the parameters.'
translationKey: optimierer
---

An optimizer is the fixed calculation rule that, during training, turns the gradient into a step for every [parameter](/en/glossary/parameters). It is the part of the [training algorithm](/en/glossary/training-algorithm) that actually changes the parameters. The simplest form is the rule “step equals slope times [learning rate](/en/glossary/learning-rate)”. Large language models are usually trained with Adam or AdamW: they carry momentum from earlier slopes, give every parameter its own step size, and AdamW also pulls every parameter slightly toward zero.

**An example:** Two [parameters](/en/glossary/parameters) get their slopes over four [batches](/en/glossary/batch) (groups of training examples). The slopes of the first point alternately far up and far down, those of the second a little up every time. The plain rule sends the first parameter far back and forth at every batch; in total it hardly gets anywhere. Adam takes the second one further than the plain rule does, because it divides each step by the parameter's typical slope size: its small, steady slopes give almost a full learning-rate step.

**Not to be confused with backpropagation:** Backpropagation only works out in which direction and how strongly each parameter would have to change. Nothing moves while it does. Only the optimizer turns that into steps. An optimizer is not a model either and learns nothing: its helper values, such as momentum, are bookkeeping of the training run and are dropped once the model is used.

**Where you'll come across it:** In research papers and technical reports on large models, usually as a name with its settings: “trained with AdamW”. Not every large run uses AdamW.

Introduced in [Optimization: What Actually Changes the Weights](/en/lessons/optimization-of-the-weights).
