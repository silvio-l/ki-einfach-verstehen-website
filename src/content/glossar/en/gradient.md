---
title: 'Gradient'
description: 'The list of the error’s slopes for all parameters of a model: a direction and a strength for every fader, computed for the current setting and one batch.'
translationKey: gradient
---

The gradient is the list of the error’s slopes for all [parameters](/en/glossary/parameters) of a model. For every fader it says in which direction the error moves when the fader is turned up a tiny bit, and how strongly. A model with eight billion parameters gets eight billion such entries after every batch. The gradient is computed by [backpropagation](/en/glossary/backpropagation).

Picture a mixing desk with a note hanging on every fader after each run, reading higher or lower with a strength. The gradient is the list of all these notes.

**An example:** An invented stair-light network with two switches has nine faders. The gradient has nine entries, one per fader, even when every weight is set correctly. With both switches pressed, the gradient has its largest entry, 4, at neuron C’s weight on neuron A: turned up, the error would grow. That weight is set correctly; the largest entry shows only the slope at this spot, not the faulty fader.

**Not to be confused with the way to the right value:** The gradient only shows the slope at the current spot, not where a fader’s right value lies. It does not turn any fader itself either; a separate step does that afterwards. And it only holds for the examples it comes from: the next batch brings a new one.

**Where you'll come across it:** In research papers and training reports, for example when they say the size of the gradient was limited, as in the training of GPT-3.

Introduced in [Backpropagation and Gradients: How the Model Knows What to Change](/en/lessons/backpropagation-and-gradients).
