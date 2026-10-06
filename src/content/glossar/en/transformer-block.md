---
title: 'Transformer block'
description: 'The repeated building block of a transformer: attention mixes between tokens, then further processing works on each token on its own.'
translationKey: transformerblock
---

A transformer block is the component a [transformer](/en/glossary/transformer) uses many times in a row. It has two parts. First, [attention](/en/glossary/attention) mixes information between positions: something from other [tokens](/en/glossary/token) flows into the state of each token. Then a further processing step, the feed-forward network, works on each position on its own without looking at other tokens.

Neither part hands back its result as a replacement; it is added to the existing state. Before each part there is a step that brings the numbers to a uniform scale (normalisation). All blocks of a model are built the same way but have their own [parameters](/en/glossary/parameters).

**An example:** Qwen3-8B has 36 blocks, Llama 3.1 8B has 32 and the smallest version of GPT-2 has 12. In Qwen3-8B, about two thirds of the parameters sit in the further processing of the blocks.

**Not to be confused with a step of thought:** A block is not a step in reasoning the way a person reasons. Every block reshapes all states a little further according to the same blueprint.

**Where you'll come across it:** In model descriptions, usually as “layer”. In the configuration of freely available models, the number often appears under a name like “num_hidden_layers”.
