---
title: 'Byte Pair Encoding (BPE)'
description: 'A method that progressively merges frequent neighboring characters or previously formed text pieces into larger units.'
translationKey: byte-pair-encoding
---

Byte Pair Encoding, or BPE, learns reusable units by repeatedly merging frequent neighboring characters or previously formed text pieces. Each unit being merged (one letter at first, a longer piece later) is called a **symbol**. If “e” and “s” often appear together, they may first become “es”; if “t” then often follows, “est” can form later. Every learned combination becomes a new entry in the [vocabulary](/en/glossary/vocabulary), the fixed list of all permitted text pieces, and from then on counts as a single [token](/en/glossary/token).

Rare sequences remain expressible through smaller units, and the concrete result depends on the training material and preprocessing.

**An example:** If “learn,” “learns,” and “learned” are frequent in the training material, common letter pairs are merged first and longer sequences such as “learn” later. When splitting new text, the tokenizer replays the learned merges in the same order. That is why the same text always gives the same split.

**Not to be confused with SentencePiece:** BPE is a method for learning units. [SentencePiece](/en/glossary/sentencepiece) is a tool that applies this method, among others, directly to unsplit text. Neither is a finished [tokenizer](/en/glossary/tokenizer); both are ways of building one.

**Where you’ll come across it:** In technical descriptions of tokenizers, often as “byte-level BPE.” The tokenizer of GPT-2, an early language model by OpenAI, works this way. Byte-level means the smallest units are bytes rather than letters. Since there are only 256 different bytes, all of them fit into the base vocabulary, and because every character is made of one or more bytes, any sequence of characters can be represented.

Explained in more depth in [Tokenizers: How Text Breaks into Tokens](/en/lessons/tokenizer-ids-vocabulary).
