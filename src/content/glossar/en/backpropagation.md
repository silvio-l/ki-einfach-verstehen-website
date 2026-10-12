---
title: 'Backpropagation'
description: 'The method that computes the gradient: a single backward pass from the error to the input, which gives every fader its slope but turns none.'
translationKey: backpropagation
---

Backpropagation, roughly “spreading backwards”, is the method that computes a model’s [gradient](/en/glossary/gradient). The calculation starts at the error at the output and goes back [layer](/en/glossary/layer) by layer to the input. On the way, every [parameter](/en/glossary/parameters) gets its slope. For this it needs the intermediate values from the forward pass, which training keeps until then.

**An example:** In an invented stair-light network with two switches, neuron B has three faders (two weights and one bias fader). Instead of probing each one separately, the backward pass works out once how strongly the error reacts to B and uses that number for all three. So one backward pass is enough; probing each of the network’s nine faders separately would take nine extra forward passes.

**Not to be confused with all of learning:** Backpropagation only works out where the error pulls each fader and how strongly. The turning happens afterwards, in a separate step. After backpropagation every fader is exactly where it was. It does not find the “guilty” fader either: the largest entry can hang on a fader that is set correctly.

**Where you'll come across it:** In explanations of how neural networks are trained, often shortened to “backprop”. For neural networks, it was discovered independently several times in the mid-1980s; in 1986, David Rumelhart, Geoffrey Hinton and Ronald Williams described it in the journal Nature. The underlying idea is older.

Introduced in [Backpropagation and Gradients: How the Model Knows What to Change](/en/lessons/backpropagation-and-gradients).
