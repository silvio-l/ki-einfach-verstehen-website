---
title: 'Layer'
description: 'A group of neurons that receive the same input and calculate in parallel; in model descriptions, “layer” often means a whole transformer block.'
translationKey: schicht
---

A layer is a group of [neurons](/en/glossary/neuron) that all receive the same input and calculate simultaneously. Their outputs form the next input, so a network calculates in stages. Counting a layer’s numbers gives the number of inputs times the number of neurons for the weights, plus one [bias](/en/glossary/bias) per neuron. Some models leave the biases out of individual layers; then they drop out of the count.

**The picture:** A row of channels on a mixing desk that listen to the same input together. The limit: the channels of a row run side by side; in a network, the output of each layer except the last becomes the input of the next.

**An example:** A layer with two inputs and three neurons has 2 times 3, so 6 weights, plus three biases: 9 numbers in all. A second example is the stair light: two neurons, A and B, both receive the same two switches as input (there, two switches control one lamp), so A and B form one layer. The output neuron C is a layer with one neuron. The outputs of A and B are intermediate values for C, and the light is on exactly when exactly one of the two switches is pressed; with both or neither pressed, it stays dark.

**Not to be confused with a transformer block:** In model descriptions such as “96 layers” for the language model GPT-3, a whole [transformer block](/en/glossary/transformer-block) is meant, and that block itself contains several layers of neurons. The number counts blocks, not individual layers of neurons.

**Where you'll come across it:** In model descriptions and programming libraries, for example in PyTorch, a widely used program for building neural networks.

Introduced in [Layers: How Many Neurons Become a Network](/en/lessons/layers).
