---
title: 'Transformer'
description: 'The architecture presented in 2017, made of many identical blocks with attention, on which today’s language models are based.'
translationKey: transformer
---

A transformer is a model [architecture](/en/glossary/architecture) made of many identically built [transformer blocks](/en/glossary/transformer-block). In each block, [attention](/en/glossary/attention) mixes information between the [tokens](/en/glossary/token), and then each token is processed further on its own. At the start are the tokens’ profiles, at the end states with a lot of context mixed in.

The transformer was presented in 2017 in a research paper, originally for machine translation. Attention existed before; what was new was building a model entirely on it, without processing text word by word in sequence. Today’s chatbot models use a variant that only reads from left to right and uses a [causal mask](/en/glossary/causal-mask) for that.

**An example:** GPT-2, Llama 3.1 8B and Qwen3-8B are transformers. Among other things, they differ in the number of blocks: 12, 32 and 36.

**Not to be confused with the 2017 original:** The original had 6 blocks and two halves, one for reading the source text and one for writing the translation. Today’s language models also change details, such as how the position of a token flows in.

**Where you'll come across it:** In model descriptions and technical texts, often as “decoder-only transformer”, and in the configuration of freely available models.
