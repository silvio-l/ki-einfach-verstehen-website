---
title: 'Token'
description: 'One text unit from a tokenizer’s fixed vocabulary: a whole word, a word part, a single character, or a punctuation mark.'
translationKey: token
---

A token is one unit into which a [tokenizer](/en/glossary/tokenizer) divides text. It can contain a whole word, a word part, an individual character, punctuation, or another character sequence that appears in many places and can therefore be reused. A token and a word are not the same thing.

Every token has a [token ID](/en/glossary/token-id) in a particular vocabulary. How many tokens a text produces depends on the tokenizer in use.

**An example:** The sentence “The cats sit.” might be split into five tokens: “The,” “ cat,” “s,” “ sit,” and “.”. The space belongs to the piece that follows it, and the period is a token of its own. Another tokenizer may split the same sentence differently, for instance keeping “ cats” as a single piece.

**Not to be confused with a word:** A word is a linguistic unit, a token a technical one. Frequent words are often a single token, while rare words, names, or unusual spellings fall apart into several. The boundaries follow the learned [vocabulary](/en/glossary/vocabulary), not syllable rules. Nor does the number of tokens in a word tell you how well a model understands it.

**Where you’ll come across it:** Many AI services bill per token, and the limit on how much text a model can handle at once is measured in tokens; see [context window](/en/glossary/context-window). Rules of thumb such as “one token is about four characters” only give you a rough idea. For an exact number, count with the provider’s counting tool.

Explained in more depth in [Tokenizers: How Language Becomes Numbers](/en/lessons/tokenizer-ids-vocabulary).
