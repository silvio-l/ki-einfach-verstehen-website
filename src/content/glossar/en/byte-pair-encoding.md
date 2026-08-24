---
title: 'Byte Pair Encoding (BPE)'
description: 'A method that progressively merges frequent neighboring characters or previously formed text pieces into larger units.'
translationKey: byte-pair-encoding
---

Byte Pair Encoding, or BPE, learns reusable units by repeatedly merging frequent neighboring characters or previously formed text pieces. Each unit currently being considered — perhaps one letter at first and a longer text piece later — is called a **symbol**. If “e” and “s” often appear together, they may first become “es”; if “t” then often follows, “est” can form later. The symbols selected at the end become [tokens](/en/glossary/token) in the [vocabulary](/en/glossary/vocabulary), the fixed list of all permitted text pieces.

Rare sequences remain expressible through smaller units. The concrete result depends on the training material, preprocessing, and chosen learning rules.

Explained in more depth in [How Language Becomes Numbers: Tokenizers, IDs, and Vocabulary](/en/lessons/tokenizer-ids-vocabulary).
