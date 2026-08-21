---
title: 'Tokenizer'
description: 'The fixed procedure that converts text into tokens and token IDs and assembles IDs back into text.'
translationKey: tokenizer
---

A tokenizer divides text into [tokens](/en/glossary/token) according to fixed rules and assigns them numbers through its [vocabulary](/en/glossary/vocabulary). During decoding, it joins a sequence of those numbers back into text.

A tokenizer and its trained model form a fixed pair because the model was trained on exactly that tokenizer’s [token IDs](/en/glossary/token-id).

Explained in more depth in [How Language Becomes Numbers: Tokenizers, IDs, and Vocabulary](/en/lessons/tokenizer-ids-vocabulary).
