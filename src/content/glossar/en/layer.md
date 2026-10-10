---
title: 'Layer'
description: 'A group of neurons that receive the same input and calculate in parallel; in model descriptions, “layer” often means a whole transformer block.'
translationKey: schicht
---

A layer is a group of [neurons](/en/glossary/neuron) that all receive the same input and calculate simultaneously. Their outputs form the next input, so a network calculates in stages. Counting a layer’s numbers gives the number of inputs times the number of neurons for the weights, plus one [bias](/en/glossary/bias) per neuron in every layer that has biases.

**The picture:** A row of channels on a mixing desk that listen to the same input together. The limit: on a mixing desk, a row belongs to one device; in a network, each layer depends on the previous layer’s output.

**An example:** A layer with two inputs and three neurons has 2 times 3, so 6 weights, plus three biases: 9 numbers in all. Two neurons, A and B, both receive the same two switches as input (in a stair light, two switches control one lamp), so A and B form one layer. The output neuron C is a layer with one neuron. The outputs of A and B are intermediate values for C, and the light is on exactly when exactly one of the two switches is pressed; with both or neither pressed, it stays dark.

**Not to be confused with a transformer block:** In model descriptions such as “96 layers” for the language model GPT-3, a whole [transformer block](/en/glossary/transformer-block) is meant, and that block itself contains several layers of neurons. The number counts blocks, not individual layers of neurons.

**Where you'll come across it:** In model descriptions and programming libraries, for example in PyTorch, a widely used program for building neural networks.

Introduced in [Neural Networks: How Many Small Calculations Become a Model](/en/lessons/neural-networks).
