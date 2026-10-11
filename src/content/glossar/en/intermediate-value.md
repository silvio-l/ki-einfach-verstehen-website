---
title: 'Intermediate Value'
description: 'The number a neuron produces while calculating an input and passes on to the next layer; it is created anew for every text.'
translationKey: zwischenwert
---

An intermediate value is the output of a [neuron](/en/glossary/neuron) that travels as input into the next [layer](/en/glossary/layer). It is neither the model’s answer nor a stored value. Every input produces its own series of intermediate values.

**An example:** In the stair light from [Layers](/en/lessons/layers), two switches control one light, which is on only when exactly one switch is pressed. Neurons A and B both see the two switches; their outputs are the intermediate values. Neither switch pressed leaves both at 0. One pressed gives 1 and 0. Both pressed give 2 and 1. A third neuron, the output neuron, calculates on from there; only its result decides whether the light is on.

**Not to be confused with the parameters:** The [parameters](/en/glossary/parameters), that is, weights and biases, stay fixed while the model answers. Intermediate values change with every input; a number is an intermediate value only through its role in the calculation. The picture for them is the meters above the controls of a mixing desk, which change with whatever passes through. The limit of this picture: on a real desk, each meter belongs to one channel and one instrument. An intermediate value, by contrast, belongs to no topic and takes part in many features. A feature is a pattern across many intermediate values that lights up with suitable text.

**Where you'll come across it:** In technical texts about the inside of language models, for example when they discuss features that become visible in intermediate values.

Introduced in [Layers: How Many Neurons Become a Network](/en/lessons/layers).
