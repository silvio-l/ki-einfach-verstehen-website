---
title: 'Token ID'
description: 'The fixed identifying number of a token in a particular tokenizer’s vocabulary.'
translationKey: token-id
---

A token ID is the whole number under which a [token](/en/glossary/token) is stored in a particular tokenizer’s [vocabulary](/en/glossary/vocabulary). The model uses it like an address: the number tells it which learned list of numbers to retrieve from its lookup table.

The number has no meaning by itself and is not transferable between tokenizers. The same ID can point to different text pieces in two vocabularies.

Explained in more depth in [Tokenizers: How Language Becomes Numbers](/en/lessons/tokenizer-ids-vocabulary).
