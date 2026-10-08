---
title: 'SentencePiece'
description: 'A language-independent system for learning and applying subword tokenizers directly from raw text.'
translationKey: sentencepiece
---

SentencePiece can learn vocabularies of **[subword tokens](/en/glossary/subword-token)**, reusable word pieces, directly from unchanged sentences. It examines the original stream of characters instead of requiring another program to split the text into words first. That matters because spaces usually separate words in English, but other languages do not all mark word boundaries in the same way. SentencePiece supports different subword methods, including **[Byte Pair Encoding (BPE)](/en/glossary/byte-pair-encoding)**, which gradually combines frequent neighboring characters into larger units.

SentencePiece is therefore not one fixed vocabulary, but a tool and method through which different [tokenizers](/en/glossary/tokenizer) can be produced.

**An example:** If one tokenizer is to handle both English and Japanese text, a word-based approach would need separate rules for each language about where a word ends. SentencePiece skips that step: it learns from the unchanged sentences of both languages which character sequences are frequent and builds a shared vocabulary from them.

**Not to be confused with BPE:** BPE describes how units are learned, namely by repeatedly merging frequent pairs. SentencePiece is the tool around it that applies such a method directly to raw text. A tokenizer can therefore use “BPE trained with SentencePiece” without the two terms meaning the same thing.

**Where you’ll come across it:** In technical documentation and model descriptions that explain how a model’s tokenizer was built, and in the tokenizer files shipped with some openly available models.

Placed in context in [Tokenizers: How Text Breaks into Tokens](/en/lessons/tokenizer-ids-vocabulary).
