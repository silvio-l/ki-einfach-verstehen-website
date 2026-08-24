---
title: 'Tokenizer'
description: 'The fixed procedure that converts text into tokens and token IDs and assembles IDs back into text.'
translationKey: tokenizer
---

A tokenizer divides text into [tokens](/en/glossary/token) according to fixed rules and assigns them numbers through its [vocabulary](/en/glossary/vocabulary). During decoding, it joins a sequence of those numbers back into text.

A tokenizer and its trained model form a fixed pair. The model receives IDs rather than visible text and learned what each ID means using exactly this tokenizer. Another tokenizer could assign the same number to a different text piece.

Explained in more depth in [Tokenizers: How Language Becomes Numbers](/en/lessons/tokenizer-ids-vocabulary).
