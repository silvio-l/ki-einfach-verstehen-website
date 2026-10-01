---
title: 'Token ID'
description: 'The fixed identifying number of a token in a particular tokenizer’s vocabulary, which the model works with instead of text.'
translationKey: token-id
---

A token ID is the whole number under which a [token](/en/glossary/token) is stored in a particular tokenizer’s [vocabulary](/en/glossary/vocabulary). The model uses it like an address: the number tells it which learned list of numbers to retrieve from its lookup table.

The number has no meaning by itself and is not transferable between tokenizers. The same ID can point to different text pieces in two vocabularies.

**An example:** In an invented mini vocabulary, “The” has ID 417, “ cat” 82, “s” 903, “ sit” 771, and the period 13. “The cats sit.” thus becomes the sequence 417, 82, 903, 771, 13. These exact numbers are what the [model](/en/glossary/model) receives as input. On the way back, the [tokenizer](/en/glossary/tokenizer) looks up each number and joins the text pieces in the same order.

**Not to be confused with a measure of meaning:** The 417 measures neither meaning nor frequency nor importance. It is just the number on an index card. Doing arithmetic with IDs is therefore pointless: 417 plus 82 does not give the meaning of 499. Whatever a model associates with an ID lives in its trained [parameters](/en/glossary/parameters).

**Where you’ll come across it:** You normally don’t see token IDs in a chat window. They show up in tools that make visible how a text is split, and when programming with splitting tools such as OpenAI’s tiktoken. Special tokens, for instance one that marks the end of a text, have their own ID as well.

Explained in more depth in [Tokenizers: How Language Becomes Numbers](/en/lessons/tokenizer-ids-vocabulary).
