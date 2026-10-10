---
title: 'Activation Function'
description: 'The step that follows the sum of a neuron and lets stacked layers do more than a single sum. The lesson calls it the kink.'
translationKey: aktivierungsfunktion
---

An activation function takes the number a [neuron](/en/glossary/neuron) reaches after its sum and its [bias](/en/glossary/bias), and reshapes it. The best-known form is called ReLU: negative values are set to zero, positive ones stay as they are. The lesson calls this step the kink.

**An example:** If the sum is −1, the neuron outputs 0. If it is 2, it outputs 2. Without this step, the −1 would stay.

**Not to be confused with a threshold:** A threshold only decides yes or no. An activation function outputs a number that the next layer processes further. Without it, stacked [layers](/en/glossary/layer) remain a single weighted sum in the result.

**Where you'll come across it:** In model descriptions, for example as `hidden_act` in the configuration file of a language model, the file with its construction details. Some language models, such as Qwen3-8B, use a rounded variant called SiLU instead of the sharp kink.

Introduced in [Neural Networks: How Many Small Calculations Become a Model](/en/lessons/neural-networks).
