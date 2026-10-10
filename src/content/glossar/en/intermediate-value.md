---
title: 'Intermediate Value'
description: 'The number a neuron produces while calculating an input and passes on to the next layer. It is created anew for every text.'
translationKey: zwischenwert
---

An intermediate value is the output of a [neuron](/en/glossary/neuron) that travels as input into the next [layer](/en/glossary/layer). It is neither the model’s answer nor a stored value. Every input produces its own series of intermediate values.

**An example:** In the stair light, the outputs of A and B are intermediate values. If both switches are pressed, they are 2 and 1. The output neuron calculates on from there, and only its result shows the light.

**Not to be confused with the parameters:** The [parameters](/en/glossary/parameters), that is, weights and biases, stay fixed while the model answers. Intermediate values change with every input.

**Where you'll come across it:** In technical texts about the inside of language models, for example when they discuss features that become visible in intermediate values.

Introduced in [Neural Networks: How Many Small Calculations Become a Model](/en/lessons/neural-networks).
