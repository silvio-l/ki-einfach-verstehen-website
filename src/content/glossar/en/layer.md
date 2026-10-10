---
title: 'Layer'
description: 'A group of neurons that receive the same input and calculate in parallel. In model descriptions, “layer” often means a whole transformer block.'
translationKey: schicht
---

A layer is a group of [neurons](/en/glossary/neuron) that all receive the same input and calculate at the same time. Their outputs form the next input. If you count the numbers of a layer, you get the number of inputs times the number of neurons for the weights, plus one [bias](/en/glossary/bias) per neuron in every layer that has biases.

**An example:** A layer with two inputs and three neurons has 2 times 3, which is 6 weights, plus three biases. Together that is 9 numbers.

**Not to be confused with a transformer block:** In model descriptions such as “96 layers” for the language model GPT-3, a whole [transformer block](/en/glossary/transformer-block) is meant, and that block itself contains several layers of neurons. The number counts blocks, not individual layers of neurons.

**Where you'll come across it:** In model descriptions and programming libraries, for example in PyTorch, a widely used program for building neural networks.

Introduced in [Neural Networks: How Many Small Calculations Become a Model](/en/lessons/neural-networks).
