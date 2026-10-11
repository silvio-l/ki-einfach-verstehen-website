---
title: 'Feed-Forward Network'
description: 'A network of layers whose numbers flow only forward, without feedback; often also called an MLP.'
translationKey: feed-forward-netz
---

A feed-forward network (named for numbers that move only forward) consists of [layers](/en/glossary/layer) through which the numbers flow in one direction: from the input through the [intermediate values](/en/glossary/intermediate-value) to the output. Each layer receives only the output of the previous one, and nothing flows back. The abbreviation MLP, for multilayer perceptron, an older English name for a network of several layers, often means the same thing.

**An example:** The stair light from the lesson [Layers](/en/lessons/layers) is a small feed-forward network with two layers. The stair light has two switches and is on only when exactly one of them is pressed. Two neurons, A and B, sit at the front and both see the two switches. They pass their numbers only on to the output neuron C, never back. Only C decides whether the light is on. The outputs of A and B are intermediate values here: they travel as input into C and are not the answer themselves.

**Not to be confused with the whole transformer block:** A [transformer block](/en/glossary/transformer-block) contains a feed-forward network as its second part. There, the feed-forward network calculates each [token](/en/glossary/token) separately, while [attention](/en/glossary/attention) mixes information between tokens. Alone, the feed-forward network is only a stack of layers; the block adds the attention to it.

**Where you'll come across it:** In technical texts on language models and in the architecture descriptions of large models, often under the abbreviation MLP.

Introduced in [Layers: How Many Neurons Become a Network](/en/lessons/layers).
