---
title: 'Subword Token'
description: 'A reusable text piece that can be smaller than a word.'
translationKey: subword-token
---

A subword token is a text unit that can keep frequent words compact while letting rare words be composed from smaller known pieces. A tokenizer might split “unhappiness,” for example, into “un,” “happi,” and “ness” if those three pieces exist in its vocabulary. Depending on the vocabulary, whole words and individual characters can also be such units.

Subword methods provide a middle ground. A fixed list of whole words cannot directly represent a new word missing from the list, while individual characters can produce unnecessarily long sequences.

Explained in more depth in [Tokenizers: How Language Becomes Numbers](/en/lessons/tokenizer-ids-vocabulary).
