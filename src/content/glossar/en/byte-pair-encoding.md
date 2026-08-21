---
title: 'Byte Pair Encoding (BPE)'
description: 'A method that progressively merges frequent neighboring symbols into larger units.'
translationKey: byte-pair-encoding
---

Byte Pair Encoding, or BPE, learns reusable units by repeatedly merging frequent neighboring symbol pairs. Common character sequences can thereby receive compact entries in the vocabulary.

Rare sequences remain expressible through smaller units. The concrete result depends on the training material, preprocessing, and chosen learning rules.

Explained in more depth in [How Language Becomes Numbers: Tokenizers, IDs, and Vocabulary](/en/lessons/tokenizer-ids-vocabulary).
