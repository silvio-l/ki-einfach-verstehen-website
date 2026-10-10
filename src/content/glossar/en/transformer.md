---
title: 'Transformer'
description: 'The architecture presented in 2017, made of many identical blocks with attention, on which today’s language models are based.'
translationKey: transformer
---

A transformer is a model [architecture](/en/glossary/architecture) made of many identically built [transformer blocks](/en/glossary/transformer-block). In each block, [attention](/en/glossary/attention) mixes information between the [tokens](/en/glossary/token), and then each token is processed further on its own. At the start are the tokens’ embeddings, at the end states with a lot of context mixed in. Later, the list of scores for the next token is produced from the state of the last position.

The transformer was presented in 2017 in a research paper, originally for machine translation. Attention existed before; what was new was building a model entirely on it, without processing text word by word in sequence. Today’s chatbot models use a variant that only reads from left to right and uses a [causal mask](/en/glossary/causal-mask) for that.

**An example:** Qwen3-8B is a transformer with 36 blocks. Depending on the model, there are one to several dozen blocks. The blocks run one after another: each continues with the state the previous one delivered.

**Not to be confused with the 2017 original:** The design was presented in 2017. Today’s language models adopt it but change details, such as how the position of a token flows in.

**Where you'll come across it:** In model descriptions and technical texts, often as “decoder-only transformer”, and in the configuration of freely available models.

Introduced in [Transformer Blocks and Attention: How Context Gets Mixed In](/en/lessons/transformer-blocks-and-attention).
