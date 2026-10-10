---
title: 'Position embedding'
description: 'A vector for a place in the text that tells the model the order, usually added to the embedding and either learned or fixed by formula.'
translationKey: positions-embedding
---

A position embedding is a [vector](/en/glossary/vector) for a place in the text: one for place 1, one for place 2, and so on. It is as long as an [embedding](/en/glossary/embedding) and, in models with their own position table, is added to it number by number; it can be learned or fixed by formula. This is needed because the transformer’s calculation steps treat every row alike wherever it stands, so they do not reliably capture the order on their own. Without a position signal, two sentences with the same words in a different order would bring the same embeddings, only reordered.

**The picture:** A seat in the sentence: each word gets its place, which is added to the embedding. The limit: literally, this holds only for models with their own position table; with RoPE, nothing is added at the input.

**An example:** GPT-2 has its own table with 1,024 rows, one per possible place, each with 768 numbers. It too starts random and is learned in training. In “dog bites man,” “dog” gets the addition for place 1; in “man bites dog,” the one for place 3.

**Not to be confused with RoPE:** RoPE stands for rotary position embedding. Many of today’s models, such as Llama, no longer add position embeddings at the input. They bring in the place in every layer by rotating the numbers, exactly where tokens look at each other. Both encode the order, by different routes.

**Where you’ll come across it:** In descriptions of the transformer architecture, often also as positional embedding or positional encoding.

Introduced in [Transformer Blocks and Attention: How Context Gets Mixed In](/en/lessons/transformer-blocks-and-attention).
