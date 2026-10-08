---
title: 'Subword Token'
description: 'A reusable text piece that can be smaller than a word, so that rare words can be built from known parts.'
translationKey: subword-token
---

A subword token is a text unit that can keep frequent words compact while letting rare words be composed from smaller known pieces. A tokenizer might split “unhappiness,” for example, into “un,” “happi,” and “ness” if those three pieces exist in its vocabulary. Depending on the vocabulary, whole words and individual characters can also be such units.

Subword methods provide a middle ground. A fixed list of whole words cannot directly represent a new word missing from the list, while individual characters can produce unnecessarily long sequences.

**An example:** The word “learning” might split into “learn” and “ing.” Another tokenizer might split it differently. The principle resembles a building set: frequent things come as large finished pieces, rare things are assembled from small parts. So a brand-new band name reaches the model as familiar pieces, not as “unknown.”

**Not to be confused with a syllable:** Subword tokens sometimes look like syllables or word parts, but they are not a linguistic analysis. They come from which character sequences often appear side by side in the training material, for example through [Byte Pair Encoding](/en/glossary/byte-pair-encoding). A token may therefore cut right through a syllable, an ending, or a name.

**Where you’ll come across it:** Many modern text tokenizers use subword tokens, including those behind well-known chatbots such as ChatGPT. You notice it indirectly: a rare word or an unusual product code can split into many small pieces and take up more room in the [context window](/en/glossary/context-window) than a common word.

Explained in more depth in [Tokenizers: How Text Breaks into Tokens](/en/lessons/tokenizer-ids-vocabulary).
