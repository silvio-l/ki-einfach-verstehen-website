---
title: 'Transformer block'
description: 'The repeated building block of a transformer: attention mixes between tokens, then further processing works on each token on its own.'
translationKey: transformerblock
---

A transformer block is the component a [transformer](/en/glossary/transformer) uses many times in a row. The blocks run one after another, not at the same time. It has two parts. First, [attention](/en/glossary/attention) mixes information between positions: something from other [tokens](/en/glossary/token) flows into the state of each token. Then a further processing step, the feed-forward network, works on each position on its own without looking at other tokens. Attention and further processing together form the block.

Neither part hands back its result as a replacement; it is added to the token’s existing [state](/en/glossary/intermediate-value). As a rule, all blocks of a model are built the same way but have their own [parameters](/en/glossary/parameters).

**An example:** Qwen3-8B has 36 blocks. In Qwen3-8B, about two thirds of the parameters sit in the further processing of the blocks.

**Not to be confused with a step of thought:** A block is not a step in reasoning the way a person reasons. Every block reshapes all states a little further according to the same blueprint. After the last block, every state carries a lot of context.

**Where you'll come across it:** In model descriptions, usually as “layer”. In the configuration of freely available models, the number often appears under a name like “num_hidden_layers”.

Introduced in [Transformer Blocks and Attention: How Context Gets Mixed In](/en/lessons/transformer-blocks-and-attention).
