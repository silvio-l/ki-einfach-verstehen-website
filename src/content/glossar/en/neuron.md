---
title: 'Neuron'
description: 'A fixed calculation rule that turns its inputs, weights and bias into one number, which then passes through a lower limit.'
translationKey: neuron
---

An artificial neuron takes several numbers as input, multiplies each by its [weight](/en/glossary/parameters), adds everything up and then adds its [bias](/en/glossary/bias). The result then runs through an [activation function](/en/glossary/activation-function). Its simplest form, the lower limit, sets negative values to zero and leaves positive ones unchanged; current language models often use smoother curves. The number that comes out is called the output of the neuron.

**An example:** The spam filter from the first lesson calculated with the made-up weights “prize” +3, “free” +2 and “invoice” −2, and compared the sum with the threshold 2. As the bias of a neuron, that threshold would be −2. An email with “prize” and “free” gives 3 + 2, which is 5, and after the bias a total of 3. This 3 is the output of this neuron.

**Not to be confused with a nerve cell:** The name comes from biology and only explains the name. An artificial neuron is a fixed calculation rule made of a sum, a bias and a lower limit. You can picture it as a channel on a mixing desk: the controls are the weights, the sum runs through the channel, and the meter shows the output. Only the weights and the bias are learned; the neuron itself does not learn. The mixing-desk picture therefore fits the calculation, not the learning.

**Where you'll come across it:** In technical texts and model descriptions, almost always together with [layer](/en/glossary/layer). When a text speaks of many neurons, it means many such calculation rules arranged in layers.

Introduced in [The Artificial Neuron: How a Sum Becomes an Output](/en/lessons/artificial-neuron).
