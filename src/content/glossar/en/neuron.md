---
title: 'Neuron'
description: 'A fixed calculation rule that turns its inputs, weights and bias into one number, which then runs through a kink.'
translationKey: neuron
---

An artificial neuron takes several numbers as input, multiplies each by its [weight](/en/glossary/parameters), adds everything up and then adds its [bias](/en/glossary/bias). The result runs through an [activation function](/en/glossary/activation-function). The number that comes out is called the output of the neuron.

**An example:** The spam filter from the first lesson calculates with the made-up weights “prize” +3, “free” +2 and “invoice” −2, and the bias −2. An email with “prize” and “free” gives 3 + 2, which is 5, and after the bias a total of 3. This 3 is the output of this neuron.

**Not to be confused with a nerve cell:** The name comes from biology, but an artificial neuron is a calculation rule made of a sum, a bias and a kink. It does not learn on its own; what is learned are the weights and the bias.

**Where you'll come across it:** In technical texts and model descriptions, almost always together with [layer](/en/glossary/layer). When a text speaks of many neurons, it means many such calculation rules arranged in layers.

Introduced in [Neural Networks: How Many Small Calculations Become a Model](/en/lessons/neural-networks).
