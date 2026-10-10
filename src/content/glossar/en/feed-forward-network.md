---
title: 'Feed-Forward Network'
description: 'A network of layers whose numbers flow only forward, without feedback. Often also called an MLP.'
translationKey: feed-forward-netz
---

A feed-forward network (named for numbers that move only forward) consists of [layers](/en/glossary/layer) through which the numbers flow in one direction: from the input through the [intermediate values](/en/glossary/intermediate-value) to the output. Each layer receives only the output of the previous one, and nothing flows back. The abbreviation MLP, for multilayer perceptron, an older English name for a network of several layers, often means the same thing.

**An example:** The stair light from the lesson on neural networks is a small feed-forward network with two stages: the numbers of A and B go only into the output neuron C, never back.

**Not to be confused with the whole transformer block:** A [transformer block](/en/glossary/transformer-block) contains a feed-forward network as its second part. There, the feed-forward network calculates each [token](/en/glossary/token) separately, while [attention](/en/glossary/attention) mixes information between tokens.

**Where you'll come across it:** In technical texts on language models and in the architecture descriptions of large models, often under the abbreviation MLP.

Introduced in [Neural Networks: How Many Small Calculations Become a Model](/en/lessons/neural-networks).
