---
title: 'Token'
description: 'One unit in a tokenizer’s fixed list of pieces (its vocabulary), for example a whole word, a word part, a single character, a punctuation mark, or a marker for structure.'
translationKey: token
---

A token is one unit from the fixed list of pieces that a [tokenizer](/en/glossary/tokenizer) knows, its [vocabulary](/en/glossary/vocabulary). Most tokens are the pieces into which the tokenizer divides text. Others are markers that tell the model, for example, where a message starts or ends; see [special token](/en/glossary/special-token). A token can be a whole word, part of a word, a single character, punctuation, or another reusable sequence of characters. A token is not the same as a word.

Every token has a fixed number in a particular vocabulary, its [token ID](/en/glossary/token-id). The number of tokens in a text depends on which tokenizer you use.

**An example:** One tokenizer might split the sentence “The cats sit.” into five tokens: “The”, “ cat”, “s”, “ sit” and “.”. The leading spaces are part of the tokens that follow them, while the period forms its own token. A different tokenizer might split the sentence another way, for example by keeping “ cats” as a single piece.

**Not to be confused with a word:** A word is a unit of language; a token is a technical unit. Frequently used words often form a single token, while rare words, names, or unusual spellings are usually split into several. The learned [vocabulary](/en/glossary/vocabulary) sets these boundaries. The syllable rules you know from school have nothing to do with it. The number of tokens in a word does not tell you how well a model understands that word.

**Where you’ll come across it:** Many AI services charge per token. The amount of text a model can handle at once, its [context window](/en/glossary/context-window), is also measured in tokens. Rules of thumb about how many characters a token has on average only give you a rough idea. For an exact number, use the provider’s token-counting tool.

Explained in more depth in [Tokenizers: How Text Breaks into Tokens](/en/lessons/tokenizer-ids-vocabulary).
