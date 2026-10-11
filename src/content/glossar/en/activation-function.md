---
title: 'Activation Function'
description: 'The step after a neuron’s sum that reshapes the number; the lesson The Artificial Neuron calls it the lower limit, which sets negative values to zero.'
translationKey: aktivierungsfunktion
---

An activation function takes the number a [neuron](/en/glossary/neuron) reaches after its sum and its [bias](/en/glossary/bias), and reshapes it. The best-known form is called ReLU: negative values are set to zero, positive ones stay as they are. The lesson The Artificial Neuron calls this step the lower limit.

**An example:** If the number after the sum and the bias is −1, the neuron outputs 0. If it is 2, it outputs 2. Without this step, the −1 would stay.

**Not to be confused with a threshold:** A threshold only decides yes or no. An activation function outputs a number that the next layer processes further. Without it, stacked [layers](/en/glossary/layer) remain a single weighted sum in the result. Only with it does stacking pay off, because a second layer can then represent what the first one cannot do alone. In the stair light from the lesson [Layers](/en/lessons/layers), that is “exactly one of two”: the light is on only when exactly one of two switches is pressed, and this pattern does not arise without the step.

**Where you'll come across it:** In model descriptions, for example as `hidden_act` in the configuration file of a language model, the file with its construction details. Some language models, such as Qwen3-8B, use a rounded variant called SiLU instead of the sharp corner.

Introduced in [The Artificial Neuron: How a Sum Becomes an Output](/en/lessons/artificial-neuron).
