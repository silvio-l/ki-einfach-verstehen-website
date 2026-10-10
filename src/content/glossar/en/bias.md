---
title: 'Bias'
description: 'A number a neuron adds to its weighted sum before the activation function; it stays fixed while the model answers, and some texts call it bias term.'
translationKey: grundregler
---

The bias is a number that belongs to a [neuron](/en/glossary/neuron). It is added after the weighted sum, before the [activation function](/en/glossary/activation-function) applies (the lower limit in the lesson: it sets negative values to zero), and can be positive or negative. While the model answers it stays fixed; during training it is learned together with the weights. It determines how high the sum must be before the neuron passes something on.

**An example:** A neuron has the weighted sum 5 and the bias −2. It calculates 5 + (−2), which is 3, and passes on the 3. Without a bias, it would pass on the 5.

**Not to be confused with the threshold:** The spam filter from the first lesson compared its sum with 2. The bias is the same adjusting screw in reverse: “sum above 2” gives the same result as “sum minus 2 above 0.” The bias is added to the sum, not subtracted from it. A neuron has at most one bias, however many inputs it receives; some language models, such as Qwen3, leave it out of their feed-forward layers entirely. A layer with three neurons therefore has up to three biases.

**Where you'll come across it:** In model descriptions and programming libraries. In PyTorch, a widely used program for building neural networks, the bias is switched on by default for a [layer](/en/glossary/layer).

Introduced in [Neural Networks: How Many Small Calculations Become a Model](/en/lessons/neural-networks).
