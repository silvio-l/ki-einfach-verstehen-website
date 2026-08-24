---
title: 'SentencePiece'
description: 'A language-independent system for learning and applying subword tokenizers directly from raw text.'
translationKey: sentencepiece
---

SentencePiece can learn vocabularies of **[subword tokens](/en/glossary/subword-token)** — reusable word pieces — directly from unchanged sentences. It examines the original stream of characters instead of requiring another program to split the text into words first. That matters because spaces usually separate words in English, but other languages do not all mark word boundaries in the same way. SentencePiece supports different subword methods, including **[Byte Pair Encoding (BPE)](/en/glossary/byte-pair-encoding)**, which gradually combines frequent neighboring characters into larger units.

SentencePiece is therefore not one fixed vocabulary, but a tool and method through which different [tokenizers](/en/glossary/tokenizer) can be produced.

Placed in context in [How Language Becomes Numbers: Tokenizers, IDs, and Vocabulary](/en/lessons/tokenizer-ids-vocabulary).
